var localCarrinho = localStorage.getItem('carrinho');

if (localCarrinho) {
    var carrinho = JSON.parse(localCarrinho);
    if (carrinho.length > 0) {
        // Tem itens no carrinho
        // Renderizar o carrinho
        renderizarCarrinho();
        // Somar totais dos produtos
        calcularTotal();
    } else {
        // Mostrar carrinho vazio
        carrinhoVazio();
    }
} else {
    // Mostrar carrinho vazio
    carrinhoVazio();
}

function renderizarCarrinho() {
    // Esvaziar a área dos itens
    $("#listaCarrinho").empty();

    // Percorrer o carrinho e alimentar a área
    $.each(carrinho, function (index, itemCarrinho) {
        var itemDiv = ` <!-- ITEM DO CARRINHO -->
        <div class="item-carrinho">
            <div class="area-img">
                <img src="${itemCarrinho.item.imagem}">
            </div>
            <div class="area-details">
                <div class="sup">
                    <span class="name-prod">
                    ${itemCarrinho.item.nome}
                    </span>
                    <a data-index="${index}" class="delete-item" href="#">
                        <i class="mdi mdi-close"></i>
                    </a>
                </div>
                <div class="middle">
                    <span>${itemCarrinho.item.principal_caracteristica}</span>
                </div>
                
                    <div class="count">
                        <!-- Botão "Selecionar Data" -->
                        <button class="selecionar-data" data-index="${index}">Selecionar Data</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Adicionar o item ao carrinho
        $("#listaCarrinho").append(itemDiv);
    });

    // Lidar com o clique no botão "Selecionar Data"
    $(".selecionar-data").click(function () {
        // Abrir uma caixa de diálogo para inserir a data manualmente
        app.dialog.prompt('Por favor, insira a data (DD/MM/AAAA):', 'Selecionar Data', function (data) {
            // Verificar se a data foi inserida
            if (data) {
                // Verificar o formato da data
                var regexData = /^\d{2}\/\d{2}\/\d{4}$/;
                if (regexData.test(data)) {
                    // Armazenar a data no localStorage
                    localStorage.setItem('dataSelecionada', data);
                    localStorage.setItem('dataEmprestimo', data); //data para ser guardada
                    // Atualizar a exibição ou realizar outras ações conforme necessário
                    console.log('Data selecionada armazenada:', data);
                } else {
                    // Exibir uma mensagem de erro para o formato da data incorreto
                    app.dialog.alert('Formato de data inválido. Por favor, insira no formato DD/MM/AAAA.', 'Erro');
                }
            } else {
                console.log('Nenhuma data foi inserida.');
            }
        });
    });

    // Lidar com o clique no botão "Alugar"
    $("#botaoAlugar").click(function () {
        // Verificar se uma data foi selecionada
        var dataSelecionada = localStorage.getItem('dataSelecionada');
        if (!dataSelecionada) {
            // Se nenhuma data foi selecionada, exibir uma mensagem de erro
            app.dialog.alert('Por favor, selecione uma data antes de prosseguir.', 'Erro');
            return; // Encerrar a execução da função
        }

        // Exibir o app.dialog para o termo
        app.dialog.confirm(
            'Você concorda com os termos do serviço?', // Mensagem do termo
            'Termos de Serviço', // Título do termo
            function () {
                localStorage.setItem('concordou', 'true');
                // Se o usuário concordar, exibir a caixa de diálogo com a data selecionada
                app.dialog.alert('Data selecionada: ' + dataSelecionada, 'Fim do empréstimo em:');
                // Aqui você pode mostrar a caixa de diálogo para anexar um comprovante PIX
                app.dialog.prompt('Insira seu nome completo', 'Insira seu nome', function (NomeCompleto) {
                    // Verificar se o nome completo foi inserido
                    if (!NomeCompleto || NomeCompleto.trim() === '') {
                        app.dialog.alert('Nome completo é obrigatório.', 'Erro');
                        return; // Encerrar a execução da função
                    }

                    // Aqui você pode salvar o nome completo temporário no localStorage
                    localStorage.setItem('NomeCompleto', NomeCompleto);

                    // Recuperar a lista de itens emprestados do localStorage
                    var itensEmprestados = JSON.parse(localStorage.getItem('itensEmprestados')) || [];

                    // Adicionar cada item do carrinho à lista de itens emprestados
                    $.each(carrinho, function (index, itemCarrinho) {
                        var itemEmprestado = {
                            id: itemCarrinho.item.id,
                            nome: itemCarrinho.item.nome,
                            imagem: itemCarrinho.item.imagem,
                            data: dataSelecionada,
                            nomeCompleto: NomeCompleto
                        };
                        itensEmprestados.push(itemEmprestado);
                    });

                    // Armazenar a lista atualizada de itens emprestados no localStorage
                    localStorage.setItem('itensEmprestados', JSON.stringify(itensEmprestados));

                    // Salvar o nome completo permanente para uso futuro
                    localStorage.setItem('NomeCompletoEmp', NomeCompleto);

                    // Limpar o carrinho e a data temporária
                    localStorage.removeItem('carrinho');
                    localStorage.removeItem('NomeCompleto');
                    localStorage.removeItem('dataSelecionada');

                    // Exibir uma mensagem de sucesso
                    app.dialog.alert('Aluguel feito com sucesso.', 'Sucesso', function () {
                        // Recarregar a página
                        window.location.reload();
                    });
                });
            },
            function () {
                // Se o usuário não concordar, exibir uma mensagem de erro ou realizar outras ações
                app.dialog.alert('Você deve concordar com os termos do serviço para prosseguir.', 'Erro');
            }
        );
    });

    // Lidar com o clique no botão "Remover Item"
    $(".delete-item").on('click', function () {
        var index = $(this).data('index');
        console.log('O índice é: ', index);
        // Confirmar
        app.dialog.confirm('Tem certeza?', 'Remover', function () {
            // Remover item do carrinho
            carrinho.splice(index, 1);
            // Atualizar o carrinho com item removido
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            // Atualizar a página
            app.views.main.router.refreshPage();
        });
    });
}

function calcularTotal() {
    var totalCarrinho = 0;
    $.each(carrinho, function (index, itemCarrinho) {
        totalCarrinho += itemCarrinho.total_item;
    });
    // Mostrar o total
    $("#subtotal").html(totalCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
}

function carrinhoVazio() {
    console.log('Carrinho está vazio');
    // Esvaziar lista do carrinho
    $("#listaCarrinho").empty();

    // Sumir os itens de baixo, botão e totais
    $("#toolbarTotais").addClass('display-none');
    $("#toolbarCheckout").addClass('display-none');

    // Mostrar sacolinha vazia
    $("#listaCarrinho").html(`
    <div class="text-align-center">
        <img width="300" src="img/empty.gif">
        <br><span class="color-gray">Nada por enquanto...</span>
    </div>
    `);
}

$("#esvaziar").on('click', function () {
    app.dialog.confirm('Tem certeza que quer esvaziar o carrinho?', '<strong>ESVAZIAR</strong>', function () {
        // Apagar o localStorage do carrinho
        localStorage.removeItem('carrinho');
        app.views.main.router.refreshPage();
    });
});
