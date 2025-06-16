import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "default_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "default_refresh_secret";

export function generateAccessToken(user: Partial<User>) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: "1h",
  });
}

export function generateRefreshToken(user: Partial<User>) {
  return jwt.sign({ id: user.id, email: user.email }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export async function verifyRefreshTokenAndGetUser(token: string) {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    return user;
  } catch (err) {
    return null;
  }
}
