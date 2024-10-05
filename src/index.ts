import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Livro from './models/livro';
import cors from 'cors';

const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb://localhost:27017/crud_livros';

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public/index.html'));
app.use(express.json());

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log('Erro ao conectar ao MongoDB', err));

// Rota POST para criar um novo livro
app.post('/livros', async (req, res) => {
    try {
        const novoLivro = new Livro({
            titulo: req.body.titulo,
            autor: req.body.autor,
            ano: req.body.ano,
        });
        const livroSalvo = await novoLivro.save();
        res.status(201).json(livroSalvo);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar livro', error });
    }
});

// Rota GET para listar todos os livros
app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.find(); // Corrigido para await
        res.json(livros);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar livros', error });
    }
});

// Rota PUT para atualizar um livro
app.put('/livros/:id', async (req:any, res:any) => {
    const { id } = req.params;
    const { titulo, autor, anoPublicacao } = req.body;
    try {
        const livroAtualizado = await Livro.findByIdAndUpdate(
            id,
            { titulo, autor, ano: anoPublicacao },
            { new: true }
        );
        if (!livroAtualizado) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }
        res.json(livroAtualizado);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar livro' });
    }
}); // <- Aqui está o fechamento correto da função PUT

// Rota DELETE para excluir um livro
app.delete('/livros/:id', async function (req:any, res:any) {
        const { id } = req.params;
        try {
            const livroDeletado = await Livro.findByIdAndDelete(id);
            if (!livroDeletado) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar livro' });
        }
    });
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });