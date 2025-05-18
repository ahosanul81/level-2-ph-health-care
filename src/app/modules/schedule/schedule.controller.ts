import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { scheduleService } from "./schedule.service";

const insert = catchAsync(async (req, res) => {
  const result = await scheduleService.insertIntoDB(req.body);

  res.status(200).json({
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

export const scheduleController = { insert };
