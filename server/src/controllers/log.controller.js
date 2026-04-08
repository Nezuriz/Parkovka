import * as logService from '../services/log.service.js';

export const getLogs = async (req, res) => {
  try {
    const data = await logService.getAllLogs();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};