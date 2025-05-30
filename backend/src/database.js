// require("dotenv").config();
// const { Client } = require("pg");

// const client = new Client({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT
// });

// client.connect();

// module.exports = { client };

require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
    connectionString: process.env.DATABASE_URL, // Use variável de ambiente
    ssl: { rejectUnauthorized: false } // Necessário para Neon
});

client.connect();

module.exports = { client };