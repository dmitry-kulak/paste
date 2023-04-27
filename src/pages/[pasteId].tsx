import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import SyntaxHighlighter from "react-syntax-highlighter";
import dracula from "react-syntax-highlighter/dist/esm/styles/hljs/dracula";

import { prisma } from "@/server/db";
import { formatter } from "@/shared";
import { NO_LANGUAGE } from "@/model/paste";

type PastePageProps = InferGetStaticPropsType<typeof getStaticProps>;

const PastePage: NextPage<PastePageProps> = ({
  paste,
  createdAt,
  name,
  language,
}) => {
  const isLanguage = language && language !== NO_LANGUAGE;
  return (
    <>
      <div className="mb-1 flex justify-between">
        <span>
          {name && `${name}. `}Created at {createdAt}
        </span>

        {isLanguage && (
          <span className="font-mono text-[#f1fa8c]">{language}</span>
        )}
      </div>

      <SyntaxHighlighter
        wrapLongLines
        showLineNumbers
        language={isLanguage ? language : undefined}
        style={dracula}
      >
        {paste}
      </SyntaxHighlighter>
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
