// Este script que ficará responsável pela codificação ou código necessário para fazer a conexão entre backend e frontend.

const urlBase = "http://localhost:4000";
function obterCidades(){
    // Recupera do backend as cidades cadastradas.
    // Preencher o select com as cidades recuperadas. Para este recuros utiliza-se uma API própria do Java Script chamada de fetch. E esta permite construir requisições http e a partir destas requisições ter acesso as respostas oriundas dessas requisições. Em outras palavras, ele permite acesso ao backend.
    const elementoSelect = document.getElementById("cidade"); // pegando o id cidade do html cadastro.html
    fetch(urlBase + "/cidade", {
        method: "GET"
    }).then((resposta) => {
        // OK no java script significa que a requisição foi bem sucedida e a resposta foi recebida com sucesso (status=200).
        if(resposta.ok){
            return resposta.json();
        }
    }).then((conteudoJSON) => {
        
        //pseudo verificação conteudoJson.status é o mesmo que conteudoJson.status === true, ou seja, tem conteudo.
        if(conteudoJSON.status){
            
            for(const cidade of conteudoJSON.cidades){
                const opcao = document.createElement("option");
                opcao.value = cidade.id;
                opcao.textContent = cidade.nome + "/" + cidade.uf;
                elementoSelect.appendChild(opcao);
            }
        }
        else{
          mostrarMensagem("danger", conteudoJSON.mensagem)
        }
    }).catch((erro) => {
        mostrarMensagem("danger", "Erro ao obter lista de cidade!" + erro);
    });
    
}

