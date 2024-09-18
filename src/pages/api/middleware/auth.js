import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key'; // Utilisez la même clé secrète que pour le token JWT

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Accès non autorisé. Aucun token fourni.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé. Format de token invalide.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
}
