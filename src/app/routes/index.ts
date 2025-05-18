import express from "express";
import userRoutes from "../modules/user/user.route";
import adminRouter from "../modules/admin/admin.route";
import authRouter from "../modules/auth/auth.route";
import specialitiesRouter from "../modules/specialities/specialities.route";
import doctorRouter from "../modules/doctor/doctor.route";
import patientRouter from "../modules/Patient/patient.route";
import scheduleRouter from "../modules/schedule/schedule.route";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/specialities",
    route: specialitiesRouter,
  },
  {
    path: "/doctor",
    route: doctorRouter,
  },
  {
    path: "/patient",
    route: patientRouter,
  },
  {
    path: "/schedule",
    route: scheduleRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
