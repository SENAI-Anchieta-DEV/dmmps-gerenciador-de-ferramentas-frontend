import React, { useState, useEffect } from 'react'; // 🌟 Atualizado: Incluído useEffect
import { Box, Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider, InputBase, Badge, IconButton, Chip, useTheme } from '@mui/material';
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
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PeopleIcon from '@mui/icons-material/People'; 

import API_BASE_URL from '../apiConfig'; // Puxa a url do seu back-end automaticamente

const drawerWidth = 260;

const Layout = ({ toggleColorMode }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation(); 
  const [notificacoes] = useState(3); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const isLight = theme.palette.mode === 'light';

  // 🟡 ESTADOS REATIVOS DO PERFIL DO USUÁRIO
  const [usuarioNome, setUsuarioNome] = useState('Usuário');
  const [usuarioRegistro, setUsuarioRegistro] = useState('#000000');
  const [usuarioPerfil, setUsuarioPerfil] = useState(''); // 🌟 NOVO: Estado para travar o menu lateral de forma nativa

  // 🧱 ITENS DO MENU REALOCADOS PARA DENTRO DO ESCOPO DE FILTRAGEM DINÂMICA
  const menuItems = [
    { text: 'Menu', icon: <MenuOpenIcon />, path: null, restrito: false }, 
    { text: 'Início', icon: <DashboardIcon />, path: '/dashboard', restrito: false },
    { text: 'Em uso', icon: <ConstructionIcon />, path: '/dashboard/em-uso', restrito: false },
    { text: 'Ferramentas', icon: <SettingsIcon />, path: '/dashboard/ferramentas', restrito: false },
    { text: 'Ocorrências', icon: <WarningIcon />, path: '/dashboard/ocorrencias', restrito: false },
    { text: 'Novo Perfil', icon: <AccountCircleIcon />, path: '/dashboard/perfil/cadastrar', restrito: true }, // 🔒 Administrativo
    { text: 'Lista de Perfis', icon: <PeopleIcon />, path: '/dashboard/perfil/listar', restrito: true },   // 🔒 Administrativo
  ];

  // 🔄 CARREGAMENTO LIMPO E PROFISSIONAL (ROTA DE PERFIL PRÓPRIO /ME)
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
          
          // 🔐 FLUXO DE SEGURANÇA SEGURO: Armazena o enum real do banco sem adivinhações por string
          if (meuPerfil.perfil) {
            setUsuarioPerfil(meuPerfil.perfil);
            localStorage.setItem('perfil', meuPerfil.perfil); // Salva para o Ferramentas.jsx ler!
          }
        } else {
          console.error(`Erro ${response.status} ao carregar perfil do banco.`);
        }
      } catch (err) {
        console.error("Falha ao conectar na rota /me do back-end:", err);
      }
    };

    carregarPerfilUsuario();
  }, []);

  // 🔒 REGRA OPERACIONAL DO MENU: Filtra as abas se o usuário logado for Técnico
  const itensFiltrados = menuItems.filter(item => {
    if (item.restrito && usuarioPerfil === 'TECNICO') {
      return false;
    }
    return true;
  });

  const isEmUsoPage = location.pathname.includes('em-uso');
  const isOcorrenciasPage = location.pathname.includes('ocorrencias'); 
  const isCadastrarPerfilPage = location.pathname.includes('perfil/cadastrar');
  const isListarPerfisPage = location.pathname.includes('perfil/listar');
  
  const isDashboardHome = location.pathname === '/dashboard' || location.pathname === '/dashboard/';
  const isCleanPage = isCadastrarPerfilPage || isListarPerfisPage || isOcorrenciasPage;

  const handleLogout = () => { 
    localStorage.clear(); 
    navigate('/'); 
  };

  const obtenerInicial = (nome) => {
    if (!nome || nome === 'Usuário') return 'U';
    return nome.trim().charAt(0).toUpperCase();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer variant="permanent" sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}>
          <Box sx={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', borderColor: 'divider', m: 3, borderRadius: '12px', position: 'relative', flexShrink: 0 }}>
            <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'divider', transform: 'rotate(27deg)' }} />
            <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'divider', transform: 'rotate(-27deg)' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Poppins' }}>LOGO TOOLHUB</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1, gap: 2, flexShrink: 0 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', border: '2px solid', borderColor: 'divider', fontWeight: 700, fontSize: '1.4rem', fontFamily: 'Poppins' }}>
              {obtenerInicial(usuarioNome)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2, color: 'text.primary', fontFamily: 'Poppins', fontSize: '1rem' }}>
                {usuarioNome}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary', fontSize: '0.8rem', mt: 0.5 }}>
                {usuarioRegistro.startsWith('#') ? usuarioRegistro : `#${usuarioRegistro}`}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, mx: 2 }} />

          {/* 🟡 ATUALIZADO: Consumindo a lista filtrada de acordo com as permissões do banco */}
          <List sx={{ flexGrow: 1, px: 2 }}>
            {itensFiltrados.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton component={item.path ? NavLink : 'div'} to={item.path} sx={{ borderRadius: '8px', color: 'text.primary', '&.active': { bgcolor: 'action.selected' }, '& .MuiListItemIcon-root': { color: 'text.primary', minWidth: '40px' } }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: item.path ? 500 : 700 }} />
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

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: isCleanPage ? 0 : { xs: 2, md: 4 }, 
          width: `calc(100% - ${drawerWidth}px)`,
          position: 'relative',
          background: isLight 
            ? `radial-gradient(circle at 1px 1px, rgba(20,33,61,0.06) 1px, transparent 0), linear-gradient(0deg, rgba(20,33,61,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(20,33,61,0.015) 1px, transparent 1px)`
            : `radial-gradient(circle at 1px 1px, rgba(0,242,255,0.15) 1px, transparent 0), linear-gradient(0deg, rgba(0,242,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px',
        }}
      >
        {!isCleanPage && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, width: '100%', pr: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}> 
              {!isOcorrenciasPage && !isDashboardHome && (
                <>
                  <Chip icon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#85FF80', ml: 1 }} />} label="Disponível" variant="outlined" sx={{ borderRadius: '20px', borderColor: 'divider', fontWeight: 600 }} />
                  {!isEmUsoPage && ( 
                    <>
                      <Chip icon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FF6961', ml: 1 }} />} label="Manutenção" variant="outlined" sx={{ borderRadius: '20px', borderColor: 'divider' }} />
                      <Chip icon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FFB347', ml: 1 }} />} label="Em Uso" variant="outlined" sx={{ borderRadius: '20px', borderColor: 'divider' }} />
                    </>
                  )}
                </>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge badgeContent={notificacoes} color="error" overlap="circular">
                <IconButton color="inherit"><NotificationsIcon sx={{ fontSize: '1.6rem' }} /></IconButton>
              </Badge>
              
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
              
              <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary', ml: 1, bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon sx={{ fontSize: '1.5rem' }} /> : <Brightness4Icon sx={{ fontSize: '1.5rem' }} />}
              </IconButton>
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