import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import PlatilloEdit from './PlatilloEdit';  // nuevo
import TipoEdit from './TipoEdit';          // nuevo
import ScrollToTop from './ScrollToTop';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            authenticated
              ? <Navigate to="/dashboard" />
              : <Login setAuthenticated={setAuthenticated} setAuthToken={setAuthToken} />
          }
        />
        <Route
          path="/dashboard"
          element={
            authenticated
              ? <Dashboard token={authToken} />
              : <Navigate to="/" />
          }
        />
        <Route
          path="/platillos/:id/edit"
          element={
            authenticated
              ? <PlatilloEdit token={authToken} />
              : <Navigate to="/" />
          }
        />
        <Route
          path="/tipos/:id/edit"
          element={
            authenticated
              ? <TipoEdit token={authToken} />
              : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
