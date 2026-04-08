import * as kendaraanService from '../services/kendaraan.service.js';

export const getKendaraan = async (req, res) => {
  try {
    const data = await kendaraanService.getAllKendaraan();
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getOneKendaraan = async (req, res) => {
  try {
    const data = await kendaraanService.getKendaraanById(req.params.id);
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const createKendaraan = async (req, res) => {
  try {
    await kendaraanService.createKendaraan(req.body);
    res.status(201).json({ status: 'success', message: 'Data kendaraan & tarif berhasil dibuat' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateKendaraan = async (req, res) => {
  try {
    await kendaraanService.updateKendaraan(req.params.id, req.body);
    res.json({ status: 'success', message: 'Data kendaraan & tarif berhasil diupdate' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteKendaraan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      return res.status(400).json({ status: 'error', message: 'ID harus berupa angka!' });
    }
    await kendaraanService.deleteKendaraan(Number(id));
    res.json({ status: 'success', message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};