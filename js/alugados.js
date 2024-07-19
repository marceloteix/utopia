// Função para renderizar itens emprestados
function renderizarItensEmprestados() {
    setTimeout(function() {
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
                        <div class="item-text">Até: ${item.data}</div>
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
    }, 500); // Adiciona um atraso de 500 milissegundos antes de executar a função
}

// Chama a função para renderizar itens emprestados quando o documento estiver pronto
$(document).ready(function() {
    renderizarItensEmprestados();
});
