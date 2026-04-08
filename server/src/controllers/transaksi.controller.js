import * as transaksiService from '../services/transaksi.service.js';
import { catatLog } from '../services/log.service.js';

export const catatMasuk = async (req, res) => {
  try {
    const result = await transaksiService.kendaraanMasuk(req.body, req.user.id_user);
    await catatLog(req.user.id_user, `Mencatat kendaraan masuk dengan plat ${req.body.plat_nomor}`);
    res.status(201).json({ status: 'success', message: 'Kendaraan masuk dicatat', data: result[0] });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const catatKeluar = async (req, res) => {
  try {
    const result = await transaksiService.kendaraanKeluar(req.params.id);
    await catatLog(req.user.id_user, `Mencatat kendaraan keluar dengan plat ${result[0].plat_nomor}`);
    res.status(200).json({ status: 'success', message: 'Kendaraan keluar dicatat', data: result[0] });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getTransaksi = async (req, res) => {
  try {
    const data = await transaksiService.getAllTransaksi();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const rekapTransaksi = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await transaksiService.getRekapTransaksi(startDate, endDate);
    await catatLog(req.user.id_user, `Melihat rekap transaksi parkir`);
    res.status(200).json({ status: 'success', ...result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};