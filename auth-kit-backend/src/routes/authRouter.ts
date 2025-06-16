// src/routes/authRouter.ts
import { Router } from "express";
import passport from "passport";
import {
  loginSuccess,
  loginFail,
  register,
  getCurrentUser,
  logout,
  googleCallback,
  naverCallback,
  refreshAccessToken,
} from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 관련 API
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로컬 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공 시 토큰과 유저 정보 반환
 */
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/auth/fail" }),
  loginSuccess
);

/**
 * @swagger
 * /auth/fail:
 *   get:
 *     summary: 로그인 실패 응답
 *     tags: [Auth]
 *     responses:
 *       401:
 *         description: 로그인 실패 메시지
 */
router.get("/fail", loginFail);

/**
 * @swagger
 * /auth/token:
 *   get:
 *     summary: refreshToken으로 accessToken 재발급
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 새 accessToken 반환
 */
router.get("/token", refreshAccessToken);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: 로그인된 사용자 정보 조회
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 유저 정보 반환
 */
router.get("/me", verifyToken, getCurrentUser);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 로그아웃 성공 메시지
 */
router.get("/logout", logout);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: 구글 OAuth 로그인 시작
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 구글 로그인 페이지로 리다이렉트
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: 구글 OAuth 로그인 콜백
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 로그인 후 리다이렉트
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/fail" }),
  googleCallback[1]
);

/**
 * @swagger
 * /auth/naver:
 *   get:
 *     summary: 네이버 OAuth 로그인 시작
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 네이버 로그인 페이지로 리다이렉트
 */
router.get("/naver", passport.authenticate("naver"));

/**
 * @swagger
 * /auth/naver/callback:
 *   get:
 *     summary: 네이버 OAuth 로그인 콜백
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 로그인 후 리다이렉트
 */
router.get(
  "/naver/callback",
  passport.authenticate("naver", { failureRedirect: "/auth/fail" }),
  naverCallback[1]
);

export default router;
