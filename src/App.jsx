import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import BoasVindas from './pages/BoasVindas';
import Login from './pages/Login';
import Layout from './components/Layout';
import DashboardInicio from './pages/DashboardInicio';
import EmUso from './pages/EmUso';
import Ferramentas from './pages/Ferramentas';

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => createTheme({
    palette: { 
      mode,
      primary: { main: '#1a1a1a' },
      background: {
        // Opcional: ajustar o cinza do modo escuro para não ficar 100% preto
        default: mode === 'light' ? '#FBFBFB' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      }
    },
    typography: { fontFamily: 'Poppins, sans-serif' }
  }), [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
  {/* Rotas Públicas */}
  <Route path="/" element={<BoasVindas toggleColorMode={toggleColorMode} />} />
  <Route path="/login" element={<Login toggleColorMode={toggleColorMode} />} />

  {/* Rotas da Dashboard (Privadas/Layout) */}
  <Route path="/dashboard" element={<Layout toggleColorMode={toggleColorMode} />}>
    {/* Rota padrão (Início) */}
    <Route index element={<DashboardInicio />} /> 
    
    {/* Rota "Em Uso" - Agora com o componente real */}
    <Route path="em-uso" element={<EmUso />} /> 
    
    <Route path="ferramentas" element={<Ferramentas />} />/
     {/* Outras rotas (Ainda em desenvolvimento) */}
    <Route path="ocorrencias" element={<div>Página Ocorrências (Em breve...)</div>} />
    <Route path="perfil" element={<div>Página Perfil (Em breve...)</div>} />
  </Route>

  {/* Redirecionamento de segurança */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;