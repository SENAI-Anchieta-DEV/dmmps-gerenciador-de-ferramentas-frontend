import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Box, Typography, Paper, Button, TextField, InputAdornment, 
  IconButton, Chip, Avatar, useTheme, CircularProgress, Stack, Grid, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; 
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; 
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import API_BASE_URL from '../apiConfig';

const mockOcorrencias = [
  { id: 'mock-1', dataAbertura: '2026-04-22T08:30:00', titulo: 'Defeito Mecânico', nomeFerramenta: 'Martelo Perfurador Bosch', nomeUsuario: 'João Silva', descricao: 'Cabo com mau contato intermitente durante o uso.', statusOcorrencia: 'EM_MANUTENCAO' },
  { id: 'mock-2', dataAbertura: '2026-04-20T14:15:00', titulo: 'Desgaste Natural', nomeFerramenta: 'Chave de Fenda Kit 12pçs', nomeUsuario: 'Maria Souza', descricao: 'Ponta da chave Philips 1/4 desgastada.', statusOcorrencia: 'RESOLVIDA' },
  { id: 'mock-3', dataAbertura: '2026-04-18T11:00:00', titulo: 'Falha Elétrica', nomeFerramenta: 'Serra Tico-Tico Dewalt', nomeUsuario: 'Carlos Lima', descricao: 'Motor apresentando superaquecimento após 10 min.', statusOcorrencia: 'DESCARTADA' },
];

