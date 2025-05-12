import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import { IJwtPayload } from "./auth.interface";

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.loginUser(req.body);
    res.cookie("refreshToken", result.refreshToken);
    res.status(200).send({
      success: true,
      message: "logged in successfully",
      data: result,
    });
  }
);
const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.refreshToken(
      req.cookies.refreshToken as string
    );

    res.status(200).send({
      success: true,
      message: "logged in successfully",
      data: result,
    });
  }
);
const changePassword = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const result = await authService.passwordChangeIntoDB(
      req?.user as IJwtPayload,
      req.body
    );

    res.status(200).send({
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);
const forgotPassword = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const result = await authService.forgotPasswordIntoDB(req.body);

    res.status(200).send({
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);
const resetPassword = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const result = await authService.resetPasswordIntoDB(
      req.headers.authorization as string,
      req.body
    );

    res.status(200).send({
      success: true,
      message: "reset password successfully",
      data: result,
    });
  }
);

export const authController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
