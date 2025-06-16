// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// 내 프로필 조회
export const getMyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as Express.User).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "사용자 없음" });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "내 정보 조회 실패", error });
  }
};

// 내 프로필 수정
export const updateMyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as Express.User).id;
    const { name } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    res.json({ message: "프로필 수정됨", user: updated });
  } catch (error) {
    res.status(500).json({ message: "프로필 수정 실패", error });
  }
};

// 비밀번호 변경
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as Express.User).id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "사용자 없음" });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      res.status(400).json({ message: "현재 비밀번호 불일치" });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.json({ message: "비밀번호 변경 완료" });
  } catch (error) {
    res.status(500).json({ message: "비밀번호 변경 실패", error });
  }
};

// 회원 탈퇴
export const deleteMyAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as Express.User).id;
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: "회원 탈퇴 완료" });
  } catch (error) {
    res.status(500).json({ message: "회원 탈퇴 실패", error });
  }
};
