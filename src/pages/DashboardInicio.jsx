import React from 'react';
import { Box, Typography, Grid, Paper, Avatar, useTheme, Stack, Divider, IconButton, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import HandymanIcon from '@mui/icons-material/Handyman';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Componente para os Cards de Métricas (KPIs Confortáveis)
const CardMetrica = ({ titulo, valor, icone, corStatus, progressoSimulado }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3, // CORREÇÃO: Voltou para o tamanho confortável anterior para não forçar a vista
        borderRadius: '20px',
        border: '1px solid',
        borderColor: isLight ? 'divider' : 'rgba(255, 255, 255, 0.05)',
        bgcolor: isLight ? '#ffffff' : 'rgba(20, 33, 61, 0.7)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: isLight 
            ? '0 10px 25px rgba(20, 33, 61, 0.06)' 
            : `0 0 25px ${corStatus === '#14213D' ? 'rgba(0, 242, 255, 0.25)' : corStatus + '40'}`,
          borderColor: corStatus === '#14213D' ? '#00f2ff' : corStatus,
          cursor: 'pointer'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Stack spacing={0.5}>
          <Typography variant="caption" sx={{ fontFamily: 'Poppins', fontWeight: 600, color: isLight ? 'rgba(20, 33, 61, 0.6)' : 'rgba(245, 245, 245, 0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {titulo}
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', letterSpacing: '-0.5px' }}>
            {valor}
          </Typography>
        </Stack>
        
        <Avatar 
          sx={{ 
            bgcolor: `${corStatus}15`, 
            color: corStatus, 
            width: 52, // CORREÇÃO: Tamanho confortável restaurado
            height: 52,
            border: `1px solid ${corStatus}30`,
            boxShadow: isLight ? 'none' : `0 0 10px ${corStatus}20`
          }}
        >
          {icone}
        </Avatar>
      </Box>

      <Box sx={{ width: '100%', mt: 'auto', pt: 0.5 }}>
        <LinearProgress 
          variant="determinate" 
          value={progressoSimulado} 
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
            '& .MuiLinearProgress-bar': {
              bgcolor: corStatus === '#14213D' && !isLight ? '#00f2ff' : corStatus,
              borderRadius: 2
            }
          }}
        />
      </Box>
    </Paper>
  );
};

// Componente para Alertas/Atividades Recentes
const ItemAtividade = ({ id, ferramenta, info, statusCor, statusTexto }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        py: 1.8, // CORREÇÃO: Altura original e confortável mantida
        px: 1,
        borderRadius: '10px',
        transition: 'background-color 0.2s ease',
        '&:hover': { bgcolor: isLight ? 'rgba(20, 33, 61, 0.02)' : 'rgba(255, 255, 255, 0.02)' }
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontFamily: 'Poppins', color: isLight ? '#14213D' : '#f5f5f5' }}>
          {ferramenta}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono', color: isLight ? 'rgba(20,33,61,0.5)' : 'rgba(245,245,245,0.4)', fontWeight: 500 }}>
            {id}
          </Typography>
          <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'divider' }} />
          <Typography variant="caption" sx={{ fontFamily: 'Poppins', color: 'text.secondary', fontWeight: 500 }}>
            {info}
          </Typography>
        </Box>
      </Stack>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusCor, boxShadow: `0 0 10px ${statusCor}, 0 0 4px ${statusCor}` }} />
        <Typography variant="caption" sx={{ fontFamily: 'Poppins', fontWeight: 600, color: statusCor, letterSpacing: '0.3px' }}>
          {statusTexto}
        </Typography>
      </Box>
    </Box>
  );
};

