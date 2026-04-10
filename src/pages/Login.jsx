import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Link, IconButton, useTheme, CircularProgress } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';

const Login = ({ toggleColorMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false); // NOVO: Estado de carregamento

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true); // Inicia o carregamento

    try {
      // O endpoint deve coincidir com o AuthController do seu backend
      const response = await fetch('https://dmmps-gerenciador-api-arzr.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }), // Mapeia para o LoginRequestDTO
      });

      if (response.ok) {
        const data = await response.json(); // Espera o TokenResponseDTO
        localStorage.setItem('token', data.token);
        navigate('/dashboard'); 
      } else {
        const errorData = await response.json();
        // Exibe a mensagem detalhada vinda do backend ou uma padrão
        setErro(errorData.detail || 'Email ou senha incorretos.');
      }
    } catch (err) {
      setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      minHeight: '100vh', bgcolor: 'background.default', position: 'relative' 
    }}>
      
      <IconButton 
        onClick={toggleColorMode} 
        sx={{ position: 'absolute', top: 20, right: 20 }}
        color="inherit"
      >
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>

      <Paper elevation={3} sx={{ 
        display: 'flex', width: '80%', maxWidth: '900px', 
        height: '550px', borderRadius: '20px', overflow: 'hidden',
        bgcolor: 'background.paper'
      }}>
        
        <Box sx={{ 
          flex: 1.5, p: 6, display: 'flex', flexDirection: 'column', 
          alignItems: 'center', bgcolor: 'background.paper' 
        }}>
          <Typography variant="h3" sx={{ mb: 4, fontFamily: 'Poppins, sans-serif', color: 'text.primary' }}>
            Login
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: '400px' }}>
            
            {/* NOVO: Exibição visual do erro */}
            {erro && (
              <Typography 
                color="error" 
                variant="body2" 
                sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}
              >
                {erro}
              </Typography>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
                Email
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
                Senha
              </Typography>
              <TextField
                fullWidth
                type="password"
                variant="outlined"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
              <Link 
                component="button" 
                variant="caption" 
                underline="hover"
                type="button"
                onClick={() => alert('Recuperação em breve...')}
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                Esqueceu a senha?
              </Link>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                type="submit"
                variant="outlined" 
                disabled={loading} // Desabilita durante o envio
                sx={{ 
                  px: 6, py: 1, borderRadius: '12px', fontSize: '1.1rem',
                  textTransform: 'none', color: 'text.primary', borderColor: 'text.primary'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: '1px', bgcolor: 'divider' }} />

        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
           {/* ... conteúdo da logo permanece igual ... */}
           <Typography variant="caption" color="text.secondary">LOGO TOOLHUB</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;