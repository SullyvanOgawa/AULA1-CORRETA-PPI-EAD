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
    }).then((conteudoJson) => {
        
        //pseudo verificação conteudoJson.status é o mesmo que conteudoJson.status === true, ou seja, tem conteudo.
        if(conteudoJson.status){
            
            for(const cidade of conteudoJson.cidades){
                const opcao = document.createElement("option");
                opcao.value = cidade.id;
                opcao.textContent = cidade.nome + "/" + cidade.uf;
                elementoSelect.appendChild(opcao);
            }
        }
        else{
          mostrarMensagem("danger", conteudoJson.mensagem)
        }
    }).catch((erro) => {
        mostrarMensagem("danger", "Erro ao obter lista de cidade!" + erro);
    });
    
}

function mostrarMensagem(tipo ="sucess", mensagem = "Mensagem Padrão") {
    const divMensagem = document.getElementById("mensagem");
    divMensagem.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" r 
                                ${mensagem}">
                             </div>`
    setTimeout(() => {
        divMensagem.innerHTML = "";
    }, 5000);
    
}



function buscarClientes(){
    fech(urlBase + "/cliente", {
        // parametrizando a chamada
        method: "GET"
    })
    .then((resposta) => {
        return resposta.json();
    })
    .then((conteudoJSON) => {
        // Verifica se o status é verdadeiro
        if(conteudoJSON.status){
            //verifica se o conteudo JSON trás as lista de clientes
            if(conteudoJSON.clientes.length == 0){
                const espacoTabela = document.getElementById("espacoTabela");
                espacoTabela.innerHTML = "";
                const tabela = document.createElement("table");
                tabela.className = "table table-striped table hover";
                
                
                
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

obterCidades();
mostrarMensagem();

// Aula - 1:08:34
