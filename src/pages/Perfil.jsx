import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Typography, Paper, Avatar, Grid, Divider, CircularProgress, useTheme, IconButton, useMediaQuery } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import API_BASE_URL from '../apiConfig';

const Perfil = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { toggleColorMode } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [dadosUsuario, setDadosUsuario] = useState(null);

  useEffect(() => {
    const buscarDadosPerfil = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/usuarios/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDadosUsuario(data);
        } else {
          // Fallback caso esteja em ambiente de testes sem o token real
          setDadosUsuario({
            nome: localStorage.getItem('usuarioNome') || 'Marcus (Admin)',
            registro: localStorage.getItem('usuarioRegistro') || 'REG-001',
            perfil: localStorage.getItem('perfil') || 'ADMIN',
            email: 'admin@toolhub.com'
          });
        }
      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    buscarDadosPerfil();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress sx={{ color: isLight ? 'primary.main' : '#00f2ff' }} /></Box>;

  // 🌟 CORRIGIDO: Limpa parênteses e caracteres especiais para não quebrar a exibição de iniciais (Ex: "M(")
  const obterIniciais = (nome) => {
    if (!nome) return 'U';
    const nomeLimpo = nome.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim(); 
    const partes = nomeLimpo.split(/\s+/);
    if (partes.length > 1) return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
    return partes[0].charAt(0).toUpperCase();
  };

  const traduzirPerfil = (perf) => {
    const perfis = { 'ADMIN': 'Administrador', 'ALMOXARIFE': 'Almoxarife / Estoque', 'TECNICO': 'Técnico de Operações' };
    return perfis[perf] || perf;
  };

  return (
    /* 🌟 FIX DE ESPAÇAMENTO DESKTOP: Injetado px reativo para desgrudar da Sidebar e manter o alinhamento padrão */
    <Box sx={{ 
      width: '100%', 
      maxWidth: '800px', 
      mx: 'auto', 
      position: 'relative', 
      pt: { xs: 4, sm: 6, md: 8 }, 
      pb: 5,
      px: { xs: 2.5, sm: 4, md: 5 }, 
      boxSizing: 'border-box'
    }}>
      
      {/* Botão de Tema no Desktop */}
      {!isMobile && (
        <Box sx={{ position: 'absolute', top: { xs: 24, md: 40 }, right: 0, zIndex: 10 }}>
          <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary', bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      )}

      {/* Título Meu Perfil */}
      <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', display: 'flex', alignItems: 'center', gap: 1.5, fontSize: { xs: '1.8rem', sm: '2.125rem' } }}>
        <AccountBoxIcon sx={{ fontSize: { xs: '2.2rem', sm: '2.5rem' }, color: isLight ? '#14213D' : '#00f2ff' }} /> Meu Perfil
      </Typography>

      {/* Cartão de Exibição das Informações */}
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: '24px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', width: '100%', boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: { xs: 2.5, sm: 4 }, mb: 4 }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: isLight ? '#14213D' : '#00f2ff', color: isLight ? '#fff' : '#14213D', fontSize: '2.2rem', fontWeight: 700, fontFamily: 'Poppins', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            {obterIniciais(dadosUsuario?.nome)}
          </Avatar>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              {dadosUsuario?.nome}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary', mt: 0.5, fontWeight: 600 }}>
              Matrícula: {dadosUsuario?.registro}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: '14px', bgcolor: 'action.hover' }}>
              <BadgeIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Poppins', display: 'block' }}>Função / Cargo</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'Poppins', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{traduzirPerfil(dadosUsuario?.perfil)}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: '14px', bgcolor: 'action.hover' }}>
              <EmailIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Poppins', display: 'block' }}>E-mail Institucional</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'Poppins', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dadosUsuario?.email || 'usuario@senai.com.br'}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>/*6566*/
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: '14px', border: '1px dashed', borderColor: 'divider' }}>
              <AdminPanelSettingsIcon sx={{ color: '#FFB347', flexShrink: 0 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Poppins', display: 'block' }}>Nível de Permissão</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#FFB347', fontSize: '0.85rem' }}>
                  ROLE_{dadosUsuario?.perfil}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Perfil;