import connection from "../mysql.config";
import { getTicket } from "./search";

const deleteTicket = async (id: number) => {

    const existingTicket = await getTicket(id);

    if (!existingTicket) {
        throw new Error('El ticket no existe.');
    }

    const deleteQuery = 'DELETE FROM tickets WHERE id = ?';
    const deleteValues = [id];


    return new Promise((resolve, reject) => {
        connection.query(deleteQuery, deleteValues, (err, results) => {
            if (err) {
                console.error('Error al eliminar el ticket en MySQL:', err);
                reject(err);
            } else {
                // Devolver los detalles del ticket eliminado
                resolve({
                    id: id,
                    user: existingTicket.user,
                    status: existingTicket.status,
                    dateCreate: existingTicket.dateCreate,
                    dateUpdate: new Date(),
                });
            }
        });

    });

}

export {
    deleteTicket
}