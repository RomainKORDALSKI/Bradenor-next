import User from "@/app/models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, nom, prenom, password, role } = req.body;

    if (!email || !nom || !prenom || !password || !role) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }

      const newUser = await User.create({
        email,
        nom,
        prenom,
        password,
        role,
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
      return res
        .status(500)
        .json({ message: "Erreur lors de l'enregistrement de l'utilisateur." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}
