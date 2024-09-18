import auth from '@/pages/api/middleware/auth';

export default async function handler(req, res) {
  auth(req, res, () => {
    res.status(200).json({ message: 'Vous avez accès à cette route protégée.' });
  });
}


/*const token = localStorage.getItem('token');

const res = await fetch('/api/protected-route', {
  method: 'GET',
  headers: {
    'Authorization': token,
  },
});

const data = await res.json();*/