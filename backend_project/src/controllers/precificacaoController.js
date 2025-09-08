async function calcularPrecificacao(req, res) {
    const { 
        nomeProduto, 
        precoCompra, 
        descontoFornecedorPercent, 
        ipiValor, 
        ipiTipo, 
        frete, 
        difalPercent 
    } = req.body;

    // Validação dos campos obrigatórios
    if (!nomeProduto || precoCompra === undefined || descontoFornecedorPercent === undefined || 
        ipiValor === undefined || !ipiTipo || frete === undefined || difalPercent === undefined) {
        return res.status(400).json({ 
            error: "Todos os campos são obrigatórios: nomeProduto, precoCompra, descontoFornecedorPercent, ipiValor, ipiTipo, frete, difalPercent" 
        });
    }

    // Validação do tipo de IPI
    if (ipiTipo !== 'percentual' && ipiTipo !== 'reais') {
        return res.status(400).json({ 
            error: "ipiTipo deve ser 'percentual' ou 'reais'" 
        });
    }

    try {
        // Lógica de cálculo conforme especificado
        const precoComDesconto = precoCompra * (1 - (descontoFornecedorPercent / 100));

        let valorIPI = 0;
        if (ipiTipo === 'reais') {
            valorIPI = ipiValor;
        } else { // 'percentual'
            // Fórmula exata: R$ Com Desconto - (R$ Com Desconto / (1 + (IPI % / 100)))
            valorIPI = precoComDesconto - (precoComDesconto / (1 + (ipiValor / 100)));
        }

        const baseCalculoDifal = precoComDesconto + frete - valorIPI;
        const valorDifal = baseCalculoDifal * (difalPercent / 100);
        const custoTotal = precoComDesconto + frete + valorDifal;

        // Retornar resultados parciais e o custoTotal final
        res.json({
            nomeProduto,
            precoCompra: parseFloat(precoCompra),
            precoComDesconto: parseFloat(precoComDesconto.toFixed(2)),
            valorIPI: parseFloat(valorIPI.toFixed(2)),
            baseCalculoDifal: parseFloat(baseCalculoDifal.toFixed(2)),
            valorDifal: parseFloat(valorDifal.toFixed(2)),
            custoTotal: parseFloat(custoTotal.toFixed(2))
        });
    } catch (error) {
        console.error("Erro ao calcular precificação:", error.message);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

module.exports = { calcularPrecificacao };

