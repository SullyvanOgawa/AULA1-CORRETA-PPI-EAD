import express from 'express';
import autenticar from './security/autenticator.js';
import session from 'express-session';

const host = '0.0.0.0';
const port = 8000;
const app = express();

//O http é estateless, ou seja, ele não distingue usuários.
// Para dar ao http a capacidade de identificar usuários, precisamos utilizar cookies de sessão. O express-session tem a capacidade de gerar sessões, cada sessão pertencerá a um único usuário.
app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: true, 
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 15 // 15 minutos
    }
}));

// app.use(express.urlencoded({ extended: true})); É um middleware que serve para interpretar dados enviados em formulários HTML (aqueles com application/x-www-form-urlencoded). Ou seja: ele pega os dados do formulário e transforma em um objeto JavaScript acessível em requisicao.body. 

// express.urlencoded = Função do Express que cria um middleware para ler dados do corpo da requisição (body).

// {extended: true} = Essa opção define como os dados serão interpretados ela usa uma biblioteca mais avançada (qs) → permite objetos complexos = user[name]=João&user[age]=20. Em outra palavras quando o Extended for igual a true ele consegue interpretar objetos e arrays.
app.use(express.urlencoded({extended: true}));

// todo o conteúdo do repositório views/public estará disponível na raiz do servidor.
app.use(express.static('views/public'));

app.post("/login", (requisicao, resposta) => {
    //precisamos extrair os dados da requisição
    //lembrando que os dados estão armazenados no corpo da requisição
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;

    if (usuario === 'admin' && senha === '123') {
        //Somente quando o usuário === admin e senha === 123, é inserido na requisição que o usuário estálogado - vamos atualizar a sessão do usuário
        requisicao.session.usuarioLogado = true;
        resposta.redirect('/menu.html');
    }
    else{
        resposta.redirect('/login.html');
    }
});

app.get("/login", (requisicao, resposta) => {
    resposta.redirect('/public/login.html');
});

app.get("/logout", (requisicao, resposta) => {
    //vamos limpar a sessão do usuário
    requisicao.session.destroy(); //aqui ele encerra a sessão do usuário
    resposta.redirect('/login.html'); // aqui ele redireciona para a tela de login
});

app.use(autenticar, express.static('views/private'));

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
