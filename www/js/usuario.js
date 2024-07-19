    var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        // Exibir o nome, username e e-mail do usuário na página
        document.getElementById('userNome').textContent = loggedInUser.nome || 'Nome não disponível';
        document.getElementById('userUsername').textContent = loggedInUser.username || 'Username não disponível';
        document.getElementById('userEmail').textContent = loggedInUser.email || 'Email não disponível';

        // Verificar o status da contribuição e atualizar o botão
        var contribuicaoButton = document.getElementById('contribuicaoStatus');
        if (loggedInUser.contribuicao) {
            contribuicaoButton.textContent = 'Contribuição em Dia';
            contribuicaoButton.style.backgroundColor = 'green';
            contribuicaoButton.style.color = 'white';
        } else {
            contribuicaoButton.textContent = 'Contribuição Pendentes';
            contribuicaoButton.style.backgroundColor = 'red';
            contribuicaoButton.style.color = 'white';
        }
    } ;

// Função para renderizar itens emprestados
function renderizarItensEmprestados() {
    // Recuperar a lista de itens emprestados do localStorage
    var itensEmprestados = JSON.parse(localStorage.getItem('itensEmprestados')) || [];

    // Verificar se há itens emprestados
    if (itensEmprestados.length > 0) {
        // Percorrer os itens emprestados e renderizá-los
        $.each(itensEmprestados, function (index, item) {
            var itemDiv = `
            <li class="item-content">
                <div class="item-media">
                    <img src="${item.imagem}" width="120">
                </div>
                <div class="item-inner">
                    <div class="item-title">${item.nome}</div>
                    <div class="item-subtitle">Emprestado por: ${item.nomeCompleto}</div>
                    <div class="item-text">Data: ${item.data}</div>
                </div>
            </li>
            `;
            // Adicionar o item à lista de itens emprestados
            $("#alugados-list").append(itemDiv);
        });
    } else {
        // Mostrar mensagem de que não há itens emprestados
        $("#alugados-list").html('<li class="item-content"><div class="item-inner"><div class="item-title">Nenhum item emprestado.</div></div></li>');
    }
}

// Chama a função para renderizar itens emprestados quando o documento estiver pronto
$(document).ready(function() {
    renderizarItensEmprestados();
});
