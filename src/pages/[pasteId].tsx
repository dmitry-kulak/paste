import { useEffect, useState } from "react";
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import SyntaxHighlighter from "react-syntax-highlighter";

import { prisma } from "@/server/db";

type PastePageProps = InferGetStaticPropsType<typeof getStaticProps>;

const PastePage: NextPage<PastePageProps> = ({
  paste,
  createdAt,
  name,
  language,
}) => {
  const [style, setStyle] = useState();

  useEffect(() => {
    import("react-syntax-highlighter/dist/esm/styles/hljs/dracula").then(
      // @ts-ignore
      (mod) => setStyle(mod.default)
    );
  }, []);

  return (
    <>
      <div className="mb-1 flex justify-between">
        <span>Created at {createdAt}</span>
        {name && <span>by {name}</span>}

        <span className="font-mono text-[#f1fa8c]">{language}</span>
      </div>

      {style ? (
        <SyntaxHighlighter
          wrapLongLines
          showLineNumbers
          language={language}
          style={style}
        >
          {paste}
        </SyntaxHighlighter>
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default PastePage;

const { format } = new Intl.DateTimeFormat();

export const getStaticProps = (async (context) => {
  const pasteId = context.params?.pasteId;
  if (!pasteId || Array.isArray(pasteId)) throw new Error("No post id");

  const paste = await prisma.paste.findUnique({ where: { id: pasteId } });

  if (!paste) throw new Error("No paste");

  return {
    props: {
      ...paste,
      createdAt: format(paste.createdAt),
      language: "typescript",
    },
  };
}) satisfies GetStaticProps;

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
