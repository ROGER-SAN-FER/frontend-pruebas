import { useState } from 'react';

function Login({ setAuthenticated, setAuthToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!username || !password) {
      setError('Debes ingresar usuario y contraseña');
      return;
    }

    const token = btoa(`${username}:${password}`);

    try {
      const res = await fetch('https://backend-restaurant-production-9a85.up.railway.app/api/platillos', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });

      if (res.ok) {
        setAuthToken(token);
        setAuthenticated(true);
      } else if (res.status === 401 || res.status === 403) {
        setError('Credenciales incorrectas');
        setUsername('');
        setPassword('');
      } else {
        setError('Error desconocido al autenticar');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de red al intentar conectar con el servidor');
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
