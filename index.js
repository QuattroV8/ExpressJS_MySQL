const express = require('express')  // SIMILAR cu #include ""   (ANUNTAM CA FOLOSIM PACHETUL EXPRESSJS) 
const server = express() // INITIALIZAM EXPRESS JS !!
const createConnection = require('./dbConnection') // Importam Conexiunea cu Baza de Date 

const serverConfiguration = require('./configuration/envData').serverConfiguration // Preluam configuratia serverului 
const userTable = require('./configuration/userTable.json') // Preluam numele tabelei


const dropTablesOnExit = (connectionDB,tableName) => {
   
     process.on('SIGINT' , async () => { // SE DECLANSEAZA LA CTRL + C (la iesirea din server)
        
        await Promise.all(  // Ne ocupam de toate cererile 
          tableName.map(async (table)=>{  // Vom lua tabela cu tabela 
            try{ // INCERCAM 
              await connectionDB.query(`DROP TABLE IF EXISTS ${table}`) //SA CEREM INLATURAREA TABELEI DIN ITERATIA CURENTA 
              console.log(`TABELA ${table} a fost inlaturata cu succes !!`) // MESAJ CU SUCCES DIN CONSOLA 
            }
            catch(err) // DACA NU MERGE 
            {
                // VOM AFISA IN CONSOLA MESAJ DE EROARE 
                console.log(`A aparut o eroare la inlaturarea tabelei ${table} : ${err}`)
            }
          }))
    
        console.log(`TOATE TABELELE AU FOST INLATURATE CU SUCCES !!`) // AFISAM CAND TOATE TABELELE AU FOST STERSE 
        process.exit(0)  // OPRIM SERVERUL 
     })
     
}


     ;(async () => {  // Fortam o solicitare asincrona imediata (';' ==> am pus inainte pentru ca nu obisnuiesc sa pun la sfarsitul fiecarui statement )

            const dbOperation =  await createConnection()  // Construim o Conexiune MySQL 

            // Definim o comanda SQL care sa solicite catre baza de date introducerea unor informatii 
        const insertUserPatternSQL = `INSERT INTO ${userTable.tableName}
                  (${userTable.tableCol[1].name},${userTable.tableCol[2].name},${userTable.tableCol[3].name})
                                                                            VALUES(?,?,?)`
        
           try{ // Incercam 
           // Sa introducem informatia in baza de date 
                await dbOperation.query(insertUserPatternSQL,["NotAMercedesD","NotaMerceDdeCB@gmail.com","NotAMercedesPassword"])
                console.log("Utilizatorul a fost introdus cu succes !!") 
           }
           catch(err)  // Daca nu merge 
           {
            // Ne apare in consola un mesaj de eroare 
            console.log(`Utilizatorul NU a fost introdus din cauza : ${err} !!`)
           }


        await dropTablesOnExit(dbOperation,[userTable.tableName])

     })();


server.use(express.json()) // PERMITEM CA APLICATIA NOASTRA WEB SA FOLOSEASCA FORMAT JSON 

server.get('/helloJSON', (request,response)  => response.json({"message":"BINE AI VENIT PE LEAGUECS!!"}))  // CERERE PE FORMAT JSON 

server.get("/helloHTML",(request,respone) => respone.status(200).send("<h1 style='text-align:center'>BINE AI VENIT PE LEAGUECS!</h1>"))  // CERERE PE FORMAT HTML CENTRAT + TITLU 

server.listen(serverConfiguration.port,
     ()=>console.log(`SERVERUL EXPRESS RULEAZA CU SUCCES PE PORTUL ${serverConfiguration.port}`))  // RULAM SERVERUL PE PORTUL MENTIONAT !! 