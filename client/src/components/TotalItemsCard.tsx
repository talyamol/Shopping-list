import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';

interface TotalItemsCardProps {
  totalItems: number;
}

export const TotalItemsCard: React.FC<TotalItemsCardProps> = ({ totalItems }) => {
  return (
    <Card 
      elevation={3} 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {totalItems}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              סה"כ פריטים ברשימה
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              width: 56,
              height: 56,
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 32 }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};