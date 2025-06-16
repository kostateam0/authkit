import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter";
import { initPassport } from "./config/passport";
import adminRouter from "./routes/adminRouter";
import userRouter from "./routes/userRouter";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

dotenv.config();

export default function AuthKit(): express.Router {
  const router = express.Router();

  router.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret", // ✅ secret만 필요
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1일
      },
    })
  );

  router.use(cors({ origin: true, credentials: true }));
  router.use(express.json());

  // passport 전략 연결
  initPassport();

  router.use(passport.initialize());
  router.use(passport.session());

  // /auth 라우터 연결
  router.use("/auth", authRouter);
  router.use("/admin", adminRouter);
  router.use("/user", userRouter);

  router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return router;
}
