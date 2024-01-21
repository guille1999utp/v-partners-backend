import { Request, Response } from "express";
import { executeGraphQLQuery } from "../services/graphqlServices";

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { user, status } = req.body;

    const query = `
      mutation {
        createTicket(user: ${user}, status: "${status}") {
          id,
          user {
            id,
            name
          },
          status,
          dateCreate,
          dateUpdate
        }
      }
    `;

    const resGraphql = await executeGraphQLQuery(query)

    const createdTicket = resGraphql.createTicket;

    res.status(201).json({ ok: true, ticket: createdTicket });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ ok: false, error: error.message });
  }
}

export const getTickets = async (req: Request, res: Response) => {
  try {
    const { page = 1, filter = '', limit = 10 } = req.query;

    const query = `
      query {
        tickets(page: ${page}, filter: "${filter}", limit: ${limit}) {
          info {
            count,
            pages,
            currentPage
          }
          results {
            id,
            user {
              id,
              name
            },
            status,
            dateCreate,
            dateUpdate
          }
        }
      }
    `;

    const resGraphql = await executeGraphQLQuery(query)

    const results = resGraphql.tickets.results;
    const info = resGraphql.tickets.info;

    res.status(200).json({ ok: true, results, info });
  } catch (error:any) {
    res.status(500).json({ ok: false, error: error.message });
  }
}

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const query = `
    mutation {
      updateTicket(id: ${id},status: "${status}") {
        id,
        user {
          id,
          name
        },
        status,
        dateCreate,
        dateUpdate
      }
    }
  `;

  const resGraphql = await executeGraphQLQuery(query)

  const updatedTicket = resGraphql.updateTicket;

    res.status(200).json({ ok: true, ticket: updatedTicket });
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
    mutation {
      deleteTicket(id: ${id}) {
        id,
        user {
          name
        },
        status,
        dateCreate,
        dateUpdate
      }
    }
  `;

    const resGraphql = await executeGraphQLQuery(query)

    const deletedTicket = resGraphql.deleteTicket;

    res.status(200).json({ ok: true, ticket: deletedTicket });
  } catch (error: any) {
    res.status(500).json({ ok: false, error:error.message });
  }
}