import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { registerUser } from "../services/authService";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// 로컬 로그인
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/auth/fail" }),
  (req: Request, res: Response) => {
    res.json({ message: "로그인 성공", user: req.user });
  }
);

// 로그인 실패
router.get("/fail", (_req: Request, res: Response) => {
  res.status(401).json({ message: "로그인 실패" });
});

// 현재 로그인 상태 확인
router.get(
  "/me",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      // 1. 로그인 안 된 경우
      if (!req.user) {
        return res.status(401).json({ message: "로그인 필요" });
      }

      // 2. req.user에 타입 단언 적용
      const userId = (req.user as Express.User).id;

      // 3. DB에서 사용자 정보 조회
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });

      if (!user) return res.status(404).json({ message: "사용자 없음" });

      // 4. 사용자 정보 반환
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
);

// 유저 등록
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await registerUser(email, password);
    res.status(201).json({
      message: "회원가입 성공",
      user: { email: user.email, id: user.id },
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "로그아웃 실패" });
    res.json({ message: "로그아웃 성공" });
  });
});

// 구글 로그인 라우터
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/fail",
  }),
  (req: Request, res: Response) => {
    res.redirect("/auth/me");
  }
);

// 네이버 로그인 라우터
router.get("/naver", passport.authenticate("naver"));

router.get(
  "/naver/callback",
  passport.authenticate("naver", {
    failureRedirect: "/auth/fail",
  }),
  (req: Request, res: Response) => {
    res.redirect("/auth/me");
  }
);

export default router;
