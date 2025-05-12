import express from "express";
import { adminController } from "./admin.controller";

import { validateRequest } from "../../middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";

const adminRouter = express.Router();

adminRouter.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAllAdmin
);
adminRouter.get(
  "/:adminId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAdminById
);
adminRouter.patch(
  "/:adminId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adminValidationSchema.update),
  adminController.updateAdminById
);
adminRouter.delete(
  "/:adminId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.deleteAdminById
);
adminRouter.delete(
  "/soft-delete/:adminId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.softDeleteAdminById
);

export default adminRouter;
