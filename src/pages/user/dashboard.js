"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Search, Edit, Trash2, Plus, ArrowUpDown } from "lucide-react";
import Header from "@/app/components/header/Header";
import SearchH from "@/app/components/header/Search";
import { jwtDecode } from "jwt-decode";
import { decode } from "jsonwebtoken";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
    </div>
  );
};

const initialFormData = {
  ville: "",
  date: "",
  type_braderie: "",
  commentaire: "",
};

export default function UserDashboard() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isAscending, setIsAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const eventsPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/user/login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        fetchEvents(decodedToken.id, token);
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        router.push("/user/login");
      }
    }
  }, [router]);
  const fetchEvents = async (userId, token) => {
    try {
      const response = await axios.get(`/api/user/event?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      if (error.response?.status === 401) {
        router.push("/user/login");
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/user/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents(token);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setFormData(event);
    setIsDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (selectedEvent) {
        await axios.put(`/api/user/events/${selectedEvent.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/user/events", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchEvents(token);
      setIsDialogOpen(false);
      setSelectedEvent(null);
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = events.filter(
      (event) =>
        event.ville.toLowerCase().includes(term.toLowerCase()) ||
        event.date.includes(term)
    );
    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleSortByDate = () => {
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      return isAscending
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });
    setFilteredEvents(sortedEvents);
    setIsAscending(!isAscending);
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  return (
    <div>
      <Header />
      <SearchH />
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Mes Événements</CardTitle>
            <CardDescription>Gérez vos événements ici</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Search className="text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher par ville ou date"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ville</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={handleSortByDate}
                    >
                      Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.ville}</TableCell>
                      <TableCell>
                        {new Date(event.date).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>{event.type_braderie}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredEvents.length / eventsPerPage)}
              onPageChange={setCurrentPage}
            />
          </CardFooter>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedEvent ? "Modifier l'événement" : "Créer un événement"}
              </DialogTitle>
              <DialogDescription>
                Remplissez les détails de l'événement ci-dessous. Cliquez sur
                sauvegarder lorsque vous avez terminé.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ville" className="text-right">
                    Ville
                  </Label>
                  <Input
                    id="ville"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type_braderie" className="text-right">
                    Type
                  </Label>
                  <Input
                    id="type_braderie"
                    name="type_braderie"
                    value={formData.type_braderie}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="commentaire" className="text-right">
                    Commentaire
                  </Label>
                  <Textarea
                    id="commentaire"
                    name="commentaire"
                    value={formData.commentaire}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Sauvegarder</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
