import { PrismaClient } from "@prisma/client";
import { uploadToCLoudinary } from "../../../shared/fileUploader";
const prisma = new PrismaClient();
const insertIntoDB = async (file: any, payload: any) => {
  try {
    if (file) {
      const imageUrl = await uploadToCLoudinary(file);
      payload.icon = imageUrl;
    }

    const result = await prisma.specialties.create({ data: payload });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const specialitiesService = { insertIntoDB };
