// src/components/AddPositionModal.jsx
import React, { useState } from 'react';
import {
  Modal, Box, TextField, Button, Typography
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

export default function AddPositionModal({ open, onClose, onCreate }) {
  const [label, setLabel] = useState('');
  const [shareNumber, setShareNumber] = useState('');
  const [sharePrice, setSharePrice] = useState('');
  const [yieldValue, setYieldValue] = useState('');
  const [taxRate, setTaxRate] = useState('');

  const handleSubmit = () => {
    onCreate({
      label,
      ShareNumber: parseInt(shareNumber),
      sharePrice: parseFloat(sharePrice),
      yield: parseFloat(yieldValue),
      taxRate: parseFloat(taxRate),
    });
    // Reset fields
    setLabel('');
    setShareNumber('');
    setSharePrice('');
    setYieldValue('');
    setTaxRate('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>Nouvelle position</Typography>
        <TextField fullWidth label="Nom" value={label} onChange={(e) => setLabel(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Quantité" type="number" value={shareNumber} onChange={(e) => setShareNumber(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Prix d'une part" type="number" value={sharePrice} onChange={(e) => setSharePrice(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Rendement" type="number" value={yieldValue} onChange={(e) => setYieldValue(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Taux d'imposition" type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} sx={{ mb: 2 }} />
        <Button variant="contained" fullWidth onClick={handleSubmit}>Enregistrer</Button>
      </Box>
    </Modal>
  );
}
