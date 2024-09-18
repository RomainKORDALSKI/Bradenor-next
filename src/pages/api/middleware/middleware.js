import { getIronSession } from 'iron-session';

const middleware = handler => {
  return async (req, res) => {
    const session = await getIronSession(req, res, {
      password: process.env.SECRET_COOKIE_PASSWORD || 'default_password',
      cookieName: 'session',
    });
    if (!session.hasOwnProperty('favorites')) {
      session.favorites = [];
    }
    console.log('Session object:', session);
    console.log('Session object type:', typeof session);
    return handler(req, res, session);
  };
};

export default middleware;



