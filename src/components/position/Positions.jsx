import React, { useEffect, useState } from 'react';
import { fetchPositions, createPosition, updatePosition, deletePosition, getMonthlyGross } from '../../services/PositionService';
import { DataGrid } from '@mui/x-data-grid';
import {
   Button, Box, CircularProgress, Snackbar, Alert
} from '@mui/material';
import AddPositionModal from './AddPositionModal';
import ProgressCircle from './MonthlyGrossProgress'

export default function PositionsGrid() {
  
  const [monthlyGross, setMonthlyGross] = useState(null); 
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const target = 1000;


  // Charger les données
  const fetchData = async () => {
    try {
      const response = await fetchPositions();
      setRows(response.data);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des données.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // Modifier un item
  const handleEdit = async (params) => {
    const ID = params.ID;
    try {
      const updated =  params;
      const response = await updatePosition(ID, updated);
      setRows(rows.map((r) => (r.ID === ID ? response.data : r)));
      setMessage({ type: 'success', text: 'Modifié avec succès.' });
      return response.data;
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la modification.' });
    }
  };

  // Supprimer un item
  const deleteItem = async (id) => {
    try {
      await deletePosition(id);
      console.log(rows)
      setRows(rows.filter((r) => r.ID !== id));
      setMessage({ type: 'success', text: 'Supprimé avec succès.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression.' });
    }
  };

  const getMonthlyGross = async () => {
    try{
      const value = await getMonthlyGross();
      setMonthlyGross(value);
    } catch (error){
      setMessage({ type: 'error', text: 'Erreur lors du chargement des données.' });
    }
  }

  const columns = [
    { field: 'label', headerName: 'Nom', flex: 1, editable: true },
    { field: 'shareNumber', headerName: 'Quantité', flex: 1, type: 'number', editable: true },
    { field: 'sharePrice', headerName: 'Valeur de la part', flex: 1, type: 'number', editable: true },
    { field: 'totalValue', headerName: 'Valeur Totale', flex: 1, type: 'number', editable: false },

    { field: 'yield', headerName: 'Rendement', flex: 1, type: 'number', editable: true , 
      valueFormatter: (params) => {
      if (params == null) return '';
      return `${params} %`;
      } 
    },
    { field: 'tax', headerName: 'Imposition', flex: 1, type: 'number', editable: false , 
      valueGetter: (params) => {
        if (params == null) return '';
        return params.taxRate ? `${(params.taxRate * 100).toFixed(1)} %` : '';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => (
        <Button color="error" onClick={() => deleteItem(params.id)}>Supprimer</Button>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', mt: 4 }}>
      <h2>Patrimoine et rente mensuelle</h2>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Ajouter
      </Button>

      <AddPositionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={async (data) => {
          try {
            const response = await createPosition(data);
            setRows((prev) => [...prev, response.data]);
            setMessage({ type: 'success', text: 'Ajouté avec succès.' });
          } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de l\'ajout.' });
          }
        }}
      />      
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.ID}
          pageSize={5}
          processRowUpdate={handleEdit}
           onProcessRowUpdateError={(error) => console.log(error)}
        />
      )}
      <ProgressCircle value={monthlyGross} total={target} />

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
      >
        <Alert severity={message?.type}>{message?.text}</Alert>
      </Snackbar>
    </Box>
  );
}
