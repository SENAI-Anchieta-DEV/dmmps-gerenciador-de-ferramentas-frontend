import React, { useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Link, 
  IconButton, useTheme, CircularProgress, InputAdornment 
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

const Login = ({ toggleColorMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  // --- LÓGICA DE FUNCIONAMENTO PRESERVADA (RENDER/TIMEOUT) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    const controller = new AbortController(); 
    const timeoutId = setTimeout(() => controller.abort(), 60000); 

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080'; 
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
        signal: controller.signal, 
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        // 🔐 AQUI ESTÁ A VIRADA DE CHAVE AUTOMÁTICA:
        // Salva o token do backend e o e-mail digitado na chave 'user' para as travas de rota lerem!
        localStorage.setItem('token', data.token); 
        localStorage.setItem('user', email); 
        
        navigate('/dashboard'); 
      } else {
        const errorData = await response.json();
        setErro(errorData.detail || 'Email ou senha incorretos.');
      }
    } catch (err) {
      if (err.name === 'AbortError') { 
        setErro('O servidor está demorando muito para responder (Cold Start). Tente novamente in instantes.');
      } else {
        setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      minHeight: '100vh', 
      background: theme.palette.mode === 'light' 
        ? `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0), linear-gradient(135deg, #14213D 0%, #2b3a55 100%)`
        : `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0), linear-gradient(135deg, #0A1128 0%, #14213D 100%)`,
      backgroundSize: '30px 30px, 100% 100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* ONDAS DE FUNDO MANTIDAS */}
      <Box sx={{ position: 'absolute', bottom: -10, left: 0, width: '100%', opacity: 0.1, pointerEvents: 'none' }}>
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </Box>

      <IconButton 
        onClick={toggleColorMode} 
        sx={{ position: 'absolute', top: 25, right: 25, bgcolor: 'rgba(255,255,255,0.1)' }}
        color="inherit"
      >
        {theme.palette.mode === 'dark' ? <Brightness7Icon sx={{ color: 'white' }}/> : <Brightness4Icon sx={{ color: 'white' }}/>}
      </IconButton>

      <Paper elevation={0} sx={{ 
        display: 'flex', width: '90%', maxWidth: '900px', minHeight: '550px', 
        borderRadius: '24px', overflow: 'hidden',
        bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(20, 33, 61, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
      }}>
        
        <Box sx={{ flex: 1.2, p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ mb: 1, fontFamily: 'Poppins', fontWeight: 800, color: 'text.primary' }}>
            Seja Bem-Vindo!
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary', fontFamily: 'Poppins' }}>
            Acesse sua conta para explorar o ToolHub.
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            {erro && (
              <Box sx={{ mb: 3, p: 1.5, borderRadius: '10px', bgcolor: 'error.main', color: 'white', textAlign: 'center', fontWeight: 700 }}>
                {erro}
              </Box>
            )}

            {/* TEXTFIELDS MANTIDOS SEM ALTERAÇÃO VISUAL */}
            <TextField
              fullWidth
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ 
                mb: 3, 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '14px',
                  bgcolor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark' ? '#00f2ff' : 'primary.main',
                    borderWidth: '2px',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: theme.palette.mode === 'dark' ? '#00f2ff' : 'primary.main',
                }
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" /></InputAdornment> }}
            />

            <TextField
              fullWidth
              placeholder="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              variant="outlined"
              sx={{ 
                mb: 1, 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '14px',
                  bgcolor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark' ? '#00f2ff' : 'primary.main',
                    borderWidth: '2px',
                  }
                }
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment> }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
              <Link 
                component="button" 
                variant="caption" 
                type="button" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#f5f5f5' : 'primary.main', 
                  fontWeight: 700, 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Esqueceu a senha?
              </Link>
            </Box>

            <Button 
              type="submit"
              fullWidth
              variant="contained" 
              disabled={loading}
              sx={{ 
                py: 2, borderRadius: '14px', fontWeight: 800,
                bgcolor: theme.palette.mode === 'light' ? '#14213D' : '#f5f5f5', 
                color: theme.palette.mode === 'light' ? 'white' : '#14213D',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': { 
                  bgcolor: theme.palette.mode === 'light' ? '#2b3a55' : '#70f9ff',
                  transform: 'translateY(-3px)',
                  boxShadow: theme.palette.mode === 'dark' ? '0 0 25px rgba(0, 242, 255, 0.5)' : '0 10px 30px rgba(20, 33, 61, 0.3)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '120%',
                    height: '300%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                    transform: 'translate(-50%, -50%)',
                    transition: 'opacity 0.4s',
                    opacity: 1,
                  }
                },
                '&::after': { opacity: 0 }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar no Sistema'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ 
          flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', bgcolor: '#14213D', color: 'white', p: 6, textAlign: 'center'
        }}>
           <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontFamily: 'Poppins' }}>
             TOOL<Box component="span" sx={{ opacity: 0.5 }}>HUB</Box>
           </Typography>
           <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: '220px', lineHeight: 1.6, fontFamily: 'Poppins' }}>
             Gerenciamento e controle de ferramentas de alta performance.
           </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;