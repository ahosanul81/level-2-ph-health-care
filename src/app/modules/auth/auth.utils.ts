import jwt from "jsonwebtoken";
import { IJwtPayload } from "./auth.interface";

export const generateToken = async (
  data: IJwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(data, secret, {
    expiresIn: expiresIn,
  });
  return token;
};
