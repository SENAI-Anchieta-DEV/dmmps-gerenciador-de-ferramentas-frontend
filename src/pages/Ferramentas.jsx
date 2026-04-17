import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Avatar, useTheme, CircularProgress, Alert } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import QrCode2Icon from '@mui/icons-material/QrCode2';

import API_BASE_URL from '../apiConfig';

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
        height: '160px',
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-5px)',
          boxShadow: theme.palette.mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.08)',
          borderColor: 'primary.main'
        }
      }}
    >
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
            {ferramenta.codigoPatrimonio}
          </Typography>
        </Box>

        <QrCode2Icon sx={{ color: 'text.primary', opacity: 0.8, fontSize: '2rem' }} />
      </Box>

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
  const [ferramentas, setFerramentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchFerramentas = async () => {
      const token = localStorage.getItem('token');
      
      const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s para Cold Start do Render

try {
  const response = await fetch(`${API_BASE_URL}/ferramentas`, {
    method: 'GET',
    headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json' 
    },
    signal: controller.signal
  });
  
  clearTimeout(timeoutId);

  if (response.ok) {
    const data = await response.json();
    setFerramentas(data);
  } else {
    setErro(`Erro ${response.status}: Falha ao buscar dados.`);
  }
} catch (err) {
  if (err.name === 'AbortError') {
    setErro('O servidor demorou muito para responder. Tente recarregar.');
  } else {
    setErro('Não foi possível conectar ao servidor.');
  }
} finally {
  setLoading(false); // ISSO GARANTE QUE O SPINNER PARE
}
    };

    fetchFerramentas();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', pb: 5 }}>
      {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
        gap: 3 
      }}>
        {ferramentas.map((f) => (
          <ToolCardLista key={f.id} ferramenta={f} />
        ))}
      </Box>

      {ferramentas.length === 0 && !erro && (
        <Typography variant="body1" sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
          Nenhuma ferramenta encontrada no sistema.
        </Typography>
      )}
    </Box>
  );
};

export default Ferramentas;