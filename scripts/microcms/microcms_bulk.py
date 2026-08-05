#!/usr/bin/env python3
import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_ENV_PATH = ROOT / ".env"
DEFAULT_DATA_PATH = Path(__file__).resolve().parent / "data.json"


def read_env(path):
    values = {}
    if not path.exists():
        raise SystemExit(f"env file not found: {path}")

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")

    values.update({key: value for key, value in os.environ.items() if key.startswith("MICROCMS_")})
    return values


def require_env(env, key):
    value = env.get(key)
    if not value:
        raise SystemExit(f"missing required env: {key}")
    return value


def endpoint(env, key, fallback):
    return env.get(key) or fallback


def clean_url(value):
    if not value:
        return None

    text = str(value).strip()
    markdown = re.match(r"^\[.*?\]\((.*?)\)$", text)
    if markdown:
        text = markdown.group(1)

    try:
        parsed = urllib.parse.urlsplit(text)
        query = urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)
        query = [(key, val) for key, val in query if key != "utm_source"]
        return urllib.parse.urlunsplit(parsed._replace(query=urllib.parse.urlencode(query)))
    except ValueError:
        return text


def compact(body):
    return {key: value for key, value in body.items() if value is not None and value != ""}


class MicroCmsClient:
    def __init__(self, env):
        service_domain = require_env(env, "MICROCMS_SERVICE_DOMAIN")
        self.base_url = f"https://{service_domain}.microcms.io/api/v1"
        self.headers = {
            "X-MICROCMS-API-KEY": require_env(env, "MICROCMS_API_KEY"),
        }

    def request(self, method, endpoint_name, body=None):
        url = f"{self.base_url}/{endpoint_name}"
        headers = dict(self.headers)
        data = None
        if body is not None:
            headers["Content-Type"] = "application/json"
            data = json.dumps(body, ensure_ascii=False).encode("utf-8")

        request = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(request) as response:
                raw = response.read().decode("utf-8")
                if not raw:
                    return {}
                try:
                    return json.loads(raw)
                except json.JSONDecodeError:
                    return {"raw": raw}
        except urllib.error.HTTPError as error:
            raw = error.read().decode("utf-8")
            raise RuntimeError(f"{method} {endpoint_name} failed: {error.code} {raw}") from error

    def list_all(self, endpoint_name):
        contents = []
        offset = 0
        while True:
            query = urllib.parse.urlencode({"limit": 100, "offset": offset, "depth": 1})
            page = self.request("GET", f"{endpoint_name}?{query}")
            rows = page.get("contents", [])
            contents.extend(rows)
            if len(contents) >= page.get("totalCount", 0) or not rows:
                return contents
            offset += 100

    def post(self, endpoint_name, body):
        return self.request("POST", endpoint_name, body)

    def delete(self, endpoint_name, content_id):
        return self.request("DELETE", f"{endpoint_name}/{content_id}")


def product_body(product):
    return compact({
        "name": product.get("name"),
        "slug": product.get("slug"),
        "description": product.get("description", ""),
        "imageUrl": clean_url(product.get("imageUrl")),
        "officialUrl": clean_url(product.get("officialUrl")),
        "seoDescription": product.get("seoDescription", ""),
        "isPublished": product.get("isPublished", True),
    })


def shop_body(shop):
    return compact({
        "name": shop.get("name"),
        "slug": shop.get("slug"),
        "description": shop.get("description", ""),
        "officialUrl": clean_url(shop.get("officialUrl")),
        "officialXUrl": clean_url(shop.get("officialXUrl")),
        "prefecture": shop.get("prefecture", "全国"),
        "area": shop.get("area", "全国"),
        "isOnline": shop.get("isOnline", True),
        "isActive": shop.get("isActive", True),
    })


def lottery_body(lottery, product_id, shop_id):
    method = lottery.get("applicationMethod") or "online"
    if not isinstance(method, list):
        method = [method]

    return compact({
        "product": product_id,
        "shop": shop_id,
        "title": lottery.get("title"),
        "applicationMethod": method,
        "startAt": lottery.get("startAt"),
        "endAt": lottery.get("endAt"),
        "applyUrl": clean_url(lottery.get("applyUrl")),
        "isPublished": lottery.get("isPublished", True),
    })


def load_data(path):
    if not path.exists():
        raise SystemExit(f"data file not found: {path}")
    with path.open(encoding="utf-8") as file:
        data = json.load(file)
    for key in ("products", "shops", "lotteries"):
        if key not in data or not isinstance(data[key], list):
            raise SystemExit(f"data file must include array: {key}")
    return data


