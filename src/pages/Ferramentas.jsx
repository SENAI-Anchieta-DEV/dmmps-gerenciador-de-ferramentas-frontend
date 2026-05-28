import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Avatar, 
  useTheme, 
  CircularProgress, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Grid, 
  Divider, 
  Stack, 
  TextField, 
  IconButton,
  Tooltip,
  InputBase,
  useMediaQuery
} from '@mui/material';

import ConstructionIcon from '@mui/icons-material/Construction';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import BusinessIcon from '@mui/icons-material/Business';
import RoomIcon from '@mui/icons-material/Room';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search'; // 🌟 ADICIONADO: Ícone para a barra de pesquisa mobile interna

// NOVOS ÍCONES PARA O FLUXO DE EMPRÉSTIMO
import PlayForWorkIcon from '@mui/icons-material/PlayForWork'; 
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; 

import API_BASE_URL from '../apiConfig';

// 🎯 MAPEAMENTO GLOBAL DAS CORES OFICIAIS DO SEU TOOLHUB
const getStatusColor = (status) => {
  if (/manutencao/i.test(status)) return '#FFB347'; 
  if (/descartada|indisponivel/i.test(status)) return '#FF4747'; 
  if (/em_uso|uso/i.test(status)) return '#FFB347'; 
  return '#85FF80'; 
};

