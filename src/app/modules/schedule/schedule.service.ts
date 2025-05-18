import { PrismaClient } from "@prisma/client";
import { addHours, addMinutes, format, getMinutes } from "date-fns";
const prisma = new PrismaClient();
const insertIntoDB = async (payload: any) => {
  // console.log(payload);
  const { startDate, endDate, startTime, endTime } = payload;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const interval = 30;
  const schedules = [];
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );
    // console.log(startDateTime);==
    // console.log(endDateTime);

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, interval),
      };

      startDateTime.setMinutes(startDateTime.getMinutes() + 30);
      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

export const scheduleService = { insertIntoDB };