const DashboardInicio = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isLight = theme.palette.mode === 'light';
  const corTextoPrincipal = isLight ? '#14213D' : '#f5f5f5';

  return (
    <Box sx={{ width: '100%', pb: 2 }}> 
      
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3, // Distanciamento equilibrado
          fontFamily: 'Poppins, sans-serif', 
          fontWeight: 800,
          color: corTextoPrincipal,
          fontSize: { xs: '1.5rem', sm: '1.75rem' },
          letterSpacing: '-0.5px'
        }}
      >
        Dashboard Geral
      </Typography>

      {/* SEÇÃO 1: CARDS DE MÉTRICAS */}
      <Grid container spacing={3} sx={{ mb: 4 }}> 
        <Grid item xs={12} sm={6} lg={3}>
          <CardMetrica titulo="Total do Estoque" valor="148" icone={<ConstructionIcon />} corStatus={isLight ? '#14213D' : '#00f2ff'} progressoSimulado={100} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <CardMetrica titulo="Ferramentas Em Uso" valor="32" icone={<HandymanIcon />} corStatus="#85FF80" progressoSimulado={22} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <CardMetrica titulo="Em Manutenção" valor="05" icone={<WarningAmberIcon />} corStatus="#FFB347" progressoSimulado={8} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <CardMetrica titulo="Devoluções Atrasadas" valor="03" icone={<AccessTimeIcon />} corStatus="#FF6961" progressoSimulado={4} />
        </Grid>
      </Grid>

      {/* SEÇÃO 2: MATRIZ ANALÍTICA 50/50 FIXA EM FLEXBOX */}
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        alignItems: 'stretch', 
        width: '100%',
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        
        {/* Painel Esquerdo: Últimas Movimentações */}
        <Paper 
          elevation={0} 
          sx={{ 
            flex: 1, 
            p: 3, 
            borderRadius: '20px', 
            border: '1px solid', 
            borderColor: isLight ? 'divider' : 'rgba(255, 255, 255, 0.05)',
            bgcolor: isLight ? '#ffffff' : 'rgba(20, 33, 61, 0.7)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            '&:hover': { 
              borderColor: 'rgba(133, 255, 128, 0.3)',
              boxShadow: isLight ? 'none' : '0 0 20px rgba(133, 255, 128, 0.05)'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: corTextoPrincipal }}>
              Últimas Movimentações
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => navigate('/dashboard/em-uso')} 
              sx={{ color: corTextoPrincipal, '&:hover': { bgcolor: 'action.hover' } }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: isLight ? 'divider' : 'rgba(255,255,255,0.05)' }} />
          <Stack spacing={0.5} sx={{ mt: 1, flexGrow: 1, justifyContent: 'center' }}>
            <ItemAtividade id="#ID-1024" ferramenta="Parafusadeira Makita" info="Retirado por Ricardo Santos" statusCor="#85FF80" statusTexto="Em Uso" />
            <Divider sx={{ borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.02)' }} />
            <ItemAtividade id="#ID-1088" ferramenta="Multímetro Digital Fluke" info="Devolvido por Ana Oliveira" statusCor="#b0bec5" statusTexto="No Estoque" />
            <Divider sx={{ borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.02)' }} />
            <ItemAtividade id="#ID-1102" ferramenta="Serra Tico-Tico Dewalt" info="Retirado por Carlos Lima" statusCor="#85FF80" statusTexto="Em Uso" />
          </Stack>
        </Paper>

        {/* Painel Direito: Alertas Urgentes */}
        <Paper 
          elevation={0} 
          sx={{ 
            flex: 1, 
            p: 3, 
            borderRadius: '20px', 
            border: '1px solid', 
            borderColor: isLight ? 'divider' : 'rgba(255, 255, 255, 0.05)',
            bgcolor: isLight ? '#ffffff' : 'rgba(20, 33, 61, 0.7)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            '&:hover': { 
              borderColor: 'rgba(255, 105, 97, 0.3)',
              boxShadow: isLight ? 'none' : '0 0 20px rgba(255, 105, 97, 0.05)'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: corTextoPrincipal }}>
              Alertas Urgentes
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => navigate('/dashboard/ocorrencias')} 
              sx={{ color: corTextoPrincipal, '&:hover': { bgcolor: 'action.hover' } }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: isLight ? 'divider' : 'rgba(255,255,255,0.05)' }} />
          <Stack spacing={0.5} sx={{ mt: 1, flexGrow: 1, justifyContent: 'center' }}>
            <ItemAtividade id="#ID-8823" ferramenta="Serra Tico-Tico Dewalt" info="Superaquecimento do Motor" statusCor="#FF6961" statusTexto="Crítico" />
            <Divider sx={{ borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.02)' }} />
            <ItemAtividade id="#ID-8821" ferramenta="Martelo Perfurador Bosch" info="Mau contato no cabo de força" statusCor="#FFB347" statusTexto="Atenção" />
            <Divider sx={{ borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.02)' }} />
            <ItemAtividade id="#ID-8824" ferramenta="Multímetro Digital Fluke" info="Falha de iluminação no LCD" statusCor="#FF6961" statusTexto="Crítico" />
          </Stack>
        </Paper>

      </Box>
    </Box>
  );
};

export default DashboardInicio;