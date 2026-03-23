import express from 'express';

const host = '0.0.0.0';
const port = 8000;
const app = express();

// todo o conteúdo do repositório views/public estará disponível na raiz do servidor.
app.use(express.static('views/public'));
app.use(express.static('views/private'));
app.post("/login", (requisicao, resposta) => {
    //precisamos extrair os dados da requisição
    //lembrando que os dados estão armazenados no corpo da requisição
    const dados = requisicao.body;
});

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
