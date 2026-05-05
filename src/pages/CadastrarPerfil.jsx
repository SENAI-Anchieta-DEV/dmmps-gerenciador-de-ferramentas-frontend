import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar, 
  useTheme, 
  Stack, 
  Container, 
  IconButton 
} from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const CadastrarPerfil = () => {
  const theme = useTheme();
  const toggleColorMode = useOutletContext(); 

  // Estilo dos inputs conforme discussões anteriores
  const inputStyle = {
    flexGrow: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: '50px', 
      backgroundColor: theme.palette.mode === 'light' ? '#E0E0E0' : '#333333',
      fontFamily: 'Poppins, sans-serif',
      '& fieldset': { border: 'none' }, 
    },
    '& .MuiInputBase-input': { 
      padding: '10px 24px', 
      fontSize: '0.8rem',
      fontFamily: 'Poppins, sans-serif',
    }
  };

  const labelStyle = {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700,
    color: 'text.primary',
    fontSize: '1.05rem',
    whiteSpace: 'nowrap', 
    minWidth: '180px',    
  };

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100vh', 
      position: 'relative',
      overflow: 'hidden',
      bgcolor: 'background.default'
    }}>
      
      {/* --- Waves (Conforme feito no figma) --- */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: -20, 
        right: -20, 
        zIndex: 0, 
        pointerEvents: 'none',
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.2,
        color: theme.palette.mode === 'light' ? '#000' : '#FFF'
      }}>
        <svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Camada de onda 1 */}
          <path d="M600 150C500 120 450 250 300 200C150 150 100 350 0 300V400H600V" stroke="currentColor" strokeWidth="1.5" />
          {/* Camada de onda 2 */}
          <path d="M600 220C520 190 480 300 350 260C220 220 150 380 50 340V400H600V220Z" stroke="currentColor" strokeWidth="1.5" />
          {/* Camada de onda 3 */}
          <path d="M600 280C540 260 510 340 400 320C290 300 220 400 120 370V400H600V280Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Box>

      {/* Cabeçalho Cinza */}
      <Box sx={{ 
        bgcolor: theme.palette.mode === 'light' ? '#D9D9D9' : '#444444', 
        height: '200px', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1,
        display: 'flex', justifyContent: 'flex-end', p: 3
      }}>
        <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary', alignSelf: 'flex-start' }}>
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      {/* Conteúdo Principal */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: 8, px: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          
          <Typography variant="h4" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, mb: 5 }}>
            Cadastrar Perfil
          </Typography>

          <Avatar sx={{ 
            width: 150, height: 150, bgcolor: '#F5F5F5', border: '2px solid #000', mb: 6 
          }}>
            <AccountCircleIcon sx={{ fontSize: 130, color: '#000' }} />
          </Avatar>

          <Stack spacing={2.5} sx={{ width: '100%', maxWidth: '750px' }}>
            {["Nome Completo", "Email", "Data de Nascimento", "Cargo", "ID"].map((label) => (
              <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={labelStyle}>{label}:</Typography>
                <TextField fullWidth variant="outlined" sx={inputStyle} />
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1.5 }}>
              <Button 
                variant="contained" 
                startIcon={<AddCircleOutlineIcon />}
                sx={{ 
                  borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 8, py: 1.6,
                  fontFamily: 'Poppins, sans-serif', boxShadow: 'none',
                  bgcolor: theme.palette.mode === 'light' ? '#1a1a1a' : '#ffffff',
                  color: theme.palette.mode === 'light' ? '#ffffff' : '#1a1a1a',
                  '&:hover': { bgcolor: theme.palette.mode === 'light' ? '#333333' : '#e0e0e0' }
                }}
              >
                Criar Usuário
              </Button>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CadastrarPerfil;