// src/routes/userRouter.ts
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteMyAccount,
} from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 유저 관련 API
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: 내 프로필 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공적으로 유저 정보를 반환
 */
router.get("/profile", verifyToken, getMyProfile);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: 내 프로필 수정
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: 프로필 수정됨
 */
router.put("/profile", verifyToken, updateMyProfile);

/**
 * @swagger
 * /user/password:
 *   post:
 *     summary: 비밀번호 변경
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: 비밀번호 변경 완료
 */
router.post("/password", verifyToken, changePassword);

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: 회원 탈퇴
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 회원 탈퇴 완료
 */
router.delete("/delete", verifyToken, deleteMyAccount);

export default router;
