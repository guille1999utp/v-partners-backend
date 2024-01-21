import { Request, Response, NextFunction } from 'express';

const getTicketsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // Validar el parámetro 'page' si está presente
    if (req.query.page) {
      const page = parseInt(req.query.page as string, 10);
      if (isNaN(page) || page < 1) {
        return res.status(400).json({ error: 'El parámetro "page" debe ser un número entero positivo' });
      }
    }

    // Validar el parámetro 'filter' si está presente
    if (req.query.filter) {
      const filter = req.query.filter as string;
      if (!['OPEN', 'CLOSE'].includes(filter)) {
        return res.status(400).json({ error: 'El parámetro "filter" debe ser una de las opciones: "OPEN" o "CLOSE"' });
      }
    }

    // Validar el parámetro 'limit' si está presente
    if (req.query.limit) {
      const limit = parseInt(req.query.limit as string, 10);
      if (isNaN(limit) || limit < 1) {
        return res.status(400).json({ error: 'El parámetro "limit" debe ser un número entero positivo' });
      }
    }

    next();
  } catch (error) {
    console.error('Error en la validación:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default getTicketsMiddleware;
