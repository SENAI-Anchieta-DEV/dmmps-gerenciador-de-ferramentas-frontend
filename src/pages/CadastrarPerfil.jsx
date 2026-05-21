import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Avatar, 
  useTheme, 
  Container, 
  Grid, 
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import API_BASE_URL from '../apiConfig';

const CadastrarPerfil = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { toggleColorMode } = useOutletContext();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    registro: '',
    perfil: '' 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [cadastroLoading, setCadastroLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCadastroLoading(true);

    try {
      // 🎯 AJUSTE DA CIRURGIA: Adicionado /api/v1 para espelhar perfeitamente a rota do Postman
      const response = await fetch(`${API_BASE_URL}/api/v1/usuarios`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Usuário cadastrado com sucesso! 🚀');
        setFormData({ nome: '', email: '', senha: '', registro: '', perfil: '' });
      } else {
        alert(`Erro ${response.status}: Não foi possível realizar o cadastro.`);
      }
    } catch (err) {
      alert('Falha na comunicação com o servidor da ToolHub.');
    } finally {
      setCadastroLoading(false);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)',
      fontFamily: 'Poppins, sans-serif',
      transition: 'all 0.3s ease',
      '& fieldset': { 
        border: '1px solid',
        borderColor: isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)' 
      },
      '&:hover fieldset': {
        borderColor: isLight ? 'primary.main' : '#00f2ff',
      },
      '&.Mui-focused fieldset': {
        borderColor: isLight ? 'primary.main' : '#00f2ff',
      },
      '& input': {
        color: isLight ? 'text.primary' : '#ffffff',
      }
    },
    '& .MuiInputLabel-root': { 
      fontFamily: 'Poppins, sans-serif',
      color: isLight ? 'text.secondary' : 'rgba(255, 255, 255, 0.6)',
      '&.Mui-focused': { color: isLight ? 'primary.main' : '#00f2ff' }
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      color: isLight ? 'text.primary' : '#ffffff'
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh', 
      position: 'relative', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6,
      bgcolor: 'background.default',
      backgroundImage: isLight 
        ? 'radial-gradient(rgba(0, 0, 0, 0.1) 1.5px, transparent 1.5px)' 
        : 'radial-gradient(rgba(0, 242, 255, 0.15) 1.2px, transparent 1.2px)',
      backgroundSize: '30px 30px',
      overflowX: 'hidden'
    }}>
      
      {/* Alternador de Tema */}
      <Box sx={{ position: 'absolute', top: 24, right: 32, zIndex: 10 }}>
        <IconButton onClick={() => toggleColorMode?.()} sx={{ color: 'text.primary' }}>
          {isLight ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Box>

      <Container maxWidth="md">
        <Paper 
          component="form"
          onSubmit={handleSubmit}
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            borderRadius: '24px', 
            border: '1px solid', 
            borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
            bgcolor: isLight ? '#f5f5f5' : '#14213D',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.03)' : '0 15px 35px rgba(0,0,0,0.2)'
          }}
        >
          <Grid container spacing={4}>
            
            {/* Título da Página */}
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: 'text.primary' }}>
                Cadastrar Perfil
              </Typography>
            </Grid>

            {/* Ícone da Foto Centralizado */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
              <Avatar sx={{ 
                width: 130, 
                height: 130, 
                bgcolor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255, 255, 255, 0.03)', 
                border: '2px solid', 
                borderColor: isLight ? 'primary.main' : '#00f2ff',
              }}>
                <AccountCircleIcon sx={{ fontSize: 115, color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.5)' }} />
              </Avatar>
            </Grid>

            {/* Nome Completo */}
            <Grid item xs={12}>
              <TextField 
                required 
                fullWidth 
                label="Nome Completo *" 
                name="nome" 
                value={formData.nome} 
                onChange={handleInputChange} 
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon sx={{ color: isLight ? 'primary.main' : '#00f2ff', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ) 
                }} 
                sx={inputStyles} 
              />
            </Grid>

            {/* Demais campos abaixo do nome */}
            <Grid item xs={12} md={6}>
              <TextField 
                required 
                fullWidth 
                type="email"
                label="E-mail *" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: isLight ? 'primary.main' : '#00f2ff', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ) 
                }} 
                sx={inputStyles} 
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                required 
                fullWidth 
                type={showPassword ? 'text' : 'password'}
                label="Senha *" 
                name="senha" 
                value={formData.senha} 
                onChange={handleInputChange} 
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: isLight ? 'primary.main' : '#00f2ff', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'text.secondary' }}>
                        {showPassword ? <VisibilityOff sx={{ fontSize: '1.2rem' }} /> : <Visibility sx={{ fontSize: '1.2rem' }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }} 
                sx={inputStyles} 
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                required 
                fullWidth 
                label="Registro *" 
                name="registro" 
                value={formData.registro} 
                onChange={handleInputChange} 
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: isLight ? 'primary.main' : '#00f2ff', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ) 
                }} 
                sx={inputStyles} 
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                select 
                required
                fullWidth 
                label="Perfil de Acesso *" 
                name="perfil" 
                value={formData.perfil} 
                onChange={handleInputChange}
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <AdminPanelSettingsIcon sx={{ color: isLight ? 'primary.main' : '#00f2ff', fontSize: '1.2rem', mr: 1 }} />
                    </InputAdornment>
                  ) 
                }}
                sx={inputStyles}
              >
                <MenuItem value="ADMIN" sx={{ fontFamily: 'Poppins, sans-serif' }}>Administrador</MenuItem>
                <MenuItem value="ALMOXARIFE" sx={{ fontFamily: 'Poppins, sans-serif' }}>Almoxarife</MenuItem>
                <MenuItem value="TECNICO" sx={{ fontFamily: 'Poppins, sans-serif' }}>Técnico</MenuItem>
              </TextField>
            </Grid>

            {/* Botão com loading */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0}}>
                <Button 
                  type="submit"
                  variant="contained" 
                  disabled={cadastroLoading}
                  startIcon={cadastroLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                  sx={{ 
                    borderRadius: '14px', 
                    textTransform: 'none', 
                    fontWeight: 700, 
                    px: 7, 
                    py: 1.6,
                    fontSize: '0.95rem',
                    fontFamily: 'Poppins, sans-serif', 
                    bgcolor: isLight ? '#14213D' : '#00f2ff',
                    color: isLight ? '#ffffff' : '#14213D',
                    '&:hover': { 
                      bgcolor: isLight ? '#2b3a55' : '#70f9ff',
                    }
                  }}
                >
                  {cadastroLoading ? 'Registrando...' : 'Criar Usuário'}
                </Button>
              </Box>
            </Grid>

          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default CadastrarPerfil;