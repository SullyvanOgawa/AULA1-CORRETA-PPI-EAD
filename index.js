import express from 'express';
import autenticar from './security/autenticator.js';
import session from 'express-session';

const host = '0.0.0.0';
const port = 8000;
const app = express();
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
//o http é estateless, ou seja, ele não distingue usuários.
// para dar ao http acapacidade de identificar usuários, precisamos utilizar cookies de sessão.
// o express-session tem a capacidade de gerar sessões, cada sessão pertencerá a um único usuário
//escolher a biblioteca que ira processar os parâmetros da requisição, são duas uma querystring e a outra qs
// querystring => extended = false
// qs = extended => true
app.use(express.urlencoded({ extended: true }));

// todo o conteúdo do repositório views/public estará disponível na raiz do servidor.
app.use(express.static('views/public'));

app.post("/login", (requisicao, resposta) => {
    //precisamos extrair os dados da requisição
    //lembrando que os dados estão armazenados no corpo da requisição
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;

    if (usuario === 'admin' && senha === '123') {
        //atualizar a sessão do usuário
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

app.use(autenticar, express.static('views/private'));

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
