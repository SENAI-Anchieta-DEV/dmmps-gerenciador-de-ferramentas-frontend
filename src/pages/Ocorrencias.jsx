import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Box, Typography, Paper, Button, TextField, InputAdornment, 
  IconButton, Chip, Avatar, useTheme, CircularProgress, Stack, Grid, Badge, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // 🌟 ADICIONADO
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // 🌟 ADICIONADO
import API_BASE_URL from '../apiConfig';

const mockOcorrencias = [
  { id: 'mock-1', dataAbertura: '2026-04-22T08:30:00', titulo: 'Defeito Mecânico', nomeFerramenta: 'Martelo Perfurador Bosch', nomeUsuario: 'João Silva', descricao: 'Cabo com mau contato intermitente durante o uso.', statusOcorrencia: 'EM_MANUTENCAO' },
  { id: 'mock-2', dataAbertura: '2026-04-20T14:15:00', titulo: 'Desgaste Natural', nomeFerramenta: 'Chave de Fenda Kit 12pçs', nomeUsuario: 'Maria Souza', descricao: 'Ponta da chave Philips 1/4 desgastada.', statusOcorrencia: 'RESOLVIDA' },
  { id: 'mock-3', dataAbertura: '2026-04-18T11:00:00', titulo: 'Falha Elétrica', nomeFerramenta: 'Serra Tico-Tico Dewalt', nomeUsuario: 'Carlos Lima', descricao: 'Motor apresentando superaquecimento após 10 min.', statusOcorrencia: 'DESCARTADA' },
];

