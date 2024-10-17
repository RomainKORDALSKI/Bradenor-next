import Event from "@/app/models/Event";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let eventData = req.body;

    // Vérifier si latitude et longitude sont des chaînes vides et les convertir en null
    if (eventData.latitude === "") {
      eventData.latitude = null;
    }
    if (eventData.longitude === "") {
      eventData.longitude = null;
    }

    try {
      const event = await Event.create(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Error creating event", error });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
