import type { PropsWithChildren } from "react";

import Head from "next/head";
import { Noto_Sans } from "next/font/google";
import { Noto_Sans_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

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

const Header = () => {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";

  return (
    <>
      <header
        className={`flex items-center justify-between ${noto.variable} mx-auto flex max-w-7xl p-6 font-sans lg:px-8`}
      >
        <div className="flex items-center gap-4">
          <Link className="mr-4 text-2xl font-semibold text-green-500" href="/">
            Paste
          </Link>
          <Link href="/">New</Link>
          <Link prefetch={false} href="/feed">
            Feed
          </Link>
        </div>

        {isLoading ? null : session ? (
          <Link className="flex items-center gap-4" href="/profile">
            {session.user.name}

            <Image
              className="rounded-full"
              src={session.user.image ?? ""}
              alt="User profile picture"
              height={32}
              width={32}
            />
          </Link>
        ) : (
          <Link href="/auth/signin">LOGIN</Link>
        )}
      </header>
    </>
  );
};

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
