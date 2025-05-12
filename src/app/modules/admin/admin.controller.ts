import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { catchAsync } from "../../../shared/catchAsync";

const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const query = pick(req.query, ["name", "email", "searchTerm"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  try {
    const result = await adminService.getAllAdmin(query, options);
    res.status(200).send({
      success: true,
      message: "Admin fetched successfully",
      meta: result?.meta,
      data: result?.data,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { adminId } = req.params;

    const result = await adminService.getAdminByIdFromDB(adminId);
    res.status(200).send({
      success: true,
      message: "Admin by id fetched successfully",
      data: result,
    });
  }
);

const updateAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { adminId } = req.params;
  try {
    const result = await adminService.updateAdminByIdIntoDB(adminId, req.body);
    res.status(200).send({
      success: true,
      message: "Admin by id updated successfully",
      data: result,
    });
  } catch (error: any) {
    // res.status(200).send({
    //   success: true,
    //   message: error.name || "Something went wrong",
    //   error: error,
    // });

    next(error);
  }
};
const deleteAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { adminId } = req.params;
  try {
    const result = await adminService.deleteAdminByIdFromDB(adminId);
    res.status(200).send({
      success: true,
      message: "Admin by id deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const softDeleteAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { adminId } = req.params;
  try {
    const result = await adminService.softDeleteAdminByIdFromDB(adminId);
    res.status(200).send({
      success: true,
      message: "Admin by id soft deleted successfully",
      data: result,
    });
  } catch (error: any) {
    // res.status(500).send({
    //   success: false,
    //   message: error.name || "Something went wrong",
    //   error: error,
    // });
    next(error);
  }
};

export const adminController = {
  getAllAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  softDeleteAdminById,
};
