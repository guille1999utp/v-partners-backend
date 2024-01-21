import { Request, Response } from "express";
import { getUser } from "../../BD/querys/search";
import { User } from "../interfaces/user";
import { executeGraphQLQuery } from "../services/graphqlServices";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        const userExists: User[] = await getUser(name);

        if (userExists.length) {
          // Si el usuario no existe, retornar un error o un mensaje apropiado
          return res.status(400).json({ ok: false, error:"El Usuario ya existe"  });
        }

        const query = `
          mutation {
            createUser(name: "${name}") {
              id,
              name
          }
        }
        `;

        const resGraphql = await executeGraphQLQuery(query)

        const createdTicket = resGraphql.createUser;
        return res.status(201).json({ ok: true, user: createdTicket });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({ ok: false, error: error.message });
    }
}

export const getUsers = async (req: Request, res: Response) => {

    try {

        const query = `
              query {
                users {
                  results {
                      id,
                      name
                  }
                }
              }
            `;
    
        const resGraphql = await executeGraphQLQuery(query)
    
        const results = resGraphql.users.results;
        res.status(200).json({ ok: true, results });
      } catch (error: any) {
        console.error(error.message);
        res.status(500).json({ ok: false, error: error.message});
      }

}