const { pool } = require("../config/database");

async function simuladorInterno(req, res) {
    const { precoVendaAvista } = req.body;

    if (precoVendaAvista === undefined || precoVendaAvista <= 0) {
        return res.status(400).json({ 
            error: "precoVendaAvista é obrigatório e deve ser maior que zero" 
        });
    }

    try {
        // Buscar todas as taxas do banco de dados
        const result = await pool.query("SELECT * FROM taxas ORDER BY id ASC");
        const taxas = result.rows;

        // Calcular a "Visão Cliente" para cada taxa
        const simulacoes = taxas.map(taxa => {
            // valorTotalParcelado = precoVendaAvista / (1 - (taxa.taxa_percentual / 100))
            const valorTotalParcelado = precoVendaAvista / (1 - (parseFloat(taxa.taxa_percentual) / 100));
            
            // Calcular valor da parcela
            let numeroParcelas = 1;
            if (taxa.parcela_tipo !== 'Pix' && taxa.parcela_tipo !== 'Débito' && taxa.parcela_tipo !== '1x') {
                // Extrair número de parcelas do tipo (ex: '12x' -> 12)
                const match = taxa.parcela_tipo.match(/(\d+)x/);
                if (match) {
                    numeroParcelas = parseInt(match[1]);
                }
            }
            
            const valorDaParcela = valorTotalParcelado / numeroParcelas;

            return {
                parcela_tipo: taxa.parcela_tipo,
                taxa_percentual: parseFloat(taxa.taxa_percentual),
                valorTotalParcelado: parseFloat(valorTotalParcelado.toFixed(2)),
                valorDaParcela: parseFloat(valorDaParcela.toFixed(2)),
                numeroParcelas: numeroParcelas
            };
        });

        res.json({
            precoVendaAvista: parseFloat(precoVendaAvista),
            simulacoes: simulacoes
        });
    } catch (error) {
        console.error("Erro no simulador interno:", error.message);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

async function simuladorPublico(req, res) {
    try {
        // Buscar produtos
        const produtosResult = await pool.query(
            "SELECT codigo_produto, nome_produto, preco_venda_avista FROM produtos ORDER BY id ASC"
        );

        // Buscar taxas
        const taxasResult = await pool.query(
            "SELECT parcela_tipo, taxa_percentual FROM taxas ORDER BY id ASC"
        );

        res.json({
            produtos: produtosResult.rows.map(produto => ({
                codigo_produto: produto.codigo_produto,
                nome_produto: produto.nome_produto,
                preco_venda_avista: parseFloat(produto.preco_venda_avista)
            })),
            taxas: taxasResult.rows.map(taxa => ({
                parcela_tipo: taxa.parcela_tipo,
                taxa_percentual: parseFloat(taxa.taxa_percentual)
            }))
        });
    } catch (error) {
        console.error("Erro no simulador público:", error.message);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

module.exports = { simuladorInterno, simuladorPublico };

