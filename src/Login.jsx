import { useState } from 'react';
import './LoginStyle.css';
import { API_BASE_URL } from './apiConfig';

function Login({ setAuthenticated, setAuthToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault(); // <--- Previene que el form recargue la página
    setError('');

    if (!username || !password) {
      setError('Debes ingresar usuario y contraseña');
      return;
    }

    const token = btoa(`${username}:${password}`);

    try {
      const res = await fetch(`${API_BASE_URL}/platillos`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });

      if (res.ok) {
        localStorage.setItem('authToken', token);
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
    <div className="login-container">
      <div className="login-card">
        <h2>🍽 Iniciar Sesión</h2>
        <form onSubmit={handleLogin} autoComplete="off">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button type="submit">Entrar</button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
