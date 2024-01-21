
import { Ticket } from "../../src/interfaces/ticket";
import { User } from "../../src/interfaces/user";
import connection from "../mysql.config";

const getUser = async (identifier: number | string): Promise<User[]> => {
  let userQuery: string;
  let userValues: any[];

  if (typeof identifier === 'number') {
      userQuery = 'SELECT id, name FROM users WHERE id = ?';
      userValues = [identifier];
  } else if (typeof identifier === 'string') {
      userQuery = 'SELECT id, name FROM users WHERE name = ?';
      userValues = [identifier];
  } 

  try {
      const userExists: User[] = await new Promise((resolve, reject) => {
          connection.query(userQuery, userValues, (err, results) => {
              if (err) {
                  console.error('Error al verificar la existencia del usuario en MySQL:', err);
                  reject(err);
              } else if (Array.isArray(results)) {
                  const users: User[] = results as User[];
                  resolve(users);
              }
          });
      });

      return userExists;
  } catch (error) {
      console.error('Error al ejecutar la consulta en MySQL:', error);
      return []
  }
};


const getTicket = async (id: number) => {

    const ticketQuery = `SELECT tickets.*, JSON_OBJECT('id', users.id, 'name', users.name) AS user
        FROM tickets
        INNER JOIN users ON tickets.user = users.id
        WHERE tickets.id = ?`;

        const ticketValues = [id];

        // Verificar si el ticket existe
        const existingTicket = await new Promise<Ticket[]>((resolve, reject) => {
          connection.query(ticketQuery, ticketValues, (err, results) => {
            if (err) {
              console.error('Error al verificar la existencia del ticket en MySQL:', err);
              reject(err);
            } else if (Array.isArray(results) && results.length > 0) {
              const tickets: Ticket[] = results as Ticket[];
              resolve(tickets);
            } else {
              resolve([]);
            }
          });
        });

        return existingTicket[0]

}

export {
    getUser,
    getTicket
}