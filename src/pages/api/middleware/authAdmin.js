import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key'; // À remplacer par votre clé secrète

export default function authAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: 'Accès non autorisé. Aucun token fourni.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;

    // Vérifier le rôle de l'utilisateur
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Vous devez être administrateur.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
}