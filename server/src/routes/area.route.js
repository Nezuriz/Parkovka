import express from "express";
import { getAreas, getArea, createNewArea, updateExistingArea, deleteArea } from "../controllers/area.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/admin.middleware.js"; 

const router = express.Router();
router.use(verifyToken);
router.get('/', authorizeRoles('admin', 'petugas', 'owner'), getAreas);
router.get('/:id', authorizeRoles('admin', 'petugas'), getArea);
router.post('/', authorizeRoles('admin'), createNewArea);
router.put('/:id', authorizeRoles('admin'), updateExistingArea);
router.delete('/:id', authorizeRoles('admin'), deleteArea);

export default router;