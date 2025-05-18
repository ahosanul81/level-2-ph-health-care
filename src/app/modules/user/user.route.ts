import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";

import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

import { upload } from "../../../shared/fileUploader";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const userRoutes = express.Router();

userRoutes.post(
  "/create-admin",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(userValidation.createAdmin),
  userController.createAdmin
);
userRoutes.post(
  "/create-doctor",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);

    next();
  },
  validateRequest(userValidation.createDoctor),
  userController.createDoctor
);
userRoutes.post(
  "/create-patient",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidation.createPatient),
  userController.createPatient
);
userRoutes.get("/", userController.getAllUser);
userRoutes.patch(
  "/:userId",
  validateRequest(userValidation.updateStatus),
  userController.changeProfileStatus
);
userRoutes.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  userController.getMyProfile
);

userRoutes.patch(
  "/update/my-profile",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  // validateRequest(userValidation.updateStatus),
  userController.updateMyProfile
);

export default userRoutes;
