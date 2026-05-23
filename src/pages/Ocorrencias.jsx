import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Box, Typography, Paper, Button, TextField, InputAdornment, 
  IconButton, Chip, Avatar, useTheme, CircularProgress, Stack, Grid, Badge, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import API_BASE_URL from '../apiConfig';

const mockOcorrencias = [
  { id: 'mock-1', dataAbertura: '2026-04-22T08:30:00', titulo: 'Defeito Mecânico', ferramenta: { nome: 'Martelo Perfurador Bosch' }, usuario: { nome: 'João Silva' }, descricao: 'Cabo com mau contato intermitente durante o uso.', statusOcorrencia: 'EM_MANUTENCAO' },
  { id: 'mock-2', dataAbertura: '2026-04-20T14:15:00', titulo: 'Desgaste Natural', ferramenta: { nome: 'Chave de Fenda Kit 12pçs' }, usuario: { nome: 'Maria Souza' }, descricao: 'Ponta da chave Philips 1/4 desgastada.', statusOcorrencia: 'RESOLVIDA' },
  { id: 'mock-3', dataAbertura: '2026-04-18T11:00:00', titulo: 'Falha Elétrica', ferramenta: { nome: 'Serra Tico-Tico Dewalt' }, usuario: { nome: 'Carlos Lima' }, descricao: 'Motor apresentando superaquecimento após 10 min.', statusOcorrencia: 'DESCARTADA' },
];

const OcorrenciaCard = ({ item }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const getStatusStyle = (statusOcorrencia) => {
    const styles = {
      'EM_MANUTENCAO': { color: '#FFB347', label: 'Em Manutenção' },
      'RESOLVIDA': { color: '#85FF80', label: 'Resolvida' },
      'DESCARTADA': { color: '#FF4747', label: 'Descartada' }
    };
    return styles[statusOcorrencia] || { color: '#9e9e9e', label: statusOcorrencia || 'Pendente' };
  };

  // 🌟 CONFIGURADO EXATAMENTE CONFORME O SEU DTO REAL DO JAVA
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
        bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 },
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { 
          borderColor: isLight ? 'primary.main' : '#00f2ff', transform: 'translateX(8px)',
          boxShadow: isLight ? '0 8px 25px rgba(0, 0, 0, 0.04)' : '0 0 20px rgba(0, 242, 255, 0.15)'
        }
      }}
    >
      <Avatar sx={{ bgcolor: `${status.color}15`, color: status.color, width: 52, height: 52, flexShrink: 0 }}>
        <WarningAmberIcon sx={{ fontSize: '1.8rem' }} />
      </Avatar>

      <Box sx={{ flex: 1.5, minWidth: 0 }}>
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

      <Box sx={{ flex: 1, display: { xs: 'none', lg: 'block' }, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'Poppins', color: 'text.primary' }}>
          {ferramentaExibicao}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Poppins', display: 'block', mt: 0.3 }}>
          Responsável: {usuarioExibicao}
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: 'Poppins', display: 'block', mb: 1 }}>
          Abertura: {dataExibicao}
        </Typography>
        <Chip label={status.label} size="small" sx={{ fontWeight: 800, fontFamily: 'Poppins', fontSize: '0.65rem', color: status.color, border: `1.5px solid ${status.color}`, bgcolor: 'transparent' }} />
      </Box>
    </Paper>
  );
};

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
        // 🔐 Identifica o perfil do usuário para chamar o endpoint correto do Java
        const perfilUsuario = localStorage.getItem('perfil') || '';
        const isAdminOuAlmoxarife = perfilUsuario === 'ADMIN' || perfilUsuario === 'ALMOXARIFE';
        
        // Se for Admin/Almoxarife vê tudo, se for Técnico bate em /minhas
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
        } else if (response.status === 403) {
          alert('Erro 403: Seu perfil não tem permissão para acessar esta rota.');
        } else {
          alert(`Erro ${response.status}: Ativando Modo Sandbox com dados de simulação.`);
          setOcorrenciasList(mockOcorrencias);
          setIsSandbox(true);
        }
      } catch (err) {
        console.error("Erro na comunicação com a API:", err);
        setOcorrenciasList(mockOcorrencias);
        setIsSandbox(true);
      } finally {
        setLoading(false);
      }
  };

    useEffect(() => { carregarOcorrencias(); }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ferramentaId: ferramentaId.trim(), titulo: titulo.trim(), descricao: descricao.trim() };

    try {
      const url = `${API_BASE_URL}/ocorrencias`; // 🌟 Corrigido para apontar sempre para o back-end real
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
        alert(`O servidor recusou os dados.\n\nRetorno do Java:\n${textoErro || 'Erro de validação (500/400)'}`);
      }
    } catch (error) {
      alert('Servidor indisponível. Salvando em escopo volátil local.');
      const novaOcorrenciaLocal = {
        id: 'local-' + Date.now(),
        titulo: titulo,
        ferramenta: { nome: 'Ativo Selecionado' },
        usuario: { nome: 'Usuário Conectado' },
        descricao: descricao,
        statusOcorrencia: 'EM_MANUTENCAO',
        dataAbertura: new Date().toISOString()
      };
      setOcorrenciasList([novaOcorrenciaLocal, ...ocorrenciasList]);
      setExibirCadastro(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress sx={{ color: isLight ? 'primary.main' : '#00f2ff' }} /></Box>;

  const ocorrenciasFiltradas = ocorrenciasList.filter(o => {
    const desc = (o.descricao || '').toLowerCase();
    const tit = (o.titulo || '').toLowerCase();
    const fer = (o.ferramenta?.nome || '').toLowerCase();
    const term = buscaInterna.toLowerCase();
    return desc.includes(term) || tit.includes(term) || fer.includes(term);
  });

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
                  <Button variant="text" onClick={() => setExibirCadastro(false)} sx={{ textTransform: 'none', fontFamily: 'Poppins', color: 'text.secondary', fontWeight: 600 }}>
                    Cancelar
                  </Button>
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
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setExibirCadastro(true)} sx={{ borderRadius: '16px', fontFamily: 'Poppins', fontWeight: 700, textTransform: 'none', bgcolor: isLight ? '#14213D' : '#00f2ff', color: isLight ? '#fff' : '#14213D', px: 3, py: 1 }}>Registrar Ocorrência</Button>
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
                sx: { 
                  borderRadius: '14px', bgcolor: 'background.paper', fontFamily: 'Poppins', fontSize: '0.88rem',
                  '& fieldset': { borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)' }
                } 
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
              <Typography variant="body1" sx={{ fontFamily: 'Poppins', color: 'text.secondary', fontWeight: 500 }}>
                Nenhuma ocorrência correspondente encontrada.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {ocorrenciasFiltradas.map((item, index) => (
                <OcorrenciaCard key={item.id || index} item={item} />
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Ocorrencias;