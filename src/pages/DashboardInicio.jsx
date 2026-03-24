import React from 'react';
import { Box, Typography, Paper, Avatar, useTheme } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import QrCode2Icon from '@mui/icons-material/QrCode2';

const ToolCardDashboard = ({ index }) => {
  const theme = useTheme();

  // Simulação de cores de status para a dashboard geral
  const statusColors = ['#85FF80', '#FF6961', '#FFB347'];
  const currentStatus = statusColors[index % 3];

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
        gap: 2,
        height: '210px',
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-5px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 12px 30px rgba(0,0,0,0.6)' 
            : '0 12px 30px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          borderColor: 'primary.main'
        }
      }}
    >
      {/* Topo do Card: Ícone + Info + QR Code */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Avatar 
          sx={{ 
            bgcolor: 'action.hover', 
            color: 'text.primary', 
            border: '1px solid', 
            borderColor: 'divider',
            width: 48,
            height: 48
          }}
        >
          <ConstructionIcon />
        </Avatar>

        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary', fontFamily: 'Poppins' }}
          >
            Ferramenta {index + 1}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary', fontSize: '0.75rem' }}
          >
            #ID-{1000 + index}
          </Typography>
        </Box>

        <QrCode2Icon sx={{ color: 'text.primary', opacity: 0.8, fontSize: '2rem' }} />
      </Box>

      {/* Meio: Detalhes Técnicos */}
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontFamily: 'Poppins' }}>
          Última Manutenção: <b>12/03/2026</b>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontFamily: 'Poppins' }}>
          Localização: <b>Gaveta 04 / B</b>
        </Typography>
      </Box>

      {/* Rodapé: Indicador de Status Estilizado */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
        <Box 
          sx={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            bgcolor: currentStatus,
            boxShadow: `0 0 12px ${currentStatus}80`, // Brilho suave na cor do status
            border: '2px solid',
            borderColor: 'background.paper'
          }} 
        />
      </Box>
    </Paper>
  );
};

const DashboardInicio = () => {
  const totalCards = Array.from({ length: 12 }); // Exemplo com 12 ferramentas

  return (
    <Box sx={{ width: '100%', pb: 5 }}> 
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          fontFamily: 'Poppins, sans-serif', 
          fontWeight: 600,
          color: 'text.primary',
          fontSize: '1.75rem'
        }}
      >
        Dashboard Geral
      </Typography>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: 3, 
        width: '100%'
      }}> 
        {totalCards.map((_, index) => (
          <ToolCardDashboard key={index} index={index} />
        ))}
      </Box>
    </Box>
  );
};

export default DashboardInicio;