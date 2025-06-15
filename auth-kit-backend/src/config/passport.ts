// src/config/passport.ts
import passport from "passport";
import "../auth/local.strategy";
import "../auth/google.strategy";
import "../auth/naver.strategy";
import "../auth/twitter.strategy";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function initPassport() {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (user) return done(null, user);
      done(null, false);
    } catch (err) {
      done(err);
    }
  });
}
