import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Copy, Calculator, LogIn } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import Logo from './Logo';
import { simuladorService } from '../lib/api';
import { toast } from 'sonner';

const SimuladorPublico = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [taxas, setTaxas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulando, setSimulando] = useState(false);
  const [resultados, setResultados] = useState([]);
  
  // Estados do formulário
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [nomeProduto, setNomeProduto] = useState('');
  const [valorProduto, setValorProduto] = useState('');

  useEffect(() => {
    carregarDadosPublicos();
  }, []);

  const carregarDadosPublicos = async () => {
    try {
      const data = await simuladorService.getPublicData();
      setProdutos(data.produtos);
      setTaxas(data.taxas);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados da API');
    } finally {
      setLoading(false);
    }
  };

  const handleProdutoChange = (value) => {
    setProdutoSelecionado(value);
    if (value) {
      const produto = produtos.find(p => p.codigo_produto === value);
      if (produto) {
        setNomeProduto(produto.nome_produto);
        setValorProduto(produto.preco_venda_avista.toString());
      }
    } else {
      setNomeProduto('');
      setValorProduto('');
    }
  };

  const simularParcelamento = () => {
    if (!nomeProduto || !valorProduto) {
      toast.error('Preencha o nome e valor do produto');
      return;
    }

    setSimulando(true);
    
    const precoVenda = parseFloat(valorProduto);
    const simulacoes = taxas.map(taxa => {
      // Calcular valor total parcelado
      const valorTotalParcelado = precoVenda / (1 - (taxa.taxa_percentual / 100));
      
      // Calcular número de parcelas
      let numeroParcelas = 1;
      if (taxa.parcela_tipo !== 'Pix' && taxa.parcela_tipo !== 'Débito' && taxa.parcela_tipo !== '1x') {
        const match = taxa.parcela_tipo.match(/(\d+)x/);
        if (match) {
          numeroParcelas = parseInt(match[1]);
        }
      }
      
      const valorDaParcela = valorTotalParcelado / numeroParcelas;

      return {
        parcela_tipo: taxa.parcela_tipo,
        taxa_percentual: taxa.taxa_percentual,
        valorTotalParcelado: valorTotalParcelado,
        valorDaParcela: valorDaParcela,
        numeroParcelas: numeroParcelas
      };
    });

    setResultados(simulacoes);
    setSimulando(false);
  };

  const copiarParaWhatsApp = () => {
    if (resultados.length === 0) {
      toast.error('Faça uma simulação primeiro');
      return;
    }

    let texto = `M4 Tática\n`;
    texto += `${nomeProduto} - R$ ${parseFloat(valorProduto).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} à vista\n`;
    texto += `Opções de Pagamento:\n`;

    resultados.forEach(resultado => {
      const valorTotal = resultado.valorTotalParcelado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const valorParcela = resultado.valorDaParcela.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      if (resultado.parcela_tipo === 'Pix' || resultado.parcela_tipo === 'Débito') {
        texto += `${resultado.parcela_tipo} R$ ${valorTotal}\n`;
      } else if (resultado.numeroParcelas === 1) {
        texto += `${resultado.parcela_tipo} R$ ${valorTotal}\n`;
      } else {
        texto += `${resultado.parcela_tipo}: ${resultado.numeroParcelas}x R$ ${valorParcela} = R$ ${valorTotal}\n`;
      }
    });

    texto += `\nOs valores poderão sofrer alterações sem aviso prévio`;

    navigator.clipboard.writeText(texto).then(() => {
      toast.success('Texto copiado para a área de transferência!');
    }).catch(() => {
      toast.error('Erro ao copiar texto');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo size="md" />
            <Button variant="outline" onClick={() => navigate('/login')}>
              <LogIn className="h-4 w-4 mr-2" />
              Área Admin
            </Button>
          </div>
        </header>
        
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button variant="outline" onClick={() => navigate('/login')}>
            <LogIn className="h-4 w-4 mr-2" />
            Área Admin
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Simulador de Parcelas</h1>
          <p className="text-muted-foreground text-lg">Simule o parcelamento dos seus produtos de forma rápida e precisa</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Dados do Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <Label htmlFor="produto-select">Produto Pré-cadastrado (opcional)</Label>
                <Select value={produtoSelecionado} onValueChange={handleProdutoChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Produto personalizado</SelectItem>
                    {produtos.map(produto => (
                      <SelectItem key={produto.codigo_produto} value={produto.codigo_produto}>
                        {produto.nome_produto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nome-produto">Nome do Produto</Label>
                <Input
                  id="nome-produto"
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  placeholder="Digite o nome do produto"
                />
              </div>

              <div>
                <Label htmlFor="valor-produto">Valor do Produto</Label>
                <CurrencyInput
                  value={valorProduto}
                  onValueChange={(value) => setValorProduto(value || '')}
                  placeholder="R$ 0,00"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={simularParcelamento} 
                  disabled={simulando}
                  className="flex-1"
                  size="lg"
                >
                  {simulando ? 'Simulando...' : 'Simular Parcelamento'}
                </Button>
                
                {resultados.length > 0 && (
                  <Button 
                    onClick={copiarParaWhatsApp}
                    variant="outline"
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    <Copy className="h-4 w-4" />
                    WhatsApp
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
              <CardTitle>Resultados da Simulação</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {resultados.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-center">{nomeProduto}</h3>
                    <p className="text-center text-muted-foreground">
                      Valor à vista: R$ {parseFloat(valorProduto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Forma de Pagamento</TableHead>
                        <TableHead>Taxa (%)</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Valor da Parcela</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultados.map((resultado, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{resultado.parcela_tipo}</TableCell>
                          <TableCell>{resultado.taxa_percentual.toFixed(2)}%</TableCell>
                          <TableCell>
                            R$ {resultado.valorTotalParcelado.toLocaleString('pt-BR', { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </TableCell>
                          <TableCell>
                            {resultado.numeroParcelas > 1 ? (
                              <>
                                {resultado.numeroParcelas}x R$ {resultado.valorDaParcela.toLocaleString('pt-BR', { 
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: 2 
                                })}
                              </>
                            ) : (
                              `R$ ${resultado.valorDaParcela.toLocaleString('pt-BR', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}`
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Preencha os dados e clique em "Simular Parcelamento"</p>
                  <p className="text-sm">para ver os resultados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimuladorPublico;

