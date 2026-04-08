import express from 'express';
import { getKendaraan, getOneKendaraan, createKendaraan, updateKendaraan, deleteKendaraan } from '../controllers/kendaraan.controller.js';
import { verifyToken, authorizeRoles } from '../middleware/admin.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', authorizeRoles('admin', 'petugas', 'owner'), getKendaraan); 
router.get('/:id', authorizeRoles('admin', 'petugas', 'owner'), getOneKendaraan);
router.post('/', createKendaraan);
router.put('/:id', updateKendaraan);
router.delete('/:id', deleteKendaraan);

export default router;