import User from "@/app/models/User";
const { Op } = require("sequelize");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { token } = req.query;
    const { password } = req.body;

    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: Date.now() },
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Token invalide ou expiré." });
      }

      user.password = password;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res
        .status(200)
        .json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      return res
        .status(500)
        .json({
          message: "Erreur lors de la réinitialisation du mot de passe.",
        });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}
