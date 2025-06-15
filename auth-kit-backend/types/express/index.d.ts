// src/types/express/index.d.ts
import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
    }
  }
}

export {};
