import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { calculatePagination } from "../../../shared/calculatePagination";
import { TAdminFilterRequest } from "./admin.interface";
const prisma = new PrismaClient();
const getAllAdmin = async (params: TAdminFilterRequest, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filteredData } = params;
  const andCondition: Prisma.AdminWhereInput[] = [];
  //   [
  //     {
  //       name: {
  //         contains: searchTerm,
  //         mode: "insensitive",
  //       },
  //     },
  //     {
  //       email: {
  //         contains: searchTerm,
  //         mode: "insensitive",
  //       },
  //     },
  //   ]
  if (searchTerm && searchTerm) {
    andCondition.push({
      OR: ["name", "email", "contactNumber"]?.map((field) => ({
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

  andCondition.push({ isDeleted: false });

  //   console.dir(andCondition, { depth: null });

  try {
    const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
    // console.dir(whereCondition, { depth: null });

    const adminData = await prisma.admin.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy:
        options.orderBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { createdAt: "asc" },
    });

    const totalCount = await prisma.admin.count({
      where: whereCondition,
    });
    return {
      meta: {
        page,
        limit,
        total: totalCount,
      },
      data: adminData,
    };
  } catch (error) {}
};

const getAdminByIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
  });
  return result;
};
const updateAdminByIdIntoDB = async (id: string, data: Partial<Admin>) => {
  const isExists = await prisma.admin.findUniqueOrThrow({ where: { id } });
  const result = await prisma.admin.update({
    where: {
      id: id,
      isDeleted: false,
    },
    data,
  });
  return result;
};
const deleteAdminByIdFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({ where: { id } });

  const result = await prisma.$transaction(async (transactionClient) => {
    const deleteAdmin = await transactionClient.admin.delete({ where: { id } });
    const deleteUser = await transactionClient.user.delete({
      where: { email: deleteAdmin.email },
    });
    return deleteAdmin;
  });
  return result;
};
const softDeleteAdminByIdFromDB = async (id: string) => {
  const isExists = await prisma.admin.findUniqueOrThrow({ where: { id } });

  const result = await prisma.$transaction(async (transactionClient) => {
    const deleteAdmin = await transactionClient.admin.update({
      where: { id },
      data: { isDeleted: true },
    });
    const deleteUser = await transactionClient.user.update({
      where: { email: deleteAdmin.email },
      data: { status: UserStatus.DELETED },
    });
    return deleteAdmin;
  });
  return result;
};

export const adminService = {
  getAllAdmin,
  getAdminByIdFromDB,
  updateAdminByIdIntoDB,
  deleteAdminByIdFromDB,
  softDeleteAdminByIdFromDB,
};
