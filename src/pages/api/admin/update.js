import Event from "@/app/models/Event";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id } = req.query;
    let eventData = req.body;

    // Vérifier si latitude et longitude sont des chaînes vides et les convertir en null
    if (eventData.latitude === "") {
      eventData.latitude = null;
    }
    if (eventData.longitude === "") {
      eventData.longitude = null;
    }

    try {
      const event = await Event.findByPk(id);
      if (event) {
        await event.update(eventData);
        res.status(200).json(event);
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Error updating event", error });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
