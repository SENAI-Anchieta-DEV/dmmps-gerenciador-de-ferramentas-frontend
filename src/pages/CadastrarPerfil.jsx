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
  Stack, 
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
      borderRadius: '14px',
      backgroundColor: 'background.paper',
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
        borderWidth: '2px'
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
      flexDirection: 'column',
      pt: { xs: 4, sm: 6, md: 8 }, 
      pb: 5,
      /* 🌟 CORRIGIDO: Injetado o padding de proteção lateral para criar o mesmo recuo da listagem */
      px: { xs: 2.5, sm: 4, md: 5 }, 
      bgcolor: 'background.default',
      boxSizing: 'border-box'
    }}>
      
      {/* Alternador de Tema clássico */}
      <Box sx={{ position: 'absolute', top: { xs: 24, md: 40 }, right: 40, zIndex: 10, display: { xs: 'none', md: 'block' } }}>
        <IconButton onClick={() => toggleColorMode?.()} sx={{ color: 'text.primary' }}>
          {isLight ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Box>

      <Container maxWidth="md" disableGutters sx={{ my: { xs: 0, md: 'auto' } }}>
        
        {/* CONTAINER DO FORMULÁRIO */}
        <Box 
          component="form"
          onSubmit={handleSubmit}
          sx={{ 
            p: { xs: 0, sm: 5, md: 8 }, 
            bgcolor: { xs: 'transparent', sm: 'background.paper' }, 
            border: { xs: 'none', sm: '1px solid' }, 
            borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '24px', 
            width: '100%',
            boxSizing: 'border-box',
            boxShadow: { xs: 'none', sm: isLight ? '0 10px 30px rgba(0,0,0,0.03)' : '0 15px 35px rgba(0,0,0,0.2)' }
          }}
        >
          {/* STACK VERTICAL */}
          <Stack spacing={3} sx={{ width: '100%' }}>
            
            <Typography variant="h4" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.6rem', sm: '2.125rem' } }}>
              Cadastrar Perfil
            </Typography>

            {/* Avatar Centralizado */}
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <Avatar sx={{ 
                width: { xs: 110, sm: 130 }, 
                height: { xs: 110, sm: 130 }, 
                bgcolor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255, 255, 255, 0.03)', 
                border: '2px solid', 
                borderColor: isLight ? 'primary.main' : '#00f2ff',
              }}>
                <AccountCircleIcon sx={{ fontSize: { xs: 95, sm: 115 }, color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.5)' }} />
              </Avatar>
            </Box>

            {/* Nome Completo */}
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

            {/* E-mail e Senha */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
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
            </Box>

            {/* Registro e Perfil */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
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
            </Box>

            {/* Área de Botões */}
            <Stack spacing={2} sx={{ pt: 1, width: '100%', alignItems: 'center' }}>
              <Button 
                type="submit"
                variant="contained" 
                disabled={cadastroLoading}
                startIcon={cadastroLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                sx={{ 
                  borderRadius: '14px', 
                  textTransform: 'none', 
                  fontWeight: 800, 
                  width: '100%', 
                  py: 1.8,
                  fontSize: '1rem',
                  fontFamily: 'Poppins, sans-serif', 
                  bgcolor: isLight ? '#14213D' : '#00f2ff',
                  color: isLight ? '#ffffff' : '#14213D',
                  boxShadow: 'none',
                  '&:hover': { 
                    bgcolor: isLight ? '#2b3a55' : '#70f9ff',
                  }
                }}
              >
                {cadastroLoading ? 'Registrando...' : 'Criar Usuário'}
              </Button>
              
              <Button 
                variant="text"
                sx={{ 
                  textTransform: 'none', 
                  fontFamily: 'Poppins, sans-serif', 
                  color: 'text.secondary', 
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  '&:hover': { bgcolor: 'transparent', color: 'text.primary' }
                }}
              >
                Cancelar
              </Button>
            </Stack>

          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CadastrarPerfil;/*556*/