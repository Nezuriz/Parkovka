import prisma from '../prisma/client.js';

export const catatLog = async (id_user, aktivitas) => {
  return await prisma.logAktivitas.create({
    data: {
      id_user: Number(id_user),
      aktivitas
    }
  });
};

export const getAllLogs = async () => {
  return await prisma.logAktivitas.findMany({
    include: {
      user: {
        select: {
          nama_lengkap: true,
          role: true
        }
      }
    },
    orderBy: {
      waktu_aktivitas: 'desc'
    }
  });
};