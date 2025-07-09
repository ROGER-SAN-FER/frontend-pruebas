import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import ScrollToTop from './ScrollToTop'; // importa el nuevo componente

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
      <ScrollToTop /> {/* <-- aquí */}
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
      </Routes>
    </Router>
  );
}

export default App;
