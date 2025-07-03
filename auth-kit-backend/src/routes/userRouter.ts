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

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 */
router.post("/logout", verifyToken, (req, res): void => {
  res.clearCookie("refreshToken"); // refreshToken 쿠키가 있다면 제거
  res.status(200).json({ message: "로그아웃 완료" });
});

export default router;
