import { NextFunction, Request, Response } from "express";
import { AppError } from "./globalErrorHandler";
import { jwtDecode } from "jwt-decode";
import { IJwtPayload } from "../modules/auth/auth.interface";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(404, "Token not found");
    }
    const decoded: IJwtPayload = jwtDecode(token as string);
    req.user = decoded;
    const { email, role } = decoded;
    if (roles.length && !roles.includes(role as string)) {
      throw new AppError(401, "you are not authorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user?.status === "BLOCKED" || user?.status === "DELETED") {
      throw new AppError(401, `you are ${user.status}`);
    }
    if (user?.role !== role || !(user?.role === "SUPER_ADMIN")) {
      throw new AppError(401, `you are authorized user`);
    }

    next();
  };
};
