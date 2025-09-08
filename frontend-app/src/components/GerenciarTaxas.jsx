import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Edit, Trash2, Percent } from 'lucide-react';
import { taxasService } from '../lib/api';
import { toast } from 'sonner';

const GerenciarTaxas = () => {
  const [taxas, setTaxas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTaxa, setEditingTaxa] = useState(null);
  const [formData, setFormData] = useState({
    parcela_tipo: '',
    taxa_percentual: ''
  });

  useEffect(() => {
    carregarTaxas();
  }, []);

  const carregarTaxas = async () => {
    try {
      const data = await taxasService.getAll();
      setTaxas(data);
    } catch (error) {
      console.error('Erro ao carregar taxas:', error);
      toast.error('Erro ao carregar taxas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.parcela_tipo || formData.taxa_percentual === '') {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      const dadosParaEnvio = {
        ...formData,
        taxa_percentual: parseFloat(formData.taxa_percentual)
      };

      if (editingTaxa) {
        await taxasService.update(editingTaxa.id, { taxa_percentual: dadosParaEnvio.taxa_percentual });
        toast.success('Taxa atualizada com sucesso');
      } else {
        await taxasService.create(dadosParaEnvio);
        toast.success('Taxa criada com sucesso');
      }

      setDialogOpen(false);
      resetForm();
      carregarTaxas();
    } catch (error) {
      console.error('Erro ao salvar taxa:', error);
      toast.error(error.response?.data?.error || 'Erro ao salvar taxa');
    }
  };

  const handleEdit = (taxa) => {
    setEditingTaxa(taxa);
    setFormData({
      parcela_tipo: taxa.parcela_tipo,
      taxa_percentual: taxa.taxa_percentual.toString()
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta taxa?')) {
      return;
    }

    try {
      await taxasService.delete(id);
      toast.success('Taxa excluída com sucesso');
      carregarTaxas();
    } catch (error) {
      console.error('Erro ao excluir taxa:', error);
      toast.error('Erro ao excluir taxa');
    }
  };

  const resetForm = () => {
    setFormData({
      parcela_tipo: '',
      taxa_percentual: ''
    });
    setEditingTaxa(null);
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
            <Percent className="h-8 w-8" />
            Gerenciar Taxas
          </h2>
          <p className="text-muted-foreground">Configure as taxas de parcelamento do sistema</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Taxa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTaxa ? 'Editar Taxa' : 'Nova Taxa'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="parcela_tipo">Tipo de Parcela</Label>
                <Input
                  id="parcela_tipo"
                  value={formData.parcela_tipo}
                  onChange={(e) => setFormData({ ...formData, parcela_tipo: e.target.value })}
                  placeholder="Ex: Pix, Débito, 1x, 12x"
                  disabled={editingTaxa} // Não permite editar o tipo quando está editando
                  required
                />
                {editingTaxa && (
                  <p className="text-xs text-muted-foreground mt-1">
                    O tipo de parcela não pode ser alterado
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="taxa_percentual">Taxa Percentual (%)</Label>
                <Input
                  id="taxa_percentual"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.taxa_percentual}
                  onChange={(e) => setFormData({ ...formData, taxa_percentual: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingTaxa ? 'Atualizar' : 'Criar'}
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
          <CardTitle>Lista de Taxas</CardTitle>
        </CardHeader>
        <CardContent>
          {taxas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Parcela</TableHead>
                  <TableHead>Taxa (%)</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxas.map((taxa) => (
                  <TableRow key={taxa.id}>
                    <TableCell className="font-medium">
                      {taxa.parcela_tipo}
                    </TableCell>
                    <TableCell>
                      {parseFloat(taxa.taxa_percentual).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(taxa.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(taxa.updated_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(taxa)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(taxa.id)}
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
              <Percent className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma taxa cadastrada</p>
              <p className="text-sm">Clique em "Nova Taxa" para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GerenciarTaxas;

