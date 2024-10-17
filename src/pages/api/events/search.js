import Event from "@/app/models/Event";
import { Op } from "sequelize";
export default async function handler(req, res) {
  const { cityName } = req.query;

  try {
    const events = await Event.findAll({
      where: {
        ville: {
          [Op.like]: `%${cityName}%`,
        },
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error searching events by city:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
