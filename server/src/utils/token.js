import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateJWT = (id_user, role) => {
  const secret = process.env.JWT_SECRET || "RAHASIA_ZYPO_PARK_123";
  return jwt.sign({ id_user, role }, secret, {
    expiresIn: "7d",
  });
};
export const verifyJWT = (token) => {
  const secret = process.env.JWT_SECRET || "RAHASIA_ZYPO_PARK_123";
  return jwt.verify(token, secret);
};
export const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 15);
  return { token, expiry };
};
