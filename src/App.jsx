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
import Ocorrencias from './pages/Ocorrencias';
import CadastrarPerfil from './pages/CadastrarPerfil'; 
import ListarPerfis from './pages/ListarPerfis';

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
        primary: mode === 'light' ? '#000000' : '#ffffff',
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
      {/* O CssBaseline é essencial: ele aplica a fonte no <body> automaticamente */}
      <CssBaseline /> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BoasVindas toggleColorMode={toggleColorMode} />} />
          <Route path="/login" element={<Login toggleColorMode={toggleColorMode} />} />
          <Route path="/" element={<BoasVindas toggleColorMode={toggleColorMode} />} />

          <Route path="/dashboard" element={<Layout toggleColorMode={toggleColorMode} />}>
            <Route index element={<DashboardInicio />} /> 
            <Route path="em-uso" element={<EmUso />} /> 
            <Route path="ferramentas" element={<Ferramentas />} />
            <Route path="ocorrencias" element={<Ocorrencias />} />
            <Route path="perfil/cadastrar" element={<CadastrarPerfil />} />
            <Route path="perfil/listar" element={<ListarPerfis />} />
            

          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );





}

export default App;