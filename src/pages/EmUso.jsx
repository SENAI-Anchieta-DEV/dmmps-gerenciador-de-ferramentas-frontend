import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Avatar, useTheme, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider, Stack } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

import API_BASE_URL from '../apiConfig';

//Dados Mockados no caso que a conexão com o servidor não esteja funcionando
const DADOS_MOCK_TESTE = [
  { nomeFerramenta: 'Parafusadeira Bosch', codigoPatrimonio: '#ID-1106', dataRetirada: '2026-05-18T08:30:00', origem: 'Gaveta: 07 / A', nomeUsuario: 'Ricardo Santos' },
  { nomeFerramenta: 'Chave de Impacto Makita', codigoPatrimonio: '#ID-3215', dataRetirada: '2026-05-18T09:45:00', origem: 'Gaveta: 05 / C', nomeUsuario: 'Carlos Lima' },
  { nomeFerramenta: 'Multímetro Digital Fluke', codigoPatrimonio: '#ID-2343', dataRetirada: '2026-05-18T12:15:00', origem: 'Gaveta: 04 / B', nomeUsuario: 'Ana Oliveira' },
];

const ToolCardEmUso = ({ ferramenta, onVerDetalhes }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const nome = ferramenta.nomeFerramenta || ferramenta.nome || 'Ferramenta Sem Nome';
  const codigo = ferramenta.codigoPatrimonio || ferramenta.id || '#ID-0000';
  const origem = ferramenta.origem || 'Almoxarifado Central';

  const extrairHora = (isoString) => {
    if (!isoString) return '00h00';
    try {
      const partes = isoString.split('T');
      if (partes.length > 1) {
        return partes[1].substring(0, 5).replace(':', 'h');
      }
    } catch (e) {
      return '00h00';
    }
    return '00h00';
  };

  const horario = ferramenta.dataRetirada ? extrairHora(ferramenta.dataRetirada) : (ferramenta.horario || '00h00');

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2.5, 
        borderRadius: '20px', 
        border: '1px solid',
        borderColor: isLight ? 'divider' : 'rgba(255, 255, 255, 0.05)',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '210px',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-5px)',
          boxShadow: isLight ? '0 12px 30px rgba(20, 33, 61, 0.06)' : '0 0 25px rgba(0, 242, 255, 0.15)',
          borderColor: isLight ? 'primary.main' : '#00f2ff',
          cursor: 'pointer'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: `${isLight ? '#14213D' : '#00f2ff'}15`, color: isLight ? '#14213D' : '#00f2ff', border: '1px solid', borderColor: isLight ? 'divider' : 'rgba(0, 242, 255, 0.2)', width: 48, height: 48 }}>
          <ConstructionIcon />
        </Avatar>

        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary', fontFamily: 'Poppins' }}>
            {nome}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary', fontSize: '0.75rem', fontWeight: 500 }}>
            {codigo}
          </Typography>
        </Box>

        <QrCode2Icon sx={{ color: 'text.primary', opacity: 0.8, fontSize: '2.2rem' }} />
      </Box>

      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontFamily: 'Poppins', fontSize: '0.8rem' }}>
          Horário de Retirada: <b style={{ color: isLight ? '#14213D' : '#f5f5f5' }}>{horario}</b>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontFamily: 'Poppins', fontSize: '0.8rem', mt: 0.5 }}>
          Origem: <b style={{ color: isLight ? '#14213D' : '#f5f5f5' }}>{origem}</b>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => onVerDetalhes(ferramenta)}
          sx={{ borderRadius: '20px', textTransform: 'none', fontSize: '0.75rem', borderColor: 'divider', color: 'text.primary', fontFamily: 'Poppins', px: 2.5, fontWeight: 600, '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' } }}
        >
          Ver mais detalhes
        </Button>
        <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#85FF80', boxShadow: '0 0 12px #85FF80, 0 0 4px #85FF80', border: '2px solid', borderColor: 'background.paper' }} />
      </Box>
    </Paper>
  );
};

