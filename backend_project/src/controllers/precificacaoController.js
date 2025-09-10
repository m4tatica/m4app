async function calcularPrecificacao(req, res) {
    const { 
        nomeProduto, 
        precoCompra, 
        descontoFornecedorPercent, 
        ipiValor, 
        ipiTipo, 
        frete, 
        difalPercent,
        impostoVendaPercent,
        margemLucroTipo,
        margemLucroValor
    } = req.body;

    // Validação dos campos obrigatórios
    if (!nomeProduto || precoCompra === undefined || descontoFornecedorPercent === undefined || 
        ipiValor === undefined || !ipiTipo || frete === undefined || difalPercent === undefined ||
        impostoVendaPercent === undefined || !margemLucroTipo || margemLucroValor === undefined) {
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
        const precoVendaSemImposto = custoTotal / (1 - (impostoVendaPercent / 100));

        let precoVendaFinal;
        let lucro;
        let margemPercentual;

        if (margemLucroTipo === 'percentual') {
            precoVendaFinal = precoVendaSemImposto / (1 - (margemLucroValor / 100));
            lucro = precoVendaFinal - custoTotal;
            margemPercentual = margemLucroValor;
        } else if (margemLucroTipo === 'lucro_alvo') {
            lucro = margemLucroValor;
            precoVendaFinal = precoVendaSemImposto + lucro;
            margemPercentual = (lucro / precoVendaFinal) * 100;
        } else if (margemLucroTipo === 'preco_final') {
            precoVendaFinal = margemLucroValor;
            lucro = precoVendaFinal - precoVendaSemImposto;
            margemPercentual = (lucro / precoVendaFinal) * 100;
        } else {
            return res.status(400).json({ error: "margemLucroTipo inválido" });
        }

        // Retornar resultados parciais e o custoTotal final
        res.json({
            nomeProduto,
            precoCompra: parseFloat(precoCompra),
            precoComDesconto: parseFloat(precoComDesconto.toFixed(2)),
            valorIPI: parseFloat(valorIPI.toFixed(2)),
            baseCalculoDifal: parseFloat(baseCalculoDifal.toFixed(2)),
            valorDifal: parseFloat(valorDifal.toFixed(2)),
            custoTotal: parseFloat(custoTotal.toFixed(2)),
            precoVendaFinal: parseFloat(precoVendaFinal.toFixed(2)),
            lucro: parseFloat(lucro.toFixed(2)),
            margemPercentual: parseFloat(margemPercentual.toFixed(2))
        });
    } catch (error) {
        console.error("Erro ao calcular precificação:", error.message);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

module.exports = { calcularPrecificacao };

