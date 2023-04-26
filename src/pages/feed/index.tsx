import type { NextPage } from "next";
import type { Paste } from "@prisma/client";
import type { MouseEventHandler } from "react";
import { useRouter } from "next/router";

import { api } from "@/utils/api";
import { formatter } from "@/shared";

type FeedPasteContentProps = { paste: Paste };

const FeedPasteContent = ({ paste }: FeedPasteContentProps) => {
  const name = paste.name ? `${paste.name}, ` : null;
  const language = paste.language ? `Written in ${paste.language}.` : null;
  const date = language
    ? formatter.format(paste.createdAt) + ". "
    : formatter.format(paste.createdAt);
  const text = paste.paste;

  const router = useRouter();

  const prefetchPaste: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
    router.prefetch(paste.id).catch(console.error);
  };
  const goToPaste = () => {
    router.push(paste.id).catch(console.error);
  };

  return (
    <article
      className="flex cursor-pointer flex-col gap-1 bg-zinc-800 px-8 py-2 transition-colors hover:bg-zinc-700"
      onClick={goToPaste}
      onMouseEnter={prefetchPaste}
    >
      <header className="border-b border-zinc-700 pb-1">
        {name}
        {date}
        {language}
      </header>
      <pre>
        <code className="line-clamp-6 font-mono">{text}</code>
      </pre>
    </article>
  );
};

const Feed: NextPage = () => {
  const { data: pastes } = api.paste.getAll.useQuery();

  return (
    <div className="flex flex-col gap-4">
      {pastes?.map((paste) => (
        <FeedPasteContent paste={paste} key={paste.id} />
      ))}
    </div>
  );
};

export default Feed;
