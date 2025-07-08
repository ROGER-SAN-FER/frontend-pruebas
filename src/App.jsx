import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');

  return (
    <div>
      {authenticated ? (
        <Dashboard token={authToken} />
      ) : (
        <Login setAuthenticated={setAuthenticated} setAuthToken={setAuthToken} />
      )}
    </div>
  );
}

export default App;
