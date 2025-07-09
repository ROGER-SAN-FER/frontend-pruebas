import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? <Navigate to="/dashboard" /> : <Login setAuthenticated={setAuthenticated} setAuthToken={setAuthToken} />
          }
        />
        <Route
          path="/dashboard"
          element={
            authenticated ? <Dashboard token={authToken} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
