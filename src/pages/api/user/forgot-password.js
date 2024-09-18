import { User } from "@/app/models";
import crypto from "crypto";
import nodemailer from "nodemailer";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ message: "Email non trouvé." });
      }

      const token = crypto.randomBytes(20).toString("hex");

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
      await user.save();

      // Create Nodemailer transporter using OAuth2
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: process.env.ACCESS_TOKEN,
        },
      });

      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: "Réinitialisation de mot de passe",
        text:
          `Vous recevez cet email car vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n` +
          `Cliquez sur le lien suivant, ou copiez-le dans votre navigateur pour compléter le processus:\n\n` +
          `http://${req.headers.host}/reset-password/${token}\n\n` +
          `Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email et votre mot de passe restera inchangé.\n`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur lors de l'envoi de l'email." });
        }
        res.status(200).json({ message: "Email de réinitialisation envoyé." });
      });
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      return res.status(500).json({
        message: "Erreur lors de la réinitialisation du mot de passe.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}
