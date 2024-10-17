"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { FavoritesContext } from "@/app/context/FavoritesContext";
import { generateMapLinks } from "@/app/utils/generateMapLinks";
import { generateShareLinks } from "@/app/utils/generateShareLinks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  MapPin,
  Clock,
  Euro,
  HelpCircle,
  Phone,
  Facebook,
  Instagram,
  Heart,
  Share2,
  Navigation,
  Map,
  Store,
  Calendar,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const EventList = ({
  events,
  grouped,
  showCity,
  showDetails,
  closeModal,
  eventsPerPage = 8,
}) => {
  const { favorites, addFavorite, removeFavorite } =
    useContext(FavoritesContext);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const groupedEvents = grouped
    ? currentEvents.reduce((acc, event) => {
        const date = new Date(event.date).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(event);
        return acc;
      }, {})
    : { "": currentEvents };

  const handleAddFavorite = async (eventId) => {
    try {
      await addFavorite(eventId);
    } catch (error) {
      console.error("Error adding favorite", error);
    }
  };

  const handleRemoveFavorite = async (eventId) => {
    try {
      await removeFavorite(eventId);
    } catch (error) {
      console.error("Error removing favorite", error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-8">
      {Object.keys(groupedEvents).map((date, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="space-y-4"
        >
          {grouped && (
            <h3 className="text-2xl font-bold text-primary">{date}</h3>
          )}
          <div
            className={`grid gap-6 ${
              groupedEvents[date].length === 1
                ? "justify-center"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            <AnimatePresence>
              {groupedEvents[date].map((event) => {
                const { wazeLink, googleMapsLink } = generateMapLinks(
                  event.rue,
                  event.departement,
                  event.code_postal
                );
                const { facebookShareUrl, instagramShareUrl } =
                  generateShareLinks(event);
                const isFavorite = favorites.includes(event.id);

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-card">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-2">
                        <CardTitle className="text-lg font-semibold text-primary flex items-center justify-between">
                          <span>
                            {showCity
                              ? event.ville
                              : new Date(event.date).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-full ${
                              isFavorite ? "text-red-500" : "text-gray-400"
                            }`}
                            onClick={() =>
                              isFavorite
                                ? handleRemoveFavorite(event.id)
                                : handleAddFavorite(event.id)
                            }
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                isFavorite ? "fill-current" : ""
                              }`}
                            />
                          </Button>
                        </CardTitle>
                        <CardDescription className="text-primary/80">
                          {capitalizeFirstLetter(event.type_braderie)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <Tabs defaultValue="details" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger
                              value="details"
                              className="text-primary"
                            >
                              Détails
                            </TabsTrigger>
                            <TabsTrigger value="info" className="text-primary">
                              Infos pratiques
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="details">
                            <ScrollArea className="h-48 pr-4">
                              <div className="space-y-3">
                                {event.nb_exposants !== null && (
                                  <div className="flex items-center space-x-2 text-primary/90">
                                    <Store className="w-4 h-4 text-primary" />
                                    <span>{event.nb_exposants} exposants</span>
                                  </div>
                                )}
                                {event.rue && (
                                  <div className="flex items-center space-x-2 text-primary/90">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{event.rue}</span>
                                  </div>
                                )}
                                {showDetails &&
                                  event.heure_debut_visiteur &&
                                  event.heure_fin_visiteur && (
                                    <div className="flex items-center space-x-2 text-primary/90">
                                      <Clock className="w-4 h-4 text-primary" />
                                      <span>{`${event.heure_debut_visiteur.slice(
                                        0,
                                        5
                                      )} à ${event.heure_fin_visiteur.slice(
                                        0,
                                        5
                                      )}`}</span>
                                    </div>
                                  )}
                                {showDetails && event.emplacement_prix && (
                                  <div className="flex items-center space-x-2 text-primary/90">
                                    <Euro className="w-4 h-4 text-primary" />
                                    <span>{event.emplacement_prix} €</span>
                                  </div>
                                )}
                                {!showDetails &&
                                  event.distance !== undefined &&
                                  event.distance !== 0 && (
                                    <Badge variant="secondary" className="mt-2">
                                      Distance: {event.distance?.toFixed(2)} km
                                    </Badge>
                                  )}
                              </div>
                            </ScrollArea>
                          </TabsContent>
                          <TabsContent value="info">
                            <ScrollArea className="h-48 pr-4">
                              <div className="space-y-3">
                                {showDetails &&
                                  event.reserve_aux_particuliers && (
                                    <div className="flex items-center space-x-2 text-primary/90">
                                      <HelpCircle className="w-4 h-4 text-primary" />
                                      <span>Réservé aux particuliers</span>
                                    </div>
                                  )}
                                {showDetails &&
                                  event.organisateur_telephone && (
                                    <div className="flex items-center space-x-2 text-primary/90">
                                      <Phone className="w-4 h-4 text-primary" />
                                      <span>
                                        {event.organisateur_telephone}
                                      </span>
                                    </div>
                                  )}
                                {event.arrondissement && (
                                  <div className="flex items-center space-x-2 text-primary/90">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>
                                      Du côté de {event.arrondissement}
                                    </span>
                                  </div>
                                )}
                                {showDetails && event.commentaire && (
                                  <div className="flex items-start space-x-2 text-primary/90">
                                    <HelpCircle className="w-4 h-4 text-primary mt-1" />
                                    <span>{event.commentaire}</span>
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                      <Separator className="my-4" />
                      <CardFooter className="justify-between pt-2">
                        <div className="flex space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  asChild
                                  className="rounded-full bg-[#33ccff] hover:bg-[#33ccff]/80 text-white border-none"
                                >
                                  <a
                                    href={wazeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 48 48"
                                      width="24"
                                      height="24"
                                    >
                                      <path
                                        fill="#1c73d3"
                                        d="M38.39,21.63c-2.17-4.83-6.57-7.76-12.39-7.76c-6.09,0-10.62,3.18-12.68,8.37c-0.19,0.49-0.19,1.02,0,1.5 c2.06,5.19,6.59,8.37,12.68,8.37c5.82,0,10.22-2.92,12.39-7.76c0.19-0.43,0.19-0.91,0-1.34V21.63z"
                                      />
                                      <path
                                        fill="#fff"
                                        d="M26,30.52c-2.86,0-5.18-2.32-5.18-5.18s2.32-5.18,5.18-5.18s5.18,2.32,5.18,5.18S28.86,30.52,26,30.52z"
                                      />
                                      <path
                                        fill="#1c73d3"
                                        d="M26,22.57c1.53,0,2.77,1.24,2.77,2.77s-1.24,2.77-2.77,2.77s-2.77-1.24-2.77-2.77S24.47,22.57,26,22.57z"
                                      />
                                    </svg>
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ouvrir dans Waze</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  asChild
                                  className="rounded-full"
                                >
                                  <a
                                    href={googleMapsLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Map className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ouvrir dans Google Maps</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <div className="flex space-x-2">
                                <a
                                  href={facebookShareUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Facebook className="h-4 w-4" />
                                </a>
                                <a
                                  href={instagramShareUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Instagram className="h-4 w-4" />
                                </a>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-full"
        >
          Précédent
        </Button>
        <span className="mx-4 flex items-center">
          Page {currentPage} sur {Math.ceil(events.length / eventsPerPage)}
        </span>
        <Button
          variant="outline"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(events.length / eventsPerPage)}
          className="rounded-full"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default EventList;
