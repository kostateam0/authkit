// src/auth/local.strategy.ts
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
          return done(null, false, {
            message: "유저 없음 또는 소셜 로그인 계정",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "비밀번호 불일치" });
        }

        return done(null, {
          id: user.id,          // ✅ passport.serializeUser에서 쓰기 위한 필드
          email: user.email,    // ✅ 프론트나 deserializeUser에서 쓸 필드
          // 필요한 경우 다른 필드도 추가 가능
        });
        
      } catch (err) {
        return done(err);
      }
    }
  )
);
