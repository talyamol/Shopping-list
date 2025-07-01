import React, {useState} from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Chip,
  TextField,
  Divider,
  Fade,
  Collapse,
  InputAdornment,
  Button,
} from '@mui/material';
import {Delete as DeleteIcon, Remove as RemoveIcon, Add as AddIcon, List as ListIcon, Search as SearchIcon} from '@mui/icons-material';
import {ShoppingItem} from '@/types';

interface ShoppingListDisplayProps {
  items: ShoppingItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
}

export const ShoppingListDisplay: React.FC<ShoppingListDisplayProps> = ({items, onUpdateQuantity, onRemoveItem}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(
    (item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems = filteredItems.reduce(
    (groups, item, index) => {
      const category = item.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push({...item, originalIndex: items.indexOf(item)});
      return groups;
    },
    {} as Record<string, Array<ShoppingItem & {originalIndex: number}>>
  );

  const handleQuantityChange = (index: number, change: number) => {
    const currentQuantity = items[index]?.quantity || 0;
    const newQuantity = Math.max(1, currentQuantity + change);
    onUpdateQuantity(index, newQuantity);
  };

  if (items.length === 0) {
    return (
      <Paper elevation={3} sx={{p: 3, textAlign: 'center', height: 'fit-content'}}>
        <Box sx={{py: 4}}>
          <ListIcon sx={{fontSize: 48, color: 'text.secondary', mb: 2}} />
          <Typography variant='h6' color='text.secondary'>
            הרשימה ריקה
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            הוסף מוצרים לרשימת הקניות שלך
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{p: 3, maxHeight: '70vh', overflow: 'auto'}}>
      <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
        <ListIcon color='primary' sx={{mr: 1}} />
        <Typography variant='h6' component='h2'>
          רשימת הקניות ({items.length} פריטים)
        </Typography>
      </Box>

      {items.length > 3 && (
        <TextField
          fullWidth
          size='small'
          placeholder='חיפוש מוצרים...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{mb: 2}}
        />
      )}

      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <Fade in key={category} timeout={300}>
          <Box sx={{mb: 2}}>
            <Typography variant='subtitle2' color='primary' sx={{mb: 1, fontWeight: 600}}>
              {category}
            </Typography>
            <List dense>
              {categoryItems.map((item) => (
                <Collapse in key={`${item.name}-${item.category}`} timeout={300}>
                  <ListItem
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                          <Typography variant='body1' sx={{fontWeight: 500}}>
                            {item.name}
                          </Typography>
                          <Chip label={item.category} size='small' variant='outlined' color='primary' />
                        </Box>
                      }
                      secondary={
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                          <Typography variant='body2' color='text.secondary'>
                            כמות:
                          </Typography>
                          <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                            <IconButton
                              size='small'
                              onClick={() => handleQuantityChange(item.originalIndex, -1)}
                              disabled={item.quantity <= 1}
                              sx={{
                                bgcolor: 'error.light',
                                color: 'error.main',
                                '&:hover': {bgcolor: 'error.main', color: 'error.contrastText'},
                                '&:disabled': {bgcolor: 'grey.200', color: 'grey.400'},
                              }}
                            >
                              <RemoveIcon fontSize='small' />
                            </IconButton>
                            <Typography
                              variant='body1'
                              sx={{
                                minWidth: 30,
                                textAlign: 'center',
                                fontWeight: 600,
                                bgcolor: 'grey.100',
                                borderRadius: 1,
                                px: 1,
                                py: 0.5,
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size='small'
                              onClick={() => handleQuantityChange(item.originalIndex, 1)}
                              sx={{
                                bgcolor: 'success.light',
                                color: 'success.main',
                                '&:hover': {bgcolor: 'success.main', color: 'success.contrastText'},
                              }}
                            >
                              <AddIcon fontSize='small' />
                            </IconButton>
                          </Box>
                        </Box>
                      }
                    />
                    <IconButton
                      edge='end'
                      onClick={() => onRemoveItem(item.originalIndex)}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          bgcolor: 'error.light',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                </Collapse>
              ))}
            </List>
            {Object.keys(groupedItems).length > 1 && <Divider sx={{my: 1}} />}
          </Box>
        </Fade>
      ))}

      <Box sx={{mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2}}>
        <Typography variant='body2' color='text.secondary' align='center'>
          סה"כ {items.length} פריטים • {items.reduce((total, item) => total + item.quantity, 0)} יחידות
        </Typography>
      </Box>
    </Paper>
  );
};
