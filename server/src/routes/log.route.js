import express from 'express';
import { getLogs } from '../controllers/log.controller.js';
import { verifyToken, isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get('/', getLogs);

export default router;