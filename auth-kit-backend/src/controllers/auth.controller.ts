// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { registerUser } from "../services/authService";
import { PrismaClient } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshTokenAndGetUser,
} from "../services/jwt.service";

const prisma = new PrismaClient();

export const loginSuccess = (req: Request, res: Response) => {
  const user = req.user as Express.User;

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // 쿠키에 refreshToken 저장 (httpOnly로 보안 강화)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  });

  res.json({
    message: "로그인 성공",
    user,
    accessToken,
  });
};

export const loginFail = (_req: Request, res: Response) => {
  res.status(401).json({ message: "로그인 실패" });
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401).json({ message: "Refresh token 없음" });
      return;
    }

    const user = await verifyRefreshTokenAndGetUser(token);
    if (!user) {
      res.status(403).json({ message: "Refresh token이 유효하지 않음" });
      return;
    }

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "로그인 필요" });
    }

    const userId = (req.user as Express.User).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) return res.status(404).json({ message: "사용자 없음" });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response) => {
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
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "로그아웃 실패" });

    // refreshToken 쿠키 삭제
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "로그아웃 성공" });
  });
};

export const googleRedirect = [
  passport.authenticate("google", { scope: ["profile", "email"] }),
];

export const googleCallback = [
  passport.authenticate("google", { failureRedirect: "/auth/fail" }),
  (req: Request, res: Response) => {
    res.redirect("/auth/me");
  },
];

export const naverRedirect = [passport.authenticate("naver")];

export const naverCallback = [
  passport.authenticate("naver", { failureRedirect: "/auth/fail" }),
  (req: Request, res: Response) => {
    res.redirect("/auth/me");
  },
];
