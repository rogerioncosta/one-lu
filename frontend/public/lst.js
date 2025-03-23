async function fetchGuestList() {
    // const apiUrlNeon = 'https://neon.tech/users';
    const endpoint = 'https://one-lu-backend.vercel.app/users';

    try {
        // const response = await fetch(apiUrlNeon);
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log("Dados recebidos:", data);

        const tabelaBody = document.getElementById('tabelaDados');
        const guestHeader = document.getElementById('guest_header');

        // if (!casaTitle || !casaHeader) {
        if (!guestHeader) {
            console.error("Elementos do DOM não encontrados.");
            return;
        }

        if (data.length > 0) {

            let qtd = 1;

            data.forEach(row => {

                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${qtd}</td>
                    <td  class="userId">${row.id}</td>
                    <td>${row.name}</td>
                    <td>${row.older_companion}</td>   
                    <td>${row.minor_companion}</td> 
                    <td colspan="2">
                        <button type="submit" class="actionButtEdit">Editar</button>
                        <button type="submit" class="actionButtDelete" data-id="${row.id}">Excluir</button>
                    </td>
                `;

                qtd++;

                tabelaBody.appendChild(tr);
            });

            // Adiciona evento de clique nos botões de exclusão
            document.querySelectorAll(".actionButtDelete").forEach(button => {
                button.addEventListener("click", async function () {
                    const id = this.getAttribute("data-id");
                    await deleteUser(id);
                });
            });

        } else {
            // casaTitle.textContent = 'Nenhum dado encontrado';
            guestHeader.textContent = 'Nenhum dado encontrado';
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

fetchGuestList();

async function deleteUser(id) {
    const endpoint = `https://one-lu-backend.vercel.app/users/${id}`;

    if (!confirm("Tem certeza que deseja excluir este usuário?")) {
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();
        alert(result.message || "Usuário excluído com sucesso!");

        // Atualizar a lista após a exclusão
        fetchGuestList();
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir usuário. Tente novamente.");
    }
}


