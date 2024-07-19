//Recuperar o id detalhes dolocalstorage
var id = parseInt(localStorage.getItem('detalhe'));

//pegar os produtos do local storage
var produtos = JSON.parse(localStorage.getItem('produtos'));

var item = produtos.find(produto => produto.id === id);

if(item) { 
    //tem o item
    console.log('Produto encontrado: ',item);

    //alimentar com os valores
    $("#imagem-detalhe").attr('src', item.imagem);
    $("#nome-detalhe").html(item.nome);
    
    $("#descricao-detalhe").html(item.descricao);
    $("#preco-detalhe").html(item.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}));

var tabelaDetalhes = $("#tabdetalhes");

item.detalhes.forEach(detalhe => {
    var linha = `
    <tr>
        <td>${detalhe.caracteristica}</td>
        <td>${detalhe.detalhes}</td>
    </tr>
    `;

    tabelaDetalhes.append(linha);

});

//não tem o item

} else {
    console.log('Produto não encontrado');
}

var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

//função para adicionar ao carrinho

function adicionarAoCarrinho(item, quantidade){
    var itemNoCarrinho = carrinho.find(c=> c.item.id === item.id);

    if(itemNoCarrinho){
        //ja tem o item
        //add a quantidade
        itemNoCarrinho.quantidade += quantidade;
        itemNoCarrinho.total_item = itemNoCarrinho.quantidade * item.preco;
    } else{
        carrinho.push({
            item: item,
            quantidade: quantidade,
            total_item: quantidade * item.preco
        })
    }

    //atualizar o local storage do carrinho

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

}

//clicou no add carrinho

$(".add-cart").on('click', function(){
    //adicionar ao carrinho
    adicionarAoCarrinho(item, 1);

    var toastCenter = app.toast.create({
        text: `${item.nome} adicionado ao carrinho`,
        position: 'center',
        closeTimeout: 2000,
      });

      toastCenter.open()
})


