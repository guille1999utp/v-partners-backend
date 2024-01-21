import { Router } from 'express';
import { createTicket, deleteTicket, getTickets, updateTicket } from '../controllers/tickets';
import { idValidation, statusValidation } from '../../utils/customValidators';
import { check } from 'express-validator';
import fieldsValidators from '../../utils/validaton';
import getTicketsMiddleware from '../middlewares/pagination';

const router = Router();

// Crear Ticket
router.post('/ticket',
    [
        check('status', 'El campo "status" es obligatorio').notEmpty(),
        statusValidation,
        check('user', 'El campo "user" es obligatorio').notEmpty(), fieldsValidators
    ],
    createTicket);

// obtener Ticket
router.get('/tickets',getTicketsMiddleware,getTickets);

// Actualizar Ticket
router.put('/ticket/:id',
    [
        statusValidation,
        ...idValidation,
        check('status', 'El campo "status" es obligatorio').notEmpty(),
        fieldsValidators
    ],
    updateTicket);

// Eliminar Ticket
router.delete('/ticket/:id',
    [
        ...idValidation,
        fieldsValidators
    ],
    deleteTicket);

export default router;