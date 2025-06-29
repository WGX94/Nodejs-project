import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./signup.scss"


function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
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

  const handleGoToLogin = () => {
    navigate('/login')
  }

  return (
    <div id='signupContainer'>
      <div id='welcomeBlock'>
        <div id='innerWelcomeBlock'>
          <div id='topBlock'>
            <span id='mainTitle'>FELLOWSHIP WALL</span>
            <span id='description'>Have fun, let's go !</span>

          </div>
          
          <form onSubmit={handleLogin} id='formSignup'>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className='inputSignup'
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='inputSignup'
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='inputSignup'
            />
            <button type="submit"  id='btnSignup'>Sign in</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button id='buttonLogin' onClick={handleGoToLogin}>Vous avez déjà un compte ? Se connecter</button>
          </form>

        </div>
      </div>
    </div>

  );
}

export default SignUp;