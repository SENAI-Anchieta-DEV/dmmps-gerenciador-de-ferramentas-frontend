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
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Container,
  useMediaQuery,
  Tooltip
} from '@mui/material';

// Ícones integrados com a identidade visual da ToolHub
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonOffIcon from '@mui/icons-material/PersonOff'; 
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import API_BASE_URL from '../apiConfig';

// --- COMPONENTE PRINCIPAL ---
const ListarPerfis = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  // Alterna para modo Cards em telas menores para proteger o layout de tabelas longas
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const { searchTerm, setSearchTerm, toggleColorMode } = useOutletContext();

  // Estado interno controlado para garantir funcionamento autônomo do input
  const [buscaLocal, setBuscaLocal] = useState(searchTerm || '');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  
  // Estados dos Modais
  const [modalOpen, setModalOpen] = useState(false);
  const [userSelecionado, setUserSelecionado] = useState(null);
  const [confirmarDeleteOpen, setConfirmarDeleteOpen] = useState(false);
  const [userParaDeletar, setUserParaDeletar] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Sincroniza a busca se ela vir alterada direto do cabeçalho global
  useEffect(() => {
    if (searchTerm !== undefined) {
      setBuscaLocal(searchTerm);
    }
  }, [searchTerm]);

  // LÓGICA DE API: Consumindo a rota oficial /api/v1/usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/usuarios`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json' 
        }
      });
      if (response.ok) {
        setUsuarios(await response.json());
      } else {
        setErro(`Erro ${response.status}: Não foi possível carregar os perfis.`);
      }
    } catch (err) {
      setErro("Falha na conexão com o servidor da ToolHub.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const handleConfirmarExclusao = async () => {
    if (!userParaDeletar) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/${userParaDeletar.id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          'Content-Type': 'application/json' 
        }
      });

      if (response.ok || response.status === 204) {
        setConfirmarDeleteOpen(false);
        setUserParaDeletar(null);
        fetchUsuarios(); 
      } else {
        alert(`Erro ${response.status}: Não foi possível alterar o status do perfil.`);
      }
    } catch (err) {
      alert('Falha de conexão ao tentar deletar o usuário.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const isAdmin = () => /admin|almoxarife/i.test(localStorage.getItem('user') || '');

  // Filtragem dinâmica baseada na busca local imediata do input
  const filteredUsers = usuarios.filter(u => 
    (u.nome || '').toLowerCase().includes(buscaLocal.toLowerCase()) ||
    (u.registro || '').includes(buscaLocal) ||
    (u.email || '').toLowerCase().includes(buscaLocal.toLowerCase())
  );

  // Estilização das células da tabela para manter o visual premium
  const cellHeaderStyle = {
    fontFamily: 'Poppins',
    fontWeight: 700,
    fontSize: '0.9rem',
    color: isLight ? '#14213D' : 'rgba(255, 255, 255, 0.6)',
    borderBottom: isLight ? '2px solid rgba(0,0,0,0.06)' : '2px solid rgba(255,255,255,0.05)',
    pb: 2
  };

  const cellBodyStyle = {
    fontFamily: 'Poppins',
    color: 'text.primary',
    borderBottom: isLight ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(255,255,255,0.03)',
    py: 2
  };

  const getCargoStyle = (role) => {
    if (/admin/i.test(role)) return { color: isLight ? '#14213D' : '#00f2ff', bg: isLight ? 'rgba(20,33,61,0.06)' : 'rgba(0,242,255,0.1)' };
    if (/almoxarife/i.test(role)) return { color: '#FFB347', bg: 'rgba(255,179,71,0.1)' };
    return { color: isLight ? '#555555' : '#85FF80', bg: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(133,255,128,0.1)' };
  };

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh', 
      pb: 8, 
      pt: { xs: 4, sm: 6, md: 8 }, 
      px: { xs: 2.5, sm: 4, md: 5 }, 
      position: 'relative',
      boxSizing: 'border-box',
      backgroundImage: isLight 
        ? 'radial-gradient(rgba(0, 0, 0, 0.05) 1.5px, transparent 1.5px)' 
        : 'radial-gradient(rgba(0, 242, 255, 0.06) 1.2px, transparent 1.2px)',
      backgroundSize: '32px 32px'
    }}>
      
      {/* BOTÃO ALTERNAR TEMA */}
      <Box sx={{ position: 'absolute', top: { xs: 24, md: 40 }, right: 40, zIndex: 10, display: { xs: 'none', md: 'block' } }}>
        <IconButton onClick={() => toggleColorMode?.()} sx={{ color: 'text.primary' }}>
          {isLight ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Box>
      
      <Container maxWidth="xl" disableGutters>
        
        {/* Título Alinhado */}
        <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 900, mb: 4, color: 'text.primary', letterSpacing: '-1px', fontSize: { xs: '1.8rem', sm: '2.125rem' } }}>
          Gerenciar Perfis
        </Typography>

        {/* BARRA DE PESQUISA ELÁSTICA */}
        <Box sx={{ maxWidth: '540px', mb: 4, width: '100%' }}>
          <TextField
            fullWidth
            placeholder="Pesquisar por nome, email ou ID..."
            value={buscaLocal}
            onChange={(e) => {
              const valor = e.target.value;
              setBuscaLocal(valor);
              if (setSearchTerm) {
                setSearchTerm(valor);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                bgcolor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
                fontFamily: 'Poppins',
                '& fieldset': { border: 'none' }
              }
            }}
          />
        </Box>

        {erro && <Alert severity="error" sx={{ mb: 3, borderRadius: '15px' }}>{erro}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress sx={{ color: isLight ? 'primary.main' : '#00f2ff' }} />
          </Box>
        ) : (
          isMobile ? (
            /* 📱 VERSÃO CARDS ADAPTATIVOS */
            <Stack spacing={2.5} sx={{ width: '100%' }}>
              {filteredUsers.map((user) => {
                const roleStyle = getCargoStyle(user.perfil);
                const isUserAtivo = user.ativo !== false && user.status !== 'INATIVO';
                
                return (
                  <Paper
                    key={user.id}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: '20px',
                      border: '1px solid',
                      borderColor: isLight ? 'divider' : 'rgba(255,255,255,0.05)',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      opacity: isUserAtivo ? 1 : 0.65
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: `${roleStyle.color}15`, color: roleStyle.color, border: '1px solid', borderColor: `${roleStyle.color}30` }}>
                        <AccountCircleIcon />
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontFamily: 'Poppins', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.nome || 'Usuário Sem Nome'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary' }}>
                        #{user.registro || '000000'}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={user.perfil || 'TECNICO'} size="small" sx={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.65rem', color: roleStyle.color, bgcolor: roleStyle.bg, borderRadius: '8px' }} />
                        <Chip label={isUserAtivo ? 'Ativo' : 'Inativo'} size="small" sx={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '0.62rem', bgcolor: isUserAtivo ? 'rgba(133, 255, 128, 0.1)' : 'rgba(255, 71, 71, 0.1)', color: isUserAtivo ? '#85FF80' : '#FF4747' }} />
                      </Stack>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 0.5 }}>
                      <Button variant="outlined" size="small" onClick={() => { setUserSelecionado(user); setModalOpen(true); }} sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 600, borderRadius: '20px', fontSize: '0.75rem', borderColor: 'divider', color: 'text.primary' }}>
                        Ver detalhes
                      </Button>
                      
                      {isAdmin() && isUserAtivo && (
                        <Button 
                          variant="text" 
                          color="error" 
                          size="small" 
                          startIcon={<PersonOffIcon sx={{ fontSize: '1rem' }} />}
                          onClick={() => { setUserParaDeletar(user); setConfirmarDeleteOpen(true); }}
                          sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.75rem' }}
                        >
                          Inativar
                        </Button>
                      )}
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          ) : (
            /* 💻 VERSÃO DESKTOP */
            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{ 
                p: 3,
                borderRadius: '24px',
                border: '1px solid',
                borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255, 255, 255, 0.05)',
                bgcolor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(20, 33, 61, 0.6)',
                backdropFilter: 'blur(12px)',
                boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.02)' : '0 20px 40px rgba(0,0,0,0.15)',
                width: '100%',
                overflowX: 'auto', 
                boxSizing: 'border-box'
              }}
            >
              <Table sx={{ minWidth: 850 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={cellHeaderStyle}>Usuário</TableCell>
                    <TableCell sx={cellHeaderStyle}>ID</TableCell>
                    <TableCell sx={cellHeaderStyle}>Cargo</TableCell>
                    <TableCell sx={cellHeaderStyle}>Status</TableCell>
                    <TableCell align="right" sx={cellHeaderStyle}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const roleStyle = getCargoStyle(user.perfil);
                    const isUserAtivo = user.ativo !== false && user.status !== 'INATIVO';

                    return (
                      <TableRow 
                        key={user.id}
                        sx={{ 
                          transition: 'background-color 0.2s ease',
                          '&:hover': { bgcolor: isLight ? 'rgba(0,0,0,0.01)' : 'rgba(217, 221, 100, 0.01)' },
                          opacity: isUserAtivo ? 1 : 0.65 
                        }}
                      >
                        <TableCell sx={cellBodyStyle}>
                          {/* 🌟 CORRIGIDO: Removido o caractere "=" extra que quebrava o token do JSX */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              width: 40, height: 40, 
                              bgcolor: `${roleStyle.color}15`, 
                              color: roleStyle.color,
                              border: '1px solid', borderColor: `${roleStyle.color}30`
                            }}>
                              <AccountCircleIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>{user.nome || 'Usuário Sem Nome'}</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{user.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ ...cellBodyStyle, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, fontSize: '0.85rem' }}>
                          #{user.registro || '000000'}
                        </TableCell>

                        <TableCell sx={cellBodyStyle}>
                          <Chip 
                            label={user.perfil || 'TECNICO'} 
                            size="small"
                            sx={{ 
                              fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.7rem',
                              color: roleStyle.color, bgcolor: roleStyle.bg, borderRadius: '8px',
                              border: '1px solid', borderColor: `${roleStyle.color}20`
                            }}
                          />
                        </TableCell>

                        <TableCell sx={cellBodyStyle}>
                          <Chip 
                            label={isUserAtivo ? 'Ativo' : 'Inativo'} 
                            size="small"
                            sx={{ 
                              fontFamily: 'Poppins', fontWeight: 800, fontSize: '0.65rem',
                              bgcolor: isUserAtivo ? 'rgba(133, 255, 128, 0.1)' : 'rgba(255, 71, 71, 0.1)',
                              color: isUserAtivo ? '#85FF80' : '#FF4747',
                              border: '1px solid', borderColor: isUserAtivo ? 'rgba(133, 255, 128, 0.2)' : 'rgba(255, 71, 71, 0.2)'
                          }}
                          />
                        </TableCell>

                        <TableCell align="right" sx={cellBodyStyle}>
                          <Button 
                            variant="text" 
                            size="small"
                            onClick={() => { setUserSelecionado(user); setModalOpen(true); }}
                            sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, mr: 1, color: isLight ? '#14213D' : '#00f2ff' }}
                          >
                            Ver detalhes
                          </Button>
                          
                          {isAdmin() && isUserAtivo && (
                            <Tooltip title="Inativar Funcionário" arrow placement="top">
                              <IconButton 
                                onClick={() => { setUserParaDeletar(user); setConfirmarDeleteOpen(true); }}
                                sx={{ color: '#FF4747', '&:hover': { bgcolor: 'rgba(255,71,71,0.1)' } }}
                              >
                                <PersonOffIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}

        {!loading && filteredUsers.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '100%' }}>
            <SearchIcon sx={{ color: 'text.secondary', fontSize: '2rem' }} />
            <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: 'text.secondary' }}>
              {buscaLocal ? 'Nenhum perfil corresponde à sua busca.' : 'Nenhum perfil cadastrado na base.'}
            </Typography>
          </Box>
        )}
      </Container>

      {/* --- MODAL DE DETALHES RESPONSIVO --- */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        PaperProps={{ sx: { borderRadius: '28px', p: 2, bgcolor: isLight ? '#fff' : '#14213D', minWidth: { xs: '85%', sm: '420px' } } }}
      >
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 800, color: 'text.primary' }}>Ficha Técnico-Cadastral</DialogTitle>
        <DialogContent>
          {userSelecionado && (
            <Stack spacing={3} sx={{ mt: 2, width: '100%' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(0, 242, 255, 0.1)', color: '#00f2ff', flexShrink: 0 }}>
                  <AccountCircleIcon sx={{ fontSize: '2.2rem' }} />
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userSelecionado.nome}</Typography>
                  <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', color: 'text.secondary', fontSize: '0.8rem' }}>ID #{userSelecionado.id || 'N/A'}</Typography>
                </Box>
              </Box>
              <Divider />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                    <EmailIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">E-mail de Contato</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userSelecionado.email}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={6} sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <BadgeIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Registro</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>{userSelecionado.registro}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={6} sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <VerifiedUserIcon sx={{ color: (userSelecionado.ativo === false || userSelecionado.status === 'INATIVO') ? '#FF4747' : '#85FF80', flexShrink: 0 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Status</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '0.9rem', color: (userSelecionado.ativo === false || userSelecionado.status === 'INATIVO') ? '#FF4747' : '#85FF80' }}>
                        {(userSelecionado.ativo === false || userSelecionado.status === 'INATIVO') ? 'Inativo' : 'Ativo'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 1, pb: 2 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, color: 'text.primary', borderRadius: '12px' }}>Fechar Ficha</Button>
        </DialogActions>
      </Dialog>

      {/* --- MODAL CONFIRMAÇÃO DE DELETAR --- */}
      <Dialog open={confirmarDeleteOpen} onClose={() => setConfirmarDeleteOpen(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1, bgcolor: isLight ? '#ffffff' : '#14213D', minWidth: { xs: '85%', sm: '365px' } } }}>
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>Remover Usuário do Sistema?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'Poppins' }}>
            Você está prestes a desativar os acessos e marcar como inativo o perfil de <strong>{userParaDeletar?.nome}</strong> (Registro: {userParaDeletar?.registro}). O histórico continuará salvo no sistema.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmarDeleteOpen(false)} disabled={deleteLoading} sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 600, color: 'text.secondary' }}>Cancelar</Button>
          <Button onClick={handleConfirmarExclusao} variant="contained" disabled={deleteLoading} sx={{ textTransform: 'none', fontFamily: 'Poppins', fontWeight: 700, bgcolor: theme.palette.error.main, color: 'white', borderRadius: '10px' }}>
            {deleteLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirmar Desativação'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListarPerfis;