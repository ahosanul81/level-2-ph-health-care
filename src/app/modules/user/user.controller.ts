import { NextFunction, Request, Response } from "express";
import { userservices } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { pick } from "../../../shared/pick";
import { IJwtPayload } from "../auth/auth.interface";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userservices.createadmin(req.file, req.body);
    res.status(200).send({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(200).send({
      success: false,
      message: error.name || "Something went wrong",
      error: error,
    });
  }
};

const createDoctor = catchAsync(async (req, res, next) => {
  const result = await userservices.createDoctorIntoDB(req.file, req.body);
  res.status(200).send({
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});
const createPatient = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const result = await userservices.createPatientIntoDB(req.file, req.body);
  res.status(200).send({
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});
const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  const query = pick(req.query, ["email", "role", "status", "searchTerm"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  try {
    const result = await userservices.getAllUserFromDB(query, options);
    res.status(200).send({
      success: true,
      message: "all user data fetched successfully",
      meta: result?.meta,
      data: result?.data,
    });
  } catch (error: any) {
    next(error);
  }
};

const changeProfileStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userservices.changeProfileStatusIntoDB(
      req.params.userId,
      req.body
    );
    res.status(200).send({
      success: true,
      message: "status updated successfully",
      data: result,
    });
  }
);

const getMyProfile = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    // console.log(req.user);

    const result = await userservices.getMyProfileFromDB(req.user);
    res.status(200).send({
      success: true,
      message: "get my profile successfully",
      data: result,
    });
  }
);
const updateMyProfile = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const result = await userservices.updateMyProfileIntoDB(
      req.file,
      req.user,
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Update my profile successfully",
      data: result,
    });
  }
);

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
