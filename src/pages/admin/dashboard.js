"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Edit, Trash2, Plus, ArrowUpDown } from "lucide-react";

// Custom Pagination component
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
  pays: "",
  departement: "",
  arrondissement: "",
  code_postal: "",
  ville: "",
  salle: "",
  rue: "",
  type_braderie: "",
  date: "",
  heure_debut_visiteur: "",
  heure_fin_visiteur: "",
  nb_exposants: 0,
  toilettes_publiques: false,
  reserve_aux_particuliers: false,
  exposant_heure_arrivee: "",
  emplacement_prix: "",
  commentaire: "",
  organisateur_personne_morale: "",
  organisateur_telephone: "",
  organisateur_facebook: "",
  latitude: "",
  longitude: "",
};

const AdminDashboard = () => {
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
      fetchEvents(token);
    }
  }, [router]);

  const fetchEvents = async (token) => {
    try {
      const response = await axios.get("/api/admin", {
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
      await axios.delete(`/api/admin/delete?id=${id}`, {
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (selectedEvent) {
        await axios.put(`/api/admin/update?id=${selectedEvent.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/admin/create", formData, {
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
        event.id.toString().includes(term) ||
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
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>Gérez vos événements ici</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Search className="text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par ID, ville ou date"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nouvel événement
            </Button>
          </div>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={handleSortByDate}
                  >
                    Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.id}</TableCell>
                    <TableCell>{event.ville}</TableCell>
                    <TableCell>
                      {new Date(event.date).toLocaleDateString("fr-FR")}
                    </TableCell>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent
                ? "Modifier l'événement"
                : "Créer un nouvel événement"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les détails de l'événement ci-dessous. Cliquez sur
              sauvegarder lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="organisateur">Organisateur</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ville">Ville</Label>
                    <Input
                      id="ville"
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type_braderie">Type de braderie</Label>
                    <Input
                      id="type_braderie"
                      name="type_braderie"
                      value={formData.type_braderie}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nb_exposants">Nombre d'exposants</Label>
                    <Input
                      id="nb_exposants"
                      name="nb_exposants"
                      type="number"
                      value={formData.nb_exposants}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="details">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heure_debut_visiteur">Heure de début</Label>
                    <Input
                      id="heure_debut_visiteur"
                      name="heure_debut_visiteur"
                      type="time"
                      value={formData.heure_debut_visiteur}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heure_fin_visiteur">Heure de fin</Label>
                    <Input
                      id="heure_fin_visiteur"
                      name="heure_fin_visiteur"
                      type="time"
                      value={formData.heure_fin_visiteur}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emplacement_prix">
                      Prix de l'emplacement
                    </Label>
                    <Input
                      id="emplacement_prix"
                      name="emplacement_prix"
                      value={formData.emplacement_prix}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="toilettes_publiques"
                      name="toilettes_publiques"
                      checked={formData.toilettes_publiques}
                      onCheckedChange={(checked) =>
                        handleChange({
                          target: {
                            name: "toilettes_publiques",
                            type: "checkbox",
                            checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="toilettes_publiques">
                      Toilettes publiques
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reserve_aux_particuliers"
                      name="reserve_aux_particuliers"
                      checked={formData.reserve_aux_particuliers}
                      onCheckedChange={(checked) =>
                        handleChange({
                          target: {
                            name: "reserve_aux_particuliers",
                            type: "checkbox",
                            checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="reserve_aux_particuliers">
                      Réservé aux particuliers
                    </Label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="organisateur">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organisateur_personne_morale">
                      Organisateur
                    </Label>
                    <Input
                      id="organisateur_personne_morale"
                      name="organisateur_personne_morale"
                      value={formData.organisateur_personne_morale}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organisateur_telephone">Téléphone</Label>
                    <Input
                      id="organisateur_telephone"
                      name="organisateur_telephone"
                      value={formData.organisateur_telephone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organisateur_facebook">Facebook</Label>
                    <Input
                      id="organisateur_facebook"
                      name="organisateur_facebook"
                      value={formData.organisateur_facebook}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="commentaire">Commentaire</Label>
                    <Textarea
                      id="commentaire"
                      name="commentaire"
                      value={formData.commentaire}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-4">
              <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
