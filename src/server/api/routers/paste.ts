import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { ExposureType, PasteSchema } from "@/model/paste";

export const pasteRouter = createTRPCRouter({
  create: publicProcedure
    .input(PasteSchema)
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.session?.user?.id;

      return ctx.prisma.paste.create({
        data: { ...input, author: { connect: { id: authorId } } },
      });
    }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const paste = await ctx.prisma.paste.findUnique({
      where: { id: input },
      include: { author: true },
    });

    if (!paste)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Post with id ${input} not found!`,
      });

    return paste;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const publicExposure: ExposureType = "Public";

    const pastes = await ctx.prisma.paste.findMany({
      orderBy: { createdAt: "desc" },
      where: { exposure: publicExposure },
      include: { author: true },
      take: 10,
    });

    return pastes.map((paste) => ({
      ...paste,
      paste: paste.paste.substring(0, 300),
    }));
  }),
});
