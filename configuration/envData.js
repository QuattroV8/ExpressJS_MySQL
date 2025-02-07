// envData.js
require('dotenv').config({
    path:__dirname+'/.env'
}) // Incarcam variabilele de mediu 

exports.dbCredentials = {   // Exportam credentialele bazei de date 
    name:process.env.DB_NAME,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    port:process.env.DB_PORT 
}

exports.serverConfiguration = {   // Exportam configuratia serverului 
    port : process.env.SERVER_PORT
}