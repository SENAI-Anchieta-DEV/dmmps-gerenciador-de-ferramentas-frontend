import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, useTheme, CircularProgress, Alert } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import QrCode2Icon from '@mui/icons-material/QrCode2';

import API_BASE_URL from '../apiConfig';

const getStatusColor = (status) => {
  switch (status) {
    case 'DISPONIVEL': return '#85FF80';
    case 'EM_USO': return '#FFB347';
    case 'EM_MANUTENCAO': return '#FF6961';
    case 'DESCARTADA': return '#9e9e9e';
    default: return '#9e9e9e';
  }
};

const ToolCardDashboard = ({ ferramenta }) => {
  const theme = useTheme();
  const currentStatusColor = getStatusColor(ferramenta.status);

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
          boxShadow: theme.palette.mode === 'dark' ? '0 12px 30px rgba(0,0,0,0.6)' : '0 12px 30px rgba(0,0,0,0.08)',
          borderColor: 'primary.main'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Avatar sx={{ bgcolor: 'action.hover', color: 'text.primary', border: '1px solid', borderColor: 'divider' }}>
          <ConstructionIcon />
        </Avatar>
        <QrCode2Icon sx={{ color: 'text.primary', opacity: 0.5 }} />
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>
          {ferramenta.nome}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          {ferramenta.codigoPatrimonio}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontFamily: 'Poppins' }}>
          Localização: <b>{ferramenta.localizacao || 'Não definida'}</b>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
        <Box 
          sx={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            bgcolor: currentStatusColor,
            boxShadow: `0 0 12px ${currentStatusColor}80`,
            border: '2px solid',
            borderColor: 'background.paper'
          }} 
        />
      </Box>
    </Paper>
  );
};

const DashboardInicio = () => {
  const [ferramentas, setFerramentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchDados = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      try {
        const response = await fetch(`${API_BASE_URL}/ferramentas`, {
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
          setErro(`Erro ${response.status}: Falha ao carregar dashboard.`);
        }
      } catch (err) {
        setErro(err.name === 'AbortError' ? 'Tempo de resposta excedido.' : 'Erro de conexão.');
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', pb: 5 }}>
      <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Poppins', fontWeight: 600 }}>
        Dashboard Geral
      </Typography>

      {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: 4 
      }}>
        {ferramentas.map((f) => (
          <ToolCardDashboard key={f.id} ferramenta={f} />
        ))}
      </Box>

      {ferramentas.length === 0 && !erro && (
        <Typography variant="body1" textAlign="center" sx={{ mt: 5, color: 'text.secondary' }}>
          Nenhum dado disponível para exibição.
        </Typography>
      )}
    </Box>
  );
};

export default DashboardInicio;