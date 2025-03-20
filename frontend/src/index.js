document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".contador").forEach((contador) => {
        const btnMais = contador.querySelector(".estiloBotaoMais");
        const btnMenos = contador.querySelector(".estiloBotaoMenos");
        const inputAcompanhantes = contador.querySelector(".acompanhantes-qtde");

        btnMais.addEventListener("click", () => {
            let valorAtual = parseInt(inputAcompanhantes.textContent, 10);
            if (valorAtual < 3) {
                // inputAcompanhantes.value = valorAtual + 1;
                valorAtual++;
                inputAcompanhantes.textContent = valorAtual;
            }
        });

        btnMenos.addEventListener("click", () => {
            let valorAtual = parseInt(inputAcompanhantes.textContent, 10);
            if (valorAtual > 0) {
                // inputAcompanhantes.value = valorAtual - 1;
                valorAtual--;
                inputAcompanhantes.textContent = valorAtual;
            }
        });
    });

    document.getElementById("name").addEventListener("input", function () {
        this.value = this.value.toUpperCase().trim();
    });

    document.getElementById("olderCompanion").addEventListener("input", function () {
        this.value = this.value.toUpperCase().trim();
    });


    const form = document.querySelector("form");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");
    const modalMessage = document.getElementById("modalMessage");

    // Função para mostrar o modal
    const showModal = (message) => {
        modalMessage.textContent = message; // Define a mensagem
        modal.classList.remove("hidden");  // Exibe o modal
    };

    // Fecha o modal ao clicar no "X"
    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Fecha o modal ao clicar fora do conteúdo
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const submitButton = document.querySelector(".button-confirm");
        submitButton.disabled = true; // Desativa o botão ao iniciar o envio

        const nome = document.getElementById("name").value.toUpperCase();
        const nomeAcompanhanteMaior = document.getElementById("olderCompanion").value.toUpperCase();
        const acompanhantesMenoresValue = document.querySelector("#acompanhantesMenores");
        const acompanhantesMenores = parseInt(acompanhantesMenoresValue.textContent, 10);
        // const acompanhantesMaiores = parseInt(document.querySelector("#acompanhantesMaiores").textContent, 10);

        // Envia os dados para o backend
        try {
            const response = await fetch("https://one-lu-backend.vercel.app/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: nome,
                    olderCompanion: nomeAcompanhanteMaior,
                    minorCompanion: acompanhantesMenores
                }),
            });

            const result = await response.json();
            showModal(result.message || "Cadastro realizado com sucesso!"); // Exibe o modal    
            form.reset();
            acompanhantesMenoresValue.textContent = "0";

        } catch (err) {
            console.error("Erro ao salvar os dados:", err);
            showModal("Erro ao salvar os dados. Tente novamente."); // Exibe o modal com erro
        } finally {
            submitButton.disabled = false; // Sempre reativa o botão, independentemente do sucesso ou erro
        }
    });
});