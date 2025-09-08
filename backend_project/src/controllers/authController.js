const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

async function register(req, res) {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        // Verificar se o usuário já existe
        const existingUser = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        // Hash da senha
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        // Inserir usuário no banco
        const result = await pool.query(
            'INSERT INTO usuarios (email, senha_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, senhaHash]
        );

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function login(req, res) {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        // Buscar usuário no banco
        const result = await pool.query('SELECT id, email, senha_hash FROM usuarios WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const user = result.rows[0];

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, user.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login realizado com sucesso',
            token,
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = { register, login };

