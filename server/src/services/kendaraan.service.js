import prisma from '../prisma/client.js';

export const getAllKendaraan = async () => {
  return await prisma.jenisKendaraan.findMany();
};

export const getKendaraanById = async (id) => {
  const data = await prisma.jenisKendaraan.findUnique({
    where: { id_jenis: Number(id) }
  });

  if (!data) throw new Error('Jenis kendaraan tidak ditemukan');
  return data;
};

export const createKendaraan = async (data) => {
  const { nama_jenis, tarif_per_jam } = data;

  if (!nama_jenis || !tarif_per_jam) {
    throw new Error('Nama jenis kendaraan dan tarif wajib diisi');
  }

  return await prisma.jenisKendaraan.create({
    data: {
      nama_jenis,
      tarif_per_jam: Number(tarif_per_jam)
    }
  });
};

export const updateKendaraan = async (id, data) => {
  const existing = await prisma.jenisKendaraan.findUnique({
    where: { id_jenis: Number(id) }
  });

  if (!existing) throw new Error('Jenis kendaraan tidak ditemukan');

  return await prisma.jenisKendaraan.update({
    where: { id_jenis: Number(id) },
    data: {
      nama_jenis: data.nama_jenis ?? existing.nama_jenis,
      tarif_per_jam: data.tarif_per_jam ? Number(data.tarif_per_jam) : existing.tarif_per_jam
    }
  });
};

export const deleteKendaraan = async (id) => {
  const existing = await prisma.jenisKendaraan.findUnique({
    where: { id_jenis: Number(id) }
  });

  if (!existing) throw new Error('Jenis kendaraan tidak ditemukan');

  return await prisma.jenisKendaraan.delete({
    where: { id_jenis: Number(id) }
  });
};