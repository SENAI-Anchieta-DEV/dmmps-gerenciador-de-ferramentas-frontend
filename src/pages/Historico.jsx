import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Box, Typography, Paper, TextField, InputAdornment, 
  IconButton, Chip, Avatar, useTheme, CircularProgress, Stack, Alert, useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BuildIcon from '@mui/icons-material/Build';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Brightness4Icon from '@mui/icons-material/Brightness4'; 
import Brightness7Icon from '@mui/icons-material/Brightness7'; 

import API_BASE_URL from '../apiConfig';

// Dados de simulação caso a API local não responda de primeira
const DADOS_MOCK_HISTORICO = [
  { id: 'h-1', nomeFerramenta: 'Parafusadeira Bosch', codigoPatrimonio: '#ID-1106', dataRetirada: '2026-05-18T08:30:00', dataDevolucao: '2026-05-18T17:00:00', estadoConservacao: 'BOM_ESTADO', statusEmprestimo: 'FINALIZADO' },
  { id: 'h-2', nomeFerramenta: 'Chave de Impacto Makita', codigoPatrimonio: '#ID-3215', dataRetirada: '2026-05-19T09:45:00', dataDevolucao: '2026-05-19T11:20:00', estadoConservacao: 'DANIFICADA', statusEmprestimo: 'FINALIZADO' },
  { id: 'h-3', nomeFerramenta: 'Multímetro Digital Fluke', codigoPatrimonio: '#ID-2343', dataRetirada: '2026-05-20T12:15:00', dataDevolucao: null, estadoConservacao: null, statusEmprestimo: 'ABERTO' },
];

const HistoricoItem = ({ registro }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  // Formatação amigável das datas e horas
  const formatarDataHora = (isoString) => {
    if (!isoString) return 'Pendente';
    const data = new Date(isoString);
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
  };

  const isAberto = registro.statusEmprestimo === 'ABERTO' || !registro.dataDevolucao;
  const foiDanificada = registro.estadoConservacao === 'DANIFICADA';

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2.5, borderRadius: '20px', border: '1px solid', 
        borderColor: isAberto ? '#FFB347' : (foiDanificada ? '#FF4747' : 'divider'),
        bgcolor: 'background.paper', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, gap: 3,
        transition: 'transform 0.2s ease',
        '&:hover': { transform: 'translateX(5px)' }
      }}
    >
      {/* Ícone de Fluxo Operacional */}
      <Avatar sx={{ bgcolor: isAberto ? 'rgba(255, 179, 71, 0.1)' : (foiDanificada ? 'rgba(255, 71, 71, 0.1)' : 'rgba(133, 255, 128, 0.1)'), color: isAberto ? '#FFB347' : (foiDanificada ? '#FF4747' : '#85FF80'), width: 48, height: 48, flexShrink: 0 }}>
        {isAberto ? <BuildIcon /> : <CheckCircleOutlineIcon />}
      </Avatar>

      {/* Info do Ativo */}
      <Box sx={{ flex: 1.5, minWidth: 0, width: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Poppins', color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {registro.nomeFerramenta}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', color: 'text.secondary', fontSize: '0.75rem', mt: 0.5, fontWeight: 600 }}>
          {registro.codigoPatrimonio}
        </Typography>
      </Box>

      {/* Linha do Tempo (Retirada e Devolução) */}
      <Box sx={{ flex: 2.5, display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArrowUpwardIcon sx={{ color: '#85FF80', fontSize: '1rem', flexShrink: 0 }} />
          <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: 'text.secondary', fontSize: '0.82rem' }}>
            Retirada: <b style={{ color: isLight ? '#14213D' : '#f5f5f5' }}>{formatarDataHora(registro.dataRetirada)}</b>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArrowDownwardIcon sx={{ color: isAberto ? 'text.disabled' : (foiDanificada ? '#FF4747' : '#00f2ff'), fontSize: '1rem', flexShrink: 0 }} />
          <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: 'text.secondary', fontSize: '0.82rem' }}>
            Retorno: <b style={{ color: isAberto ? theme.palette.text.disabled : (isLight ? '#14213D' : '#f5f5f5') }}>{formatarDataHora(registro.dataDevolucao)}</b>
          </Typography>
        </Box>
      </Box>

      {/* Chips de Status Final */}
      <Box sx={{ textAlign: { xs: 'left', md: 'right' }, flexShrink: 0, pl: { xs: 0, md: 2 }, width: { xs: '100%', md: 'auto' }, pt: { xs: 1, md: 0 }, borderTop: { xs: '1px dashed', md: 'none' }, borderColor: 'divider' }}>
        {isAberto ? (
          <Chip label="Em Uso Ativo" size="small" sx={{ fontWeight: 800, fontFamily: 'Poppins', fontSize: '0.65rem', color: '#FFB347', border: '1.5px solid #FFB347', bgcolor: 'transparent' }} />
        ) : (
          <Chip 
            label={foiDanificada ? "Devolvido com Avaria" : "Retornado com Sucesso"} 
            size="small" 
            sx={{ 
              fontWeight: 800, fontFamily: 'Poppins', fontSize: '0.65rem', 
              color: foiDanificada ? '#FF4747' : '#85FF80', 
              border: `1.5px solid ${foiDanificada ? '#FF4747' : '#85FF80'}`, 
              bgcolor: 'transparent' 
            }} 
          />
        )}
      </Box>
    </Paper>
  );
};

