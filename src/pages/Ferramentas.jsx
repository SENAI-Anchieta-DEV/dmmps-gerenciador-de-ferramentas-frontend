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
  IconButton 
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

import API_BASE_URL from '../apiConfig';

// --- COMPONENTE DO CARD DE LISTAGEM ---
const ToolCardLista = ({ ferramenta, onVerDetalhes, onDeletar, podeModificar }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const nome = ferramenta.nome || 'Ferramenta Sem Nome';
  const codigo = ferramenta.codigoPatrimonio || '#ID-0000';

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
        height: '180px',
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-5px)',
          boxShadow: isLight ? '0 12px 30px rgba(20, 33, 61, 0.06)' : '0 0 25px rgba(0, 242, 255, 0.15)',
          borderColor: isLight ? 'primary.main' : '#00f2ff',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: `${isLight ? '#14213D' : '#00f2ff'}15`, color: isLight ? '#14213D' : '#00f2ff', border: '1px solid', borderColor: isLight ? 'divider' : 'rgba(0, 242, 255, 0.2)', width: 48, height: 48 }}>
          <ConstructionIcon />
        </Avatar>

        <Box sx={{ flexGrow: 1, ml: 2, pr: podeModificar ? 4 : 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary', fontFamily: 'Poppins' }}>
            {nome}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', color: 'text.secondary', fontSize: '0.78rem', letterSpacing: '0.5px', fontWeight: 600, mt: 0.5 }}>
            {codigo}
          </Typography>
        </Box>

        {podeModificar ? (
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              onDeletar(ferramenta);
            }}
            sx={{ 
              position: 'absolute', 
              top: 15, 
              right: 15, 
              color: theme.palette.error.main,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.15)', bgcolor: 'rgba(211, 47, 47, 0.1)' }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        ) : (
          <QrCode2Icon sx={{ color: 'text.primary', opacity: 0.8, fontSize: '2.2rem' }} />
        )}
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

  // Puxa o searchTerm direto do Layout.jsx
  const { searchTerm } = useOutletContext();

  // Estados da Listagem e Conexão
  const [ferramentas, setFerramentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  // Modais
  const [modalOpen, setModalOpen] = useState(false);
  const [toolDetalhada, setToolDetalhada] = useState(null);
  const [confirmarDeleteOpen, setConfirmarDeleteOpen] = useState(false);
  const [toolParaDeletar, setToolParaDeletar] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Subpágina Cadastro e Formulário
  const [exibirCadastro, setExibirCadastro] = useState(false);
  const [formNome, setFormNome] = useState('');
  const [formPatrimonio, setFormPatrimonio] = useState('');
  const [formFabricante, setFormFabricante] = useState('');
  const [formLocalizacao, setFormLocalizacao] = useState('');
  const [formDescricao, setFormDescricao] = useState('');
  const [cadastroLoading, setCadastroLoading] = useState(false);
  const [cadastroErro, setCadastroErro] = useState('');
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

  // Estilos Inputs
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

  // 🔐 DEFEZA CONTRA HOISTING: Mudamos para funções tradicionais pro React ler em qualquer ordem
  function abrirDetalhes(ferramenta) {
    setToolDetalhada(ferramenta);
    setModalOpen(true);
  }

  function acionarDeletar(ferramenta) {
    setToolParaDeletar(ferramenta);
    setConfirmarDeleteOpen(true);
  }

  const verificarPermissaoAdministrativa = () => {
    return /admin|almoxarife/i.test(localStorage.getItem('user') || '');
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

  // Filtragem executada na renderização
  const termo = (searchTerm || '').toLowerCase();
  const ferramentasFiltradas = ferramentas.filter(f => 
    (f.nome || '').toLowerCase().includes(termo) || 
    (f.codigoPatrimonio || '').toLowerCase().includes(termo)
  );

  // --- SUBPÁGINA DE CADASTRO EXPANDIDA ---
  if (exibirCadastro) {
    return (
      <Box sx={{ width: '100%', pb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <IconButton onClick={() => { setExibirCadastro(false); setCadastroErro(''); }} sx={{ color: isLight ? '#14213D' : '#f5f5f5' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', letterSpacing: '-0.5px' }}>
            Nova Ferramenta
          </Typography>
        </Box>

        {cadastroErro && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{cadastroErro}</Alert>}
        {cadastroSucesso && <Alert severity="success" sx={{ mb: 3, borderRadius: '14px', fontWeight: 600 }}>Ferramenta cadastrada!</Alert>}

        <Paper elevation={0} component="form" onSubmit={handleCadastrarFerramenta} sx={{ p: 4, borderRadius: '24px', border: '1px solid', borderColor: isLight ? 'divider' : 'rgba(255, 255, 255, 0.05)', bgcolor: 'background.paper', width: '100%', maxWidth: '1100px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField required fullWidth label="Nome da Ferramenta" variant="outlined" value={formNome} onChange={(e) => setFormNome(e.target.value)} sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField required fullWidth label="Código do Patrimônio" variant="outlined" value={formPatrimonio} onChange={(e) => setFormPatrimonio(e.target.value)} sx={patrimonioInputStyles} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField required fullWidth label="Fabricante / Marca" variant="outlined" value={formFabricante} onChange={(e) => setFormFabricante(e.target.value)} sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField required fullWidth label="Localização (Ex: Gaveta B3)" variant="outlined" value={formLocalizacao} onChange={(e) => setFormLocalizacao(e.target.value)} sx={inputStyles} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Descrição / Especificações Técnicas" variant="outlined" value={formDescricao} onChange={(e) => setFormDescricao(e.target.value)} sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
              <Button variant="text" onClick={() => setExibirCadastro(false)} sx={{ borderRadius: '12px', textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, color: 'text.secondary', px: 4 }}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={cadastroLoading} sx={{ borderRadius: '14px', textTransform: 'none', fontFamily: 'Poppins', fontWeight: 800, bgcolor: isLight ? '#14213D' : '#00f2ff', color: isLight ? '#ffffff' : '#14213D', px: 5, py: 1.5 }}>
                {cadastroLoading ? <CircularProgress size={24} color="inherit" /> : 'Registrar Ativo'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }

  // --- PÁGINA PRINCIPAL DE LISTAGEM ---
  return (
    <Box sx={{ width: '100%', pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', letterSpacing: '-0.5px' }}>
          Ferramentas
        </Typography>
        {verificarPermissaoAdministrativa() && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setExibirCadastro(true)} sx={{ borderRadius: '16px', textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, bgcolor: isLight ? '#14213D' : '#00f2ff', color: isLight ? '#ffffff' : '#14213D', px: 2.5, py: 1 }}>
            Nova Ferramenta
          </Button>
        )}
      </Box>

      {erro && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{erro}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 3 }}>
          {ferramentasFiltradas.map((f, i) => (
            <ToolCardLista key={f.id || i} ferramenta={f} onVerDetalhes={abrirDetalhes} onDeletar={acionarDeletar} podeModificar={verificarPermissaoAdministrativa()} />
          ))}
        </Box>
      )}

      {ferramentasFiltradas.length === 0 && !loading && !erro && (
        <Typography variant="body1" sx={{ mt: 6, textAlign: 'center', color: 'text.secondary', fontFamily: 'Poppins' }}>
          {searchTerm ? 'Nenhuma ferramenta corresponde à sua busca.' : 'Nenhuma ferramenta cadastrada no sistema.'}
        </Typography>
      )}

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
                    <Typography variant="body2" sx={{ fontWeight: 700, color: toolDetalhada.status === 'DISPONIVEL' ? '#85FF80' : '#FFB347' }}>{toolDetalhada.status || 'N/A'}</Typography>
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
      <Dialog open={confirmarDeleteOpen} onClose={() => setConfirmarDeleteOpen(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1, bgcolor: isLight ? '#ffffff' : '#14213D' } }}>
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