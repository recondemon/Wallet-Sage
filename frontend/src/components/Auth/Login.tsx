import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase/firebase';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  //* Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //* Login Function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    //! ---- add better error handling ----
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      setError('Login failed, please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-2vw font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-destructive">{error}</p>}
      <form 
        onSubmit={handleLogin} 
        className="p-4 gap-4 flex flex-col"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          type="submit" 
          className="w-full bg-primary text-foreground hover:bg-muted hover:text-mutedForeground p-2 rounded"
        >
          Login
        </button>
      </form>
      <div className='flex gap-2'>
        <p>
            Don&apos;t have an account?{' '}
        </p>
        <button>
            Register
        </button>
      </div>
    </div>
  );
};

export default Login;
