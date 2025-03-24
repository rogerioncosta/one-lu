const user = require("../user");

class UserController {

    post(request, response) {
        request.on("data", async (data) => {
            const body = JSON.parse(data);
            //const result = 
            await user.create(body);
            // return response.end(JSON.stringify(result));
            return response.end(JSON.stringify({
                message: "Convidado confirmado com sucesso!",
            }));

        });
        return; // Este return evita que a execução continue
        //O segundo return (fora do request.on) garante que o fluxo principal do código do servidor não continue até a lógica final ("Rota não encontrada"), enquanto o callback do request.on ainda está sendo processado.
    }

    async get(request, response) {
        try {
            const result = await user.findAll();
            response.writeHead(200, { "Content-Type": "application/json" });
            return response.end(JSON.stringify(result));
        } catch (err) {
            response.writeHead(500, { "Content-Type": "application/json" });
            return response.end(JSON.stringify({ error: "Erro ao buscar usuários." }));
        }
    }

    put(request, response) {

        const URL = request.url;
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
            } catch (err) {
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

    async delete(request, response) {
        const paramSplit = URL.split("/");
        const id = paramSplit[2];

        try {
            await user.delete(id);
            return response.end(
                JSON.stringify({
                    message: "Convidado excluído com sucesso!",
                })
            );
        } catch (err) {
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

module.exports = { UserController };