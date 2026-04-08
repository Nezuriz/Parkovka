import prisma from '../prisma/client.js';
import { comparePassword } from '../utils/hash.js';
import { generateJWT } from '../utils/token.js';

export const loginUser = async (username, password) => {
  const user = await prisma.user.findUnique({
    where: { username }
  });
  if (!user) {
    throw new Error('Username atau password salah');
  }
  const isPasswordValid = await comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Username atau password salah');
  }
  if (!user.status_aktif) {
    throw new Error('Akun ini sudah tidak aktif, silakan hubungi Admin.');
  }
  const token = generateJWT(user.id_user, user.role);
  return {
    user: {
      id_user: user.id_user,
      nama_lengkap: user.nama_lengkap,
      username: user.username,
      role: user.role
    },
    token
  };
};