import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import * as yup from 'yup';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const schema = yup.object().shape({
    password: yup.string().min(8, 'Mot de passe trop court')
      .matches(/[A-Z]/, 'Doit contenir une majuscule')
      .matches(/[a-z]/, 'Doit contenir une minuscule')
      .matches(/[0-9]/, 'Doit contenir un chiffre')
      .matches(/[@$!%*?&#]/, 'Doit contenir un caractère spécial')
      .required('Mot de passe est requis'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Les mots de passe doivent correspondre')
      .required('Confirmation du mot de passe est requise')
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await schema.validate({ password, confirmPassword }, { abortEarly: false });

      const response = await axios.post(`/api/user/reset-password/${token}`, { password });
      setMessage('Votre mot de passe a été réinitialisé avec succès.');
      router.push('/user/login');
    } catch (err) {
      if (err.inner) {
        setError(err.inner.map(e => e.message).join('. '));
      } else {
        setError('Erreur lors de la réinitialisation du mot de passe.');
      }
    }
  };

  return (
    <div className='reset-password'>
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nouveau mot de passe:
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Confirmer le nouveau mot de passe:
          <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>
        <button type='submit'>Réinitialiser</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p className='error'>{error}</p>}
    </div>
  );
};

export default ResetPassword;
