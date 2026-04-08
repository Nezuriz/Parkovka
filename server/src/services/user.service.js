import prisma from '../prisma/client.js';
import { hashPassword } from '../utils/hash.js'; 

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: { id_user: true, nama_lengkap: true, username: true, role: true, status_aktif: true }
  });
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id_user: Number(id) },
    select: { id_user: true, nama_lengkap: true, username: true, role: true, status_aktif: true }
  });
  if (!user) throw new Error('User tidak ditemukan');
  return user;
};

export const createUser = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: { username: data.username }
  });
  if (existingUser) throw new Error('Username sudah digunakan');
  const hashedPassword = await hashPassword(data.password);
  return await prisma.user.create({
    data: {
      nama_lengkap: data.nama_lengkap,
      username: data.username,
      password: hashedPassword,
      role: data.role || 'petugas',
      status_aktif: data.status_aktif !== undefined ? data.status_aktif : true
    },
    select: { id_user: true, nama_lengkap: true, username: true, role: true, status_aktif: true }
  });
};

export const updateUser = async (id, data) => {
  const existingUser = await prisma.user.findUnique({
    where: { id_user: Number(id) }
  });
  if (!existingUser) throw new Error('User tidak ditemukan');

  if (data.username && data.username !== existingUser.username) {
    const usernameTaken = await prisma.user.findUnique({
      where: { username: data.username }
    });
    if (usernameTaken) throw new Error('Username sudah digunakan oleh pengguna lain');
  }

  const updateData = { ...data };
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }
  
  return await prisma.user.update({
    where: { id_user: Number(id) },
    data: updateData,
    select: { id_user: true, nama_lengkap: true, username: true, role: true, status_aktif: true }
  });
};

export const deleteUser = async (id) => {
  const existingUser = await prisma.user.findUnique({
    where: { id_user: Number(id) }
  });
  if (!existingUser) throw new Error('User tidak ditemukan');
  return await prisma.user.delete({
    where: { id_user: Number(id) },
    select: { id_user: true, nama_lengkap: true, username: true, role: true, status_aktif: true }
  });
};