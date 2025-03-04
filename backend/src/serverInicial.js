const http = require("http");
const user = require("./user");

const fs = require("fs");
const path = require("path");

const server = http.createServer(async (request, response) => {
    // Cadastro de convidado

    // GET - Listar todos os convidados
    // POST - Inserir os convidados
    // PUT - Alterar um convidado
    // DELETE - Remove um convidado

    // request.url -> Caputar a rota
    const METHOD = request.method;
    const URL = request.url;  

    // Servir arquivos estáticos (CSS e fontes)
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

            response.writeHead(200, { "Content-Type": contentType });
            return response.end(content);
        });
        return;
    }

    // Acesso local
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
    }

    // Acesso localhost
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
    }

    if(URL.startsWith("/users")) {
        //Cadastrar convidado
        if (METHOD === "POST") {
            request.on("data", async (data) => {
                const body = JSON.parse(data);
                //const result = 
                await user.create(body);
                // return response.end(JSON.stringify(result));
                return response.end(JSON.stringify({
                    message: "Convidado inserido com sucesso!",
                }));

            });
            return; // Este return evita que a execução continue
            //O segundo return (fora do request.on) garante que o fluxo principal do código do servidor não continue até a lógica final ("Rota não encontrada"), enquanto o callback do request.on ainda está sendo processado.
        }

        if (METHOD === "GET") {
            try {
                const result = await user.findAll();
                response.writeHead(200, { "Content-Type": "application/json" });
                return response.end(JSON.stringify(result));
            } catch (err) {
                response.writeHead(500, { "Content-Type": "application/json" });
                return response.end(JSON.stringify({ error: "Erro ao buscar usuários." }));
            }
        }

        if (METHOD === "PUT") {
            // Capturar o ID do convidado
            const paramSplit = URL.split("/");
            const id = paramSplit[2];

            request.on("data", async (data) => {
                // Receber as informações que quero alterar do nosso body
                const body = JSON.parse(data);

                try {
                    await user.update(body, id);
                    return response.end(
                        JSON.stringify({
                            message: "Convidado alterado com sucesso!",
                        })
                    );
                }catch(err) {   
                    // Trata o erro e envia uma resposta apropriada.
                    response.statusCode = 500; // Código de erro interno.                   
                    return response.end(
                        JSON.stringify({
                            message: err.message,
                        })
                    );
                }
            });
            return; // Garante que o fluxo não continue antes da conclusão da leitura
            //O segundo return (fora do request.on) garante que o fluxo principal do código do servidor não continue até a lógica final ("Rota não encontrada"), enquanto o callback do request.on ainda está sendo processado.
        }

        if (METHOD === "DELETE") {
            const paramSplit = URL.split("/");
            const id = paramSplit[2];
            
            try {
                await user.delete(id);
                return response.end(
                    JSON.stringify({
                        message: "Convidado excluído com sucesso!",
                    })
                );
            }catch(err) { 
                // Trata o erro e envia uma resposta apropriada.
                response.statusCode = 500; // Código de erro interno.                   
                return response.end(
                    JSON.stringify({
                        message: err.message,
                    })
                );
            }            

        }

    }
    // Requisição não encontrada
    response.writeHead(404, { "Content-Type": "text/plain" });
    return response.end("Rota não encontrada.");

});

server.listen(3000, () => console.log("O servidor está rodando"));
