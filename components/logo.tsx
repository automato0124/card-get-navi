import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="カードゲットナビ トップへ">
      <Image
        src="/logo-cardgetnavi-pokeca.png"
        alt="カードゲットナビ"
        width={1983}
        height={480}
        priority
        className="h-10 w-auto"
      />
    </Link>
  );
}
