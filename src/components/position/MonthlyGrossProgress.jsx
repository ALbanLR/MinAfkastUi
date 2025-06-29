import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function ProgressCircle({ value, total }) {
  const percentage = Math.round(((value / total) * 100));
  console.log(percentage)
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={percentage}
        size={240}
        thickness={10}
        color="error"
        sx={{ transform: 'rotate(-90deg)' }}      
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6" component="div" color="text.secondary">
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
