import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { PasteSchema } from "@/model/paste";

export const pasteRouter = createTRPCRouter({
  create: publicProcedure
    .input(PasteSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newPaste = await ctx.prisma.paste.create({ data: input });
        return newPaste;
      } catch (err) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
      }
    }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const paste = await ctx.prisma.paste.findUnique({ where: { id: input } });

      if (!paste)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Post with id ${input} not found!`,
        });

      return paste;
    } catch (err) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Post with id ${input} not found!`,
      });
    }
  }),
});
