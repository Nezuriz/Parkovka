import prisma from '../prisma/client.js';

export const getAllAreas = async () => {
  return await prisma.areaParkir.findMany({
    select: {
      id_area: true,
      nama_area: true,
      kapasitas: true,
      terisi: true
    }
  });
};

export const getAreaById = async (id) => {
  const area = await prisma.areaParkir.findUnique({
    where: { id_area: Number(id) },
    select: {
      id_area: true,
      nama_area: true,
      kapasitas: true,
      terisi: true
    }
  });

  if (!area) throw new Error('Area parkir tidak ditemukan');
  return area;
};

export const createArea = async (data) => {
  if (!data.nama_area || !data.kapasitas) {
    throw new Error('Nama area dan kapasitas wajib diisi');
  }

  if (data.kapasitas <= 0) {
    throw new Error('Kapasitas harus lebih dari 0');
  }

  return await prisma.areaParkir.create({
    data: {
      nama_area: data.nama_area,
      kapasitas: Number(data.kapasitas),
      terisi: 0
    },
    select: {
      id_area: true,
      nama_area: true,
      kapasitas: true,
      terisi: true
    }
  });
};

export const updateArea = async (id, data) => {
  const existingArea = await prisma.areaParkir.findUnique({
    where: { id_area: Number(id) }
  });

  if (!existingArea) throw new Error('Area parkir tidak ditemukan');

  if (data.kapasitas !== undefined) {
    if (data.kapasitas < existingArea.terisi) {
      throw new Error('Kapasitas tidak boleh lebih kecil dari jumlah kendaraan saat ini');
    }
  }

  return await prisma.areaParkir.update({
    where: { id_area: Number(id) },
    data: {
      nama_area: data.nama_area,
      kapasitas: data.kapasitas ? Number(data.kapasitas) : existingArea.kapasitas
    },
    select: {
      id_area: true,
      nama_area: true,
      kapasitas: true,
      terisi: true
    }
  });
};

export const deleteArea = async (id) => {
  const existingArea = await prisma.areaParkir.findUnique({
    where: { id_area: Number(id) }
  });

  if (!existingArea) throw new Error('Area parkir tidak ditemukan');

  if (existingArea.terisi > 0) {
    throw new Error('Area parkir masih digunakan');
  }

  return await prisma.areaParkir.delete({
    where: { id_area: Number(id) },
    select: {
      id_area: true,
      nama_area: true,
      kapasitas: true,
      terisi: true
    }
  });
};