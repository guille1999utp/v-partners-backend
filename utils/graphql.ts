import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLEnumType } from 'graphql';
import connection from '../BD/mysql.config';
import mysql from 'mysql';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getTicket, getUser } from '../BD/querys/search';
import { deleteTicket } from '../BD/querys/delete';
import { User } from '../src/interfaces/user';

const TicketStatusEnum = new GraphQLEnumType({
  name: 'TicketStatus',
  values: {
    OPEN: { value: 'OPEN' },
    CLOSE: { value: 'CLOSE' },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString }
  }
});


const TicketType = new GraphQLObjectType({
  name: 'Ticket',
  fields: {
    id: { type: GraphQLInt },
    user: { type: UserType },
    status: { type: TicketStatusEnum },
    dateCreate: { type: GraphQLString },
    dateUpdate: { type: GraphQLString },
  },
});

const PageInfoType = new GraphQLObjectType({
  name: 'PageInfo',
  fields: {
    count: { type: GraphQLInt },
    pages: { type: GraphQLInt },
    currentPage: { type: GraphQLString },
  },
});

const TicketsType = new GraphQLObjectType({
  name: 'Tickets',
  fields: {
    info: { type: PageInfoType },
    results: { type: new GraphQLList(TicketType) },
  },
});

const UsersType = new GraphQLObjectType({
  name: 'Users',
  fields: {
    results: { type: new GraphQLList(UserType) },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    tickets: {
      type: TicketsType,
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        filter: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const { page = 1, filter = '',limit = 10 } = args;

        const query = `
        SELECT SQL_CALC_FOUND_ROWS tickets.*, JSON_OBJECT('id', users.id, 'name', users.name) AS user
        FROM tickets
        INNER JOIN users ON tickets.user = users.id
        WHERE status LIKE '%${filter}%'
        LIMIT ?, ?;
      `;

      const countQuery = 'SELECT FOUND_ROWS() as totalCount;';

      const offset = (page - 1) * limit || 0;
      const values = [offset,limit];

        return new Promise((resolve, reject) => {
          connection.query(query,values,(err, results:RowDataPacket[]) => {
            if (err) {
              console.error('Error al obtener los tickets desde MySQL:', err);
              reject(err);
            } else {
              connection.query(countQuery, (countErr, countResults:RowDataPacket[]) => {
                if (countErr) {
                  console.error('Error al obtener el total de registros:', countErr);
                  reject(countErr);
                } else {
                  const totalCount = countResults[0].totalCount;
                  const totalPages = Math.ceil(totalCount / limit);
      
                  resolve({
                    info: {
                      count: totalCount,
                      pages: totalPages,
                      currentPage: page || 1
                    },
                    results,
                  });
                }
              });
            }
          });
        });
      },
    },
    users: {
      type: UsersType,
      async resolve(parent, args) {
        const query = `
          SELECT * FROM users
        `;

        return new Promise((resolve, reject) => {
          connection.query(query, (err: mysql.MysqlError | null, results: any[]) => {
            if (err) {
              console.error('Error al obtener los usuarios desde MySQL:', err);
              reject(err);
            } else {
              resolve({
                results
              });
            }
          });
        });
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString }
      },
      async resolve(parent, args) {
        const query = `
          INSERT INTO users (name)
          VALUES (?)
        `;
        const values = [args.name];

        return new Promise((resolve, reject) => {

          connection.query(query, values, (err, results: ResultSetHeader) => {
            if (err) {
              console.error('Error al crear el usuario en MySQL:', err);
              reject(err);
            } else {
              resolve({ ...args, id: results.insertId });
            }
          });
        });

      },
    },
    createTicket: {
      type: TicketType,
      args: {
        user: { type: GraphQLInt },
        status: { type: GraphQLString },
      },
      async resolve(parent, args) {

        const userExists: User[] = await getUser(args.user);

        if (!userExists.length) {

          throw new Error('El usuario no existe.');
        }

        const query = `
          INSERT INTO tickets (user, status, dateCreate, dateUpdate)
          VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        const values = [args.user, args.status];

        return new Promise((resolve, reject) => {

          connection.query(query, values, (err, results: ResultSetHeader) => {
            if (err) {
              console.error('Error al crear el ticket en MySQL:', err);
              reject(err);
            } else {
              resolve({ ...args, id: results.insertId, user: userExists[0], dateCreate: new Date(), dateUpdate: new Date() });
            }
          });
        });

      },
    },
    updateTicket: {
      type: TicketType,
      args: {
        id: { type: GraphQLInt },
        status: { type: GraphQLString },
      },
      async resolve(parent, args) {


        // Verificar si el ticket existe
        const existingTicket = await getTicket(args.id);

        if (!existingTicket) {
          throw new Error('El ticket no existe.');
        }

        const updateQuery = 'UPDATE tickets SET status = ?, dateUpdate = CURRENT_TIMESTAMP WHERE id = ?';
        const updateValues = [args.status, args.id];

        // Actualizar el ticket
        return new Promise((resolve, reject) => {
          connection.query(updateQuery, updateValues, (err, results) => {
            if (err) {
              console.error('Error al actualizar el ticket en MySQL:', err);
              reject(err);
            } else {

              resolve({
                id: args.id,
                user: existingTicket.user,
                status: args.status,
                dateCreate: existingTicket.dateCreate,
                dateUpdate: new Date(),
              });
            }
          });
        });
      },
    },
    deleteTicket: {
      type: TicketType,
      args: {
        id: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        return deleteTicket(args.id);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});

export default schema;