// --- COMPONENTE DO CARD ATUALIZADO COM AÇÕES DO ALMOXARIFE ---
const OcorrenciaCard = ({ item, onAcaoStatus }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  // 🔐 Identifica se quem está olhando a tela é Admin ou Almoxarife para liberar os botões
  const perfilUsuario = localStorage.getItem('perfil') || '';
  const ehAlmoxarifeOuAdmin = perfilUsuario === 'ADMIN' || perfilUsuario === 'ALMOXARIFE';

  const getStatusStyle = (statusOcorrencia) => {
    const styles = {
      'EM_MANUTENCAO': { color: '#FFB347', label: 'Em Manutenção' },
      'RESOLVIDA': { color: '#85FF80', label: 'Resolvida' },
      'DESCARTADA': { color: '#FF4747', label: 'Descartada' }
    };
    return styles[statusOcorrencia] || { color: '#9e9e9e', label: statusOcorrencia || 'Pendente' };
  };

  const idExibicao = item.id ? `#ID-${String(item.id).substring(0, 8).toUpperCase()}` : '#ID-S/N';
  const tituloExibicao = item.titulo || 'Ocorrência Operacional';
  const ferramentaExibicao = item.nomeFerramenta || 'Ativo Não Identificado';
  const usuarioExibicao = item.nomeUsuario || 'Técnico do Sistema';
  const descricaoExibicao = item.descricao || 'Sem especificações fornecidas.';
  
  const dataRaw = item.dataAbertura;
  const dataExibicao = dataRaw ? new Date(dataRaw).toLocaleDateString('pt-BR') : 'Recente';
  
  const status = getStatusStyle(item.statusOcorrencia);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2.5, borderRadius: '20px', border: '1px solid', 
        borderColor: isLight ? 'divider' : 'rgba(255, 255, 255, 0.05)',
        bgcolor: 'background.paper', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 2, md: 4 },
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { 
          borderColor: isLight ? 'primary.main' : '#00f2ff', transform: 'translateX(8px)',
          boxShadow: isLight ? '0 8px 25px rgba(0, 0, 0, 0.04)' : '0 0 20px rgba(0, 242, 255, 0.15)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1.5, minWidth: 0, width: '100%' }}>
        <Avatar sx={{ bgcolor: `${status.color}15`, color: status.color, width: 52, height: 52, flexShrink: 0 }}>
          <WarningAmberIcon sx={{ fontSize: '1.8rem' }} />
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Poppins', lineHeight: 1.3, color: 'text.primary' }}>
            {tituloExibicao}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: 'text.secondary', fontSize: '0.85rem', mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {descricaoExibicao}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', color: 'text.secondary', fontSize: '0.75rem', mt: 0.5, fontWeight: 600 }}>
            {idExibicao}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: { xs: 'block', sm: 'block' }, minWidth: 0, pl: { xs: 7, sm: 0 } }}>
        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'Poppins', color: 'text.primary' }}>
          {ferramentaExibicao}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Poppins', display: 'block', mt: 0.3 }}>
          Responsável: {usuarioExibicao}
        </Typography>
      </Box>

      {/* 🌟 ADICIONADO: Painel de Ações Dinâmicas para o Almoxarife fechar o ciclo do Java */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: { xs: '100%', sm: 'auto' }, gap: 3, pl: { xs: 7, sm: 0 }, ml: 'auto' }}>
        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: 'Poppins', display: 'block', mb: 1 }}>
            Abertura: {dataExibicao}
          </Typography>
          <Chip label={status.label} size="small" sx={{ fontWeight: 800, fontFamily: 'Poppins', fontSize: '0.65rem', color: status.color, border: `1.5px solid ${status.color}`, bgcolor: 'transparent' }} />
        </Box>

        {ehAlmoxarifeOuAdmin && item.statusOcorrencia === 'EM_MANUTENCAO' && (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Resolver Ocorrência (Disponibilizar Ativo)">
              <IconButton 
                size="small" 
                onClick={() => onAcaoStatus(item, 'RESOLVIDA')}
                sx={{ color: '#85FF80', border: '1px solid rgba(133, 255, 128, 0.3)', '&:hover': { bgcolor: 'rgba(133, 255, 128, 0.1)' } }}
              >
                <CheckCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descartar Ferramenta Definitivamente">
              <IconButton 
                size="small" 
                onClick={() => onAcaoStatus(item, 'DESCARTADA')}
                sx={{ color: '#FF4747', border: '1px solid rgba(255, 71, 71, 0.3)', '&:hover': { bgcolor: 'rgba(255, 71, 71, 0.1)' } }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Ocorrencias = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { toggleColorMode } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exibirCadastro, setExibirCadastro] = useState(false);
  const [buscaInterna, setBuscaInterna] = useState('');
  const [ocorrenciasList, setOcorrenciasList] = useState([]);
  const [isSandbox, setIsSandbox] = useState(false);

  const [ferramentaId, setFerramentaId] = useState('');
  const [titulo, setTitulo] = useState(''); 
  const [descricao, setDescricao] = useState('');

  // 🌟 ESTADOS PARA MODAL DE ATUALIZAÇÃO DO ALMOXARIFE
  const [dialogAcaoOpen, setDialogAcaoOpen] = useState(false);
  const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState(null);
  const [proximoStatus, setProximoStatus] = useState('');
  const [justificativaDescarte, setJustificativaDescarte] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      bgcolor: 'background.paper',
      fontFamily: 'Poppins',
      '& fieldset': { borderColor: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: isLight ? 'primary.main' : '#00f2ff' },
      '&.Mui-focused fieldset': { borderColor: isLight ? 'primary.main' : '#00f2ff' }
    },
    '& .MuiInputLabel-root': { fontFamily: 'Poppins', '&.Mui-focused': { color: isLight ? 'primary.main' : '#00f2ff' } }
  };

  const carregarOcorrencias = async () => {
    try {
      const perfilUsuario = localStorage.getItem('perfil') || '';
      const isAdminOuAlmoxarife = perfilUsuario === 'ADMIN' || perfilUsuario === 'ALMOXARIFE';
      
      const endpoint = isAdminOuAlmoxarife ? '/ocorrencias' : '/ocorrencias/minhas';
      const url = `${API_BASE_URL}${endpoint}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOcorrenciasList(data);
        setIsSandbox(false);
      } else {
        setOcorrenciasList(mockOcorrencias);
        setIsSandbox(true);
      }
    } catch (err) {
      setOcorrenciasList(mockOcorrencias);
      setIsSandbox(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarOcorrencias(); }, []);

  // 🌟 FUNÇÃO PARA DISPARAR O PATCH CONFORME SEU OCORRENCIACONTROLLER.JAVA
  const handleAtualizarStatusOcorrencia = async () => {
    if (!ocorrenciaSelecionada) return;
    
    // Validação da regra de negócio (RN06): Descarte exige justificativa
    if (proximoStatus === 'DESCARTADA' && !justificativaDescarte.trim()) {
      alert('A justificativa é obrigatória para descartar uma ferramenta.');
      return;
    }

    setStatusLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ocorrencias/${ocorrenciaSelecionada.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          statusOcorrencia: proximoStatus,
          justificativaDescarte: proximoStatus === 'DESCARTADA' ? justificativaDescarte.trim() : null
        })
      });

      if (response.ok) {
        setDialogAcaoOpen(false);
        setOcorrenciaSelecionada(null);
        setJustificativaDescarte('');
        carregarOcorrencias(); // Recarrega os dados reais
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`Erro ${response.status}: ${errData.detail || 'Não foi possível atualizar o status.'}`);
      }
    } catch (err) {
      alert('Erro de conexão ao tentar atualizar o status da ocorrência.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAbrirDialogAcao = (ocorrencia, status) => {
    setOcorrenciaSelecionada(ocorrencia);
    setProximoStatus(status);
    setJustificativaDescarte('');
    setDialogAcaoOpen(true);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ferramentaId: ferramentaId.trim(), titulo: titulo.trim(), descricao: descricao.trim() };

    try {
      const url = `${API_BASE_URL}/ocorrencias`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Ocorrência registrada com sucesso no servidor!');
        setFerramentaId(''); setTitulo(''); setDescricao('');
        setExibirCadastro(false);
        setLoading(true);
        carregarOcorrencias(); 
      } else {
        const textoErro = await response.text().catch(() => "");
        alert(`O servidor recusou os dados.\n\nRetorno do Java:\n${textoErro || 'Erro'}`);
      }
    } catch (error) {
      alert('Erro de rede ao salvar.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress sx={{ color: isLight ? 'primary.main' : '#00f2ff' }} /></Box>;

  // 1. Primeiro filtramos por texto (busca por ferramenta, título ou descrição)
  const ocorrenciasFiltradasPorTexto = ocorrenciasList.filter(o => {
    const desc = (o.descricao || '').toLowerCase();
    const tit = (o.titulo || '').toLowerCase();
    const fer = (o.nomeFerramenta || '').toLowerCase();
    const term = buscaInterna.toLowerCase();
    return desc.includes(term) || tit.includes(term) || fer.includes(term);
  });

  // 🌟 REGRA DE NEGÓCIO: Filtro de Visibilidade por Perfil
  const perfilUsuario = localStorage.getItem('perfil') || '';
  const ehAlmoxarifeOuAdmin = perfilUsuario === 'ADMIN' || perfilUsuario === 'ALMOXARIFE';

  // 🔒 Se for Técnico, exibe APENAS o que estiver em aberto ('EM_MANUTENCAO'). Se for Almoxarife/Admin, vê tudo!
  const ocorrenciasFiltradas = ehAlmoxarifeOuAdmin 
    ? ocorrenciasFiltradasPorTexto 
    : ocorrenciasFiltradasPorTexto.filter(o => o.statusOcorrencia === 'EM_MANUTENCAO');

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', position: 'relative', pt: 8, pb: 5 }}>
      <Box sx={{ position: 'absolute', top: 20, right: 0, display: 'flex', gap: 1 }}>
        <Badge badgeContent={3} color="error"><IconButton><NotificationsIcon sx={{ color: 'text.primary' }} /></IconButton></Badge>
        <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary' }}>{theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
      </Box>

      {exibirCadastro ? (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <IconButton onClick={() => setExibirCadastro(false)} sx={{ color: 'text.primary' }}><ArrowBackIcon /></IconButton>
            <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5' }}>
              Registrar Nova Ocorrência
            </Typography>
          </Box>

          <Paper elevation={0} component="form" onSubmit={handleSalvar} sx={{ p: 5, borderRadius: '24px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField required fullWidth label="UUID da Ferramenta *" placeholder="Ex: 123e4567-e89b..." value={ferramentaId} onChange={(e) => setFerramentaId(e.target.value)} sx={inputStyles} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField required fullWidth label="Título da Ocorrência *" placeholder="Ex: Defeito no motor" value={titulo} onChange={(e) => setTitulo(e.target.value)} sx={inputStyles} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="Descrição Detalhada *" placeholder="Descreva com detalhes o defeito observado..." value={descricao} onChange={(e) => setDescricao(e.target.value)} sx={inputStyles} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button variant="text" onClick={() => setExibirCadastro(false)} sx={{ textTransform: 'none', fontFamily: 'Poppins', color: 'text.secondary', fontWeight: 600 }}>Cancelar</Button>
                  <Button type="submit" variant="contained" disabled={submitting} sx={{ borderRadius: '14px', px: 6, py: 1.5, fontFamily: 'Poppins', fontWeight: 800, textTransform: 'none', bgcolor: isLight ? '#14213D' : '#00f2ff', color: isLight ? '#fff' : '#14213D' }}>
                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Salvar Relato'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5' }}>Ocorrências</Typography>
            {/* O botão de registro manual no topo só faz sentido para o Técnico registrar defeito sem empréstimo associado */}
            {!ehAlmoxarifeOuAdmin && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setExibirCadastro(true)} sx={{ borderRadius: '16px', fontFamily: 'Poppins', fontWeight: 700, textTransform: 'none', bgcolor: isLight ? '#14213D' : '#00f2ff', color: isLight ? '#fff' : '#14213D', px: 3, py: 1 }}>Registrar Ocorrência</Button>
            )}
          </Box>

          <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
            <TextField 
              fullWidth 
              placeholder="Buscar por ferramenta, título ou descrição..." 
              size="small" 
              value={buscaInterna} 
              onChange={(e) => setBuscaInterna(e.target.value)} 
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: isLight ? 'primary.main' : '#00f2ff', fontSize: '1.2rem' }} /></InputAdornment>, 
                sx: { borderRadius: '14px', bgcolor: 'background.paper', fontFamily: 'Poppins', fontSize: '0.88rem', '& fieldset': { borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)' } } 
              }} 
            />
            <IconButton sx={{ border: '1px solid', borderColor: isLight ? 'primary.main' : '#00f2ff', borderRadius: '14px', p: 1.2, bgcolor: 'background.paper', color: isLight ? 'primary.main' : '#00f2ff' }}><FilterListIcon fontSize="small" /></IconButton>
          </Box>

          {isSandbox && (
            <Alert severity="info" sx={{ mb: 4, borderRadius: '14px', fontFamily: 'Poppins', fontWeight: 600 }}>
              <strong>Modo Sandbox Ativo:</strong> Exibindo dados locais de testes. Aguardando conexão com a API do backend.
            </Alert>
          )}

          {ocorrenciasFiltradas.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', width: '100%' }}>
              <Typography variant="body1" sx={{ fontFamily: 'Poppins', color: 'text.secondary', fontWeight: 500 }}>Nenhuma ocorrência correspondente encontrada.</Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {ocorrenciasFiltradas.map((item, index) => (
                <OcorrenciaCard key={item.id || index} item={item} onAcaoStatus={handleAbrirDialogAcao} />
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* 🌟 MODAL CONFIRMAÇÃO DE STATUS (RESOLVER OU DESCARTAR) */}
      <Dialog open={dialogAcaoOpen} onClose={() => setDialogAcaoOpen(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1, bgcolor: isLight ? '#ffffff' : '#14213D', minWidth: '350px' } }}>
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>
          {proximoStatus === 'RESOLVIDA' ? 'Resolver Ocorrência?' : 'Descartar Ferramenta?'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'Poppins', mb: 2.5 }}>
            {proximoStatus === 'RESOLVIDA' 
              ? 'Confirma que a ferramenta passou por manutenção e está pronta para retornar ao estoque disponível?' 
              : 'Esta ação irá desativar permanentemente o ativo do sistema. Justifique o descarte abaixo:'}
          </Typography>

          {proximoStatus === 'DESCARTADA' && (
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              label="Justificativa do Descarte (RN06)"
              placeholder="Ex: Custo de reparo excede 80% do valor de um ativo novo..."
              value={justificativaDescarte}
              onChange={(e) => setJustificativaDescarte(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', fontFamily: 'Poppins' }, '& .MuiInputLabel-root': { fontFamily: 'Poppins' } }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogAcaoOpen(false)} disabled={statusLoading} sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 600, color: 'text.secondary' }}>Cancelar</Button>
          <Button 
            onClick={handleAtualizarStatusOcorrencia} 
            variant="contained" 
            disabled={statusLoading || (proximoStatus === 'DESCARTADA' && !justificativaDescarte.trim())} 
            sx={{ 
              textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, 
              bgcolor: proximoStatus === 'RESOLVIDA' ? '#85FF80' : '#FF4747', 
              color: proximoStatus === 'RESOLVIDA' ? '#14213D' : '#white', 
              borderRadius: '10px', '&:hover': { bgcolor: proximoStatus === 'RESOLVIDA' ? '#72eb6d' : '#e03b3b' } 
            }}
          >
            {statusLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ocorrencias;