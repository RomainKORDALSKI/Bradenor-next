import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";

const SECRET_KEY = "your_secret_key"; //a changer

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Email incorrect." });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Mot de passe incorrect." });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          prenom: user.prenom,
          role: user.role,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token });
    } catch (error) {
      console.error("Erreur lors de la connexion de l'utilisateur:", error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la connexion de l'utilisateur." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}
