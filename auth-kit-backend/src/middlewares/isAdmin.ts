import { Request, Response, NextFunction } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = req.user as { role?: string };

  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "관리자 권한이 필요합니다." });
    return; // Response 반환 말고 void로 종료
  }

  next();
}
