// src/controllers/admin.controller.ts
import { Request, Response } from "express";
import prisma from "../lib/prisma";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 관리자 전용 API
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: 전체 유저 조회 (관리자 전용)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 전체 유저 리스트 반환
 */
export const listAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "사용자 조회 실패", error: err });
  }
};

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: 유저 삭제 (관리자 전용)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 삭제할 유저의 ID
 *     responses:
 *       200:
 *         description: 유저 삭제 성공
 */
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: "유저 삭제 성공" });
  } catch (err) {
    res.status(500).json({ message: "유저 삭제 실패", error: err });
  }
};

/**
 * @swagger
 * /admin/users/{id}/ban:
 *   patch:
 *     summary: 유저 벤 처리 (관리자 전용)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 벤할 유저의 ID
 *     responses:
 *       200:
 *         description: 유저 벤 처리 완료
 */
export const banUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });

    res.json({ message: "유저 벤 처리됨", user: updated });
  } catch (err) {
    res.status(500).json({ message: "유저 벤 실패", error: err });
  }
};
