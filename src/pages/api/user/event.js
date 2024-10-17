import { User, Event } from "@/app/models";

export default async function handler(req, res) {
  const { userId } = req.query;
  console.log("userId", userId);
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Event,
          as: "events",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.events); // Renvoie uniquement les événements
  } catch (error) {
    console.error("Error fetching user's events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
