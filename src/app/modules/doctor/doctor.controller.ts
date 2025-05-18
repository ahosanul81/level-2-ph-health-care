import { NextFunction, Request, Response } from "express";
import { pick } from "../../../shared/pick";
import { doctorService } from "./doctor.service";
import { catchAsync } from "../../../shared/catchAsync";

const getAllDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = pick(req.query, ["name", "email", "searchTerm", "specialties"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  try {
    const result = await doctorService.getAllDoctor(query, options);
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

const getDoctorById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params;

    const result = await doctorService.getDoctorByIdFromDB(doctorId);
    res.status(200).send({
      success: true,
      message: "doctor by id fetched successfully",
      data: result,
    });
  }
);

const updateDoctorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { doctorId } = req.params;
  try {
    const result = await doctorService.updateDoctorByIdIntoDB(
      doctorId,
      req.body
    );
    res.status(200).send({
      success: true,
      message: "doctor by id updated successfully",
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
const deleteDoctorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { doctorId } = req.params;
  try {
    const result = await doctorService.deleteDoctorByIdFromDB(doctorId);
    res.status(200).send({
      success: true,
      message: "doctor by id deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const softDeleteDoctorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { doctorId } = req.params;
  try {
    const result = await doctorService.softDeleteDoctorByIdFromDB(doctorId);
    res.status(200).send({
      success: true,
      message: "doctor by id soft deleted successfully",
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

export const doctorController = {
  getAllDoctor,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
  softDeleteDoctorById,
};
