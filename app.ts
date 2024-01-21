import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './utils/graphql';
import cors from 'cors';
import routeTickets from './src/routes/tickets'
import routeUser from './src/routes/users'
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.use(express.json());
app.use(cors());

//routing
app.use(routeTickets)
app.use(routeUser)


app.listen(process.env.PORTAPLICATION, () => {
  console.log(`Servidor escuchando en http://localhost:${process.env.PORTAPLICATION}`);
});