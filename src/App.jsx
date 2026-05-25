import React, { useState, useEffect } from 'react'; // 🌟 Atualizado: Mantida a consistência de imports
import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useOutletContext } from 'react-router-dom'; // 🌟 Incluído useOutletContextimport BoasVindas from './pages/BoasVindas';
import BoasVindas from './pages/BoasVindas'; 
import Login from './pages/Login';
import Layout from './components/Layout';
import DashboardInicio from './pages/DashboardInicio';
import EmUso from './pages/EmUso';
import Ferramentas from './pages/Ferramentas';
import Ocorrencias from './pages/Ocorrencias';
import CadastrarPerfil from './pages/CadastrarPerfil'; 
import ListarPerfis from './pages/ListarPerfis';
import Historico from './pages/Historico';
import Perfil from './pages/Perfil';

// 🌟 ATUALIZADO: Componente Guardião agora repassa o contexto do Layout adiante
const RotaProtegida = ({ perfisPermitidos }) => {
  const perfilUsuario = localStorage.getItem('perfil') || '';
  const context = useOutletContext(); // 🌟 ADICIONADO: Captura o contexto vindo do Layout.jsx
  
  if (!perfisPermitidos.includes(perfilUsuario)) {
    // Se o perfil digitado na barra de endereços não for ADMIN, chuta de volta para o início do painel
    return <Navigate to="/dashboard" replace />;
  }
  
  // 🌟 ATUALIZADO: Repassa o context para que as páginas internas (CadastrarPerfil, ListarPerfis) consigam lê-lo!
  return <Outlet context={context} />;
};

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => createTheme({
    palette: { 
      mode,
      primary: { main: '#14213D' },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#0A1128', 
        paper: mode === 'light' ? '#ffffff' : '#14213D', 
      },
      text: {
        primary: mode === 'light' ? '#14213D' : '#f5f5f5',
        secondary: mode === 'light' ? 'rgba(20, 33, 61, 0.7)' : 'rgba(245, 245, 245, 0.7)',
      }
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Poppins';
            font-style: normal;
            display: swap;
            font-weight: 400;
          }
        `,
      },
    },
  }), [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <BrowserRouter>
        <Routes>
          {/* Rotas Raiz */}
          <Route path="/" element={<BoasVindas toggleColorMode={toggleColorMode} />} />
          <Route path="/login" element={<Login toggleColorMode={toggleColorMode} />} />

          {/* Rotas do Painel Administrativo (Aninhadas dentro de /dashboard) */}
          <Route path="/dashboard" element={<Layout toggleColorMode={toggleColorMode} />}>
            <Route index element={<DashboardInicio />} /> 
            <Route path="em-uso" element={<EmUso />} /> 
            <Route path="ferramentas" element={<Ferramentas />} />
            <Route path="ocorrencias" element={<Ocorrencias />} />
            <Route path="historico" element={<Historico />} />
            <Route path="perfil/meu" element={<Perfil />} />

            {/* 🌟 ADICIONADO: Envelopamento de segurança máxima. Bloqueia na marra o formulário e a listagem de funcionários */}
            <Route element={<RotaProtegida perfisPermitidos={['ADMIN']} />}>
              <Route path="perfil/cadastrar" element={<CadastrarPerfil />} />
              <Route path="perfil/listar" element={<ListarPerfis />} />
            </Route>
          </Route>

          {/* Fallback de segurança para rotas inexistentes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;