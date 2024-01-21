import {Router} from 'express';
import { createUser, getUsers } from '../controllers/users';

const router = Router();

// Crear User
router.post('/User', createUser);

// obtener Usuarios
router.get('/Users', getUsers);

export default router;