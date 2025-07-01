import React from 'react';
import {Button, Box, Typography, CircularProgress, Paper} from '@mui/material';
import {Save as SaveIcon, CheckCircle as CheckCircleIcon} from '@mui/icons-material';

interface SaveOrderButtonProps {
  onSave: () => void;
  loading: boolean;
  itemCount: number;
}

export const SaveOrderButton: React.FC<SaveOrderButtonProps> = ({onSave, loading, itemCount}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Box sx={{mb: 2}}>
        <Typography variant='h6' color='text.primary' gutterBottom>
          מוכן לשמור את ההזמנה?
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {itemCount} פריטים ברשימה מחכים להזמנה
        </Typography>
      </Box>

      <Button
        variant='contained'
        size='large'
        onClick={onSave}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color='inherit' /> : <SaveIcon />}
        sx={{
          minWidth: 200,
          py: 1.5,
          background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #45a049 30%, #7CB342 90%)',
          },
          '&:disabled': {
            background: 'rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        {loading ? 'שומר הזמנה...' : 'שמור הזמנה'}
      </Button>
    </Paper>
  );
};
