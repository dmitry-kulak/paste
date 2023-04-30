import type { NextPage } from "next";
import type { MouseEventHandler } from "react";
import { useRouter } from "next/router";

import { api, RouterOutputs } from "@/utils/api";
import { formatter } from "@/shared";
import { NO_LANGUAGE } from "@/model/paste";

type FeedPasteContentProps = {
  paste: RouterOutputs["paste"]["getAll"][number];
};

const FeedPasteContent = ({ paste }: FeedPasteContentProps) => {
  const name = paste.name ? `${paste.name}, ` : null;
  const language =
    paste.language && paste.language !== NO_LANGUAGE ? (
      <>
        Written in <span className="text-[#f1fa8c]">{paste.language}</span>.
      </>
    ) : null;
  const author = paste.author ? `By ${paste.author.name}. ` : null;
  const date = formatter.format(paste.createdAt) + ". ";
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
      <header className="flex justify-between border-b border-zinc-700 pb-1">
        <span>
          {name}
          {date}
          {author}
          {language}
        </span>
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