const Historico = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { toggleColorMode, searchTerm } = useOutletContext(); 

  const [loading, setLoading] = useState(true);
  const [historicoList, setHistoricoList] = useState([]);
  const [buscaInterna, setBuscaInterna] = useState('');
  const [isSandbox, setIsSandbox] = useState(false);

  const carregarHistorico = async () => {
    try {
      const url = `${API_BASE_URL}/emprestimos/meus`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHistoricoList(data);
        setIsSandbox(false);
      } else {
        setHistoricoList(DADOS_MOCK_HISTORICO);
        setIsSandbox(true);
      }
    } catch (err) {
      setHistoricoList(DADOS_MOCK_HISTORICO);
      setIsSandbox(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarHistorico(); }, []);

  const historicoFiltrado = historicoList.filter(reg => {
    const termo = (buscaInterna || searchTerm || '').toLowerCase();
    const nome = (reg.nomeFerramenta || '').toLowerCase();
    const cod = (reg.codigoPatrimonio || '').toLowerCase();
    return nome.includes(termo) || cod.includes(termo);
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress sx={{ color: isLight ? 'primary.main' : '#00f2ff' }} /></Box>;

  return (
    /* 🌟 FIX DE RESPONSIVIDADE E ESPAÇAMENTO LATERAL: Ajustado pt e px para blindar contra colisões laterais e alinhar perfeitamente */
    <Box sx={{ 
      width: '100%', 
      maxWidth: '1200px', 
      mx: 'auto', 
      position: 'relative', 
      pt: { xs: 4, sm: 6, md: 8 }, 
      pb: 5,
      px: { xs: 2.5, sm: 4, md: 5 },
      boxSizing: 'border-box'
    }}>
      
      {/* Botão de Tema no canto superior direito (Escondido no mobile para sumir com duplicidades) */}
      {!isMobile && (
        <Box sx={{ position: 'absolute', top: { xs: 24, md: 40 }, right: 0, zIndex: 10 }}>
          <IconButton 
            onClick={toggleColorMode} 
            sx={{ 
              color: 'text.primary', 
              bgcolor: 'action.hover', 
              '&:hover': { bgcolor: 'action.selected' } 
            }}
          >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      )}

      {/* Título Histórico */}
      <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', display: 'flex', alignItems: 'center', gap: 1.5, fontSize: { xs: '1.6rem', sm: '2.125rem' } }}>
        <HistoryIcon sx={{ fontSize: { xs: '2.2rem', sm: '2.5rem' } }} /> Histórico de Movimentação
      </Typography>

      {/* Barra de Busca */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, width: '100%' }}>
        <TextField 
          fullWidth 
          placeholder="Filtrar por nome do ativo ou patrimônio..." 
          size="small" 
          value={buscaInterna} 
          onChange={(e) => setBuscaInterna(e.target.value)} 
          InputProps={{ 
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: isLight ? 'primary.main' : '#00f2ff', fontSize: '1.2rem' }} /></InputAdornment>, 
            sx: { borderRadius: '14px', bgcolor: 'background.paper', fontFamily: 'Poppins', fontSize: '0.88rem', '& fieldset': { borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)' } } 
          }} 
        />
        <IconButton sx={{ border: '1px solid', borderColor: isLight ? 'primary.main' : '#00f2ff', borderRadius: '14px', p: 1.2, bgcolor: 'background.paper', color: isLight ? 'primary.main' : '#00f2ff', flexShrink: 0 }}><FilterListIcon fontSize="small" /></IconButton>
      </Box>

      {isSandbox && (
        <Alert severity="info" sx={{ mb: 4, borderRadius: '14px', fontFamily: 'Poppins', fontWeight: 600 }}>
          <strong>Modo Sandbox:</strong> Exibindo simulação de movimentações locais.
        </Alert>
      )}

      {historicoFiltrado.length === 0 ? (/*545646*/
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', width: '100%' }}>
          <Typography variant="body1" sx={{ fontFamily: 'Poppins', color: 'text.secondary', fontWeight: 500 }}>
            Nenhum registro de empréstimo ou devolução localizado.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2.5} sx={{ width: '100%' }}>
          {historicoFiltrado.map((item, index) => (
            <HistoricoItem key={item.id || index} registro={item} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Historico;