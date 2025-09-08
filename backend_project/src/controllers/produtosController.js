const { pool } = require("../config/database");

async function getAllProdutos(req, res) {
  try {
    const result = await pool.query("SELECT * FROM produtos ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getProdutoById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM produtos WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar produto:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function createProduto(req, res) {
  const { codigo_produto, nome_produto, preco_venda_avista } = req.body;
  
  if (!nome_produto || preco_venda_avista === undefined) {
    return res.status(400).json({ error: "Nome do produto e preço de venda à vista são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO produtos (codigo_produto, nome_produto, preco_venda_avista) VALUES ($1, $2, $3) RETURNING *",
      [codigo_produto, nome_produto, preco_venda_avista]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar produto:", error.message);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: "Código do produto já existe" });
    } else {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

async function updateProduto(req, res) {
  const { id } = req.params;
  const { codigo_produto, nome_produto, preco_venda_avista } = req.body;
  
  if (!nome_produto || preco_venda_avista === undefined) {
    return res.status(400).json({ error: "Nome do produto e preço de venda à vista são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "UPDATE produtos SET codigo_produto = $1, nome_produto = $2, preco_venda_avista = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [codigo_produto, nome_produto, preco_venda_avista, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error.message);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: "Código do produto já existe" });
    } else {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

async function deleteProduto(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM produtos WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json({ message: "Produto deletado com sucesso", produto: result.rows[0] });
  } catch (error) {
    console.error("Erro ao deletar produto:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { getAllProdutos, getProdutoById, createProduto, updateProduto, deleteProduto };

