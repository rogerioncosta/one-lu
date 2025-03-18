const http = require("http");
// const user = require("./user");

const fs = require("fs");
const path = require("path");
const { UserController } = require("./controllers/user.controller");

const userController = new UserController();

const server = http.createServer(async (request, response) => {

    // Habilita CORS para todas as origens
    response.setHeader("Access-Control-Allow-Origin", "https://one-lu.vercel.app/");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    // Cadastro de convidado

    // GET - Listar todos os convidados
    // POST - Inserir os convidados
    // PUT - Alterar um convidado
    // DELETE - Remove um convidado

    // request.url -> Caputar a rota
    const METHOD = request.method;
    const URL = request.url;  

    /*/ Servir arquivos estáticos (CSS e fontes)
    if (URL.startsWith("/styles/") || URL.startsWith("/src/")) {
        const filePath = path.join(__dirname, "..", "..", "frontend", URL);
        fs.readFile(filePath, (err, content) => {
            if (err) {
                response.writeHead(404, { "Content-Type": "text/plain" });
                return response.end("Arquivo não encontrado.");
            }

            // Determina o tipo de conteúdo com base na extensão do arquivo
            const ext = path.extname(filePath);
            let contentType = "text/plain";
            if (ext === ".css") contentType = "text/css";
            if (ext === ".ttf") contentType = "font/ttf";
            if (ext === ".png") contentType = "image/png";

            response.writeHead(200, { "Content-Type": contentType });
            return response.end(content);
        });
        return;
    }*/

    /*/ Acesso local
    if (URL === "/") {
        // Lê o arquivo HTML e envia como resposta
        const filePath = path.join(__dirname, "..", "..", "frontend", "src", "index.html");
        fs.readFile(filePath, (err, content) => {
            if (err) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                return response.end("Erro ao carregar o arquivo HTML.");
            }
            response.writeHead(200, { "Content-Type": "text/html" });
            return response.end(content);
        });
        return;
    }*/

    /*/ Acesso localhost
    if (URL === "/guestList") {
        // Lê o arquivo HTML e envia como resposta
        const filePath = path.join(__dirname, "..", "..", "frontend", "src", "guestList.html");
        fs.readFile(filePath, (err, content) => {
            if (err) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                return response.end("Erro ao carregar o arquivo HTML.");
            }
            response.writeHead(200, { "Content-Type": "text/html" });
            return response.end(content);
        });
        return;
    }*/

    if(URL.startsWith("/users")) {
        //Cadastrar convidado
        if (METHOD === "POST") {
            return userController.post(request, response);
        }

        if (METHOD === "GET") {
            return userController.get(request, response);            
        }

        if (METHOD === "PUT") {
            return userController.put(request, response);            
        }

        // if (METHOD === "DELETE") {}

    }
    // Requisição não encontrada
    response.writeHead(404, { "Content-Type": "text/plain" });
    return response.end("Rota não encontrada.");

});

server.listen(3000, () => console.log("O servidor está rodando"));
