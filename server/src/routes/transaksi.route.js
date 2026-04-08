import express from 'express';
import { catatMasuk, catatKeluar, getTransaksi, rekapTransaksi } from '../controllers/transaksi.controller.js';
import { verifyToken, authorizeRoles } from '../middleware/admin.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/rekap', authorizeRoles('admin', 'owner'), rekapTransaksi);
router.get('/', authorizeRoles('admin', 'petugas', 'owner'), getTransaksi);
router.post('/masuk', authorizeRoles('admin', 'petugas'), catatMasuk);
router.put('/keluar/:id', authorizeRoles('admin', 'petugas'), catatKeluar);

export default router;