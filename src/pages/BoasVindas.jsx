import React from 'react';
import { Box, Button, Typography, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Ícone da Lua
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Ícone do Sol
import { useNavigate } from 'react-router-dom';

const BoasVindas = ({ toggleColorMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', bgcolor: 'background.default',
      position: 'relative' 
    }}>
      {/* Botão da Lua no Canto Superior Direito */}
      <IconButton 
        onClick={toggleColorMode} 
        sx={{ position: 'absolute', top: 30, right: 40 }}
        color="inherit"
      >
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>

      {/* Espaço do Logo (X) */}
      <Box sx={{ 
        width: 350, height: 180, border: '1px solid #ccc', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', mb: 5
      }}>
        <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: '#ccc', transform: 'rotate(27deg)' }} />
        <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: '#ccc', transform: 'rotate(-27deg)' }} />
        <Typography variant="h6" color="text.secondary">LOGO TOOLHUB</Typography>
      </Box>

      {/* Botão de Entrar centralizado */}
      <Button 
        variant="outlined" 
        size="large"
        onClick={() => navigate('/login')}
        sx={{ 
          px: 8, py: 1.5, fontSize: '1.5rem', textTransform: 'none',
          borderRadius: '12px', color: 'text.primary', borderColor: 'text.primary'
        }}
      >
        Entrar
      </Button>
    </Box>
  );
};

export default BoasVindas;