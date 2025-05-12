import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("successfuly router is connent");
});

export const userRoutes = router;
