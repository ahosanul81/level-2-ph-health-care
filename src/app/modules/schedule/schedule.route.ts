import express from "express";
import { scheduleController } from "./schedule.controller";

const scheduleRouter = express.Router();

scheduleRouter.post("/", scheduleController.insert);

export default scheduleRouter;
