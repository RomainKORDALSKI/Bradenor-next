// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from "@/app/models/User"; // Vérifiez le chemin
import jwt from 'jsonwebtoken';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email, given_name: prenom, family_name: nom } = profile;

      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser) {
        await User.create({
          email,
          nom,
          prenom,
          password: "", // Pas de mot de passe pour Google
          role: "user", // Définissez le rôle par défaut
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;

        // Créez un token JWT pour Google
        if (account && account.provider === 'google') {
          const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
          };

          // Générer un token JWT avec une expiration de 1 heure
          token.accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken; // Ajoutez l'accessToken à la session
      return session;
    },
  },
  pages: {
    signIn: '/user/login', // Page de connexion personnalisée
  },
});
