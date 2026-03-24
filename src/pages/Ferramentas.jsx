import React from 'react';
import { Box, Typography, Paper, Button, Avatar, useTheme } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import QrCode2Icon from '@mui/icons-material/QrCode2';

const ToolCardLista = ({ ferramenta }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2.5, 
        borderRadius: '20px', 
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '160px', // Mais baixo que os outros para ser minimalista
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-5px)',
          boxShadow: theme.palette.mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.08)',
          borderColor: 'primary.main'
        }
      }}
    >
      {/* Linha Superior: Ícone + Info + QR Code */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Avatar 
          sx={{ 
            bgcolor: 'action.hover', 
            color: 'text.primary', 
            border: '1px solid', 
            borderColor: 'divider',
            width: 44,
            height: 44
          }}
        >
          <ConstructionIcon fontSize="small" />
        </Avatar>

        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', fontFamily: 'Poppins', fontSize: '0.9rem' }}>
            {ferramenta.nome}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary', fontSize: '0.75rem' }}>
            {ferramenta.id}
          </Typography>
        </Box>

        <QrCode2Icon sx={{ color: 'text.primary', opacity: 0.8, fontSize: '2rem' }} />
      </Box>

      {/* Botão Centralizado na base */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="outlined" 
          size="small"
          sx={{ 
            borderRadius: '20px', 
            textTransform: 'none', 
            fontSize: '0.7rem',
            borderColor: 'divider',
            color: 'text.primary',
            fontFamily: 'Poppins',
            px: 3,
            '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' }
          }}
        >
          Ver mais detalhes
        </Button>
      </Box>
    </Paper>
  );
};

const Ferramentas = () => {
  // Gerando 16 exemplos para ver o grid em ação
  const listaFerramentas = Array.from({ length: 16 }).map((_, i) => ({
    nome: 'Ferramenta',
    id: `#${1234567 + i}`
  }));

  return (
    <Box sx={{ width: '100%', pb: 5 }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
        gap: 3 
      }}>
        {listaFerramentas.map((f, i) => (
          <ToolCardLista key={i} ferramenta={f} />
        ))}
      </Box>
    </Box>
  );
};

export default Ferramentas;