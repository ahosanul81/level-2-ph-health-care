import { UserRole } from "@prisma/client";
import express from "express";
import { auth } from "../../middlewares/auth";
import { doctorController } from "./doctor.controller";

const doctorRouter = express.Router();

doctorRouter.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  doctorController.getAllDoctor
);
doctorRouter.get(
  "/:doctorId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  doctorController.getDoctorById
);
doctorRouter.patch(
  "/:doctorId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  // validateRequest(adminValidationSchema.update),
  doctorController.updateDoctorById
);
doctorRouter.delete(
  "/:doctorId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  doctorController.deleteDoctorById
);
doctorRouter.delete(
  "/soft-delete/:doctorId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  doctorController.softDeleteDoctorById
);

export default doctorRouter;