// --- COMPONENTE DO CARD DE LISTAGEM ---
const ToolCardLista = ({ ferramenta, onVerDetalhes, onDeletar, podeModificar, onAcaoEmprestimo }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const nome = ferramenta.nome || 'Ferramenta Sem Nome';
  const codigo = ferramenta.codigoPatrimonio || '#ID-0000';
  const statusAtivo = ferramenta.status || 'DISPONIVEL';

  const corStatus = getStatusColor(statusAtivo);
  const isDisponivel = statusAtivo.toUpperCase() === 'DISPONIVEL';
  const isEmUso = statusAtivo.toUpperCase() === 'EM_USO';

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2.5, 
        borderRadius: '20px', 
        border: '1px solid',
        borderColor: corStatus, 
        bgcolor: 'background.paper',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '180px',
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-5px)',
          boxShadow: isLight 
            ? `0 12px 30px ${corStatus}30` 
            : `0 0 25px ${corStatus}40`,
          borderColor: corStatus,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: `${corStatus}15`, color: corStatus, border: '1px solid', borderColor: `${corStatus}30`, width: 48, height: 48, flexShrink: 0 }}>
          <ConstructionIcon />
        </Avatar>

        {/* 🌟 BLINDAGEM ANTI-QUEBRA: minWidth 0 e ellipsis protegem o layout de estourar horizontamente */}
        <Box sx={{ flexGrow: 1, ml: 2, pr: 7, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary', fontFamily: 'Poppins', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {nome}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', color: 'text.secondary', fontSize: '0.78rem', letterSpacing: '0.5px', fontWeight: 600, mt: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {codigo}
          </Typography>
        </Box>

        {/* 🛠️ ÁREA DE BOTÕES DE AÇÃO CONTEXTUAIS */}
        <Box sx={{ position: 'absolute', top: 15, right: 15, display: 'flex', gap: 1, flexShrink: 0 }}>
          {!podeModificar && (isDisponivel || isEmUso) && (
            <Tooltip title={isDisponivel ? "Solicitar Empréstimo" : "Devolver Ferramenta"}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onAcaoEmprestimo(ferramenta, isDisponivel ? 'SOLICITAR' : 'DEVOLVER');
                }}
                sx={{
                  color: isDisponivel ? (isLight ? 'primary.main' : '#00f2ff') : '#FFB347',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.15)', bgcolor: 'action.hover' }
                }}
              >
                {isDisponivel ? <PlayForWorkIcon /> : <AssignmentTurnedInIcon />}
              </IconButton>
            </Tooltip>
          )}

          {podeModificar && (
            <IconButton 
              onClick={(e) => {
                e.stopPropagation();
                onDeletar(ferramenta);
              }}
              sx={{ 
                color: theme.palette.error.main,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.15)', bgcolor: 'rgba(211, 47, 47, 0.1)' }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 'auto' }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => onVerDetalhes(ferramenta)}
          sx={{ borderRadius: '20px', textTransform: 'none', fontSize: '0.75rem', borderColor: 'divider', color: 'text.primary', fontFamily: 'Poppins', px: 2.5, fontWeight: 600, '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' } }}
        >
          Ver mais detalhes
        </Button>
      </Box>
    </Paper>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Ferramentas = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // CONTEXTO GLOBAL + BUSCA INTERNA MOBILE
  const { searchTerm } = useOutletContext();
  const [buscaInterna, setBuscaInterna] = useState('');

  const [ferramentas, setFerramentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [toolDetalhada, setToolDetalhada] = useState(null);
  const [confirmarDeleteOpen, setConfirmarDeleteOpen] = useState(false);
  const [toolParaDeletar, setToolParaDeletar] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [emprestimoModalOpen, setEmprestimoModalOpen] = useState(false);
  const [toolEmprestimo, setToolEmprestimo] = useState(null);
  const [tipoAcaoEmprestimo, setTipoAcaoEmprestimo] = useState(''); 
  const [emprestimoLoading, setEmprestimoLoading] = useState(false);

  const [exibirCadastro, setExibirCadastro] = useState(false);
  const [formNome, setFormNome] = useState('');
  const [formPatrimonio, setFormPatrimonio] = useState('');
  const [formFabricante, setFormFabricante] = useState('');
  const [formLocalizacao, setFormLocalizacao] = useState('');
  const [formDescricao, setFormDescricao] = useState('');
  const [cadastroLoading, setCadastroLoading] = useState(false);
  const [cadastroErro, setCadastroErro] = useState('');
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      bgcolor: 'background.paper',
      fontFamily: 'Poppins',
      '& .MuiOutlinedInput-notchedOutline': { borderColor: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)' },
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: isLight ? 'primary.main' : '#00f2ff' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: isLight ? 'primary.main' : '#00f2ff', borderWidth: '2px' }
    },
    '& .MuiInputLabel-root': { fontFamily: 'Poppins', '&.Mui-focused': { color: isLight ? 'primary.main' : '#00f2ff' } }
  };

  const patrimonioInputStyles = {
    ...inputStyles,
    '& .MuiOutlinedInput-input': { fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.5px' }
  };

  function abrirDetalhes(ferramenta) {
    setToolDetalhada(ferramenta);
    setModalOpen(true);
  }

  function acionarDeletar(ferramenta) {
    setToolParaDeletar(ferramenta);
    setConfirmarDeleteOpen(true);
  }

  function acionarAcaoEmprestimo(ferramenta, tipo) {
    setToolEmprestimo(ferramenta);
    setTipoAcaoEmprestimo(tipo);
    setEmprestimoModalOpen(true);
  }

  const verificarPermissaoAdministrativa = () => {
    const perfil = localStorage.getItem('perfil') || '';
    return perfil === 'ADMIN' || perfil === 'ALMOXARIFE';
  };

  const fetchFerramentas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ferramentas`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json' 
        }
      });
      if (response.ok) {
        setFerramentas(await response.json());
      } else {
        setErro(`Erro ${response.status}: Falha ao buscar dados.`);
      }
    } catch (err) {
      setErro('Não foi possível conectar ao servidor da ToolHub.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFerramentas();
  }, []);

  const handleProcessarEmprestimo = async () => {
    if (!toolEmprestimo) return;
    setEmprestimoLoading(true);
    
    const token = localStorage.getItem('token');
    const urlBase = API_BASE_URL || 'http://localhost:8080';
    const urlFinal = tipoAcaoEmprestimo === 'SOLICITAR' 
      ? `${urlBase}/emprestimos` 
      : `${urlBase}/emprestimos/${toolEmprestimo.id}/devolucao`;

    try {
      const response = await fetch(urlFinal, {
        method: tipoAcaoEmprestimo === 'SOLICITAR' ? 'POST' : 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(
          tipoAcaoEmprestimo === 'SOLICITAR' 
            ? { ferramentaId: toolEmprestimo.id } 
            : { estadoConservacao: "BOM_ESTADO" }
        )
      }); 

      if (response.ok) {
        setEmprestimoModalOpen(false);
        setToolEmprestimo(null);
        fetchFerramentas(); 
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`Erro ${response.status}: ${errData.detail || 'Acesso negado ou restrição de negócio.'}`);
      }
    } catch (err) {
      alert(`Erro na comunicação com o servidor: ${err.message}`);
    } finally {
      setEmprestimoLoading(false);
    }
  };

  const handleConfirmarExclusao = async () => {
    if (!toolParaDeletar) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ferramentas/${toolParaDeletar.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setConfirmarDeleteOpen(false);
        setToolParaDeletar(null);
        fetchFerramentas();
      } else {
        alert(`Erro ${response.status}: Não foi possível remover.`);
      }
    } catch (err) {
      alert('Falha de conexão ao tentar deletar ferramenta.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCadastrarFerramenta = async (e) => {
    e.preventDefault();
    setCadastroLoading(true);
    setCadastroErro('');

    const novaFerramenta = {
      nome: formNome,
      codigoPatrimonio: formPatrimonio,
      fabricante: formFabricante,
      gavetaLocalizacao: formLocalizacao,
      descricao: formDescricao,
      status: "DISPONIVEL"
    };

    try {
      const response = await fetch(`${API_BASE_URL}/ferramentas`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(novaFerramenta)
      });

      if (response.ok) {
        setCadastroSucesso(true);
        setFormNome(''); setFormPatrimonio(''); setFormFabricante(''); setFormLocalizacao(''); setFormDescricao('');
        setTimeout(() => {
          setCadastroSucesso(false);
          setExibirCadastro(false);
          fetchFerramentas();
        }, 1500);
      } else {
        setCadastroErro(`Erro ${response.status}: Não foi possível cadastrar.`);
      }
    } catch (err) {
      setCadastroErro('Falha na comunicação com o servidor.');
    } finally {
      setCadastroLoading(false);
    }
  };

  if (loading && ferramentas.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress sx={{ color: isLight ? 'primary.main' : '#00f2ff' }} />
      </Box>
    );
  }

  const termo = (isMobile ? buscaInterna : searchTerm || '').toLowerCase();
  
  const ferramentasFiltradas = ferramentas.filter(f => {
    const correspondeBusca = (f.nome || '').toLowerCase().includes(termo) || 
                             (f.codigoPatrimonio || '').toLowerCase().includes(termo);
    const estaDisponivel = (f.status || '').toUpperCase() === 'DISPONIVEL';

    return correspondeBusca && estaDisponivel;
  });

if (exibirCadastro) {
    return (
      <Box sx={{ width: '100%', pb: 5, px: { xs: 1, sm: 3, md: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, px: { xs: 1, sm: 0 } }}>
          <IconButton onClick={() => { setExibirCadastro(false); setCadastroErro(''); }} sx={{ color: isLight ? '#14213D' : '#f5f5f5' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', fontSize: { xs: '1.6rem', sm: '2.125rem' }, letterSpacing: '-0.5px' }}>
            Nova Ferramenta
          </Typography>
        </Box>

        {cadastroErro && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px', mx: { xs: 1, sm: 0 } }}>{cadastroErro}</Alert>}
        {cadastroSucesso && <Alert severity="success" sx={{ mb: 3, borderRadius: '14px', fontWeight: 600, mx: { xs: 1, sm: 0 } }}>Ferramenta cadastrada!</Alert>}

        {/* 🌟 CONTEINER RECALIBRADO: Elimina o sufoco visual adaptando o fundo dinamicamente */}
        <Box 
          component="form" 
          onSubmit={handleCadastrarFerramenta} 
          sx={{ 
            p: { xs: 0, sm: 4 },           // Remove o preenchimento rígido no mobile para ganhar área útil
            bgcolor: { xs: 'transparent', sm: 'background.paper' }, // Remove o bloco pesado no celular
            border: { xs: 'none', sm: '1px solid' },
            borderColor: isLight ? 'divider' : 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '24px',
            width: '100%', 
            maxWidth: '1100px',
            boxSizing: 'border-box'
          }}
        >
          {/* 🌟 O SEGREDO: Stack força 100% de ocupação horizontal em cada linha com espaçamento uniforme */}
          <Stack spacing={3} sx={{ width: '100%', px: { xs: 1, sm: 0 }, boxSizing: 'border-box' }}>
            
            <TextField required fullWidth label="Nome da Ferramenta" variant="outlined" value={formNome} onChange={(e) => setFormNome(e.target.value)} sx={inputStyles} />
            
            {/* No mobile vira coluna de 100% de largura; no desktop volta para a linha com divisões normais */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, width: '100%' }}>
              <TextField required fullWidth label="Código do Patrimônio" variant="outlined" value={formPatrimonio} onChange={(e) => setFormPatrimonio(e.target.value)} sx={patrimonioInputStyles} />
              <TextField required fullWidth label="Fabricante / Marca" variant="outlined" value={formFabricante} onChange={(e) => setFormFabricante(e.target.value)} sx={inputStyles} />
              <TextField required fullWidth label="Localização (Ex: Gaveta B3)" variant="outlined" value={formLocalizacao} onChange={(e) => setFormLocalizacao(e.target.value)} sx={inputStyles} />
            </Box>

            <TextField fullWidth multiline rows={4} label="Descrição / Especificações Técnicas" variant="outlined" value={formDescricao} onChange={(e) => setFormDescricao(e.target.value)} sx={inputStyles} />
            
            {/* Botões de ação com comportamento responsivo premium */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'flex-end', gap: 2, mt: 1, width: '100%' }}>
              <Button variant="text" onClick={() => setExibirCadastro(false)} sx={{ borderRadius: '12px', textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, color: 'text.secondary', px: 4, py: { xs: 1.5, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={cadastroLoading} sx={{ borderRadius: '14px', textTransform: 'none', fontFamily: 'Poppins', fontWeight: 800, bgcolor: isLight ? '#14213D' : '#00f2ff', color: isLight ? '#ffffff' : '#14213D', px: 5, py: 1.5, width: { xs: '100%', sm: 'auto' } }}>
                {cadastroLoading ? <CircularProgress size={24} color="inherit" /> : 'Registrar Ativo'}
              </Button>
            </Box>

          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', pb: 5, px: { xs: 2, sm: 3, md: 0 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', letterSpacing: '-0.5px' }}>
          Ferramentas
        </Typography>
        {verificarPermissaoAdministrativa() && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setExibirCadastro(true)} sx={{ borderRadius: '16px', textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, bgcolor: isLight ? '#14213D' : '#00f2ff', color: isLight ? '#ffffff' : '#14213D', px: 2.5, py: 1, width: { xs: '100%', sm: 'auto' } }}>
            Nova Ferramenta
          </Button>
        )}
      </Box>

      {/* 🌟 BARRA DE BUSCA NATIVA MOBILE: Ativada de forma reativa para as telas menores */}
      {isMobile && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: '24px', 
            px: 2, 
            mb: 4,
            bgcolor: 'background.paper', 
            width: '100%' 
          }}
        >
          <InputBase 
            placeholder="Buscar ferramenta disponível..." 
            value={buscaInterna}
            onChange={(e) => setBuscaInterna(e.target.value)}
            sx={{ ml: 1, flex: 1, p: '10px 0', fontSize: '0.85rem', fontFamily: 'Poppins' }} 
          />
          <IconButton size="small"><SearchIcon sx={{ fontSize: '1.2rem' }} /></IconButton>
        </Box>
      )}

      {erro && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{erro}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 3 }}>
          {ferramentasFiltradas.map((f, i) => (
            <ToolCardLista 
              key={f.id || i} 
              ferramenta={f} 
              onVerDetalhes={abrirDetalhes} 
              onDeletar={acionarDeletar} 
              podeModificar={verificarPermissaoAdministrativa()} 
              onAcaoEmprestimo={acionarAcaoEmprestimo}
            />
          ))}
        </Box>
      )}

      {ferramentasFiltradas.length === 0 && !loading && !erro && (
        <Typography variant="body1" sx={{ mt: 6, textAlign: 'center', color: 'text.secondary', fontFamily: 'Poppins' }}>
          {termo ? 'Nenhuma ferramenta corresponde à sua busca.' : 'Nenhuma ferramenta disponível no estoque no momento.'}
        </Typography>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EMPRÉSTIMO */}
      <Dialog open={emprestimoModalOpen} onClose={() => setEmprestimoModalOpen(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1, bgcolor: isLight ? '#ffffff' : '#14213D', minWidth: { xs: '90%', sm: '380px' } } }}>
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>Confirmar Solicitação de Empréstimo?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'Poppins' }}>
            Você está prestes a retirar a ferramenta <strong>{toolEmprestimo?.nome}</strong> (Patrimônio: {toolEmprestimo?.codigoPatrimonio}). O status do ativo mudará para EM USO.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEmprestimoModalOpen(false)} disabled={emprestimoLoading} sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 600, color: 'text.secondary' }}>Cancelar</Button>
          <Button 
            onClick={handleProcessarEmprestimo} 
            variant="contained" 
            disabled={emprestimoLoading} 
            sx={{ 
              textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, 
              bgcolor: isLight ? '#14213D' : '#00f2ff', 
              color: !isLight ? '#14213D' : 'white', 
              borderRadius: '10px',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            {emprestimoLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirmar'}
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
                  <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>{toolDetalhada.nome || 'Ferramenta'}</Typography>
                  <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono", monospace', color: 'text.secondary', letterSpacing: '0.5px', fontWeight: 600 }}>PATRIMÔNIO: {toolDetalhada.codigoPatrimonio}</Typography>
                </Box>
              </Box>
              <Divider />
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <BusinessIcon sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Fabricante</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{toolDetalhada.fabricante || 'Não Informado'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <RoomIcon sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Localização</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{toolDetalhada.gavetaLocalizacao || 'Almoxarifado'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <InfoIcon sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Status do Ativo</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: getStatusColor(toolDetalhada.status) }}>{toolDetalhada.status || 'N/A'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mt: 1 }}>
                  <DescriptionIcon sx={{ color: 'text.secondary', mt: 0.3 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Especificações</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mt: 0.5 }}>{toolDetalhada.descricao || 'Nenhuma descrição informada.'}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 1 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, color: 'text.primary', borderRadius: '12px' }}>Fechar Ficha</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL DELETE */}
      <Dialog open={confirmarDeleteOpen} onClose={() => setConfirmarDeleteOpen(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1, bgcolor: isLight ? '#ffffff' : '#14213D', minWidth: { xs: '90%', sm: '380px' } } }}>
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>Remover Ativo do Sistema?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'Poppins' }}>
            Você está prestes a excluir definitivamente a ferramenta <strong>{toolParaDeletar?.nome}</strong> (Patrimônio: {toolParaDeletar?.codigoPatrimonio}).
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmarDeleteOpen(false)} disabled={deleteLoading} sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 600, color: 'text.secondary' }}>Cancelar</Button>
          <Button onClick={handleConfirmarExclusao} variant="contained" disabled={deleteLoading} sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, bgcolor: theme.palette.error.main, color: 'white', borderRadius: '10px' }}>
            {deleteLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirmar Exclusão'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ferramentas;