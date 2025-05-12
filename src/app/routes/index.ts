import express from "express";
import path from "path";
import userRoutes from "../modules/user/user.route";
import adminRouter from "../modules/admin/admin.route";
import authRouter from "../modules/auth/auth.route";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