def make_context(env):
    return {
        "products": endpoint(env, "MICROCMS_PRODUCTS_ENDPOINT", "products"),
        "shops": endpoint(env, "MICROCMS_SHOPS_ENDPOINT", "shops"),
        "lotteries": endpoint(env, "MICROCMS_LOTTERIES_ENDPOINT", "lotteries"),
    }


def insert_all(client, endpoints, data):
    existing_products = client.list_all(endpoints["products"])
    existing_shops = client.list_all(endpoints["shops"])
    existing_lotteries = client.list_all(endpoints["lotteries"])

    product_ids = {item.get("slug"): item["id"] for item in existing_products}
    shop_ids = {item.get("slug"): item["id"] for item in existing_shops}
    lottery_keys = {f'{item.get("title")}::{item.get("endAt")}' for item in existing_lotteries}

    summary = {
        "created": {"products": [], "shops": [], "lotteries": []},
        "skipped": {"products": [], "shops": [], "lotteries": []},
    }

    for product in data["products"]:
        slug = product.get("slug")
        if not slug:
            raise SystemExit(f"product slug is required: {product.get('name')}")
        if slug in product_ids:
            summary["skipped"]["products"].append(slug)
            continue
        result = client.post(endpoints["products"], product_body(product))
        product_ids[slug] = result["id"]
        summary["created"]["products"].append({"slug": slug, "id": result["id"]})
        print(f"created product {slug}")

    for shop in data["shops"]:
        slug = shop.get("slug")
        if not slug:
            raise SystemExit(f"shop slug is required: {shop.get('name')}")
        if slug in shop_ids:
            summary["skipped"]["shops"].append(slug)
            continue
        result = client.post(endpoints["shops"], shop_body(shop))
        shop_ids[slug] = result["id"]
        summary["created"]["shops"].append({"slug": slug, "id": result["id"]})
        print(f"created shop {slug}")

    for lottery in data["lotteries"]:
        product_slug = lottery.get("productSlug")
        shop_slug = lottery.get("shopSlug")
        product_id = product_ids.get(product_slug)
        shop_id = shop_ids.get(shop_slug)
        if not product_id or not shop_id:
            raise SystemExit(f"missing reference: {lottery.get('title')} productSlug={product_slug} shopSlug={shop_slug}")

        key = f'{lottery.get("title")}::{lottery.get("endAt")}'
        if key in lottery_keys:
            summary["skipped"]["lotteries"].append(lottery.get("title"))
            continue

        result = client.post(endpoints["lotteries"], lottery_body(lottery, product_id, shop_id))
        lottery_keys.add(key)
        summary["created"]["lotteries"].append({"title": lottery.get("title"), "id": result["id"]})
        print(f"created lottery {lottery.get('title')}")

    print_summary(summary)


def delete_all(client, endpoints, yes):
    order = ("lotteries", "products", "shops")
    existing = {key: client.list_all(endpoints[key]) for key in order}
    print("delete target:")
    for key in order:
        print(f"- {endpoints[key]}: {len(existing[key])}")

    if not yes:
        print("Add --yes to delete these contents.")
        return

    summary = {}
    for key in order:
        endpoint_name = endpoints[key]
        summary[endpoint_name] = {"found": len(existing[key]), "deleted": 0}
        for row in existing[key]:
            client.delete(endpoint_name, row["id"])
            summary[endpoint_name]["deleted"] += 1
            print(f"deleted {endpoint_name}/{row['id']}")

    print_summary(summary)


def count_all(client, endpoints):
    summary = {}
    for key, endpoint_name in endpoints.items():
        summary[endpoint_name] = len(client.list_all(endpoint_name))
    print_summary(summary)


def print_summary(summary):
    print("SUMMARY")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


def main():
    parser = argparse.ArgumentParser(description="Bulk import/delete card-get-navi contents in microCMS.")
    parser.add_argument("--env", type=Path, default=DEFAULT_ENV_PATH, help="env file path")
    subparsers = parser.add_subparsers(dest="command", required=True)

    insert_parser = subparsers.add_parser("insert", help="insert products, shops, and lotteries from JSON")
    insert_parser.add_argument("--data", type=Path, default=DEFAULT_DATA_PATH, help="JSON data path")

    delete_parser = subparsers.add_parser("delete", help="delete all lotteries, products, and shops")
    delete_parser.add_argument("--yes", action="store_true", help="actually delete contents")

    subparsers.add_parser("count", help="show content counts")

    args = parser.parse_args()
    env = read_env(args.env)
    endpoints = make_context(env)
    client = MicroCmsClient(env)

    if args.command == "insert":
        insert_all(client, endpoints, load_data(args.data))
    elif args.command == "delete":
        delete_all(client, endpoints, args.yes)
    elif args.command == "count":
        count_all(client, endpoints)


if __name__ == "__main__":
    main()
