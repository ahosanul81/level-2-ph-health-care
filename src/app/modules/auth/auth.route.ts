import express from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const authRouter = express.Router();

authRouter.post("/login", authController.loginUser);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  authController.changePassword
);
authRouter.post(
  "/forgot-password",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  authController.forgotPassword
);
authRouter.post(
  "/reset-password",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  authController.resetPassword
);
export default authRouter;
