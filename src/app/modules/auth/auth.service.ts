import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../middlewares/globalErrorHandler";
import { IJwtPayload } from "./auth.interface";
import { generateToken } from "./auth.utils";
import { jwtDecode } from "jwt-decode";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import emailSender from "./emailSender";
const prisma = new PrismaClient();

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const isExistsUser = await prisma.user.findUnique({ where: { email } });
  //   console.log(isExistsUser);
  if (
    isExistsUser &&
    isExistsUser.password &&
    !(await bcrypt.compare(password, isExistsUser?.password))
  ) {
    throw new AppError(404, "Password has not matched");
  }
  const jwtPayload: IJwtPayload = {
    email,
    role: isExistsUser?.role,
  };
  const accessToken = await generateToken(
    jwtPayload,
    config.jwt.jwt_secret as string,
    "7d"
  );
  const refreshToken = await generateToken(
    jwtPayload,
    "hsjdfdgsa76473bc373ccbx",
    "60d"
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  const decoded: IJwtPayload = jwtDecode(token);

  const result = await prisma.user.findFirst({
    where: {
      email: decoded.email,
      role: decoded.role as UserRole,
      status: UserStatus.ACTIVE,
    },
  });
  const jwtPayload: IJwtPayload = {
    email: decoded.email,
    role: decoded.role,
  };
  const accessToken = await generateToken(
    jwtPayload,
    "hsjdfdgsa76473bc373ccbx",
    "15m"
  );
  return { accessToken };
};

const passwordChangeIntoDB = async (
  user: IJwtPayload,
  payload: { oldPassword: string; currentPassword: string }
) => {
  const { email, role } = user;
  const isExistsUser = await prisma.user.findUnique({ where: { email } });
  if (
    isExistsUser &&
    isExistsUser?.password &&
    !(await bcrypt.compareSync(payload.oldPassword, isExistsUser?.password))
  ) {
    throw new AppError(401, "Password not matched");
  }
  const result = await prisma.user.update({
    where: { email },
    data: {
      password: bcrypt.hashSync(payload.currentPassword, 15),
      needPasswordChange: false,
    },
  });
  return result;
};

const forgotPasswordIntoDB = async (payload: { email: string }) => {
  const isExistsUser = await prisma.user.findUnique({
    where: { email: payload.email, status: UserStatus.ACTIVE },
  });

  const resetPassToken = await generateToken(
    { email: payload?.email, role: isExistsUser?.role },
    config.jwt.reset_pass_secret as string,
    config.jwt.reset_pass_token_expires_in as string
  );

  const resetPasswordLink =
    config.reset_pass_link +
    `?userId=${isExistsUser?.id}&token=${resetPassToken}`;
  console.log(resetPasswordLink);

  const sentEmail = await emailSender(
    payload.email,
    `
      <div>
        <p>Dear User, </p>
        <p> 
          Your password reset link 
            <a href="${resetPasswordLink}">
              <button> Reset</button>
            </a>
        </p>
      </div>
    `
  );

  return sentEmail;
};

const resetPasswordIntoDB = async (
  token: string,
  payload: { id: string; password: string }
) => {
  // console.log(token, payload);
  try {
    const isExistsUser = await prisma.user.findUnique({
      where: { id: payload.id, status: UserStatus.ACTIVE },
    });
    const isValidToken = jwt.verify(
      token,
      config.jwt.reset_pass_secret as string
    ) as JwtPayload;
    if (!isValidToken) {
      throw new AppError(401, "forbidden");
    }

    const result = await prisma.user.update({
      where: { id: payload.id },
      data: {
        password: bcrypt.hashSync(payload.password, 15),
      },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const authService = {
  loginUser,
  refreshToken,
  passwordChangeIntoDB,
  forgotPasswordIntoDB,
  resetPasswordIntoDB,
};
