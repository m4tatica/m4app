import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Calculator, 
  Package, 
  Percent, 
  LogOut, 
  Home,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import Logo from './Logo';
import CalculadoraPrecificacao from './CalculadoraPrecificacao';
import GerenciarProdutos from './GerenciarProdutos';
import GerenciarTaxas from './GerenciarTaxas';
import SimuladorInterno from './SimuladorInterno';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout realizado com sucesso');
    navigate('/');
  };

  const menuItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: Home,
      exact: true
    },
    {
      path: '/admin/calculadora',
      label: 'Calculadora',
      icon: Calculator
    },
    {
      path: '/admin/simulador',
      label: 'Simulador Interno',
      icon: BarChart3
    },
    {
      path: '/admin/produtos',
      label: 'Produtos',
      icon: Package
    },
    {
      path: '/admin/taxas',
      label: 'Taxas',
      icon: Percent
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive(item.path, item.exact) ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => navigate(item.path)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calculadora" element={<CalculadoraPrecificacao />} />
              <Route path="/simulador" element={<SimuladorInterno />} />
              <Route path="/produtos" element={<GerenciarProdutos />} />
              <Route path="/taxas" element={<GerenciarTaxas />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Dashboard
const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Calculadora de Precificação',
      description: 'Calcule o custo total de produtos considerando descontos, IPI e DIFAL',
      icon: Calculator,
      path: '/admin/calculadora',
      color: 'bg-blue-500'
    },
    {
      title: 'Simulador Interno',
      description: 'Simule parcelamentos para análise estratégica interna',
      icon: BarChart3,
      path: '/admin/simulador',
      color: 'bg-green-500'
    },
    {
      title: 'Gerenciar Produtos',
      description: 'Adicione, edite ou remova produtos do sistema',
      icon: Package,
      path: '/admin/produtos',
      color: 'bg-purple-500'
    },
    {
      title: 'Gerenciar Taxas',
      description: 'Configure as taxas de parcelamento do sistema',
      icon: Percent,
      path: '/admin/taxas',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Bem-vindo ao painel administrativo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.path} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(card.path)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${card.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminLayout;

