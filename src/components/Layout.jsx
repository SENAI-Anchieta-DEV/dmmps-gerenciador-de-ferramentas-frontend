import React, { useState } from 'react';
import { Box, Drawer, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider, InputBase, Badge, IconButton, Chip, useTheme } from '@mui/material';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';

// Ícones MUI
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

const drawerWidth = 260;

const menuItems = [
  { text: 'Menu', icon: <MenuOpenIcon />, path: null }, 
  { text: 'Início', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Em uso', icon: <ConstructionIcon />, path: '/dashboard/em-uso' },
  { text: 'Ferramentas', icon: <SettingsIcon />, path: '/dashboard/ferramentas' },
  { text: 'Ocorrências', icon: <WarningIcon />, path: '/dashboard/ocorrencias' },
  { text: 'Perfil', icon: <AccountCircleIcon />, path: '/dashboard/perfil' },
];

const Layout = ({ toggleColorMode }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation(); // Hook para identificar a rota atual
  const [notificacoes] = useState(3); 

  // Verifica se a URL atual contém 'em-uso'
  const isEmUsoPage = location.pathname.includes('em-uso');

  const handleLogout = () => {
    navigate('/'); 
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}>
      {/* Logo */}
      <Box sx={{ 
        height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', 
        border: '1px solid', borderColor: 'divider', m: 3, borderRadius: '12px', position: 'relative', flexShrink: 0
      }}>
        <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'divider', transform: 'rotate(27deg)' }} />
        <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'divider', transform: 'rotate(-27deg)' }} />
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Poppins' }}>LOGO TOOLHUB</Typography>
      </Box>

      {/* Perfil */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1, gap: 2, flexShrink: 0 }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', border: '2px solid', borderColor: 'divider' }}>U</Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2, color: 'text.primary' }}>Usuário</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary' }}>#110605</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2, mx: 2 }} />

      {/* Itens do Menu */}
      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              component={item.path ? NavLink : 'div'} 
              to={item.path} 
              sx={{ 
                borderRadius: '8px',
                color: 'text.primary',
                '&.active': { bgcolor: 'action.selected' },
                '& .MuiListItemIcon-root': { color: 'text.primary', minWidth: '40px' }
              }}
            >
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
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, width: `calc(100% - ${drawerWidth}px)` }}>
        
        {/* Header Superior */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 5, 
          width: '100%',
          pr: 2 
        }}>
          
          {/* 1. Esquerda: Semáforo Dinâmico */}
          <Box sx={{ display: 'flex', gap: 1.5 }}> 
            <Chip 
              icon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#85FF80', ml: 1 }} />}
              label="Em Uso" variant="outlined" sx={{ borderRadius: '20px', borderColor: 'divider', fontWeight: 600 }}
            />
            
            {!isEmUsoPage && ( // Só mostra os outros se NÃO estiver na página "Em Uso"
              <>
                <Chip 
                  icon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FF6961', ml: 1 }} />}
                  label="Não Devolvidas" variant="outlined" sx={{ borderRadius: '20px', borderColor: 'divider' }}
                />
                <Chip 
                  icon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FFB347', ml: 1 }} />}
                  label="Manutenção" variant="outlined" sx={{ borderRadius: '20px', borderColor: 'divider' }}
                />
              </>
            )}
          </Box>

          {/* 2. Direita: Notificações + Busca + Botão de Tema */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            
            {/* Sino de Notificações */}
            <Badge badgeContent={notificacoes} color="error" overlap="circular">
              <IconButton color="inherit">
                <NotificationsIcon sx={{ fontSize: '1.6rem' }} />
              </IconButton>
            </Badge>

            {/* Barra de Busca */}
            <Box sx={{ 
              display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', 
              borderRadius: '24px', px: 2, bgcolor: 'background.paper', width: '260px' 
            }}>
              <InputBase
                placeholder="Buscar ferramenta..."
                sx={{ ml: 1, flex: 1, p: '6px 0', fontSize: '0.85rem', fontFamily: 'Poppins' }}
              />
              <IconButton size="small"><SearchIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
            </Box>

            {/* BOTÃO DE TEMA */}
            <IconButton 
              onClick={toggleColorMode} 
              sx={{ 
                color: 'text.primary',
                ml: 1,
                bgcolor: 'action.hover', 
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              {theme.palette.mode === 'dark' ? (
                <Brightness7Icon sx={{ fontSize: '1.5rem' }} /> 
              ) : (
                <Brightness4Icon sx={{ fontSize: '1.5rem' }} />
              )}
            </IconButton>
          </Box>
        </Box>

        {/* Conteúdo dinâmico das páginas */}
        <Box sx={{ width: '100%' }}>
          <Outlet /> 
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;