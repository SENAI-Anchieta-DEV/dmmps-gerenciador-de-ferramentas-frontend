import React from 'react';
import { Box, Typography, Paper, Button, Avatar, useTheme } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import QrCode2Icon from '@mui/icons-material/QrCode2';

const ToolCardEmUso = ({ ferramenta }) => {
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
        gap: 2,
        height: '210px', // Mesma altura do Dashboard para manter simetria
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-5px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 12px 30px rgba(0,0,0,0.6)' 
            : '0 12px 30px rgba(0,0,0,0.08)',
          borderColor: 'primary.main'
        }
      }}
    >
      {/* Topo: Ícone Redondo + Info + QR Code */}
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
            {ferramenta.nome}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary', fontSize: '0.75rem' }}
          >
            {ferramenta.id}
          </Typography>
        </Box>

        <QrCode2Icon sx={{ color: 'text.primary', opacity: 0.8, fontSize: '2.2rem' }} />
      </Box>

      {/* Meio: Detalhes de Retirada */}
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontFamily: 'Poppins' }}>
          Horário de Retirada: <b>{ferramenta.horario}</b>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontFamily: 'Poppins' }}>
          Origem: <b>{ferramenta.origem}</b>
        </Typography>
      </Box>

      {/* Rodapé: Botão Detalhes + LED de Status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
        <Button 
          variant="outlined" 
          size="small"
          sx={{ 
            borderRadius: '20px', 
            textTransform: 'none', 
            fontSize: '0.75rem',
            borderColor: 'divider',
            color: 'text.primary',
            fontFamily: 'Poppins',
            px: 2,
            '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' }
          }}
        >
          Ver mais detalhes
        </Button>
        
        {/* LED Verde com Glow */}
        <Box 
          sx={{ 
            width: 22, 
            height: 22, 
            borderRadius: '50%', 
            bgcolor: '#85FF80',
            boxShadow: '0 0 12px rgba(133, 255, 128, 0.6)',
            border: '2px solid',
            borderColor: 'background.paper'
          }} 
        />
      </Box>
    </Paper>
  );
};

const EmUso = () => {
  const ferramentasEmUso = [
    { nome: 'Parafusadeira Bosch', id: '#ID-1106', horario: '08h30', origem: 'Gaveta: 07 / A' },
    { nome: 'Chave de Impacto', id: '#ID-3215', horario: '09h45', origem: 'Gaveta: 05 / C' },
    { nome: 'Multímetro Digital', id: '#ID-2343', horario: '12h15', origem: 'Gaveta: 04 / B' },
    { nome: 'Furadeira Ind.', id: '#ID-4568', horario: '09h45', origem: 'Gaveta: 12 / D' },
    { nome: 'Esmerilhadeira Ang.', id: '#ID-5590', horario: '10h00', origem: 'Gaveta: 01 / E' },
    { nome: 'Alicate Amperímetro', id: '#ID-2210', horario: '10h15', origem: 'Gaveta: 08 / B' },
    { nome: 'Nível a Laser', id: '#ID-8842', horario: '10h30', origem: 'Gaveta: 03 / A' },
    { nome: 'Serra Tico-Tico', id: '#ID-3341', horario: '11h00', origem: 'Gaveta: 10 / C' },
    { nome: 'Martelete Perf.', id: '#ID-9920', horario: '11h20', origem: 'Gaveta: 02 / D' },
    { nome: 'Torquímetro Digital', id: '#ID-4455', horario: '11h45', origem: 'Gaveta: 06 / B' },
    { nome: 'Scanner Térmico', id: '#ID-7712', horario: '13h10', origem: 'Gaveta: 14 / A' },
    { nome: 'Soprador Térmico', id: '#ID-6630', horario: '13h40', origem: 'Gaveta: 09 / E' },
    { nome: 'Chave Inglesa 12"', id: '#ID-1122', horario: '14h05', origem: 'Gaveta: 11 / C' },
    { nome: 'Micrômetro Externo', id: '#ID-5544', horario: '14h30', origem: 'Gaveta: 04 / D' },
    { nome: 'Paquímetro Digital', id: '#ID-8877', horario: '15h00', origem: 'Gaveta: 07 / B' },
    { nome: 'Lanterna Industrial', id: '#ID-2233', horario: '15h20', origem: 'Gaveta: 15 / A' },
];

  return (
    <Box sx={{ width: '100%', pb: 5 }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', 
        gap: 3 
      }}>
        {ferramentasEmUso.map((f, i) => (
          <ToolCardEmUso key={i} ferramenta={f} />
        ))}
      </Box>
    </Box>
  );
};

export default EmUso;