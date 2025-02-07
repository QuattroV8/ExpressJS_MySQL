// Adaugam dependentele  
const mysqlConnection = require('mysql2/promise.js')

// Importam Configuratia TABELEI UTILIZATOR 

const userTableConfiguration = require('./configuration/userTable.json') 

// Importam Credentialele Bazei de Date 

const dbCredentials = require('./configuration/envData').dbCredentials


const userTable = {
    name : userTableConfiguration.tableName, 
    columns : userTableConfiguration.tableCol
          .map(col => `${col.name} ${col.type}`).join(',')
}

// Definim cateva interogari DDL (Legate de Constructia Bazei de Date +tabela)

const ddlQueryDB =  {

// Definim o comanda SQL pentru construirea automata a unei bazei de date in cazul in care nu avem una . 
queryCreateDatabaseIfNotExists : `CREATE DATABASE IF NOT EXISTS ${dbCredentials.name}` ,

// Defim o camanda SQL pentru construirea automata a unei tabele in cazul in care nu avem una 
queryCreateTableIfNotExists : `CREATE TABLE IF NOT EXISTS ${userTable.name} 
                                                 (${userTable.columns})`}

            
const databaseConnection = async ()=> {      
   
    // Construim o conexiune cu credentialele noastre 
       const mysqlConnect = await mysqlConnection.createConnection({
           host:dbCredentials.host,
           port:dbCredentials.port,
           user:dbCredentials.user,
           password:dbCredentials.password 
       })

       try{
 
         // Construim Baza de Date pentru mai multe tabele 

             await mysqlConnect.query(ddlQueryDB.queryCreateDatabaseIfNotExists); 
             console.log(`Baza de Date ${dbCredentials.name} este construita cu succes !!`)

             await mysqlConnect.changeUser({
                   database:dbCredentials.name  // MUTAM CONEXIUNEA LA ACEASTA BAZA DE DATE 
             })

             // Construim Tabela Utilizatori 
    
            await mysqlConnect.query(ddlQueryDB.queryCreateTableIfNotExists)
             
            console.log(`Tabela ${userTable.name} A FOST CREEATA CU SUCCES !! `)

             return mysqlConnect;
       }

       catch(err)  // In cazul in care apar erori (de exemplu , nu avem o baza de date , credentiale gresite etc.)
       {
            console.log(`A aparut o problema in construirea bazei de date : ${err}`) 
            throw err;      
       }
}

module.exports = databaseConnection // Exportam Conexiunea pentru accesarea acesteia in alte fisier