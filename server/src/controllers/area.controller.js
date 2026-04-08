import * as areaService from '../services/area.service.js';

export const getAreas = async (req, res) => {
  try {
    const areas = await areaService.getAllAreas();
    res.status(200).json({ status: 'success', data: areas });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getArea = async (req, res) => {
  try {
    const area = await areaService.getAreaById(req.params.id);
    res.status(200).json({ status: 'success', data: area });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

export const createNewArea = async (req, res) => {
  try {
    await areaService.createArea(req.body);
    res.status(201).json({ status: 'success', message: 'Area parkir berhasil dibuat' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateExistingArea = async (req, res) => {
  try {
    await areaService.updateArea(req.params.id, req.body);
    res.status(200).json({ status: 'success', message: 'Area parkir berhasil diupdate' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteArea = async (req, res) => {
  try {
    await areaService.deleteArea(req.params.id);
    res.status(200).json({ status: 'success', message: 'Area parkir berhasil dihapus' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};