import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { email: profile.emails?.[0].value },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0].value || "",
              provider: "google",
              name: profile.displayName,
              password: "", // 소셜 로그인은 비번 필요 없음
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(false);
      }
    }
  )
);
