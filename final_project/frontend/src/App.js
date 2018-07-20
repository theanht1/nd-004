import React from 'react';
import { Card } from '@material-ui/core/es/index';
import Header from './components/Header';
import AppSnackbar from './components/utils/AppSnackbar';
import AppAlert from './components/utils/AppAlert';
import AppRouter from './AppRouter';

const App = () => (
  <div>
    <Header />
    <main>
      <Card className="container">
        <AppRouter />
      </Card>
      <AppSnackbar />
      <AppAlert />
    </main>
  </div>
);


export default App;
