import express from 'express';
import {getUsers, getUser, createNewUser, updateExistingUser, deleteUser} from "../controllers/user.controller.js"
import { verifyToken, isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();
router.use(verifyToken, isAdmin);

router.get('/', getUsers);                
router.get('/:id', getUser);             
router.post('/', createNewUser);         
router.put('/:id', updateExistingUser);   
router.delete('/:id', deleteUser);       

export default router;