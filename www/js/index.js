fetch('js/backend.json')
.then(response => response.json())
.then(data=> {
    //SALVAR OS DADOS VINDO DO BACKEND LOCALMENTE
    //localstorage
    localStorage.setItem('produtos', JSON.stringify(data));
    console.log('Dados dos produtos salvo no localstorage')

    //simular carregamento online
    setTimeout(() => {


     //esvaziar área de produtos
     $("#produtos").empty();

        data.forEach(produto =>{
            var produtoHTML = `
            <!--ITEM CARD-->
            
            <div class="item-card">
                <a data-id="${produto.id}" href="#" class="item">
                    <div class="img-container">
                        <img src="${produto.imagem}">
                    </div>
                    <div class="nome-rating">
                        <span class="color-gray">${produto.nome}</span>
                        
                    </div>
                    <div class="price">${produto.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
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
.catch(error => console.error('Erro ao fazer fatch dos dados: ' +error));

//VER quantos itens tem dentro do carrinho
setTimeout(() => {
    var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    //alimentar o contador da sacola
    $('.btn-cart').attr('data-count', carrinho.length);
}, 300);

//se a pessoa não estiver logada

