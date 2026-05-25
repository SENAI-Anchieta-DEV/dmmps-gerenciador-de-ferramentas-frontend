import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Avatar, useTheme, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider, Stack, IconButton, Tooltip, TextField } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned'; // 🌟 Ícone de devolução

import API_BASE_URL from '../apiConfig';

const DADOS_MOCK_TESTE = [
  { id: 'mock-1', nomeFerramenta: 'Parafusadeira Bosch', codigoPatrimonio: '#ID-1106', dataRetirada: '2026-05-18T08:30:00', origem: 'Gaveta: 07 / A', nomeUsuario: 'Ricardo Santos' },
  { id: 'mock-2', nomeFerramenta: 'Chave de Impacto Makita', codigoPatrimonio: '#ID-3215', dataRetirada: '2026-05-18T09:45:00', origem: 'Gaveta: 05 / C', nomeUsuario: 'Carlos Lima' },
  { id: 'mock-3', nomeFerramenta: 'Multímetro Digital Fluke', codigoPatrimonio: '#ID-2343', dataRetirada: '2026-05-18T12:15:00', origem: 'Gaveta: 04 / B', nomeUsuario: 'Ana Oliveira' },
];

// --- COMPONENTE DO CARD ATUALIZADO COM BOTÃO DE DEVOLUÇÃO ---
const ToolCardEmUso = ({ ferramenta, onVerDetalhes, onAcionarDevolucao }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  // 🌟 ADICIONADO: Captura o perfil do usuário para ocultar o botão de ação indevida
  const perfilUsuario = localStorage.getItem('perfil') || '';
  const podeDevolver = perfilUsuario === 'TECNICO';

  const nome = ferramenta.ferramenta?.nome || ferramenta.nomeFerramenta || 'Ferramenta Sem Nome';
  const codigo = ferramenta.ferramenta?.codigoPatrimonio || ferramenta.codigoPatrimonio || '#ID-0000';
  const origem = ferramenta.ferramenta?.gavetaLocalizacao || ferramenta.origem || 'Almoxarifado Central';

  const extrairHora = (isoString) => {
    if (!isoString) return '00h00';
    try {
      const partes = isoString.split('T');
      if (partes.length > 1) return partes[1].substring(0, 5).replace(':', 'h');
    } catch (e) {
      return '00h00';
    }
    return '00h00';
  };

  const horario = ferramenta.dataRetirada ? extrairHora(ferramenta.dataRetirada) : '00h00';

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2.5, 
        borderRadius: '20px', 
        border: '1px solid',
        borderColor: '#FFB347', // Bordinha Laranja Oficial de Em Uso
        bgcolor: 'background.paper',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '210px',
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-5px)',
          boxShadow: isLight ? '0 12px 30px rgba(255, 179, 71, 0.2)' : '0 0 25px rgba(255, 179, 71, 0.25)',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: 'rgba(255, 179, 71, 0.15)', color: '#FFB347', border: '1px solid rgba(255, 179, 71, 0.3)', width: 48, height: 48 }}>
          <ConstructionIcon />
        </Avatar>

        <Box sx={{ flexGrow: 1, ml: 2, pr: 5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary', fontFamily: 'Poppins' }}>
            {nome}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, mt: 0.5 }}>
            {codigo}
          </Typography>
        </Box>

        {/* 🌟 ATUALIZADO: O botão de devolução agora só aparece se o usuário for legitimamente um TÉCNICO */}
        {podeDevolver && (
          <Box sx={{ position: 'absolute', top: 15, right: 15 }}>
            <Tooltip title="Devolver Ferramenta">
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  onAcionarDevolucao(ferramenta);
                }}
                sx={{ color: '#FFB347', '&:hover': { transform: 'scale(1.15)', bgcolor: 'action.hover' } }}
              >
                <AssignmentReturnedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
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
        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#FFB347', boxShadow: '0 0 10px #FFB347', border: '2px solid', borderColor: 'background.paper' }} />
      </Box>
    </Paper>
  );
};

