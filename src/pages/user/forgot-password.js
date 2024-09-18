import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/user/forgot-password', { email });
      setMessage('Un lien de réinitialisation du mot de passe a été envoyé à votre adresse email.');
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'email de réinitialisation.');
    }
  };

  return (
    <div className='forgot-password'>
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit">Envoyer</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p className='error'>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
