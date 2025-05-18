import { Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { calculatePagination } from "../../../shared/calculatePagination";

const prisma = new PrismaClient();
const getAllDoctor = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, specialties, ...filteredData } = params;

  const andCondition: Prisma.DoctorWhereInput[] = [];
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
  // doctor > doctorSpecialities > specialities ---> title
  if (specialties && specialties.length > 0) {
    // Corrected specialties condition
    andCondition.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  andCondition.push({ isDeleted: false });

  //   console.dir(andCondition, { depth: null });

  try {
    const whereCondition: Prisma.DoctorWhereInput = { AND: andCondition };
    // console.dir(whereCondition, { depth: null });

    const adminData = await prisma.doctor.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy:
        options.orderBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { createdAt: "asc" },
      include: {
        doctorSpecialties: {
          include: {
            specialities: true,
          },
        },
      },
    });

    const totalCount = await prisma.doctor.count({
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

const getDoctorByIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
  });
  return result;
};
const updateDoctorByIdIntoDB = async (id: string, payload: any) => {
  const { specialities, ...doctorData } = payload;
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({ where: { id } });
  const result = await prisma.$transaction(async (transationClient) => {
    const updateDoctor = await transationClient.doctor.update({
      where: {
        id: id,
        isDeleted: false,
      },
      data: doctorData,
    });

    if (specialities && specialities.length > 0) {
      const deleteSpecialities = specialities.filter(
        (speciality: any) => speciality.isDeleted === true
      );

      for (const speciality of specialities) {
        const deleteDoctorSpecialisties =
          await transationClient.doctorSpecialties.deleteMany({
            where: {
              doctorId: doctorInfo.id,
              specialitiesId: deleteSpecialities.specialitiesId,
            },
          });
      }

      // create specialities
      const createSpecialities = specialities.filter(
        (speciality: any) => speciality.isDeleted === false
      );
      for (const speciality of createSpecialities) {
        const CreateDoctorSpecialisties =
          await transationClient.doctorSpecialties.create({
            data: {
              doctorId: doctorInfo.id,
              specialitiesId: speciality.specialitiesId,
            },
          });
      }
    }

    return updateDoctor;
  });
  return result;
};
const deleteDoctorByIdFromDB = async (id: string) => {
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
const softDeleteDoctorByIdFromDB = async (id: string) => {
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

export const doctorService = {
  getAllDoctor,
  getDoctorByIdFromDB,
  updateDoctorByIdIntoDB,
  deleteDoctorByIdFromDB,
  softDeleteDoctorByIdFromDB,
};
