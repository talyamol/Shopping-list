import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Collapse,
  Paper,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  History as HistoryIcon,
  ShoppingCart as ShoppingCartIcon,
  RestoreFromTrash as RestoreIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {RootState, AppDispatch} from '@/store';
import {fetchOrders, deleteOrder, addItem, clearItems} from '../store/shoppingListSlice';
import {ShoppingItem, Order} from '@/types';

export const OrderHistoryTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {orders, loading, error} = useSelector((state: RootState) => state.shoppingList);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchOrders({}));
  }, [dispatch]);

  const handleToggleExpanded = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleLoadOrder = (items: ShoppingItem[]) => {
    dispatch(clearItems());
    items.forEach((item) => {
      dispatch(addItem(item));
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      dispatch(deleteOrder(orderToDelete));
      setExpandedOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderToDelete);
        return newSet;
      });
    }
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleRefreshOrders = () => {
    dispatch(fetchOrders({}));
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.items.some(
        (item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase())
      ) || searchTerm === ''
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalQuantity = (items: ShoppingItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading && orders.length === 0) {
    return (
      <Paper elevation={3} sx={{p: 4, textAlign: 'center'}}>
        <RefreshIcon sx={{fontSize: 64, color: 'primary.main', mb: 2}} />
        <Typography variant='h6' color='text.secondary' gutterBottom>
          טוען היסטוריית הזמנות...
        </Typography>
      </Paper>
    );
  }

  if (orders.length === 0) {
    return (
      <Paper elevation={3} sx={{p: 4, textAlign: 'center'}}>
        <HistoryIcon sx={{fontSize: 64, color: 'text.secondary', mb: 2}} />
        <Typography variant='h6' color='text.secondary' gutterBottom>
          אין היסטוריית הזמנות
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{mb: 2}}>
          ההזמנות שתשמור יופיעו כאן
        </Typography>
        <Button variant='outlined' startIcon={<RefreshIcon />} onClick={handleRefreshOrders} disabled={loading}>
          רענן
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper elevation={2} sx={{p: 2, mb: 3}}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size='small'
              placeholder='חיפוש בהיסטוריית הזמנות...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{display: 'flex', gap: 1, justifyContent: {xs: 'flex-start', md: 'flex-end'}}}>
            <Button variant='outlined' startIcon={<RefreshIcon />} onClick={handleRefreshOrders} disabled={loading}>
              רענן
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>
        <HistoryIcon color='primary' sx={{mr: 1}} />
        <Typography variant='h6' component='h2'>
          היסטוריית הזמנות ({filteredOrders.length})
        </Typography>
      </Box>

      {error && (
        <Paper elevation={1} sx={{p: 2, mb: 2, bgcolor: 'error.light', color: 'error.contrastText'}}>
          <Typography variant='body2'>{error}</Typography>
        </Paper>
      )}

      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
        {filteredOrders.map((order: Order, index) => (
          <Fade in key={order._id} timeout={300}>
            <Card elevation={2} sx={{overflow: 'visible'}}>
              <CardContent sx={{pb: 1}}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleToggleExpanded(order._id)}
                >
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <CalendarIcon color='action' />
                    <Box>
                      <Typography variant='subtitle1' fontWeight='medium'>
                        הזמנה #{orders.length - index}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Chip label={`${getTotalQuantity(order.items)} פריטים`} color='primary' size='small' />
                    <IconButton size='small'>{expandedOrders.has(order._id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
                  </Box>
                </Box>

                <Collapse in={expandedOrders.has(order._id)} timeout={300}>
                  <Box sx={{mt: 2}}>
                    <List dense>
                      {order.items.map((item, itemIndex) => (
                        <ListItem
                          key={itemIndex}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1,
                            bgcolor: 'background.default',
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <Typography variant='body1'>{item.name}</Typography>
                                <Chip label={item.category} size='small' variant='outlined' color='primary' />
                              </Box>
                            }
                            secondary={`כמות: ${item.quantity}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{mt: 2, display: 'flex', justifyContent: 'center', gap: 2}}>
                      <Button
                        variant='contained'
                        startIcon={<RestoreIcon />}
                        onClick={() => handleLoadOrder(order.items)}
                        sx={{
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                          },
                        }}
                      >
                        טען הזמנה זו לעריכה
                      </Button>
                      <Button
                        variant='outlined'
                        color='error'
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteOrder(order._id)}
                        disabled={loading}
                      >
                        מחק הזמנה
                      </Button>
                    </Box>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </Fade>
        ))}
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>מחיקת הזמנה</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק הזמנה זו? פעולה זו לא ניתנת לביטול.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>ביטול</Button>
          <Button onClick={confirmDeleteOrder} color='error' variant='contained' disabled={loading}>
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
