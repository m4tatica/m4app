import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart3, TrendingUp } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import { simuladorService } from '../lib/api';
import { toast } from 'sonner';

const SimuladorInterno = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [precoVendaAvista, setPrecoVendaAvista] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!precoVendaAvista) {
      toast.error('Preencha o preço de venda à vista');
      return;
    }

    setLoading(true);
    
    try {
      const preco = parseFloat(precoVendaAvista);
      const response = await simuladorService.simulateInternal(preco);
      setResultado(response);
      toast.success('Simulação realizada com sucesso!');
    } catch (error) {
      console.error('Erro na simulação:', error);
      toast.error(error.response?.data?.error || 'Erro ao realizar simulação');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPrecoVendaAvista('');
    setResultado(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Simulador Interno
        </h2>
        <p className="text-muted-foreground">
          Análise estratégica de parcelamento para tomada de decisão
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Dados para Simulação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="precoVendaAvista">Preço de Venda à Vista</Label>
                <CurrencyInput
                  value={precoVendaAvista}
                  onValueChange={(value) => setPrecoVendaAvista(value || '')}
                  placeholder="R$ 0,00"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Simulando...' : 'Simular'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Limpar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Análise de Parcelamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resultado ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Preço Base (À Vista)</p>
                      <p className="text-2xl font-bold text-primary">
                        R$ {resultado.precoVendaAvista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Forma de Pagamento</TableHead>
                        <TableHead>Taxa (%)</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Valor da Parcela</TableHead>
                        <TableHead>Diferença</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultado.simulacoes.map((simulacao, index) => {
                        const diferenca = simulacao.valorTotalParcelado - resultado.precoVendaAvista;
                        const percentualDiferenca = ((diferenca / resultado.precoVendaAvista) * 100);
                        
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {simulacao.parcela_tipo}
                            </TableCell>
                            <TableCell>
                              {simulacao.taxa_percentual.toFixed(2)}%
                            </TableCell>
                            <TableCell>
                              R$ {simulacao.valorTotalParcelado.toLocaleString('pt-BR', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </TableCell>
                            <TableCell>
                              {simulacao.numeroParcelas > 1 ? (
                                <>
                                  {simulacao.numeroParcelas}x R$ {simulacao.valorDaParcela.toLocaleString('pt-BR', { 
                                    minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2 
                                  })}
                                </>
                              ) : (
                                `R$ ${simulacao.valorDaParcela.toLocaleString('pt-BR', { 
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: 2 
                                })}`
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-right">
                                <div className={diferenca >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {diferenca >= 0 ? '+' : ''}R$ {diferenca.toLocaleString('pt-BR', { 
                                    minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2 
                                  })}
                                </div>
                                <div className={`text-xs ${diferenca >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  ({diferenca >= 0 ? '+' : ''}{percentualDiferenca.toFixed(1)}%)
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      💡 Insights da Análise
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• As taxas mostram o custo real do parcelamento para o cliente</li>
                      <li>• Valores em verde indicam receita adicional comparado ao preço à vista</li>
                      <li>• Use estes dados para negociações e estratégias de preço</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Preencha o preço de venda à vista</p>
                  <p className="text-sm">e clique em "Simular" para ver a análise</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimuladorInterno;

