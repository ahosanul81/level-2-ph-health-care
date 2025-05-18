import { catchAsync } from "../../../shared/catchAsync";
import { specialitiesService } from "./specialities.service";

const insert = catchAsync(async (req, res) => {
  const result = await specialitiesService.insertIntoDB(req.file, req.body);
  res.status(200).send({
    success: true,
    message: "Update my profile successfully",
    data: result,
  });
});
export const specialitiesController = { insert };
