export interface IJwtPayload {
  email: string;
  role: string | undefined;
  iat?: number;
  exp?: number;
}
