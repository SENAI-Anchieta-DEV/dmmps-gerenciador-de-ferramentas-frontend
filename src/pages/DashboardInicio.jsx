import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Avatar, useTheme, Stack, Divider, IconButton, LinearProgress, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import HandymanIcon from '@mui/icons-material/Handyman';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import API_BASE_URL from '../apiConfig';

// Componente para os Cards de Métricas (KPIs Confortáveis)
const CardMetrica = ({ titulo, valor, icone, corStatus, progressoSimulado }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3 }, 
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1 }}>
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ fontFamily: 'Poppins', fontWeight: 600, color: isLight ? 'rgba(20, 33, 61, 0.6)' : 'rgba(245, 245, 245, 0.5)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {titulo}
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', letterSpacing: '-0.5px', fontSize: { xs: '1.8rem', sm: '2.125rem' } }}>
            {valor}
          </Typography>
        </Stack>
        
        <Avatar 
          sx={{ 
            bgcolor: `${corStatus}15`, 
            color: corStatus, 
            width: { xs: 46, sm: 52 }, 
            height: { xs: 46, sm: 52 },
            border: `1px solid ${corStatus}30`,
            boxShadow: isLight ? 'none' : `0 0 10px ${corStatus}20`,
            flexShrink: 0
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
        py: 1.8,
        px: 1,
        borderRadius: '10px',
        gap: 2, 
        transition: 'background-color 0.2s ease',
        '&:hover': { bgcolor: isLight ? 'rgba(20, 33, 61, 0.02)' : 'rgba(255, 255, 255, 0.02)' }
      }}
    >
      <Stack spacing={0.5} sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 700, 
            fontFamily: 'Poppins', 
            color: isLight ? '#14213D' : '#f5f5f5',
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}
        >
          {ferramenta}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono', color: isLight ? 'rgba(20,33,61,0.5)' : 'rgba(245,245,245,0.4)', fontWeight: 500, flexShrink: 0 }}>
            {id}
          </Typography>
          <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'divider', flexShrink: 0 }} />
          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: 'Poppins', 
              color: 'text.secondary', 
              fontWeight: 500,
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}
          >
            {info}
          </Typography>
        </Box>
      </Stack>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
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

  const [loading, setLoading] = useState(true);
  const [isSandbox, setIsSandbox] = useState(false);
  const [metrics, setMetrics] = useState({ total: 0, disponiveis: 0, emUso: 0 });
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [alertas, setAlertas] = useState([]);

  const carregarDadosDashboard = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const perfilUsuario = localStorage.getItem('perfil') || '';
    const isAdminOuAlmoxarife = perfilUsuario === 'ADMIN' || perfilUsuario === 'ALMOXARIFE';

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      const resTools = await fetch(`${API_BASE_URL}/ferramentas`, { method: 'GET', headers });
      const ferramentasLista = resTools.ok ? await resTools.json() : [];

      const urlMovimentacao = isAdminOuAlmoxarife ? `${API_BASE_URL}/emprestimos` : `${API_BASE_URL}/emprestimos/meus`;
      const resMov = await fetch(urlMovimentacao, { method: 'GET', headers });
      const movLista = resMov.ok ? await resMov.json() : [];

      const urlOcorrencias = isAdminOuAlmoxarife ? `${API_BASE_URL}/ocorrencias` : `${API_BASE_URL}/ocorrencias/minhas`;
      const resOco = await fetch(urlOcorrencias, { method: 'GET', headers });
      const ocoLista = resOco.ok ? await resOco.json() : [];

      if (resTools.ok) {
        const total = ferramentasLista.length;
        const disponiveis = ferramentasLista.filter(f => (f.status || '').toUpperCase() === 'DISPONIVEL').length;
        const emUso = ferramentasLista.filter(f => (f.status || '').toUpperCase() === 'EM_USO').length;

        setMetrics({ total, disponiveis, emUso });

        const mapaFerramentas = {};
        ferramentasLista.forEach(f => { mapaFerramentas[f.id] = f; });

        const movVinculadas = movLista.map(m => {
          const fId = m.ferramentaId || m.ferramenta?.id;
          return {
            ...m,
            statusAtualEstoque: fId && mapaFerramentas[fId] ? mapaFerramentas[fId].status : null
          };
        });
        setMovimentacoes(movVinculadas);
        
        const ativas = ocoLista.filter(o => {
          const st = (o.statusOcorrencia || '').toUpperCase();
          const fId = o.ferramenta?.id || o.ferramentaId;
          const ferramentaEstoque = fId ? mapaFerramentas[fId] : null;
          const statusFerramenta = (ferramentaEstoque?.status || '').toUpperCase();

          return st !== 'RESOLVIDA' && 
                 st !== 'FECHADA' && 
                 st !== '' && 
                 statusFerramenta !== 'DESCARTADA' && 
                 statusFerramenta !== 'INDISPONIVEL';
        });

        const alertasTratados = ativas.map(o => { 
          const fId = o.ferramenta?.id || o.ferramentaId;
          const ferramentaEstoque = fId && mapaFerramentas[fId] ? mapaFerramentas[fId] : null;
          const patrimonioValidado = o.codigoPatrimonio || 
                                     o.ferramenta?.codigoPatrimonio || 
                                     (ferramentaEstoque ? ferramentaEstoque.codigoPatrimonio : 'N/A');

          return {
            ...o,
            patrimonioExibicao: patrimonioValidado
          };
        });

        setAlertas(alertasTratados);
        setIsSandbox(false);
      } else {
        executarFallbackMock();
      }
    } catch (err) {
      console.error(err);
      executarFallbackMock();
    } finally {
      setLoading(false);
    }
  };

  const executarFallbackMock = () => {
    setMetrics({ total: 148, disponiveis: 32, emUso: 5 });
    setMovimentacoes([
      { id: '1', dataDevolucao: null, codigoPatrimonio: '1234', nomeFerramenta: 'Parafusadeira Makita', nomeUsuario: 'Ricardo Santos', estadoConservacao: 'BOM_ESTADO', statusAtualEstoque: 'EM_USO' },
      { id: '2', dataDevolucao: '2026-05-18', codigoPatrimonio: '1235', nomeFerramenta: 'Multímetro Fluke', nomeUsuario: 'Ana Oliveira', estadoConservacao: 'DANIFICADA', statusAtualEstoque: 'DISPONIVEL' }
    ]);
    setAlertas([{ id: '1', patrimonioExibicao: '1236', nomeFerramenta: 'Serra Dewalt', titulo: 'Superaquecimento', estadoConservacao: 'DANIFICADA' }]);
    setIsSandbox(true);
  };

  useEffect(() => { carregarDadosDashboard(); }, []);

  const pctDisponivel = metrics.total > 0 ? Math.round((metrics.disponiveis / metrics.total) * 100) : 0;
  const pctEmUso = metrics.total > 0 ? Math.round((metrics.emUso / metrics.total) * 100) : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress sx={{ color: isLight ? 'primary.main' : '#00f2ff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', pb: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: corTextoPrincipal, fontSize: { xs: '1.4rem', sm: '1.75rem' }, letterSpacing: '-0.5px', px: { xs: 1, sm: 0 } }}>
        Dashboard Geral
      </Typography>

      {isSandbox && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: '12px', fontFamily: 'Poppins', fontWeight: 500, mx: { xs: 1, sm: 0 } }}>
          <b>Modo Sandbox:</b> Exibindo métricas e logs simulados da planta fabril.
        </Alert>
      )}

      {/* CARDS SUPERIORES — 🌟 FAIXA DE TRANSIÇÃO PROTOCOLADA POR SEBASTIAN */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr',           // Celular: 1 por linha
            md: '1fr 1fr',       // 💡 Notebooks médios/Tablets: Fica em 2 colunas para dar espaço ao menu lateral!
            lg: '1fr 1fr 1fr'    // Monitores grandes: Abre as 3 colunas paralelas originais
          }, 
          gap: 3, 
          mb: 4, 
          px: { xs: 1, sm: 0 },
          width: '100%'
        }}
      >
        <CardMetrica titulo="Total do Estoque" valor={metrics.total.toString().padStart(2, '0')} icone={<ConstructionIcon />} corStatus={isLight ? '#14213D' : '#00f2ff'} progressoSimulado={100} />
        <CardMetrica titulo="Ferramentas Disponíveis" valor={metrics.disponiveis.toString().padStart(2, '0')} icone={<HandymanIcon />} corStatus="#85FF80" progressoSimulado={pctDisponivel} />
        <CardMetrica titulo="Em Uso Ativo" valor={metrics.emUso.toString().padStart(2, '0')} icone={<WarningAmberIcon />} corStatus="#FFB347" progressoSimulado={pctEmUso} />
      </Box>

      {/* PAINÉIS INFERIORES — 🌟 FAIXA DE TRANSIÇÃO PROTOCOLADA POR SEBASTIAN */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 3, 
          alignItems: 'stretch', 
          width: '100%', 
          // 💡 O PULO DO GATO: Transiciona para coluna em 'lg' (1280px) em vez de empurrar as caixas no sufoco
          flexDirection: { xs: 'column', lg: 'row' }, 
          px: { xs: 1, sm: 0 } 
        }}
      >
        
        {/* Painel Esquerdo: Últimas Movimentações */}
        <Paper elevation={0} sx={{ flex: 1, p: { xs: 2.5, sm: 3 }, borderRadius: '20px', border: '1px solid', borderColor: isLight ? 'divider' : 'rgba(255, 255, 255, 0.05)', bgcolor: isLight ? '#ffffff' : 'rgba(20, 33, 61, 0.7)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: corTextoPrincipal, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>Últimas Movimentações</Typography>
            <IconButton size="small" onClick={() => navigate('/dashboard/em-uso')} sx={{ color: corTextoPrincipal, '&:hover': { bgcolor: 'action.hover' } }}><ArrowForwardIcon fontSize="small" /></IconButton>
          </Box>
          <Divider sx={{ borderColor: isLight ? 'divider' : 'rgba(255,255,255,0.05)' }} />
          
          <Stack spacing={0.5} sx={{ flexGrow: 1, justifyContent: 'flex-start', maxHeight: { xs: '320px', sm: '420px' }, overflowY: 'auto', pr: 0.5 }}>
            {movimentacoes.map((mov, idx) => {
              const codigoReal = mov.codigoPatrimonio || mov.ferramenta?.codigoPatrimonio || 'N/A';
              const nomeReal = mov.nomeFerramenta || mov.ferramenta?.nome || 'Ativo Omissor';
              const usuarioReal = mov.nomeUsuario || mov.usuario?.nome || 'Operador';
              
              const isDevolvido = mov.dataDevolucao || (mov.status || '').toUpperCase() === 'FINALIZADO';
              const isDanificadaRetirada = (mov.estadoConservacao || '').toUpperCase() === 'DANIFICADA';
              const statusAtualItem = (mov.statusAtualEstoque || '').toUpperCase();

              let txtStatus = "Em Uso";
              let corStatus = "#85FF80";

              if (isDevolvido) {
                if (statusAtualItem === 'DISPONIVEL') {
                  txtStatus = "No Estoque";
                  corStatus = "#b0bec5";
                } else if (statusAtualItem === 'DESCARTADA' || statusAtualItem === 'INDISPONIVEL') {
                  txtStatus = "Descartada (Fim de Vida)";
                  corStatus = "#751A1A";
                } else if (isDanificadaRetirada) {
                  txtStatus = "Retida (Avaria)";
                  corStatus = "#FF6961";
                } else {
                  txtStatus = "No Estoque";
                  corStatus = "#b0bec5";
                }
              }

              return (
                <React.Fragment key={mov.id || idx}>
                  {idx > 0 && <Divider sx={{ borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.02)' }} />}
                  <ItemAtividade 
                    id={`#${codigoReal}`} 
                    ferramenta={nomeReal} 
                    info={isDevolvido ? `Devolvido por ${usuarioReal}` : `Retirado por ${usuarioReal}`} 
                    statusCor={corStatus} 
                    statusTexto={txtStatus} 
                  />
                </React.Fragment>
              );
            })}
            {movimentacoes.length === 0 && <Typography variant="caption" sx={{ py: 4, textAlign: 'center', color: 'text.secondary', fontFamily: 'Poppins' }}>Nenhum log registrado.</Typography>}
          </Stack>
        </Paper>

        {/* Painel Direito: Alertas Urgentes */}
        <Paper elevation={0} sx={{ flex: 1, p: { xs: 2.5, sm: 3 }, borderRadius: '20px', border: '1px solid', borderColor: isLight ? 'divider' : 'rgba(255, 255, 255, 0.05)', bgcolor: isLight ? '#ffffff' : 'rgba(20, 33, 61, 0.7)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: corTextoPrincipal, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>Alertas Urgentes</Typography>
            <IconButton size="small" onClick={() => navigate('/dashboard/ocorrencias')} sx={{ color: corTextoPrincipal, '&:hover': { bgcolor: 'action.hover' } }}><ArrowForwardIcon fontSize="small" /></IconButton>
          </Box>
          <Divider sx={{ borderColor: isLight ? 'divider' : 'rgba(255,255,255,0.05)' }} />
          
          <Stack spacing={0.5} sx={{ flexGrow: 1, justifyContent: 'flex-start', maxHeight: { xs: '320px', sm: '420px' }, overflowY: 'auto', pr: 0.5 }}>
            {alertas.map((alerta, idx) => {
              const codigoReal = alerta.patrimonioExibicao;
              const nomeReal = alerta.nomeFerramenta || alerta.ferramenta?.nome || 'Ativo Sem Nome';
              const isCritico = (alerta.estadoConservacao || '').toUpperCase() === 'DANIFICADA';

              return (
                <React.Fragment key={alerta.id || idx}>
                  {idx > 0 && <Divider sx={{ borderColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.02)' }} />}
                  <ItemAtividade 
                    id={`#${codigoReal}`} 
                    ferramenta={nomeReal} 
                    info={alerta.titulo || 'Avaria reportada'} 
                    statusCor={isCritico ? "#FF6961" : "#FFB347"} 
                    statusTexto={isCritico ? "Crítico" : "Atenção"} 
                  />
                </React.Fragment>
              );
            })}
            {alertas.length === 0 && <Typography variant="caption" sx={{ py: 4, textAlign: 'center', color: 'text.secondary', fontWeight: 500, fontFamily: 'Poppins' }}>Planta 100% operacional. Sem ocorrências em aberto!</Typography>}
          </Stack>
        </Paper>

      </Box>
    </Box>
  );
};

export default DashboardInicio;