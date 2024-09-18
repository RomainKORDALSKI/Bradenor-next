import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import * as yup from 'yup';

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    prenom: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const schema = yup.object().shape({
    email: yup.string().email('Email invalide').required('Email est requis'),
    nom: yup.string().min(2, 'Nom trop court').required('Nom est requis'),
    prenom: yup.string().min(2, 'Prénom trop court').required('Prénom est requis'),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      try {
        schema.validateSyncAt('password', { password: value });
        setPasswordError('');
      } catch (err) {
        setPasswordError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await schema.validate(formData, { abortEarly: false });
      const response = await axios.post('/api/user/register', formData);
      console.log('Utilisateur enregistré avec succès:', response.data);
      router.push('/user/login');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Erreur lors de l\'enregistrement de l\'utilisateur.');
      } else if (err.inner) {
        setError(err.inner.map(e => e.message).join('. '));
      } else {
        setError('Erreur lors de l\'enregistrement de l\'utilisateur.');
      }
      console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', err);
    }
  };

  return (
    <div className='register'>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Nom:
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
          </label>
          <label>
            Prénom:
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
          </label>
          <div className='passwordContainer'>
            <label>
              Mot de passe:
            </label>
            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required />
            <span
              className='eyeIcon'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          {passwordError && (
              <div className='errorMessage'>
                {passwordError}
              </div>
            )}
          <div className='passwordContainer'>
            <label>
              Confirmer le mot de passe:
            </label>
            <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            <span
              className='eyeIcon'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </span>
          </div>
          {error && (
            <div id="error-message" className='errorMessage'>
              <span className='errorIcon'>⚠️</span> {error}
            </div>
          )}
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;




