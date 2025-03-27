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
                    <td class="userId hidden">${row.id}</td>
                    <td>${row.name}</td>
                    <td>${row.older_companion}</td>   
                    <td>${row.minor_companion}</td> 
                    <td colspan="2">
                        <button type="submit" class="actionButtEdit" data-id="${row.id}">Editar</button>
                        <button type="submit" class="actionButtDelete" data-id="${row.id}">Excluir</button>
                    </td>
                `;

                tabelaBody.appendChild(tr);
                qtd++;

            });

            // Adiciona evento de clique nos botões de edição
            document.querySelectorAll(".actionButtEdit").forEach(button => {
                button.addEventListener("click", function () {
                    const id = this.getAttribute("data-id");
                    const selectedGuest = data.find(guest => guest.id == id);
                    if (selectedGuest) {
                        showEditModalForm(selectedGuest);
                    }
                });
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

// Função para exibir o formulário de edição com os dados do convidado
function showEditModalForm(guest) {    

    const modalEdit = document.getElementById("modalEdit");
    const closeModalEdit = document.getElementById("closeModalEdit");
    // const modalMessageEdit = document.getElementById("modalMessageEdit");
    const buttonCancelEdit = document.getElementById("cancelEdit");

    modalEdit.classList.remove("hidden");  // Exibe o modal

    document.getElementById("editUserId").value = guest.id;
    document.getElementById("editName").value = guest.name;
    document.getElementById("editOlderCompanion").value = guest.older_companion;
    document.getElementById("editMinorCompanion").value = guest.minor_companion; 
    
    document.querySelectorAll(".contadorEdit").forEach((contadorEdit) => {
        const editBtnMenos = contadorEdit.querySelector(".estiloEditBotaoMenos");
        const editInputAcompanhantes = contadorEdit.querySelector(".editMinorCompanion");
        const editBtnMais = contadorEdit.querySelector(".estiloEditBotaoMais");

        editBtnMenos.addEventListener("click", () => {
            let valorAtual = parseInt(editInputAcompanhantes.textContent, 10);
            if (valorAtual > 0) {
                // inputAcompanhantes.value = valorAtual - 1;
                valorAtual--;
                editInputAcompanhantes.textContent = valorAtual;
            }
        });

        editBtnMais.addEventListener("click", () => {
            let valorAtual = parseInt(editInputAcompanhantes.textContent, 10);
            if (valorAtual < 3) {
                // inputAcompanhantes.value = valorAtual + 1;  
                valorAtual++;              
                editInputAcompanhantes.textContent = valorAtual;
            }
        });
    });

    document.getElementById("editName").addEventListener("input", function () {
        this.value = this.value.toUpperCase();
    });

    document.getElementById("editOlderCompanion").addEventListener("input", function () {
        this.value = this.value.toUpperCase();
    });
    
    // document.getElementById("editFormContainer").style.display = "block";    

    /*/ Função para mostrar o modal
    const showModalEdit = () => {
        modalEdit.classList.remove("hidden");  // Exibe o modal
    };*/

    // Fecha o modal ao clicar no "X"
    closeModalEdit.addEventListener("click", () => {
        modalEdit.classList.add("hidden");
    });

    // Fecha o modal ao clicar fora do conteúdo
    modalEdit.addEventListener("click", (event) => {
        if (event.target === modalEdit) {
            modalEdit.classList.add("hidden");
        }
    });

    // Fecha o modal ao clicar no "cancelar do formulário"
    buttonCancelEdit.addEventListener("click", () => {
        modalEdit.classList.add("hidden");
    });
}

/*// Esconder o formulário ao cancelar
document.getElementById("cancelEdit").addEventListener("click", function () {
    document.getElementById("editFormContainer").style.display = "none";
});*/


// Evento para salvar os dados editados
document.getElementById("editForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita recarregar a página

    const id = document.getElementById("editUserId").value;
    const name = document.getElementById("editName").value.toUpperCase().trim();
    const olderCompanion = document.getElementById("editOlderCompanion").value.toUpperCase().trim();
    const minorCompanion = document.getElementById("editMinorCompanion").value.trim();

    const updatedGuest = {
        name: name,
        olderCompanion: olderCompanion,
        minorCompanion: minorCompanion
    };

    await updateGuest(id, updatedGuest);
});

// Função para enviar os dados editados para a API
async function updateGuest(id, guestData) {
    const endpoint = `https://one-lu-backend.vercel.app/users/${id}`;

    console.log("URL da requisição PUT:", endpoint);
    console.log("Dados enviados:", JSON.stringify(guestData));

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(guestData)
        });

        const responseData = await response.json();
        console.log("Resposta do servidor:", responseData);

        if (response.ok) {
            alert("Convidado atualizado com sucesso!");
            document.getElementById("modalEdit").classList.add("hidden"); // Fecha o modal
            // document.getElementById("editFormContainer").style.display = "none";
            window.location.reload(); // Atualiza a tabela
        } else {
            console.error("Erro ao atualizar convidado");
        }
    } catch (error) {
        console.error("Erro ao enviar atualização:", error);
        alert("Erro ao atualizar convidado. Tente novamente.");
    }
}


fetchGuestList();

async function deleteUser(id) {
    const endpoint = `https://one-lu-backend.vercel.app/users/${id}`;

    if (!confirm("Tem certeza que deseja excluir este convidado?")) {
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();
        alert(result.message || "Convidado excluído com sucesso!");

        // Atualizar a lista após a exclusão
        // fetchGuestList();
        window.location.reload();
    } catch (error) {
        console.error("Erro ao excluir convidado:", error);
        alert("Erro ao excluir convidado. Tente novamente.");
    }
}


