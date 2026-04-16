const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// CONFIGURAÇÃO DO SUPABASE
// Pegue essas informações no seu painel do Supabase em Project Settings > API
const supabaseUrl = 'SUA_URL_DO_SUPABASE';
const supabaseKey = 'SUA_CHAVE_ANON_PUBLIC';
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/api/produtos', async (req, res) => {
    const { data, error } = await supabase.from('produtos').select('*').order('id', { ascending: true });
    if (error) return res.status(500).json(error);
    res.json(data);
});

app.post('/api/produtos', async (req, res) => {
    const { id, nome, preco } = req.body;
    
    if (id) {
        const { error } = await supabase.from('produtos').update({ nome, preco }).eq('id', id);
        if (error) return res.status(500).json(error);
        res.json({ message: "Atualizado!" });
    } else {
        const { error } = await supabase.from('produtos').insert([{ nome, preco }]);
        if (error) return res.status(500).json(error);
        res.json({ message: "Criado!" });
    }
});

app.delete('/api/produtos/:id', async (req, res) => {
    const { error } = await supabase.from('produtos').delete().eq('id', req.params.id);
    if (error) return res.status(500).json(error);
    res.json({ message: "Excluído!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor rodando na porta ${PORT}`));