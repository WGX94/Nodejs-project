import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.scss"


function Login() {
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erreur inconnue');
        return;
      }
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Utilisateur connecté:', data.user);
      navigate('/');
    } catch (err) {
      setError('Erreur réseau');
      console.error(err);
    }
  };


  return (
    <div id='loginContainer'>
      <div id='welcomeBlock'>
        <div id='innerWelcomeBlock'>
          <div id='topBlock'>
            <span id='mainTitle'>FELLOWSHIP WALL</span>
            <span id='description'>Have fun, let's go !</span>

          </div>
          
          <form onSubmit={handleLogin} id='formLogin'>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='inputLogin'
            />
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='inputLogin'
            />
            <button type="submit" id='btnLogin'>Sign in</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}

          </form>

        </div>



      </div>
    </div>

  );
}

export default Login;