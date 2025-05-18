import express, { NextFunction, Request, Response } from "express";
import { specialitiesController } from "./specialities.controller";
import { upload } from "../../../shared/fileUploader";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";

const specialitiesRouter = express.Router();

specialitiesRouter.post(
  "/",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    // console.log(req.body);
    next();
  },
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  specialitiesController.insert
);
export default specialitiesRouter;
