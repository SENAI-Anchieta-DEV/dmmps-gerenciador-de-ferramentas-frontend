import React, { useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Avatar, IconButton, TextField, 
  InputAdornment, useTheme, Container, Chip, Tooltip
} from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const initialRows = [
  { id: '110605', nome: 'Sebastian Silva', email: 'sebastian@toolhub.com', cargo: 'Administrador', status: 'Ativo' },
  { id: '123456', nome: 'Ana Oliveira', email: 'ana.oliver@toolhub.com', cargo: 'Técnico', status: 'Ativo' },
  { id: '224466', nome: 'Carlos Souza', email: 'carlos.s@toolhub.com', cargo: 'Almoxarife', status: 'Inativo' },
  { id: '223791', nome: 'Mariana Lima', email: 'mari.lima@gmail.com', cargo: 'Técnico', status: 'Ativo' },
];

const ListarPerfis = () => {
  const theme = useTheme();
  const toggleColorMode = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = initialRows.filter(row => 
    row.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    row.id.includes(searchTerm)
  );

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
      
      {/* Botão de Tema flutuante posicionado no canto superior direito */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary' }}>
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      {/* Container principal */}
      <Container maxWidth="lg" sx={{ pt: 6, px: { xs: 3, md: 6 } }}>
        
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: 'Poppins, sans-serif', 
            fontWeight: 700, 
            mb: 4, 
            color: 'text.primary' 
          }}
        >
          Gerenciar Perfis
        </Typography>

        {/* Barra de Pesquisa Estilo Pílula */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pesquisar por nome ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 5,
            maxWidth: '550px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              bgcolor: theme.palette.mode === 'light' ? '#E0E0E0' : '#333333',
              fontFamily: 'Poppins, sans-serif',
              '& fieldset': { border: 'none' },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Tabela de Perfis */}
        <TableContainer component={Paper} sx={{ 
          boxShadow: 'none', 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: '16px',
          overflow: 'hidden',
          bgcolor: 'background.paper'
        }}>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : '#1e293b' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>Usuário</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>Cargo</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* Avatar com cor de fundo #f5f5f5 corrigida */}
                      <Avatar 
                        sx={{ 
                          bgcolor: '#f5f5f5', 
                          color: '#000', 
                          fontFamily: 'Poppins',
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        {row.nome.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontFamily: 'Poppins', fontSize: '0.9rem' }}>{row.nome}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{row.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>#{row.id}</TableCell>
                  <TableCell sx={{ fontFamily: 'Poppins', fontSize: '0.9rem' }}>{row.cargo}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      size="small"
                      sx={{ 
                        fontFamily: 'Poppins', 
                        fontWeight: 600,
                        bgcolor: row.status === 'Ativo' ? '#e8f5e9' : '#ffebee',
                        color: row.status === 'Ativo' ? '#2e7d32' : '#c62828'
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton size="small" sx={{ mr: 1 }}><EditIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default ListarPerfis;