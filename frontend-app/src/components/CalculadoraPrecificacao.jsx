// frontend-app/src/components/CalculadoraPrecificacao.jsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calculator, DollarSign } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import { precificacaoService } from '../lib/api';
import { toast } from 'sonner';

const CalculadoraPrecificacao = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [formData, setFormData] = useState({
    nomeProduto: '',
    precoCompra: '',
    descontoFornecedorPercent: '',
    ipiValor: '',
    ipiTipo: 'percentual',
    frete: '',
    difalPercent: '',
    impostoVendaPercent: '',
    margemLucroTipo: 'percentual',
    margemLucroValor: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    const camposObrigatorios = ["nomeProduto", "precoCompra", "descontoFornecedorPercent", "ipiValor", "frete", "difalPercent", "impostoVendaPercent", "margemLucroValor"];
    const campoVazio = camposObrigatorios.find(campo => !formData[campo] && formData[campo] !== "0");
    
    if (campoVazio) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    
    try {
      const dadosParaEnvio = {
        nomeProduto: formData.nomeProduto,
        precoCompra: parseFloat(formData.precoCompra),
        descontoFornecedorPercent: parseFloat(formData.descontoFornecedorPercent),
        ipiValor: parseFloat(formData.ipiValor),
        ipiTipo: formData.ipiTipo,
        frete: parseFloat(formData.frete),
        difalPercent: parseFloat(formData.difalPercent),
        impostoVendaPercent: parseFloat(formData.impostoVendaPercent),
        margemLucroTipo: formData.margemLucroTipo,
        margemLucroValor: parseFloat(formData.margemLucroValor)
      };

      const response = await precificacaoService.calcular(dadosParaEnvio);
      setResultado(response);
      toast.success('Cálculo realizado com sucesso!');
    } catch (error) {
      console.error('Erro no cálculo:', error);
      toast.error(error.response?.data?.error || 'Erro ao calcular precificação');
    } finally {
      setLoading(false);
    }
  };

  // --- INÍCIO DA CORREÇÃO ---
  const resetForm = () => {
    setFormData({
      nomeProduto: '',
      precoCompra: '',
      descontoFornecedorPercent: '',
      ipiValor: '',
      ipiTipo: 'percentual',
      frete: '',
      difalPercent: '',
      impostoVendaPercent: '',      // Campo adicionado ao reset
      margemLucroTipo: 'percentual', // Campo adicionado ao reset
      margemLucroValor: ''           // Campo adicionado ao reset
    });
    setResultado(null);
  };

  const formatarMoeda = (valor) => {
    if (typeof valor !== 'number' || isNaN(valor)) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  // --- FIM DA CORREÇÃO ---


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          Calculadora de Precificação
        </h2>
        <p className="text-muted-foreground">
          Calcule o custo total e o preço de venda do seu produto.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nomeProduto">Nome do Produto</Label>
                <Input
                  id="nomeProduto"
                  value={formData.nomeProduto}
                  onChange={(e) => setFormData({ ...formData, nomeProduto: e.target.value })}
                  placeholder="Nome do produto"
                  required
                />
              </div>

              <div>
                <Label htmlFor="precoCompra">Preço de Compra</Label>
                <CurrencyInput
                  value={formData.precoCompra}
                  onValueChange={(value) => setFormData({ ...formData, precoCompra: value || '' })}
                  placeholder="R$ 0,00"
                />
              </div>

              <div>
                <Label htmlFor="descontoFornecedor">Desconto do Fornecedor (%)</Label>
                <Input
                  id="descontoFornecedor"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.descontoFornecedorPercent}
                  onChange={(e) => setFormData({ ...formData, descontoFornecedorPercent: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ipiTipo">Tipo do IPI</Label>
                  <Select value={formData.ipiTipo} onValueChange={(value) => setFormData({ ...formData, ipiTipo: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentual">Percentual (%)</SelectItem>
                      <SelectItem value="reais">Valor em Reais (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ipiValor">
                    Valor do IPI {formData.ipiTipo === 'percentual' ? '(%)' : '(R$)'}
                  </Label>
                  {formData.ipiTipo === 'reais' ? (
                    <CurrencyInput
                      value={formData.ipiValor}
                      onValueChange={(value) => setFormData({ ...formData, ipiValor: value || '' })}
                      placeholder="R$ 0,00"
                    />
                  ) : (
                    <Input
                      id="ipiValor"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.ipiValor}
                      onChange={(e) => setFormData({ ...formData, ipiValor: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="frete">Frete</Label>
                <CurrencyInput
                  value={formData.frete}
                  onValueChange={(value) => setFormData({ ...formData, frete: value || '' })}
                  placeholder="R$ 0,00"
                />
              </div>
              
               <div>
                <Label htmlFor="difal">DIFAL (%)</Label>
                <Input
                  id="difal"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.difalPercent}
                  onChange={(e) => setFormData({ ...formData, difalPercent: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="impostoVenda">Imposto de Venda (%)</Label>
                <Input
                  id="impostoVenda"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.impostoVendaPercent}
                  onChange={(e) => setFormData({ ...formData, impostoVendaPercent: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="margemLucroTipo">Método de Lucro</Label>
                  <Select value={formData.margemLucroTipo} onValueChange={(value) => setFormData({ ...formData, margemLucroTipo: value, margemLucroValor: '' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentual">Margem (%)</SelectItem>
                      <SelectItem value="lucro_alvo">Lucro Alvo (R$)</SelectItem>
                      <SelectItem value="preco_final">Preço Final (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="margemLucroValor">
                    {formData.margemLucroTipo === 'percentual' && 'Margem de Lucro (%)'}
                    {formData.margemLucroTipo === 'lucro_alvo' && 'Lucro Alvo (R$)'}
                    {formData.margemLucroTipo === 'preco_final' && 'Preço Final (R$)'}
                  </Label>
                  {formData.margemLucroTipo === 'percentual' ? (
                    <Input
                      id="margemLucroValor"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.margemLucroValor}
                      onChange={(e) => setFormData({ ...formData, margemLucroValor: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  ) : (
                    <CurrencyInput
                      value={formData.margemLucroValor}
                      onValueChange={(value) => setFormData({ ...formData, margemLucroValor: value || '' })}
                      placeholder="R$ 0,00"
                      required
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Calculando...' : 'Calcular'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Limpar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Resultados do Cálculo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resultado ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">{resultado.nomeProduto}</h3>
                </div>

                {/* --- SEÇÃO DE RESULTADOS ATUALIZADA --- */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Preço de Compra:</span><span className="font-medium">{formatarMoeda(resultado.precoCompra)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Preço com Desconto:</span><span className="font-medium">{formatarMoeda(resultado.precoComDesconto)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Valor do IPI:</span><span className="font-medium">{formatarMoeda(resultado.valorIPI)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Base de Cálculo DIFAL:</span><span className="font-medium">{formatarMoeda(resultado.baseCalculoDifal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Valor do DIFAL:</span><span className="font-medium">{formatarMoeda(resultado.valorDifal)}</span></div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-base font-bold">
                      <span>Custo Total:</span>
                      <span className="text-primary">{formatarMoeda(resultado.custoTotal)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 space-y-3">
                    <div className="flex justify-between"><span className="text-muted-foreground">(+) Imposto sobre Venda:</span><span className="font-medium">{formatarMoeda(resultado.valorImpostoVenda)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">(+) Lucro Bruto:</span><span className="font-medium">{formatarMoeda(resultado.lucroBruto)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Margem de Lucro:</span><span className="font-medium">{resultado.margemCalculada.toFixed(2)}%</span></div>

                    <div className="border-t pt-3">
                       <div className="flex justify-between text-xl font-bold">
                         <span>Preço de Venda Final:</span>
                         <span className="text-green-600">{formatarMoeda(resultado.precoVendaFinal)}</span>
                       </div>
                    </div>
                  </div>
                </div>
                {/* --- FIM DA SEÇÃO DE RESULTADOS --- */}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Preencha os dados e clique em "Calcular"</p>
                <p className="text-sm">para ver os resultados da precificação</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalculadoraPrecificacao;