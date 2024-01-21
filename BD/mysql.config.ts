import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const portDB = process.env.PORTDB ? parseInt(process.env.PORTDB, 10) : undefined;

// Configuración conexión a MySQL
const dbConfig = {
  host: process.env.HOST,
  port:portDB,
  user: process.env.USERDB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const connection = mysql.createConnection(dbConfig);

// Conectar a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    throw err;
  }
  console.log('Conexión a MySQL establecida');


  const queryCreateTableTickets = "CREATE TABLE IF NOT EXISTS tickets (id INT AUTO_INCREMENT PRIMARY KEY, user INT, status VARCHAR(255), dateCreate DATETIME DEFAULT CURRENT_TIMESTAMP, dateUpdate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";
  const queryCreateTableUsers = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))"; 
  
  connection.query(
    queryCreateTableUsers,
    (err, result) => {
      if (err) {
        console.error('Error al crear la tabla users:', err);
        throw err;
      }
      console.log('Tabla users verificada/creada');
    }
  );

  connection.query(
    queryCreateTableTickets
    ,
    (err, result) => {
      if (err) {
        console.error('Error al crear la tabla tickets:', err);
        throw err;
      }
      console.log('Tabla tickets verificada/creada');
    }
  );
});


// Cerrar la conexión
process.on('SIGINT', () => {
    connection.end();
    process.exit();
});


export default connection;
