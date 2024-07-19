// Função para verificar se o usuário está logado
function verificarLogin() {
    var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        // Redirecionar para a página de login se o usuário não estiver logado
        if (window.location.pathname !== '/login.html') {
            console.log('Usuário não está logado. Redirecionando para a página de login.');
            // Adiciona um pequeno atraso para garantir que o login possa ser processado
            setTimeout(() => {
                window.location.href = 'login.html'; // Atualize o caminho se necessário
            }, 100);
        }
    }
}

// Verificar login antes de carregar os dados dos produtos
verificarLogin();

// Verificar login novamente antes de prosseguir com o fetch
var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
if (loggedInUser) {
    // Fazer fetch dos dados
    fetch('js/backend.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
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


