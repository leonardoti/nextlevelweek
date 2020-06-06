const express = require("express")
const server = express()

//Pegar o banco de dados!
const db = require("./database/db.js")

//Configuração da Pasta Pública!
server.use(express.static("public"))

//Habilitar o uso do req.body da minha aplicação!
server.use(express.urlencoded({extended: true}))

//Utilizando Template Engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//Configurar os caminhos da minha aplicação! (ROTAS)
//Página Inicial!
//Req: Requisição, Pedidos!
//Res: Resposta
server.get("/", (req, res) => {
   return res.render("index.html")
})

server.get("/create-point", (req, res) => {

    //req.query: Query Strings da URL!
    //console.log(req.query)

   return res.render("create-point.html")
})

server.post("/savepoint", (req, res) =>{
    
    //req,body: O corpo do nosso formulário!
    //console.log(req.body)

    //Inserir dados no banco de dados!
    const query = `
    INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso!")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData) 
    
})

server.get("/search", (req, res) =>{

    const search = req.query.search

    if(search == "") {
        //Pesquisa vazia!
        return res.render("search-results.html", {total: 0})
    }

//Pegar os dados do Banco de Dados!
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
       if(err) {
           return console.log(err)
       }

       // Contador de Elementos dentro do Array, exibidos na página HTML search-results!
       const total = rows.length

       console.log("Aqui estão seus registros:")
       console.log(rows)
       //Mostrar a página HTML com os dados do Banco de Dados!
       return res.render("search-results.html", {places: rows, total})
    })
})

// Ligar o Servidor!
server.listen(3000)