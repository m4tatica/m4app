import axios from 'axios';

// URL base da API backend
const API_BASE_URL = 'https://3000-i48nl2p0opalpv18o6z7z-771ac5b9.manus.computer/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços da API
export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/login', { email, senha });
    return response.data;
  },
  register: async (email, senha) => {
    const response = await api.post('/register', { email, senha });
    return response.data;
  },
};

export const simuladorService = {
  getPublicData: async () => {
    const response = await api.get('/simulador/publico');
    return response.data;
  },
  simulateInternal: async (precoVendaAvista) => {
    const response = await api.post('/simulador/interno', { precoVendaAvista });
    return response.data;
  },
};

export const precificacaoService = {
  calcular: async (dados) => {
    const response = await api.post('/precificacao/calcular', dados);
    return response.data;
  },
};

export const taxasService = {
  getAll: async () => {
    const response = await api.get('/taxas');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/taxas/${id}`);
    return response.data;
  },
  create: async (taxa) => {
    const response = await api.post('/taxas', taxa);
    return response.data;
  },
  update: async (id, taxa) => {
    const response = await api.put(`/taxas/${id}`, taxa);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/taxas/${id}`);
    return response.data;
  },
};

export const produtosService = {
  getAll: async () => {
    const response = await api.get('/produtos');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },
  create: async (produto) => {
    const response = await api.post('/produtos', produto);
    return response.data;
  },
  update: async (id, produto) => {
    const response = await api.put(`/produtos/${id}`, produto);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
  },
};

export default api;

