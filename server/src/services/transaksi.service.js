import prisma from '../prisma/client.js';

export const kendaraanMasuk = async (data, id_user) => {
  const { plat_nomor, id_area, id_jenis } = data;
  if (!plat_nomor || !id_area || !id_jenis) throw new Error('Data tidak lengkap');

  const area = await prisma.areaParkir.findUnique({ where: { id_area: Number(id_area) } });
  if (!area) throw new Error('Area tidak ditemukan');
  if (area.terisi >= area.kapasitas) throw new Error('Area parkir penuh');

  const jenis = await prisma.jenisKendaraan.findUnique({ where: { id_jenis: Number(id_jenis) } });
  if (!jenis) throw new Error('Jenis kendaraan tidak valid');

  return await prisma.$transaction([
    prisma.transaksi.create({
      data: {
        plat_nomor,
        id_area: Number(id_area),
        id_jenis: Number(id_jenis),
        id_user: Number(id_user),
        status: 'masuk'
      }
    }),
    prisma.areaParkir.update({
      where: { id_area: Number(id_area) },
      data: { terisi: { increment: 1 } }
    })
  ]);
};

export const kendaraanKeluar = async (id_parkir) => {
  const trx = await prisma.transaksi.findUnique({
    where: { id_parkir: Number(id_parkir) },
    include: { jenis_kendaraan: true }
  });

  if (!trx) throw new Error('Transaksi tidak ditemukan');
  if (trx.status === 'keluar') throw new Error('Kendaraan sudah keluar');

  const waktuKeluar = new Date();
  const selisihMs = waktuKeluar - new Date(trx.waktu_masuk);
  let durasiJam = Math.ceil(selisihMs / (1000 * 60 * 60));
  
  if (durasiJam < 1) durasiJam = 1;

  const biayaTotal = durasiJam * Number(trx.jenis_kendaraan.tarif_per_jam);

  return await prisma.$transaction([
    prisma.transaksi.update({
      where: { id_parkir: Number(id_parkir) },
      data: {
        waktu_keluar: waktuKeluar,
        durasi_jam: durasiJam,
        biaya_total: biayaTotal,
        status: 'keluar'
      }
    }),
    prisma.areaParkir.update({
      where: { id_area: trx.id_area },
      data: { terisi: { decrement: 1 } }
    })
  ]);
};

export const getAllTransaksi = async () => {
  return await prisma.transaksi.findMany({
    include: {
      user: { select: { nama_lengkap: true } },
      area_parkir: { select: { nama_area: true } },
      jenis_kendaraan: { select: { nama_jenis: true, tarif_per_jam: true } }
    },
    orderBy: { waktu_masuk: 'desc' }
  });
};

export const getRekapTransaksi = async (startDate, endDate) => {
  const whereClause = { status: 'keluar' };

  if (startDate && endDate) {
    whereClause.waktu_keluar = {
      gte: new Date(`${startDate}T00:00:00.000Z`),
      lte: new Date(`${endDate}T23:59:59.999Z`)
    };
  }

  const data = await prisma.transaksi.findMany({
    where: whereClause,
    include: {
      user: { select: { nama_lengkap: true } },
      area_parkir: { select: { nama_area: true } },
      jenis_kendaraan: { select: { nama_jenis: true } }
    },
    orderBy: { waktu_keluar: 'desc' }
  });

  const total_pendapatan = data.reduce((sum, item) => sum + Number(item.biaya_total || 0), 0);

  return { total_pendapatan, total_transaksi: data.length, data };
};