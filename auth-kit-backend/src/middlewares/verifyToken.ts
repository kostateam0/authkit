// src/middlewares/verifyToken.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. 세션 쿠키 방식 확인
    if (req.isAuthenticated?.() && req.user) {
      next(); // next 호출하고 return
      return;
    }

    // 2. JWT 헤더 확인
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        res.status(401).json({ message: "유효하지 않은 사용자입니다." });
        return;
      }

      req.user = user;
      next(); // 유저 설정하고 next
      return;
    }

    // 인증 정보가 없음
    res.status(401).json({ message: "인증 필요 (세션 또는 토큰)" });
  } catch (err) {
    res.status(401).json({ message: "토큰 검증 실패 또는 만료됨" });
  }
};
