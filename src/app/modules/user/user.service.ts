import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import { uploadToCLoudinary } from "../../../shared/fileUploader";
import { calculatePagination } from "../../../shared/calculatePagination";
import { equal } from "assert";
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const createadmin = async (file: any, data: any) => {
  try {
    const hashedpass = bcrypt.hashSync(data?.password, 12);
    const userData = {
      email: data?.admin?.email,
      password: hashedpass,
      role: UserRole.ADMIN,
    };

    const result = await prisma.$transaction(async (transactionClient) => {
      if (file) {
        const imageUrl = await uploadToCLoudinary(file);
        data.admin.profilePhoto = imageUrl;
      }
      await transactionClient.user.create({
        data: userData,
      });
      const createdAdminData = await transactionClient.admin.create({
        data: data.admin,
      });
      return createdAdminData;
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const createDoctorIntoDB = async (file: any, data: any) => {
  try {
    const hashedpass = bcrypt.hashSync(data?.password, 12);
    const userData = {
      email: data?.doctor?.email,
      password: hashedpass,
      role: UserRole.DOCTOR,
    };

    const result = await prisma.$transaction(async (transactionClient) => {
      if (file) {
        const imageUrl = await uploadToCLoudinary(file);

        data.doctor.profilePhoto = imageUrl;
      }
      await transactionClient.user.create({
        data: userData,
      });
      const createdAdminData = await transactionClient.doctor.create({
        data: data.doctor,
      });

      return createdAdminData;
    });

    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const createPatientIntoDB = async (file: any, data: any) => {
  const hashedpass = bcrypt.hashSync(data?.password, 12);
  const userData = {
    email: data?.patient?.email,
    password: hashedpass,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    if (file) {
      const imageUrl = await uploadToCLoudinary(file);

      data.patient.profilePhoto = imageUrl;
    }
    await transactionClient.user.create({
      data: userData,
    });
    const createdPatientData = await transactionClient.patient.create({
      data: data.patient,
    });

    return createdPatientData;
  });

  return result;
};

const getAllUserFromDB = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filteredData } = params;
  const andCondition: Prisma.UserWhereInput[] = [];

  if (searchTerm && searchTerm) {
    andCondition.push({
      OR: ["email"]?.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filteredData).length > 0) {
    andCondition.push({
      OR: Object.keys(filteredData).map((key) => ({
        [key]: {
          equals: (filteredData as any)[key],
        },
      })),
    });
  }

  //   console.dir(andCondition, { depth: null });

  try {
    const whereCondition: Prisma.UserWhereInput =
      andCondition.length > 0 ? { AND: andCondition } : {};
    // console.dir(whereCondition, { depth: null });

    const userData = await prisma.user.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy:
        options.orderBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { createdAt: "asc" },
    });

    const totalCount = await prisma.user.count({
      where: whereCondition,
    });
    return {
      meta: {
        page,
        limit,
        total: totalCount,
      },
      data: userData,
    };
  } catch (error) {}
};

const changeProfileStatusIntoDB = async (id: string, status: string) => {
  console.log(status);

  const result = await prisma.user.update({ where: { id }, data: status });
  return result;
};

const getMyProfileFromDB = async (user) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  let profileInfo;
  if (
    userInfo?.role === UserRole.ADMIN ||
    userInfo?.role === UserRole.SUPER_ADMIN
  ) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: user.email,
      },
    });
  } else if (userInfo?.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: user.email,
      },
    });
  } else if (userInfo?.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: user.email,
      },
    });
  }
  // console.log(profileInfo);

  return { ...userInfo, ...profileInfo };
};
export const userservices = {
  createadmin,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllUserFromDB,
  changeProfileStatusIntoDB,
  getMyProfileFromDB,
};
