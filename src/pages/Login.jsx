import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Link, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';

const Login = ({ toggleColorMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard'); 
  };

  return (
    <Box sx={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      minHeight: '100vh', bgcolor: 'background.default', position: 'relative' 
    }}>
      
      {/* Botão de Tema */}
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
        
        {/* Coluna da Esquerda */}
        <Box sx={{ 
          flex: 1.5, p: 6, display: 'flex', flexDirection: 'column', 
          alignItems: 'center', bgcolor: 'background.paper' 
        }}>
          <Typography variant="h3" sx={{ mb: 6, fontFamily: 'Poppins, sans-serif', color: 'text.primary' }}>
            Login
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: '400px' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
                Email ou ID
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
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
                sx={{ 
                  px: 6, py: 1, borderRadius: '12px', fontSize: '1.1rem',
                  textTransform: 'none', color: 'text.primary', borderColor: 'text.primary'
                }}
              >
                Entrar
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: '1px', bgcolor: 'divider' }} />

        {/* Coluna da Direita (Logo) */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
          <Box sx={{ 
            width: '180px', height: '100px', border: '1px solid', borderColor: 'divider', 
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'divider', transform: 'rotate(25deg)' }} />
            <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'divider', transform: 'rotate(-25deg)' }} />
            <Typography variant="caption" color="text.secondary">LOGO</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;