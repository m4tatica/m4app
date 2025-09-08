import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import { produtosService } from '../lib/api';
import { toast } from 'sonner';

const GerenciarProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [formData, setFormData] = useState({
    codigo_produto: '',
    nome_produto: '',
    preco_venda_avista: ''
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const data = await produtosService.getAll();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome_produto || !formData.preco_venda_avista) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const dadosParaEnvio = {
        ...formData,
        preco_venda_avista: parseFloat(formData.preco_venda_avista)
      };

      if (editingProduto) {
        await produtosService.update(editingProduto.id, dadosParaEnvio);
        toast.success('Produto atualizado com sucesso');
      } else {
        await produtosService.create(dadosParaEnvio);
        toast.success('Produto criado com sucesso');
      }

      setDialogOpen(false);
      resetForm();
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error(error.response?.data?.error || 'Erro ao salvar produto');
    }
  };

  const handleEdit = (produto) => {
    setEditingProduto(produto);
    setFormData({
      codigo_produto: produto.codigo_produto || '',
      nome_produto: produto.nome_produto,
      preco_venda_avista: produto.preco_venda_avista.toString()
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      await produtosService.delete(id);
      toast.success('Produto excluído com sucesso');
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const resetForm = () => {
    setFormData({
      codigo_produto: '',
      nome_produto: '',
      preco_venda_avista: ''
    });
    setEditingProduto(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Gerenciar Produtos
          </h2>
          <p className="text-muted-foreground">Adicione, edite ou remova produtos do sistema</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduto ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="codigo_produto">Código do Produto (opcional)</Label>
                <Input
                  id="codigo_produto"
                  value={formData.codigo_produto}
                  onChange={(e) => setFormData({ ...formData, codigo_produto: e.target.value })}
                  placeholder="Ex: TAU0001"
                />
              </div>
              
              <div>
                <Label htmlFor="nome_produto">Nome do Produto *</Label>
                <Input
                  id="nome_produto"
                  value={formData.nome_produto}
                  onChange={(e) => setFormData({ ...formData, nome_produto: e.target.value })}
                  placeholder="Nome do produto"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="preco_venda_avista">Preço de Venda à Vista *</Label>
                <CurrencyInput
                  value={formData.preco_venda_avista}
                  onValueChange={(value) => setFormData({ ...formData, preco_venda_avista: value || '' })}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingProduto ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          {produtos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço à Vista</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-mono">
                      {produto.codigo_produto || '-'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {produto.nome_produto}
                    </TableCell>
                    <TableCell>
                      R$ {parseFloat(produto.preco_venda_avista).toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(produto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(produto.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum produto cadastrado</p>
              <p className="text-sm">Clique em "Novo Produto" para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GerenciarProdutos;

