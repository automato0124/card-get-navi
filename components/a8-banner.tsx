/* eslint-disable @next/next/no-img-element */

const A8_CLICK_URL = "https://px.a8.net/svt/ejp?a8mat=4B9VHF+9LWV8Y+5WQC+5YZ75";
const A8_BANNER_URL = "https://www25.a8.net/svt/bgt?aid=260801187581&wid=001&eno=01&mid=s00000027570001003000&mc=1";
const A8_TRACKING_URL = "https://www17.a8.net/0.gif?a8mat=4B9VHF+9LWV8Y+5WQC+5YZ75";

export function A8Banner() {
  return (
    <aside className="space-y-2 py-2 text-center" aria-label="広告">
      <p className="text-[11px] font-bold leading-5 text-slate-500">PR</p>
      <a href={A8_CLICK_URL} target="_blank" rel="sponsored nofollow noopener noreferrer" className="mx-auto block w-fit max-w-full">
        <img
          width={300}
          height={250}
          alt="PR広告"
          src={A8_BANNER_URL}
          loading="lazy"
          decoding="async"
          className="block h-auto max-w-full rounded-xl border border-line bg-white"
        />
      </a>
      <img width={1} height={1} src={A8_TRACKING_URL} alt="" loading="lazy" decoding="async" className="sr-only" />
    </aside>
  );
}
