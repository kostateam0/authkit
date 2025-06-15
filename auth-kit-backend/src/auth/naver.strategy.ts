import passport from "passport";
import { Strategy as NaverStrategy, Profile } from "passport-naver";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
      callbackURL: process.env.NAVER_CALLBACK_URL!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: Express.User | false) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name =
          (profile as any).nickname || profile.displayName || "naver-user";

        if (!email) {
          return done(new Error("이메일 정보가 없습니다"), false);
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name,
              provider: "naver",
              password: "",
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);
