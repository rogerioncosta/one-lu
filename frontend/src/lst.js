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
                    <td hidden>${row.id}</td>
                    <td>${row.name}</td>
                    <td>${row.older_companion}</td>   
                    <td>${row.minor_companion}</td> 
                    <td colspan="2">
                        <button type="submit" class="actionButtEdit">Editar</button>
                        <button type="submit" class="actionButtDelete">Excluir</button>
                    </td>
                `;

                qtd++;

                tabelaBody.appendChild(tr);
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