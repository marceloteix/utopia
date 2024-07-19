// Função para verificar se o usuário está logado
function verificarLogin() {
    var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        // Redirecionar para a página de login se o usuário não estiver logado
        if (window.location.pathname !== '/login.html') {
            window.location.href = 'login.html'; // Atualize o caminho se necessário
            return false; // Impede a execução do restante do código se o redirecionamento ocorrer
        }
    }
    return true; // Retorna true se o usuário estiver logado
}

// Verificar login antes de carregar os dados dos produtos
if (verificarLogin()) {
    fetch('js/backend.json')
        .then(response => response.json())
        .then(data => {
            // SALVAR OS DADOS VINDO DO BACKEND LOCALMENTE
            localStorage.setItem('produtos', JSON.stringify(data));
            console.log('Dados dos produtos salvos no localStorage');

            // Simular carregamento online
            setTimeout(() => {
                // Esvaziar área de produtos
                $("#produtos").empty();

                data.forEach(produto => {
                    var produtoHTML = `
                    <!-- ITEM CARD -->
                    <div class="item-card">
                        <a data-id="${produto.id}" href="#" class="item">
                            <div class="img-container">
                                <img src="${produto.imagem}">
                            </div>
                            <div class="nome-rating">
                                <span class="color-black">${produto.nome}</span>
                            </div>
                        </a>
                    </div>
                    `;

                    $("#produtos").append(produtoHTML);
                });

                $(".item").on('click', function () {
                    var id = $(this).attr('data-id');
                    localStorage.setItem('detalhe', id);
                    app.views.main.router.navigate('/detalhes/');
                });

            }, 500);
        })
        .catch(error => console.error('Erro ao fazer fetch dos dados: ' + error));

    // VER quantos itens tem dentro do carrinho
    setTimeout(() => {
        var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        // Alimentar o contador da sacola
        $('.btn-cart').attr('data-count', carrinho.length);
    }, 300);
}
