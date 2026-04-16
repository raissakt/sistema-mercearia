const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// CONFIGURAÇÃO DO SUPABASE
// Pegue essas informações no seu painel do Supabase em Project Settings > API
const supabaseUrl = 'https://slgbahuiwbfdoowqcbvn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZ2JhaHVpd2JmZG9vd3FjYnZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODM1NjQsImV4cCI6MjA5MTg1OTU2NH0.S-K79A_RCxALe9Oa8_nrUVBeECkt9Ir_-wDpygtCbAk';
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