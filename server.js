const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicia o Banco de Dados e verifica se há erro na criação do arquivo
const db = new sqlite3.Database('./mercearia.db', (err) => {
    if (err) console.error("ERRO AO CRIAR BANCO:", err.message);
    else console.log("Banco de dados pronto!");
});

db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    preco REAL
)`);

app.get('/api/produtos', (req, res) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

app.post('/api/produtos', (req, res) => {
    const { id, nome, preco } = req.body;
    
    // Se não houver nome ou preço, o servidor avisa
    if (!nome || preco === undefined) {
        return res.status(400).json({error: "Dados incompletos"});
    }

    if (id) {
        db.run("UPDATE produtos SET nome = ?, preco = ? WHERE id = ?", [nome, preco, id], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({ message: "Atualizado!" });
        });
    } else {
        db.run("INSERT INTO produtos (nome, preco) VALUES (?, ?)", [nome, preco], function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({ message: "Criado!" });
        });
    }
});

app.delete('/api/produtos/:id', (req, res) => {
    db.run("DELETE FROM produtos WHERE id = ?", req.params.id, (err) => {
        if (err) return res.status(500).json({error: err.message});
        res.json({ message: "Excluído!" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
