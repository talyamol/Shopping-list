import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Typography, Paper, Tabs, Tab, Alert, Snackbar, Fade} from '@mui/material';
import {ShoppingCartOutlined, HistoryOutlined} from '@mui/icons-material';
import {RootState, AppDispatch} from '@/store';
import {fetchCategories, clearError} from '../store/shoppingListSlice';
import {ShoppingListTab} from './ShoppingListTab';
import {OrderHistoryTab} from './OrderHistoryTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({children, value, index}: TabPanelProps) {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <Box sx={{pt: 3}}>{children}</Box>}
    </div>
  );
}

export const ShoppingListApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {error, loading} = useSelector((state: RootState) => state.shoppingList);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  return (
    <Fade in timeout={800}>
      <Box>
        <Paper elevation={2} sx={{mb: 4, p: 3, textAlign: 'center'}}>
          <Typography variant='h4' component='h1' gutterBottom color='primary'>
            🛒 רשימת קניות חכמה
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            נהל את רשימת הקניות שלך בקלות ויעילות
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{mb: 3}}>
          <Tabs value={tabValue} onChange={handleTabChange} variant='fullWidth' indicatorColor='primary' textColor='primary'>
            <Tab icon={<ShoppingCartOutlined />} label='רשימת קניות' iconPosition='start' />
            <Tab icon={<HistoryOutlined />} label='היסטוריית הזמנות' iconPosition='start' />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <ShoppingListTab />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <OrderHistoryTab />
        </TabPanel>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
          <Alert onClose={handleCloseError} severity='error' sx={{width: '100%'}}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};