// --- COMPONENTE PRINCIPAL ---
const EmUso = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  const { searchTerm } = useOutletContext(); 

  const [ferramentas, setFerramentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);
  const [erro, setErro] = useState('');

  // Estados dos Modais
  const [modalOpen, setModalOpen] = useState(false);
  const [toolDetalhada, setToolDetalhada] = useState(null);
  const [devolucaoModalOpen, setDevolucaoModalOpen] = useState(false);
  const [emprestimoParaDevolver, setEmprestimoParaDevolver] = useState(null);
  const [devolucaoLoading, setDevolucaoLoading] = useState(false);
  
  // 🌟 ESTADO OPERACIONAL PARA COMPATIBILIDADE COM O POSTMAN (RF12 / RF13)
  const [estadoConservacao, setEstadoConservacao] = useState('BOM_ESTADO');

  // 🌟 ADICIONADO: Estados para capturar a escrita manual da ocorrência no fluxo integrado
  const [tituloOcorrencia, setTituloOcorrencia] = useState('');
  const [descricaoOcorrencia, setDescricaoOcorrencia] = useState('');

  const extrairHora = (isoString) => {
    if (!isoString) return '00h00';
    try {
      const partes = isoString.split('T');
      if (partes.length > 1) return partes[1].substring(0, 5).replace(':', 'h');
    } catch (e) {
      return '00h00';
    }
    return '00h00';
  };

  // 🔄 BUSCAR EMPRÉSTIMOS REALINHADO COM AS PERMISSÕES
  const fetchFerramentasEmUso = async () => {
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const perfilUsuario = localStorage.getItem('perfil') || '';
    const isAdminOuAlmoxarife = perfilUsuario === 'ADMIN' || perfilUsuario === 'ALMOXARIFE';
    const endpointUrl = isAdminOuAlmoxarife ? `${API_BASE_URL}/emprestimos` : `${API_BASE_URL}/emprestimos/meus`;

    try {
      const response = await fetch(endpointUrl, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json' 
        },
        signal: controller.signal
      });
      
      if (response.ok) {
        const data = await response.json();
        const ativosAtivos = data.filter(emp => !emp.dataDevolucao);
        setFerramentas(ativosAtivos);
        setUsandoMock(false);
        setErro('');
      } else {
        setFerramentas(DADOS_MOCK_TESTE);
        setUsandoMock(true);
        setErro(`Erro ${response.status}: Exibindo dados de simulação.`);
      }
    } catch (err) {
      setFerramentas(DADOS_MOCK_TESTE);
      setUsandoMock(true);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFerramentasEmUso();
  }, []);

  // 🛠️ PROCESSAR CHECK-IN (PATCH) ATUALIZADO DINAMICAMENTE CONFORME SEU SPRINT BOOT
  const handleProcessarDevolucao = async () => {
    if (!emprestimoParaDevolver) return;
    setDevolucaoLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/emprestimos/${emprestimoParaDevolver.id}/devolucao`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estadoConservacao: estadoConservacao,
          // 🌟 ADICIONADO: Enviando os textos digitados manualmente no modal para o DTO do Java
          tituloOcorrencia: estadoConservacao === 'DANIFICADA' ? tituloOcorrencia.trim() : null,
          descricaoOcorrencia: estadoConservacao === 'DANIFICADA' ? descricaoOcorrencia.trim() : null
        })
      });

      if (response.ok) {
        setDevolucaoModalOpen(false);
        setEmprestimoParaDevolver(null);
        setEstadoConservacao('BOM_ESTADO'); // Reseta para o padrão limpo pós-sucesso
        setTituloOcorrencia(''); // 🌟 ADICIONADO: Limpa o campo de texto
        setDescricaoOcorrencia(''); // 🌟 ADICIONADO: Limpa o campo de texto
        fetchFerramentasEmUso(); 
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`Erro ${response.status}: ${errData.detail || 'Não foi possível registrar a devolução.'}`);
      }
    } catch (err) {
      alert('Falha na conexão ao tentar processar a devolução.');
    } finally {
      setDevolucaoLoading(false);
    }
  };

  const ferramentasFiltradas = ferramentas.filter((f) => {
    const termo = searchTerm?.toLowerCase() || '';
    const nome = (f.ferramenta?.nome || f.nomeFerramenta || '').toLowerCase();
    const codigo = (f.ferramenta?.codigoPatrimonio || f.codigoPatrimonio || '').toString().toLowerCase();
    return nome.includes(termo) || codigo.includes(termo);
  });

  const abrirDetalhes = (ferramenta) => {
    setToolDetalhada(ferramenta);
    setModalOpen(true);
  };

  // 🌟 ATUALIZADO: Garante o reset do estado de conservação e campos preventivos ao abrir o modal
  const acionarDevolucao = (emprestimo) => {
    setEmprestimoParaDevolver(emprestimo);
    setEstadoConservacao('BOM_ESTADO'); 
    setTituloOcorrencia(''); // 🌟 ADICIONADO
    setDescricaoOcorrencia(''); // 🌟 ADICIONADO
    setDevolucaoModalOpen(true);
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

      {usandoMock && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: '12px', fontFamily: 'Poppins', fontWeight: 500 }}>
          <b>Modo Sandbox Ativo:</b> Exibindo dados locais para testes de interface.
        </Alert>
      )}

      {erro && !usandoMock && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{erro}</Alert>}
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 3 }}>
        {ferramentasFiltradas.map((f, i) => (
          <ToolCardEmUso key={f.id || i} ferramenta={f} onVerDetalhes={abrirDetalhes} onAcionarDevolucao={acionarDevolucao} />
        ))}
      </Box>

      {ferramentasFiltradas.length === 0 && (
        <Typography variant="body1" sx={{ mt: 6, textAlign: 'center', color: 'text.secondary', fontFamily: 'Poppins' }}>
          Nenhuma ferramenta correspondente em uso.
        </Typography>
      )}

      {/* 🌟 MODAL DE CONFIRMAÇÃO DE DEVOLUÇÃO ATUALIZADA WITH PREMIUM BUTTONS */}
      <Dialog open={devolucaoModalOpen} onClose={() => setDevolucaoModalOpen(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1, bgcolor: isLight ? '#ffffff' : '#14213D', minWidth: '380px', maxWidth: '450px' } }}>
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>Confirmar Devolução?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'Poppins', mb: 2.5 }}>
            Deseja registrar o retorno completo do ativo <strong>{emprestimoParaDevolver?.ferramenta?.nome || emprestimoParaDevolver?.nomeFerramenta}</strong> para o estoque do almoxarifado?
          </Typography>

          {/* 🌟 ADICIONADO: Painel de Botões Premium de Conservação */}
          <Box sx={{ p: 2, borderRadius: '12px', bgcolor: isLight ? 'rgba(20,33,61,0.02)' : 'rgba(255,255,255,0.02)', border: '1px solid', borderColor: 'divider', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
              Condições de Conservação do Ativo:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={estadoConservacao === 'BOM_ESTADO' ? 'contained' : 'outlined'}
                onClick={() => setEstadoConservacao('BOM_ESTADO')}
                sx={{
                  flex: 1,
                  textTransform: 'none',
                  fontFamily: 'Poppins',
                  borderRadius: '10px',
                  fontWeight: 600,
                  borderColor: 'divider',
                  bgcolor: estadoConservacao === 'BOM_ESTADO' ? '#85FF80' : 'transparent',
                  color: estadoConservacao === 'BOM_ESTADO' ? '#14213D' : 'text.primary',
                  '&:hover': { bgcolor: estadoConservacao === 'BOM_ESTADO' ? '#72eb6d' : 'action.hover' }
                }}
              >
                Bom Estado
              </Button>
              <Button
                variant={estadoConservacao === 'DANIFICADA' ? 'contained' : 'outlined'}
                onClick={() => setEstadoConservacao('DANIFICADA')}
                sx={{
                  flex: 1,
                  textTransform: 'none',
                  fontFamily: 'Poppins',
                  borderRadius: '10px',
                  fontWeight: 600,
                  borderColor: 'divider',
                  bgcolor: estadoConservacao === 'DANIFICADA' ? '#FF4747' : 'transparent',
                  color: estadoConservacao === 'DANIFICADA' ? '#ffffff' : 'text.primary',
                  '&:hover': { bgcolor: estadoConservacao === 'DANIFICADA' ? '#e03b3b' : 'action.hover' }
                }}
              >
                Danificada
              </Button>
            </Box>
          </Box>

          {/* 🌟 ADICIONADO: Formulário de relato de avaria técnico manual */}
          {estadoConservacao === 'DANIFICADA' && (
            <Stack spacing={2} sx={{ mt: 2, pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#FF4747' }}>
                Relatório de Avaria Técnico (Manual):
              </Typography>
              <TextField
                required
                fullWidth
                label="Título da Ocorrência"
                placeholder="Ex: Cabo de força quebrado"
                value={tituloOcorrencia}
                onChange={(e) => setTituloOcorrencia(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px', fontFamily: 'Poppins' },
                  '& .MuiInputLabel-root': { fontFamily: 'Poppins' }
                }}
              />
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Descrição Detalhada do Defeito"
                placeholder="Descreva o problema observado no ativo..."
                value={descricaoOcorrencia}
                onChange={(e) => setDescricaoOcorrencia(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px', fontFamily: 'Poppins' },
                  '& .MuiInputLabel-root': { fontFamily: 'Poppins' }
                }}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
          <Button onClick={() => setDevolucaoModalOpen(false)} disabled={devolucaoLoading} sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 600, color: 'text.secondary' }}>Cancelar</Button>
          <Button 
            onClick={handleProcessarDevolucao} 
            variant="contained" 
            disabled={devolucaoLoading || (estadoConservacao === 'DANIFICADA' && (!tituloOcorrencia.trim() || !descricaoOcorrencia.trim()))} 
            sx={{ 
              textTransform: 'none', 
              fontFamily: 'Poppins', 
              fontWeight: 700, 
              bgcolor: estadoConservacao === 'DANIFICADA' ? '#FF4747' : '#FFB347', 
              color: 'white', 
              borderRadius: '10px', 
              '&:hover': { bgcolor: estadoConservacao === 'DANIFICADA' ? '#e03b3b' : '#e09a36' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' }
            }}
          >
            {devolucaoLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirmar Retorno'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL DETALHES */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} PaperProps={{ sx: { borderRadius: '24px', p: 1.5, bgcolor: isLight ? '#ffffff' : '#14213D', minWidth: { xs: '90%', sm: '480px' } } }}>
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', pb: 1 }}>Ficha Técnico-Operacional</DialogTitle>
        <DialogContent>
          {toolDetalhada && (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <QrCode2Icon sx={{ fontSize: '3rem', color: isLight ? '#14213D' : '#00f2ff' }} />
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>
                    {toolDetalhada.ferramenta?.nome || toolDetalhada.nomeFerramenta || 'Ferramenta'}
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary' }}>
                    PATRIMÔNIO: {toolDetalhada.ferramenta?.codigoPatrimonio || toolDetalhada.codigoPatrimonio}
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
                      {toolDetalhada.usuario?.nome || toolDetalhada.nomeUsuario || 'Não Informado'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <AccessTimeIcon sx={{ color: 'text.secondary' }} />
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
                      Fim do Turno
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <MeetingRoomIcon sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Local de Retorno Original</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {toolDetalhada.ferramenta?.gavetaLocalizacao || toolDetalhada.origem || 'Almoxarifado Central'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 1 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, color: 'text.primary', borderRadius: '12px' }}>Fechar Diagnóstico</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmUso;