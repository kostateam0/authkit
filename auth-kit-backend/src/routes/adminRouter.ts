// src/routes/adminRouter.ts
import { Router } from "express";
import {
  listAllUsers,
  deleteUser,
  banUser,
} from "../controllers/admin.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

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
 *     summary: 전체 유저 목록 조회
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 유저 리스트 반환
 */
router.get("/users", verifyToken, isAdmin, listAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: 유저 삭제
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 유저 삭제 완료
 */
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

/**
 * @swagger
 * /admin/users/{id}/ban:
 *   patch:
 *     summary: 유저 벤 처리
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 유저 벤 완료
 */
router.patch("/users/:id/ban", verifyToken, isAdmin, banUser);

export default router;
