import { useState } from 'react';

function Login({ setAuthenticated, setAuthToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const token = btoa(`${username}:${password}`);
    const res = await fetch('https://backend-restaurant-production-9a85.up.railway.app/api/platillos', {
      headers: {
        'Authorization': `Basic ${token}`
      }
    });

    if (res.ok) {
      setAuthToken(token);
      setAuthenticated(true);
    } else {
      setError('Credenciales incorrectas');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Iniciar Sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
