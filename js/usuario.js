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
}

// Função para renderizar itens emprestados
function renderizarItensEmprestados() {
    var itensEmprestados = JSON.parse(localStorage.getItem('itensEmprestados')) || [];

    if (itensEmprestados.length > 0) {
        itensEmprestados.forEach(function (item) {
            var itemDiv = `
            <li class="item-content">
                <div class="item-media">
                    <img src="${item.imagem}" width="120">
                </div>
                <div class="item-inner">
                    <div class="item-title">${item.nome}</div>
                    <div class="item-subtitle">Emprestado por: ${item.nomeCompleto}</div>
                    <div class="item-text">Data: ${item.data}</div>
                    <div class="item-action">
                        <button class="devolver-btn" data-id="${item.id}">Devolver</button>
                        <button class="sobguarda-btn" data-id="${item.id}">${item.sobGuarda ? 'Sob Guarda' : 'Marcar como Sob Guarda'}</button>
                    </div>
                </div>
            </li>
            `;
            document.getElementById('alugados-list').insertAdjacentHTML('beforeend', itemDiv);
        });
    } else {
        document.getElementById('alugados-list').innerHTML = '<li class="item-content"><div class="item-inner"><div class="item-title">Nenhum item emprestado.</div></div></li>';
    }
}

// Função para carregar os itens alugados do localStorage
function carregarItensAlugados() {
    const alugadosList = document.getElementById('alugados-list');
    const alugados = JSON.parse(localStorage.getItem('itensAlugados')) || [];
    alugadosList.innerHTML = '';

    alugados.forEach(item => {
        const itemHTML = `
        <li class="item">
            <div class="item-content">
                <div class="item-inner">
                    <div class="item-title">${item.nome}</div>
                    <div class="item-subtitle">${item.devolucao ? `Devolução: ${item.devolucao}` : 'Sob Guarda'}</div>
                </div>
            </div>
            <div class="item-action">
                <button class="devolver-btn" data-id="${item.id}">Devolver</button>
                <button class="sobguarda-btn" data-id="${item.id}">${item.sobGuarda ? 'Sob Guarda' : 'Marcar como Sob Guarda'}</button>
            </div>
        </li>
        `;
        alugadosList.insertAdjacentHTML('beforeend', itemHTML);
    });
}

// Função para marcar um item como "Sob Guarda" ou "Devolver"
function handleItemAction(event) {
    const target = event.target;

    if (target.classList.contains('devolver-btn')) {
        const id = target.getAttribute('data-id');
        let alugados = JSON.parse(localStorage.getItem('itensAlugados')) || [];
        alugados = alugados.filter(item => item.id !== id);
        localStorage.setItem('itensAlugados', JSON.stringify(alugados));
        carregarItensAlugados();
    }

    if (target.classList.contains('sobguarda-btn')) {
        const id = target.getAttribute('data-id');
        const alugados = JSON.parse(localStorage.getItem('itensAlugados')) || [];
        const item = alugados.find(i => i.id === id);

        if (item) {
            if (item.sobGuarda) {
                item.sobGuarda = false;
                item.devolucao = null;
            } else {
                item.sobGuarda = true;
                item.devolucao = `Sob guarda de ${document.getElementById('userNome').textContent}`;
            }
            localStorage.setItem('itensAlugados', JSON.stringify(alugados));
            carregarItensAlugados();
        }
    }
}

// Carregar os itens alugados quando a página é exibida
carregarItensAlugados();

// Adicionar ouvintes de eventos aos botões
document.getElementById('alugados-list').addEventListener('click', handleItemAction);

// Renderizar itens emprestados
renderizarItensEmprestados();

// Estilização
var style = document.createElement('style');
style.innerHTML = `
body {
    font-family: Arial, sans-serif;
    background-color: white;
}

.navbar {
    background-color: indigo;
    color: white;
}

.title {
    color: white;
}

.block {
    margin: 20px;
    padding: 20px;
    background-color: white;
    border: 1px solid indigo;
    border-radius: 8px;
}

h2 {
    color: indigo;
}

.button {
    background-color: orange;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.button:hover {
    background-color: darkorange;
}

.item-content {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.item-media img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-right: 20px;
}

.item-inner {
    flex-grow: 1;
}

.item-title {
    font-size: 18px;
    color: indigo;
}

.item-subtitle, .item-text {
    font-size: 14px;
    color: gray;
}

.item-actions {
    display: flex;
    gap: 10px;
}

.devolver-btn, .sobguarda-btn {
    background-color: orange;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
}

.devolver-btn:hover, .sobguarda-btn:hover {
    background-color: darkorange;
}
`;
document.head.appendChild(style);