const EmUso = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  const { searchTerm } = useOutletContext(); 

  const [ferramentas, setFerramentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);
  const [erro, setErro] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [toolDetalhada, setToolDetalhada] = useState(null);

  const extrairHora = (isoString) => {
    if (!isoString) return '00h00';
    try {
      const partes = isoString.split('T');
      if (partes.length > 1) {
        return partes[1].substring(0, 5).replace(':', 'h');
      }
    } catch (e) {
      return '00h00';
    }
    return '00h00';
  };

  useEffect(() => {
    const fetchFerramentasEmUso = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch(`${API_BASE_URL}/emprestimos`, {
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
          setUsandoMock(false);
          setErro('');
        } else {
          // Se responder com erro (ex: token expirou), ativa o mock de segurança
          setFerramentas(DADOS_MOCK_TESTE);
          setUsandoMock(true);
          setErro(`Erro ${response.status}: Exibindo dados de simulação.`);
        }
      } catch (err) {
        // Se o IntelliJ estiver desligado, carrega os mocks e avisa com um banner azul informativo
        setFerramentas(DADOS_MOCK_TESTE);
        setUsandoMock(true);
      }
      setLoading(false);
    };

    fetchFerramentasEmUso();
  }, []);

  const ferramentasFiltradas = ferramentas.filter((f) => {
    const termo = searchTerm?.toLowerCase() || '';
    const nome = (f.nomeFerramenta || f.nome || '').toLowerCase();
    const codigo = (f.codigoPatrimonio || f.id || '').toString().toLowerCase();
    return nome.includes(termo) || codigo.includes(termo);
  });

  const abrirDetalhes = (ferramenta) => {
    setToolDetalhada(ferramenta);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress sx={{ color: isLight ? 'primary.main' : '#00f2ff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', pb: 5 }}>
      <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', letterSpacing: '-0.5px' }}>
        Em Uso
      </Typography>

      {/* BANNER REATIVADO: Só aparece quando o backend cai */}
      {usandoMock && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: '12px', fontFamily: 'Poppins', fontWeight: 500 }}>
          <b>Modo Sandbox Ativo:</b> Conexão com o servidor indisponível. Exibindo dados locais para testes de interface.
        </Alert>
      )}

      {erro && !usandoMock && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{erro}</Alert>}
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 3 }}>
        {ferramentasFiltradas.map((f, i) => (
          <ToolCardEmUso key={f.id || i} ferramenta={f} onVerDetalhes={abrirDetalhes} />
        ))}
      </Box>

      {ferramentasFiltradas.length === 0 && !erro && (
        <Typography variant="body1" sx={{ mt: 6, textAlign: 'center', color: 'text.secondary', fontFamily: 'Poppins' }}>
          Nenhuma ferramenta correspondente em uso.
        </Typography>
      )}

      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 1.5,
            bgcolor: isLight ? '#ffffff' : '#14213D',
            border: '1px solid',
            borderColor: isLight ? 'divider' : 'rgba(0, 242, 255, 0.2)',
            boxShadow: isLight ? theme.shadows[10] : '0 0 30px rgba(0, 242, 255, 0.1)',
            minWidth: { xs: '90%', sm: '480px' }
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', pb: 1 }}>
          Ficha Técnico-Operacional
        </DialogTitle>
        <DialogContent>
          {toolDetalhada && (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <QrCode2Icon sx={{ fontSize: '3rem', color: isLight ? '#14213D' : '#00f2ff' }} />
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>
                    {toolDetalhada.nomeFerramenta || 'Ferramenta'}
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary' }}>
                    PATRIMÔNIO: {toolDetalhada.codigoPatrimonio}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PersonIcon sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Responsável Atual</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {toolDetalhada.nomeUsuario || 'Colaborador não identificado'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <AccessTimeIcon hover={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Retirada</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {extrairHora(toolDetalhada.dataRetirada)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Previsão Devolução</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFB347' }}>
                      {toolDetalhada.dataDevolucao ? extrairHora(toolDetalhada.dataDevolucao) : 'Fim do Turno'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <MeetingRoomIcon sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Local de Retorno Original</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {toolDetalhada.origem || 'Almoxarifado Central'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 1 }}>
          <Button 
            onClick={() => setModalOpen(false)}
            sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, color: 'text.primary', borderRadius: '12px' }}
          >
            Fechar Diagnóstico
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmUso;