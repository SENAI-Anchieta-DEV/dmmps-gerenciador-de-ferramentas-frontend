import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Typography, Paper, Avatar, Grid, Divider, CircularProgress, useTheme, IconButton } from '@mui/material';
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
            nome: localStorage.getItem('usuarioNome') || 'Sebastian Angel',
            registro: localStorage.getItem('usuarioRegistro') || 'RE-2026',
            perfil: localStorage.getItem('perfil') || 'ADMIN',
            email: 'sebastian@toolhub.com.br'
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

  const obterIniciais = (nome) => {
    if (!nome) return 'U';
    const partes = nome.trim().split(' ');
    if (partes.length > 1) return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
    return partes[0].charAt(0).toUpperCase();
  };

  const traduzirPerfil = (perf) => {
    const perfis = { 'ADMIN': 'Administrador', 'ALMOXARIFE': 'Almoxarife / Estoque', 'TECNICO': 'Técnico de Operações' };
    return perfis[perf] || perf;
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', position: 'relative', pt: 8, pb: 5 }}>
      
      {/* Botão de Tema no canto superior direito */}
      <Box sx={{ position: 'absolute', top: 20, right: 0 }}>
        <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary', bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Poppins', fontWeight: 800, color: isLight ? '#14213D' : '#f5f5f5', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AccountBoxIcon sx={{ fontSize: '2.5rem', color: isLight ? '#14213D' : '#00f2ff' }} /> Meu Perfil
      </Typography>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4, mb: 4 }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: isLight ? '#14213D' : '#00f2ff', color: isLight ? '#fff' : '#14213D', fontSize: '2.2rem', fontWeight: 700, fontFamily: 'Poppins', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            {obterIniciais(dadosUsuario?.nome)}
          </Avatar>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'text.primary' }}>
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
              <BadgeIcon sx={{ color: 'text.secondary' }} />
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Poppins', display: 'block' }}>Função / Cargo</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>{traduzirPerfil(dadosUsuario?.perfil)}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: '14px', bgcolor: 'action.hover' }}>
              <EmailIcon sx={{ color: 'text.secondary' }} />
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Poppins', display: 'block' }}>E-mail Institucional</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>{dadosUsuario?.email || 'usuario@senai.com.br'}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: '14px', border: '1px dashed', borderColor: 'divider' }}>
              <AdminPanelSettingsIcon sx={{ color: '#FFB347' }} />
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Poppins', display: 'block' }}>Nível de Permissão</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#FFB347' }}>
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