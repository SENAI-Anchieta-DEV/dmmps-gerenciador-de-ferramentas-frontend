import React, { useState, useEffect } from 'react'; 
import { Box, Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider, InputBase, Badge, IconButton, Chip, useTheme, useMediaQuery, AppBar, Toolbar, Collapse } from '@mui/material';
import { Stack } from '@mui/material'; 
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard'; 
import ConstructionIcon from '@mui/icons-material/Construction'; 
import SettingsIcon from '@mui/icons-material/Settings'; 
import WarningIcon from '@mui/icons-material/Warning'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import LogoutIcon from '@mui/icons-material/Logout'; 
import SearchIcon from '@mui/icons-material/Search'; 
import NotificationsIcon from '@mui/icons-material/Notifications'; 
import MenuOpenIcon from '@mui/icons-material/MenuOpen'; 
import MenuIcon from '@mui/icons-material/Menu'; 
import CloseIcon from '@mui/icons-material/Close'; 
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PeopleIcon from '@mui/icons-material/People'; 
import HistoryIcon from '@mui/icons-material/History'; 

import API_BASE_URL from '../apiConfig'; 

const drawerWidth = 260;

const Layout = ({ toggleColorMode }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation(); 
  const [notificacoes] = useState(3); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const isLight = theme.palette.mode === 'light';

  // 📱 Controle do Menu Superior Sanfona no Mobile
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [menuExpanded, setMenuExpanded] = useState(false);

  // 🟡 ESTADOS REATIVOS DO PERFIL DO USUÁRIO
  const [usuarioNome, setUsuarioNome] = useState('Usuário');
  const [usuarioRegistro, setUsuarioRegistro] = useState('#000000');
  const [usuarioPerfil, setUsuarioPerfil] = useState(''); 

  const menuItems = [
    { text: 'Início', icon: <DashboardIcon />, path: '/dashboard', restrito: false, exclusivoTecnico: false },
    { text: 'Em uso', icon: <ConstructionIcon />, path: '/dashboard/em-uso', restrito: false, exclusivoTecnico: false },
    { text: 'Ferramentas', icon: <SettingsIcon />, path: '/dashboard/ferramentas', restrito: false, exclusivoTecnico: false },
    { text: 'Ocorrências', icon: <WarningIcon />, path: '/dashboard/ocorrencias', restrito: false, exclusivoTecnico: false },
    { text: 'Histórico', icon: <HistoryIcon />, path: '/dashboard/historico', restrito: false, exclusivoTecnico: true }, 
    { text: 'Novo Perfil', icon: <AccountCircleIcon />, path: '/dashboard/perfil/cadastrar', restrito: true, exclusivoTecnico: false }, 
    { text: 'Lista de Perfis', icon: <PeopleIcon />, path: '/dashboard/perfil/listar', restrito: true, exclusivoTecnico: false },   
  ];

  useEffect(() => {
    const carregarPerfilUsuario = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const meuPerfil = await response.json();
          if (meuPerfil.nome) setUsuarioNome(meuPerfil.nome);
          if (meuPerfil.registro) setUsuarioRegistro(meuPerfil.registro);
          if (meuPerfil.perfil) {
            setUsuarioPerfil(meuPerfil.perfil);
            localStorage.setItem('perfil', meuPerfil.perfil); 
          }
        }
      } catch (err) {
        console.error("Falha ao conectar na rota /me do back-end:", err);
      }
    };

    carregarPerfilUsuario();
  }, []);

  const itensFiltrados = menuItems.filter(item => {
    if (item.restrito && usuarioPerfil !== 'ADMIN') return false;
    if (item.exclusivoTecnico && usuarioPerfil !== 'TECNICO') return false;
    return true;
  });

  const isEmUsoPage = location.pathname.includes('em-uso');
  const isOcorrenciasPage = location.pathname.includes('ocorrencias'); 
  const isCadastrarPerfilPage = location.pathname.includes('perfil/cadastrar');
  const isListarPerfisPage = location.pathname.includes('perfil/listar');
  const isHistoricoPage = location.pathname.includes('historico'); 
  
  const isDashboardHome = location.pathname === '/dashboard' || location.pathname === '/dashboard/';
  const isCleanPage = isCadastrarPerfilPage || isListarPerfisPage || isOcorrenciasPage || isHistoricoPage || location.pathname.includes('perfil/meu'); 

  const handleLogout = () => { 
    localStorage.clear(); 
    navigate('/'); 
  };

  const obtenerInicial = (nome) => {
    if (!nome || nome === 'Usuário') return 'U';
    return nome.trim().charAt(0).toUpperCase();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: isMobile ? 'column' : 'row', bgcolor: 'background.default' }}>
      
      {/* 📱 VERSÃO MOBILE: Ajustada para uma presença mais imponente, gordinha e confortável de usar */}
      {isMobile ? (
        <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 3, minHeight: { xs: 80, sm: 80 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                color="inherit" 
                onClick={() => setMenuExpanded(!menuExpanded)}
                sx={{ bgcolor: 'action.hover', borderRadius: '12px', p: 1.2 }}
              >
                {menuExpanded ? <CloseIcon sx={{ fontSize: '1.6rem' }} /> : <MenuIcon sx={{ fontSize: '1.6rem' }} />}
              </IconButton>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 800, letterSpacing: '1px', fontSize: '1.15rem' }}>
                TOOLHUB
              </Typography>
            </Box>

            {/* Ícones de Notificação e Tema fixados perfeitamente juntos na extrema direita */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Badge badgeContent={notificacoes} color="error" overlap="circular">
                <IconButton color="inherit" sx={{ bgcolor: 'action.hover', borderRadius: '12px', p: 1.2 }}><NotificationsIcon sx={{ fontSize: '1.5rem' }} /></IconButton>
              </Badge>
              <IconButton 
                onClick={toggleColorMode} 
                sx={{ color: 'text.primary', bgcolor: 'action.hover', borderRadius: '12px', p: 1.2 }}
              >
                {theme.palette.mode === 'dark' ? <Brightness7Icon sx={{ fontSize: '1.5rem' }} /> : <Brightness4Icon sx={{ fontSize: '1.5rem' }} />}
              </IconButton>
            </Box>
          </Toolbar>

          {/* Painel Dropdown Suave (Sanfona) que desce perfeitamente sincronizado dos 80px */}
          <Collapse in={menuExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', px: 3, pb: 2, maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
              <List>
                {itensFiltrados.map((item) => (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton 
                      component={NavLink} 
                      to={item.path} 
                      onClick={() => setMenuExpanded(false)}
                      sx={{ borderRadius: '8px', color: 'text.primary', '&.active': { bgcolor: 'action.selected' } }}
                    >
                      <ListItemIcon sx={{ color: 'text.primary' }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} primaryTypographyProps={{ fontFamily: 'Poppins', fontWeight: 500 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <ListItemButton 
                  onClick={() => { navigate('/dashboard/perfil/meu'); setMenuExpanded(false); }}
                  sx={{ borderRadius: '8px', mb: 0.5 }}
                >
                  <ListItemIcon sx={{ color: 'text.primary' }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem', bgcolor: 'primary.main' }}>{obtenerInicial(usuarioNome)}</Avatar>
                  </ListItemIcon>
                  <ListItemText primary={`Perfil (${usuarioNome})`} primaryTypographyProps={{ fontFamily: 'Poppins', fontWeight: 500 }} />
                </ListItemButton>
                <ListItemButton onClick={handleLogout} sx={{ borderRadius: '8px', color: 'error.main' }}>
                  <ListItemIcon sx={{ color: 'error.main' }}><LogoutIcon /></ListItemIcon>
                  <ListItemText primary="Sair do Sistema" primaryTypographyProps={{ fontFamily: 'Poppins', fontWeight: 500 }} />
                </ListItemButton>
              </List>
            </Box>
          </Collapse>
        </AppBar>
      ) : (
        /* 💻 VERSÃO DESKTOP: Mantém a Sidebar clássica intacta e estilosa */
        <Drawer variant="permanent" sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo Preservada com cruzamentos geométricos */}
            <Box sx={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', borderColor: 'divider', m: 3, borderRadius: '12px', position: 'relative', flexShrink: 0 }}>
              <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'divider', transform: 'rotate(27deg)' }} />
              <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'divider', transform: 'rotate(-27deg)' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Poppins' }}>LOGO TOOLHUB</Typography>
            </Box>

            {/* Avatar do Usuário */}
            <Box onClick={() => navigate('/dashboard/perfil/meu')} sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1.5, gap: 2, flexShrink: 0, cursor: 'pointer', mx: 2, borderRadius: '12px', transition: 'background-color 0.2s ease', '&:hover': { bgcolor: 'action.hover' } }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', border: '2px solid', borderColor: 'divider', fontWeight: 700, fontSize: '1.4rem', fontFamily: 'Poppins' }}>
                {obtenerInicial(usuarioNome)}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2, color: 'text.primary', fontFamily: 'Poppins', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {usuarioNome}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary', fontSize: '0.8rem', mt: 0.5 }}>
                  {usuarioRegistro.startsWith('#') ? usuarioRegistro : `#${usuarioRegistro}`}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2, mx: 2 }} />

            <List sx={{ flexGrow: 1, px: 2 }}>
              {itensFiltrados.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton component={NavLink} to={item.path} sx={{ borderRadius: '8px', color: 'text.primary', '&.active': { bgcolor: 'action.selected' }, '& .MuiListItemIcon-root': { color: 'text.primary', minWidth: '40px' } }}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            
            <Divider />
            <List sx={{ px: 2, pb: 2 }}>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: '8px', color: 'text.primary' }}>
                <ListItemIcon sx={{ color: 'text.primary', minWidth: '40px' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
      )}

      {/* 💻 CONTEÚDO PRINCIPAL DAS PÁGINAS */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: isCleanPage ? 0 : { xs: 2, sm: 3, md: 4 }, 
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          mt: isMobile ? '80px' : 0, 
          position: 'relative',
          background: isLight 
            ? `radial-gradient(circle at 1px 1px, rgba(20,33,61,0.06) 1px, transparent 0), linear-gradient(0deg, rgba(20,33,61,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(20,33,61,0.015) 1px, transparent 1px)`
            : `radial-gradient(circle at 1px 1px, rgba(0,242,255,0.15) 1px, transparent 0), linear-gradient(0deg, rgba(0,242,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px',
        }}
      >
        {/* 🌟 REORGANIZAÇÃO: Cabeçalho limpo sem os chips estáticos redundantes */}
        {!isCleanPage && !isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 3, width: '100%', pr: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isDashboardHome && (
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: '24px', px: 2, bgcolor: 'background.paper', width: '260px' }}>
                  <InputBase 
                    placeholder="Buscar ferramenta..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ ml: 1, flex: 1, p: '6px 0', fontSize: '0.85rem', fontFamily: 'Poppins' }} 
                  />
                  <IconButton size="small"><SearchIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Badge badgeContent={notificacoes} color="error" overlap="circular">
                  <IconButton color="inherit"><NotificationsIcon sx={{ fontSize: '1.6rem' }} /></IconButton>
                </Badge>
                <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary', bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
                  {theme.palette.mode === 'dark' ? <Brightness7Icon sx={{ fontSize: '1.5rem' }} /> : <Brightness4Icon sx={{ fontSize: '1.5rem' }} />}
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ width: '100%', height: '100%' }}>
          <Outlet context={{ toggleColorMode, searchTerm }} /> 
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;