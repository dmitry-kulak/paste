import { type CSSProperties, useEffect, useState } from "react";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import SyntaxHighlighter from "react-syntax-highlighter";

import { prisma } from "@/server/db";
import { formatter } from "@/shared";

type PastePageProps = InferGetStaticPropsType<typeof getStaticProps>;

const PastePage: NextPage<PastePageProps> = ({
  paste,
  createdAt,
  name,
  language,
}) => {
  const [style, setStyle] = useState<{ [p: string]: CSSProperties }>();

  useEffect(() => {
    // makes style work in nextjs
    void import("react-syntax-highlighter/dist/esm/styles/hljs/dracula").then(
      (mod) => setStyle(mod.default)
    );
  }, []);

  return (
    <>
      <div className="mb-1 flex justify-between">
        <span>
          {name && `${name}. `}Created at {createdAt}
        </span>

        {language && (
          <span className="font-mono text-[#f1fa8c]">{language}</span>
        )}
      </div>

      {style ? (
        <SyntaxHighlighter
          wrapLongLines
          showLineNumbers
          language={language || undefined}
          style={style}
        >
          {paste}
        </SyntaxHighlighter>
      ) : (
        <h1 className="text-center">Loading paste...</h1>
      )}
    </>
  );
};

export default PastePage;

export const getStaticProps = (async (context) => {
  const pasteId = context.params?.pasteId;
  if (!pasteId || Array.isArray(pasteId)) throw new Error("No post id");

  const paste = await prisma.paste.findUnique({ where: { id: pasteId } });

  if (!paste) return { notFound: true };

  return {
    props: {
      ...paste,
      createdAt: formatter.format(paste.createdAt),
    },
  };
}) satisfies GetStaticProps;

export const getStaticPaths: GetStaticPaths = async () => {
  const pastesIds = await prisma.paste.findMany({
    select: { id: true },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  return {
    paths: pastesIds.map(({ id }) => ({ params: { pasteId: id } })),
    fallback: "blocking",
  };
};
