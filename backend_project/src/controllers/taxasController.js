const { pool } = require("../config/database");

async function getAllTaxas(req, res) {
  try {
    const result = await pool.query("SELECT * FROM taxas ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar taxas:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getTaxaById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM taxas WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Taxa não encontrada." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar taxa:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function createTaxa(req, res) {
  const { parcela_tipo, taxa_percentual } = req.body;
  
  if (!parcela_tipo || taxa_percentual === undefined) {
    return res.status(400).json({ error: "Parcela tipo e taxa percentual são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO taxas (parcela_tipo, taxa_percentual) VALUES ($1, $2) RETURNING *",
      [parcela_tipo, taxa_percentual]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar taxa:", error.message);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: "Parcela tipo já existe" });
    } else {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

async function updateTaxa(req, res) {
  const { id } = req.params;
  const { taxa_percentual } = req.body;
  
  if (taxa_percentual === undefined) {
    return res.status(400).json({ error: "Taxa percentual é obrigatória" });
  }

  try {
    const result = await pool.query(
      "UPDATE taxas SET taxa_percentual = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [taxa_percentual, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Taxa não encontrada." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar taxa:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function deleteTaxa(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM taxas WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Taxa não encontrada." });
    }
    res.json({ message: "Taxa deletada com sucesso", taxa: result.rows[0] });
  } catch (error) {
    console.error("Erro ao deletar taxa:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { getAllTaxas, getTaxaById, createTaxa, updateTaxa, deleteTaxa };

