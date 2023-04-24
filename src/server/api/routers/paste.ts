import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { languages, PasteSchema } from "@/model/paste";

const languagesRecord = languages.reduce<Record<string, boolean>>(
  (acc, language) => {
    acc[language] = true;
    return acc;
  },
  {}
);

export const pasteRouter = createTRPCRouter({
  create: publicProcedure.input(PasteSchema).mutation(({ ctx, input }) => {
    if (input.language && !languagesRecord[input.language]) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Language ${input.language} is not supported (are you proud of yourself?)`,
      });
    }

    return ctx.prisma.paste.create({ data: input });
  }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const paste = await ctx.prisma.paste.findUnique({ where: { id: input } });

    if (!paste)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Post with id ${input} not found!`,
      });

    return paste;
  }),
});
