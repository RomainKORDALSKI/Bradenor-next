// index.js (API pour récupérer les favoris)
import middleware from "@/pages/api/middleware/middleware";

const handler = async (req, res, session) => {
  if (req.method === "GET") {
    let favorites = session.favorites || [];

    res.status(200).json({ favorites });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default middleware(handler);
