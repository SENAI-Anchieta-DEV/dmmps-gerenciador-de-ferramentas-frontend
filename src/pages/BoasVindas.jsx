import React from 'react';
import { 
  Box, Typography, Container, Button, AppBar, Toolbar, 
  IconButton, Stack, Grid, Paper, Accordion, AccordionSummary, 
  AccordionDetails, useTheme 
} from '@mui/material';
import { Link } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ConstructionIcon from '@mui/icons-material/Construction';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function BoasVindas({ toggleColorMode }) {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      
      {/* HEADER / NAVBAR - Aumentado para 90px */}
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'rgba(20, 33, 61, 0.95)', backdropFilter: 'blur(10px)' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ minHeight: 90, justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1, fontFamily: 'Poppins' }}>
              TOOL<Box component="span" sx={{ color: 'primary.light' }}>HUB</Box>
            </Typography>

            <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button component="a" href="#inicio" color="inherit" sx={{ textTransform: 'none', fontFamily: 'Poppins' }}>Início</Button>
              <Button component="a" href="#sobre" color="inherit" sx={{ textTransform: 'none', fontFamily: 'Poppins' }}>Sobre</Button>
              <Button component="a" href="#ajuda" color="inherit" sx={{ textTransform: 'none', fontFamily: 'Poppins' }}>Ajuda</Button>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <Button 
                component={Link} 
                to="/login" 
                variant="contained" 
                sx={{ 
                  bgcolor: 'white', 
                  color: '#14213D', 
                  fontWeight: 700,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontFamily: 'Poppins',
                  px: 3,
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                Acessar Site
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* HERO SECTION - Espaçamento ajustado para as ondas */}
      <Box id="inicio" sx={{ 
        pt: 22, pb: 25, 
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(180deg, #14213D 0%, #2b3a55 100%)' 
          : 'linear-gradient(180deg, #0A1128 0%, #14213D 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontFamily: 'Poppins' }}>
            ToolHub
          </Typography>
          <Typography variant="h5" sx={{ mb: 6, opacity: 0.9, fontFamily: 'Poppins', fontWeight: 300 }}>
            Gerenciamento inteligente para ferramentas profissionais.
          </Typography>

          {/* Vídeo/Pitch Container */}
          <Paper elevation={20} sx={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            borderRadius: '24px', 
            bgcolor: 'rgba(255,255,255,0.1)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="body1" color="inherit" sx={{ opacity: 0.7 }}>
              Espaço reservado para o vídeo/pitch do projeto
            </Typography>
          </Paper>

          <Typography variant="body1" sx={{ mt: 8, fontFamily: 'Poppins', fontStyle: 'italic', opacity: 0.8 }}>
            Todas as informações que você precisa em um só lugar.
          </Typography>
        </Container>

        {/* ONDAS SVG - Ajuste de posicionamento */}
        <Box sx={{ position: 'absolute', bottom: -2, left: 0, width: '100%', lineHeight: 0 }}>
          <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path fill={theme.palette.background.default} d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </Box>
      </Box>

      {/* POR QUE USAR O TOOLHUB? - Cards Lado a Lado (Horizontal) */}
      <Container id="sobre" maxWidth="lg" sx={{ py: 12 }}>
        <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mb: 8, fontFamily: 'Poppins' }}>
          Por que usar o ToolHub?
        </Typography>

        <Grid container spacing={3} alignItems="stretch" justifyContent="center">
          {[
            { icon: <ConstructionIcon fontSize="large" />, title: "Centralização", desc: "Controle empréstimos, localização e disponibilidade em tempo real." },
            { icon: <TrendingUpIcon fontSize="large" />, title: "Eficiência", desc: "Otimize o uso de recursos e reduza perdas por falta de controle." },
            { icon: <SecurityIcon fontSize="large" />, title: "Segurança", desc: "Histórico completo de quem usou e quando devolveu cada equipamento." }
          ].map((item, index) => (
            <Grid item xs={12} sm={4} key={index}> {/* Mudado de md={4} para sm={4} para garantir a horizontal em tablets/monitores */}
              <Paper sx={{ 
                p: 4, 
                textAlign: 'center', 
                borderRadius: '20px', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                transition: '0.3s',
                border: '1px solid',
                borderColor: 'divider', // Adiciona uma borda sutil para definir melhor o espaço
                boxShadow: 'none', // Remove a sombra pesada para um visual mais limpo
                '&:hover': { 
                  transform: 'translateY(-10px)', 
                  boxShadow: theme.palette.mode === 'light' ? '0 10px 30px rgba(0,0,0,0.05)' : '0 10px 30px rgba(0,0,0,0.3)',
                  borderColor: 'primary.main'
                }
              }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Poppins', fontSize: '1.1rem' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Poppins', lineHeight: 1.6 }}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* AJUDA / FAQ - Centralização dos Contatos */}
      <Box id="ajuda" sx={{ bgcolor: theme.palette.mode === 'light' ? '#f0f2f5' : '#0d162d', py: 15 }}>
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mb: 8, fontFamily: 'Poppins' }}>
            Dúvidas Frequentes
          </Typography>

          <Stack spacing={2} sx={{ mb: 10 }}>
            {[
              { q: "Como acessar o sistema?", a: "Clique em 'Acessar Site' no menu superior e entre com seu CPF/Email e senha cadastrados." },
              { q: "Esqueci minha senha, o que faço?", a: "Na tela de login, clique em 'Esqueceu a senha?' para iniciar o processo de recuperação via e-mail." },
              { q: "O sistema funciona em celular?", a: "Sim! O ToolHub foi desenvolvido com tecnologia responsiva, funcionando perfeitamente em tablets e smartphones." }
            ].map((faq, index) => (
              <Accordion key={index} sx={{ borderRadius: '12px !important', '&:before': { display: 'none' }, boxShadow: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ fontFamily: 'Poppins' }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>

          {/* CONTATOS CENTRALIZADOS */}
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            <Grid item xs={12} sm={6} md={5}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: '15px' }}>
                <EmailIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>contato@toolhub.com</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: '15px' }}>
                <PhoneIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Telefone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>(11) 99999-9999</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ py: 4, textAlign: 'center', bgcolor: '#14213D', color: 'rgba(255,255,255,0.6)' }}>
        <Typography variant="body2" sx={{ fontFamily: 'Poppins' }}>
          © 2026 ToolHub. TCC - Senai Anchieta - Desenvolvimento de Sistemas.
        </Typography>
      </Box>
    </Box>
  );
}