import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import SimuladorPublico from './components/SimuladorPublico';
import Login from './components/Login';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<SimuladorPublico />} />
          
          {/* Rota de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas da área administrativa */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          } />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
