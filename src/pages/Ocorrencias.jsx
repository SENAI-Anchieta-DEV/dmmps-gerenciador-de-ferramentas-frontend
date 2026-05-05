import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Button, TextField, InputAdornment, 
  IconButton, Chip, Avatar, useTheme, CircularProgress, Stack, Badge 
} from '@mui/material';
import { useOutletContext } from 'react-router-dom'; // Importado para o controle de tema
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import API_BASE_URL from '../apiConfig';

const mockOcorrencias = [
  { id: '#ID-8821', data: '22/04/2026', ferramentaNome: 'Martelo Perfurador Bosch', usuarioNome: 'João Silva', descricao: 'Cabo com mau contato intermitente durante o uso.', gravidade: 'Média' },
  { id: '#ID-8822', data: '20/04/2026', ferramentaNome: 'Chave de Fenda Kit 12pçs', usuarioNome: 'Maria Souza', descricao: 'Ponta da chave Philips 1/4 desgastada.', gravidade: 'Baixa' },
  { id: '#ID-8823', data: '18/04/2026', ferramentaNome: 'Serra Tico-Tico Dewalt', usuarioNome: 'Carlos Lima', descricao: 'Motor apresentando superaquecimento após 10 min.', gravidade: 'Alta' },
  { id: '#ID-8824', data: '15/04/2026', ferramentaNome: 'Multímetro Digital Fluke', usuarioNome: 'Ana Oliveira', descricao: 'Display LCD com falha na retroiluminação.', gravidade: 'Alta' },
  { id: '#ID-8825', data: '12/04/2026', ferramentaNome: 'Parafusadeira Makita', usuarioNome: 'Ricardo Santos', descricao: 'Mandril travando ao tentar trocar a broca.', gravidade: 'Média' },
];

const OcorrenciaCard = ({ item }) => {
  const theme = useTheme();
  const getStatusStyle = (gravidade) => {
    const styles = {
      'Alta': { color: '#FF6961', label: 'Alta' },
      'Média': { color: '#FFB347', label: 'Média' },
      'Baixa': { color: '#85FF80', label: 'Baixa' }
    };
    return styles[gravidade] || { color: '#9e9e9e', label: gravidade };
  };

  const status = getStatusStyle(item.gravidade);

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
        alignItems: 'center',
        gap: { xs: 2, md: 4 },
        transition: '0.3s ease',
        '&:hover': { 
          borderColor: 'primary.main', 
          transform: 'translateX(8px)',
          boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.05)'
        }
      }}
    >
      <Avatar sx={{ bgcolor: `${status.color}15`, color: status.color, width: 52, height: 52 }}>
        <WarningAmberIcon sx={{ fontSize: '1.8rem' }} />
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Poppins', lineHeight: 1.2 }}>
          {item.descricao}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary', mt: 0.5 }}>
          {item.id}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: { xs: 'none', lg: 'block' } }}>
        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>
          {item.ferramentaNome}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          Relatado por: {item.usuarioNome}
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontFamily: 'Poppins' }}>
          {item.data}
        </Typography>
        <Chip 
          label={status.label} 
          size="small"
          sx={{ 
            fontWeight: 800, 
            fontSize: '0.65rem',
            color: status.color, 
            border: `1.5px solid ${status.color}`,
            bgcolor: 'transparent',
            height: '22px',
            px: 1
          }} 
        />
      </Box>
    </Paper>
  );
};

const Ocorrencias = () => {
  const theme = useTheme();
  const toggleColorMode = useOutletContext(); // Contexto para mudar o tema
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificacoes] = useState(3);

  useEffect(() => {
    const fetchOcorrencias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/ocorrencias`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setOcorrencias(data.length > 0 ? data : mockOcorrencias);
        } else {
          setOcorrencias(mockOcorrencias);
        }
      } catch (err) {
        setOcorrencias(mockOcorrencias);
      } finally {
        setLoading(false);
      }
    };
    fetchOcorrencias();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh', 
      bgcolor: 'background.default', 
      position: 'relative',
      pt: 8, // Espaço para não ficar colado no topo
      px: { xs: 3, md: 6 },
      pb: 5
    }}>
      
      {/* Ícones de Cabeçalho (Tema e Notificações) */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Badge badgeContent={notificacoes} color="error" overlap="circular">
          <IconButton color="inherit">
            <NotificationsIcon sx={{ fontSize: '1.6rem', color: 'text.primary' }} />
          </IconButton>
        </Badge>
        <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary' }}>
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      {/* Título e Botão Registrar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '1.8rem' }}>
          Ocorrências
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          sx={{ 
            borderRadius: '12px', 
            textTransform: 'none', 
            fontWeight: 700, 
            px: 3, 
            py: 1,
            bgcolor: 'text.primary',
            color: 'background.default',
            '&:hover': {
              bgcolor: 'text.secondary',
            }
          }}
        >
          Registrar Ocorrência
        </Button>
      </Box>

      {/* Barra de Pesquisa Local */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField 
          fullWidth 
          placeholder="Buscar por ID, ferramenta ou descrição..." 
          size="small"
          InputProps={{ 
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            sx: { 
              borderRadius: '12px', 
              bgcolor: theme.palette.mode === 'light' ? '#E0E0E0' : '#333333',
              fontFamily: 'Poppins',
              '& fieldset': { border: 'none' } 
            }
          }}
        />
        <IconButton sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px', p: 1 }}>
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Lista de Cards */}
      <Stack spacing={2.5}>
        {ocorrencias.map((item, index) => (
          <OcorrenciaCard key={item.id || index} item={item} />
        ))}
      </Stack>
    </Box>
  );
};

export default Ocorrencias;