function mostrarMensagem(tipo ="sucess", mensagem = "Mensagem Padrão") {
    const divMensagem = document.getElementById("mensagem");
    divMensagem.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagem}
        </div>
    `;
    setTimeout(() => {
        divMensagem.innerHTML = "";
    }, 5000);
    
}



function buscarClientes(){
    fetch(urlBase + "/cliente", {
        // parametrizando a chamada
        method: "GET"
    })
    .then((resposta) => {
       if(resposta.ok){
            return resposta.json();
        }
    })
    .then((conteudoJSON) => {
        // Verifica se o status é verdadeiro
        if(conteudoJSON.status){
            //verifica se o conteudo JSON trás as lista de clientes
            if(conteudoJSON.clientes.length == 0){
                mostrarMensagem("warning", "Nenhum cliente Cadastrado");
            }
            else{
                const espacoTabela = document.getElementById("espacoTabela");
                espacoTabela.innerHTML = "";
                const tabela = document.createElement("table");
                tabela.className = "table table-striped table hover";

                const cabecalhoTabela = document.createElement("thead");
                cabecalhoTabela.innerHTML = `
                    <tr>
                        <th>Id</th>
                        <th>CPF</th>
                        <th>Nome</th>
                        <th>Endereco</th>
                        <th>Bairro</th>
                        <th>Cidade/UF</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Ações</th>   
                    </tr>
                `;

                tabela.appendChild(cabecalhoTabela);

                const corpoTabela = document.createElement("tbody");
                for(const cliente of conteudoJSON.clientes){
                    const linha = document.createElement("tr");
                    linha.innerHTML = `
                        <td>${cliente.id}</td>
                        <td>${cliente.cpf}</td>
                        <td>${cliente.nome}</td>
                        <td>${cliente.endereco}</td>
                        <td>${cliente.bairro}</td>
                        <td>${cliente.cidade.nome}/${cliente.cidade.uf}</td>
                        <td>${cliente.telefone}</td>
                        <td>${cliente.email}</td>
                        <td><button class="btn btn-warning" 
                                    onclick="selecionarCliente(${cliente.id}, 
                                                                '${cliente.cpf}', 
                                                                '${cliente.nome}', 
                                                                '${cliente.endereco}', 
                                                                '${cliente.bairro}', 
                                                                '${cliente.cidade.id}', 
                                                                '${cliente.telefone}', 
                                                                '${cliente.email}')">
                                        Selecionar
                            </button></td>
                    `;
                    //este botão selecionarCliente(), vai receber os parâmetros id, cpf...
                    corpoTabela.appendChild(linha);
                }

                tabela.appendChild(corpoTabela);
                espacoTabela.appendChild(tabela);
                
                
                
            }

        }
        else{
            mostrarMensagem("danger", conteudoJSON.mensagem);
        }
    })
    .catch((erro) => {
        mostrarMensagem("danger", "Erro ao buscar a mensagem" + erro);
    });

}

function cadastrarCliente(){
    const formulario = document.getElementById("formCliente");
    // checkValidity - retorna true se o formulário for válido.
    if(formulario.checkValidity()){
        const cliente = {
            cpf: document.getElementById("cpf").value,
            nome: document.getElementById("nome").value,
            endereco: document.getElementById("endereco").value,
            bairro: document.getElementById("bairro").value,
            cidade: {
                id: document.getElementById("cidade").value
            },
            telefone: document.getElementById("telefone").value,
            email: document.getElementById("email").value
        }
        //vamos inserir uma forma de gravar no banco de dados.
        fetch(urlBase + "/cliente", {
            method: "POST",
            // No cabeçalho o tipo de conteúdo será json.
            headers: {
                "content-Type": "application/json"
            },
            // É o mesmo que dizer, json transforme esse objeto na sua versão string e mande ele lá para o backend utilizando o método POST, e dizendo no cabeçalho da requisição que o tipo de conteúdo é json - aplication/json.
            body: JSON.stringify(cliente)
        })
        .then((resposta) => {
            if(resposta.ok){
                return resposta.json();
            }
        })
        .then((conteudoJSON) => {
            if(conteudoJSON.status){
                mostrarMensagem("success", conteudoJSON.mensagem);
                // caso seja válido, este comando remove a classe was-validated, ou seja, a classe que ele foi validado.
                // essa função was-validated é uma função do próprio bootstrap que deixa em vermelho os campos que não foram preenchidos.
                limparFormulario();
                buscarClientes(); // exemplo didático - o mais recomendado seria adicionar um filho sem precisar recarregar a tela toda vez que adiciona uma cliente. 
                
            }
            else{
                mostrarMensagem("danger", conteudoJSON.mensagem);
            }
        })
        .catch((erro) => {
            mostrarMensagem("danger", "Erro ao cadastrar o cliente!" + erro);
        });
        
    }
    else{
        formulario.classList.add("was-validated");
    }
}

function limparFormulario(){
    const formulario = document.getElementById("formCliente");
    formulario.classList.remove("was-validated");
    formulario.reset();
}

function excluirCliente(id){
    fetch(urlBase + "/cliente/" + id, {
        method: "DELETE"
    })
    .then((resposta) => {
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((conteudoJSON) => {
        if(conteudoJSON.status){
            mostrarMensagem("success", conteudoJSON.mensagem);
            buscarClientes();
        }
        else{
            mostrarMensagem("danger", conteudoJSON.mensagem);
        }
    })
    .catch((erro) => {
        mostrarMensagem("danger", "Erro ao excluir o cliente!" + erro);
    });
}

function atualizarCliente(id){
    const formulario = document.getElementById("formCliente");
    if(formulario.checkValidity()){
        const cliente = {
            cpf: document.getElementById("cpf").value,
            nome: document.getElementById("nome").value,
            endereco: document.getElementById("endereco").value,
            bairro: document.getElementById("bairro").value,
            cidade: {
                id: document.getElementById("cidade").value
            },
            telefone: document.getElementById("telefone").value,
            email: document.getElementById("email").value
        }
        fetch(urlBase + "/cliente" + id, {
            method: "PUT",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        })
        .then((resposta) => {
            if(resposta.ok){
                return resposta.json();
            }
        })
        .then((conteudoJSON) => {
            if(conteudoJSON.status){
                mostrarMensagem("success", conteudoJSON.mensagem);
                limparFormulario();
                buscarClientes();
            }
            else{
                mostrarMensagem("danger", conteudoJSON.mensagem);
            }
        })
        .catch((erro) => {
            mostrarMensagem("danger", "Erro ao atualizar o cliente!" + erro);
        });
    }
    else{
        formulario.classList.add("was-validated");
    }
}
        

function selecionarCliente(id, cpf, nome, endereco, bairro, id_cidade,  telefone, email){
    document.getElementById("id").value = id;
    document.getElementById("cpf").value = cpf;
    document.getElementById("nome").value = nome;
    document.getElementById("endereco").value = endereco;
    document.getElementById("bairro").value = bairro;
    document.getElementById("cidade").value = id_cidade;
    document.getElementById("telefone").value = telefone;
    document.getElementById("email").value = email;

    //no momento que selecionarmos um cliente o botão cadastrar fica desabilitado. 
    document.getElementById("cadastrar").disabled = true;
    document.getElementById("atualizar").disabled = false;
    document.getElementById("excluir").disabled = false;
}

obterCidades();
buscarClientes();

// Neste ponto eu estou pegando o botão cadastrar do html cadastro.html, traduzindo, a minha contante botaoCadastrar vai receber o (id) identificador do botão cadastrar da tela cadastro.html.
const botaoCadastrar = document.getElementById("cadastrar");
botaoCadastrar.onclick = cadastrarCliente; // É errado chamar a função cadastrarCliente(), aqui deve ser associado ao método click do botão a função cadastrarCliente.
const botaoExcluir = document.getElementById("excluir");
botaoExcluir.onclick = function () {
    const id = document.getElementById("id").value;
    if(id){
        excluirCliente(id);
    } else {
        mostrarMensagem("warning", "Selecione um cliente primeiro!");
    }
};

const botaoAtualizar = document.getElementById("atualizar");
botaoAtualizar.onclick = atualizarCliente;
// Aula - 1:08:34
