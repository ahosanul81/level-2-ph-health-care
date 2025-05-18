import express from "express";
import { PatientController } from "./patient.controller";

const patientRouter = express.Router();

patientRouter.get("/", PatientController.getAllFromDB);

patientRouter.get("/:id", PatientController.getByIdFromDB);

patientRouter.patch("/:id", PatientController.updateIntoDB);

patientRouter.delete("/:id", PatientController.deleteFromDB);
patientRouter.delete("/soft/:id", PatientController.softDelete);

export default patientRouter;