// --- COMPONENTE DO CARD ---
const OcorrenciaCard = ({ item, onAcaoStatus }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const perfilUsuario = localStorage.getItem('perfil') || '';
  // 🌟 CORREÇÃO DE UX E REGRA DE NEGÓCIO: Apenas ALMOXARIFE gerencia o fluxo operacional de ativos
  const ehAlmoxarife = perfilUsuario === 'ALMOXARIFE';

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
        bgcolor: 'background.paper', 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        alignItems: { xs: 'flex-start', md: 'center' }, 
        gap: 2.5,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease',
        '&:hover': { 
          borderColor: isLight ? 'primary.main' : '#00f2ff', 
          transform: 'translateX(6px)',
          boxShadow: isLight ? '0 8px 25px rgba(0, 0, 0, 0.04)' : '0 0 20px rgba(0, 242, 255, 0.15)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1.5, minWidth: 0, width: '100%' }}>
        <Avatar sx={{ bgcolor: `${status.color}15`, color: status.color, width: 48, height: 48, flexShrink: 0 }}>
          <WarningAmberIcon sx={{ fontSize: '1.6rem' }} />
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 700, lineHeight: 1.3, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tituloExibicao}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: 'text.secondary', fontSize: '0.82rem', mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {descricaoExibicao}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', color: 'text.secondary', fontSize: '0.75rem', mt: 0.5, fontWeight: 600 }}>
            {idExibicao}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'Poppins', color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ferramentaExibicao}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Poppins', display: 'block', mt: 0.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Responsável: {usuarioExibicao}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: { xs: '100%', md: 'auto' }, gap: 3, ml: 'auto', pt: { xs: 1, md: 0 }, borderTop: { xs: '1px dashed', md: 'none' }, borderColor: 'divider' }}>
        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: 'Poppins', display: 'block', mb: 0.8 }}>
            Abertura: {dataExibicao}
          </Typography>
          <Chip label={status.label} size="small" sx={{ fontWeight: 800, fontFamily: 'Poppins', fontSize: '0.65rem', color: status.color, border: `1.5px solid ${status.color}`, bgcolor: 'transparent' }} />
        </Box>

        {/* 🌟 PRIVILÉGIO MÍNIMO ATUALIZADO: Botões restritos exclusivamente ao Almoxarife */}
        {ehAlmoxarife && item.statusOcorrencia === 'EM_MANUTENCAO' && (
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const handleOriginalStatusUpdate = async () => {
    if (!ocorrenciaSelecionada) return;
    
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
        carregarOcorrencias(); 
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

  const ocorrenciasFiltradasPorTexto = ocorrenciasList.filter(o => {
    const desc = (o.descricao || '').toLowerCase();
    const tit = (o.titulo || '').toLowerCase();
    const fer = (o.nomeFerramenta || '').toLowerCase();
    const term = buscaInterna.toLowerCase();
    return desc.includes(term) || tit.includes(term) || fer.includes(term);
  });

  const perfilUsuarioGlobal = localStorage.getItem('perfil') || '';
  const ehAlmoxarifeOuAdmin = perfilUsuarioGlobal === 'ADMIN' || perfilUsuarioGlobal === 'ALMOXARIFE';

  const ocorrenciasFiltradas = ehAlmoxarifeOuAdmin 
    ? ocorrenciasFiltradasPorTexto 
    : ocorrenciasFiltradasPorTexto.filter(o => o.statusOcorrencia === 'EM_MANUTENCAO');

  if (exibirCadastro) {
    return (
      <Box sx={{ width: '100%', pb: 5, p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <IconButton onClick={() => setExibirCadastro(false)} sx={{ color: 'text.primary' }}><ArrowBackIcon /></IconButton>
          <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
            Registrar Nova Ocorrência
          </Typography>
        </Box>

        <Box 
          component="form" 
          onSubmit={handleSalvar} 
          sx={{ 
            p: { xs: 0, sm: 5 }, 
            bgcolor: { xs: 'transparent', sm: 'background.paper' }, 
            border: { xs: 'none', sm: '1px solid' }, 
            borderColor: 'divider', 
            borderRadius: '24px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <Stack spacing={3} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
              <TextField required fullWidth label="UUID da Ferramenta *" placeholder="Ex: 123e4567-e89b..." value={ferramentaId} onChange={(e) => setFerramentaId(e.target.value)} sx={inputStyles} />
              <TextField required fullWidth label="Título da Ocorrência *" placeholder="Ex: Defeito no motor" value={titulo} onChange={(e) => setTitulo(e.target.value)} sx={inputStyles} />
            </Box>
            
            <TextField required fullWidth multiline rows={4} label="Descrição Detalhada *" placeholder="Descreva com detalhes o defeito observado..." value={descricao} onChange={(e) => setDescricao(e.target.value)} sx={inputStyles} />
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'flex-end', gap: 2, mt: 1, width: '100%' }}>
              <Button variant="text" onClick={() => setExibirCadastro(false)} sx={{ textTransform: 'none', fontFamily: 'Poppins', color: 'text.secondary', fontWeight: 600, py: { xs: 1.5, sm: 0 } }}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={submitting} sx={{ borderRadius: '14px', px: 6, py: 1.5, fontFamily: 'Poppins', fontWeight: 800, textTransform: 'none', bgcolor: isLight ? '#14213D' : '#00f2ff', color: isLight ? '#fff' : '#14213D', width: { xs: '100%', sm: 'auto' } }}>
                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Salvar Relato'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', pb: 5, p: { xs: 2.5, sm: 3, md: 4 }, boxSizing: 'border-box' }}>
      
      {/* Barra de ferramentas Desktop alinhada */}
      {!isMobile && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 3, width: '100%' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton 
              onClick={toggleColorMode} 
              sx={{ 
                color: 'text.primary', 
                bgcolor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)', 
                p: 1,
                '&:hover': { bgcolor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)' } 
              }}
            >
              {theme.palette.mode === 'dark' ? <Brightness7Icon sx={{ fontSize: '1.4rem' }} /> : <Brightness4Icon sx={{ fontSize: '1.4rem' }} />}
            </IconButton>
          </Stack>
        </Box>
      )}

      {/* Título da Página */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', fontSize: { xs: '1.8rem', sm: '2.125rem' } }}>
          Ocorrências
        </Typography>
      </Box>

      {/* Barra de Pesquisa */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, width: '100%' }}>
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
        <IconButton sx={{ border: '1px solid', borderColor: isLight ? 'primary.main' : '#00f2ff', borderRadius: '14px', p: 1.2, bgcolor: 'background.paper', color: isLight ? 'primary.main' : '#00f2ff', flexShrink: 0 }}><FilterListIcon fontSize="small" /></IconButton>
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
        <Stack spacing={2} sx={{ width: '100%' }}>
          {ocorrenciasFiltradas.map((item, index) => (
            <OcorrenciaCard key={item.id || index} item={item} onAcaoStatus={handleAbrirDialogAcao} />
          ))}
        </Stack>
      )}

      {/* MODAL CONFIRMAÇÃO DE STATUS */}
      <Dialog open={dialogAcaoOpen} onClose={() => setDialogAcaoOpen(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1, bgcolor: isLight ? '#ffffff' : '#14213D', minWidth: { xs: '90%', sm: '350px' } } }}>
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
            onClick={handleOriginalStatusUpdate} 
            variant="contained" 
            disabled={statusLoading || (proximoStatus === 'DESCARTADA' && !justificativaDescarte.trim())} 
            sx={{ 
              textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, 
              bgcolor: proximoStatus === 'RESOLVIDA' ? '#85FF80' : '#FF4747', 
              color: proximoStatus === 'RESOLVIDA' ? '#14213D' : 'white', 
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