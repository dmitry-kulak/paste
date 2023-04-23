import { type PropsWithChildren } from "react";

import Head from "next/head";
import { Noto_Sans } from "next/font/google";
import { Noto_Sans_Mono } from "next/font/google";

const noto = Noto_Sans({
  weight: ["400", "600"],
  variable: "--font-noto",
  subsets: ["latin", "cyrillic"],
});
const notoMono = Noto_Sans_Mono({
  weight: "400",
  variable: "--font-noto-mono",
  subsets: ["latin", "cyrillic"],
});

const Header = () => (
  <header
    className={`flex items-center justify-between ${noto.variable} mx-auto flex max-w-7xl p-6 font-sans lg:px-8`}
  >
    <div className="flex gap-4">
      <span className="mr-4 text-2xl font-semibold text-green-500">Paste</span>
      <button>New</button>
      <button>Feed</button>
    </div>

    <div className="flex gap-4">
      <button>LOGIN</button>
      <button>SIGN UP</button>
    </div>
  </header>
);

const Layout = ({ children }: PropsWithChildren) => (
  <>
    <Head>
      <title>Paste</title>
      <meta name="description" content="✍️" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header />

    <main
      className={`${noto.variable} ${notoMono.variable} mx-auto flex max-w-7xl flex-col bg-zinc-900 px-8 py-6 font-sans`}
    >
      {children}
    </main>
  </>
);

export default Layout;
