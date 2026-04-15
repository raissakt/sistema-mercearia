const api = "http://localhost:3000/api/produtos";

async function listar() {
    const res =  await fetch(api);
    const dados = await res.json();
    const corpoTabela = document.querySelector("#tabela tbody");
    corpoTabela.innerHTML = "";

    dados.forEach(p => {
        corpoTabela.innerHTML += `
        <tr>
            <td>${p.nome}</td>
            <td>R$ ${p.preco.toFixed(2)}</td>
            <td>
                <button onclick="prepararEdicao(${p.id}, '${p.nome}', ${p.preco})">✏️ Editar</button>
                <button onclick="deletar(${p.id})" style="background:#dc3545; color:white">🗑️</button>
            </td>
        </tr>`;
    });
}

async function salvar() {
    const id = document.getElementById("id-prod").value;
    const nome = document.getElementById("nome-prod").value;
    const preco = document.getElementById("preco-prod").value;

    if (!nome || !preco) return alert("Preencha todos os campos!");

    await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            id: id,
            nome: nome,
            preco: parseFloat(preco) 
        })
    });

    limpar();
    listar();
}

async function deletar(id) {
    if(confirm("Deseja excluir este produto?")) {
        await fetch(`${api}/${id}`, { method: 'DELETE' });
        listar();
    }
}

function prepararEdicao(id, nome, preco) {
    document.getElementById("id-prod").value = id;
    document.getElementById("nome-prod").value = nome;
    document.getElementById("preco-prod").value = preco;
}

function limpar() {
    document.getElementById("id-prod").value = "";
    document.getElementById("nome-prod").value = "";
    document.getElementById("preco-prod").value = "";
}

listar(); // Carrega a lista assim que abre o site

