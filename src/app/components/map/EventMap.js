"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { MapPin, Calendar, Users } from "lucide-react";

const EventMap = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/allevents");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const eventsData = await response.json();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const EventMapComponent = dynamic(() => import("./EventMapComponent"), {
    loading: () => <Skeleton className="w-full h-[400px] rounded-lg" />,
    ssr: false,
  });

  if (loading) {
    return <Skeleton className="w-full h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">
              Bienvenue sur BradEnOr
            </CardTitle>
            <CardDescription className="text-primary/80">
              Découvrez les braderies des Hauts-de-France
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="relative h-64 lg:h-full rounded-lg overflow-hidden">
                <Image
                  src="/images/braderie2.jpg"
                  alt="Image de braderie"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="space-y-4">
                <Tabs defaultValue="visiteurs" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="visiteurs">Visiteurs</TabsTrigger>
                    <TabsTrigger value="organisateurs">
                      Organisateurs
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="visiteurs">
                    <ScrollArea className="h-[200px] lg:h-[300px] w-full rounded-md border p-4">
                      <h3 className="font-semibold mb-2 text-primary">
                        Fonctionnalités pour les visiteurs :
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-sm text-primary/80">
                        <li>
                          <MapPin className="inline-block mr-2 w-4 h-4" />
                          Recherche de braderies par géolocalisation, par ville
                          ou directement sur la carte.
                        </li>
                        <li>
                          <Calendar className="inline-block mr-2 w-4 h-4" />
                          Redirection directe de l'adresse sur Waze ou Google
                          Maps.
                        </li>
                        <li>
                          <Users className="inline-block mr-2 w-4 h-4" />
                          Possibilité d'ajouter des événements en favoris.
                        </li>
                      </ul>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="organisateurs">
                    <ScrollArea className="h-[200px] lg:h-[300px] w-full rounded-md border p-4">
                      <h3 className="font-semibold mb-2 text-primary">
                        Fonctionnalités pour les organisateurs :
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-sm text-primary/80">
                        <li>
                          <Calendar className="inline-block mr-2 w-4 h-4" />
                          Publication de vos événements via un formulaire dédié.
                        </li>
                        <li>
                          <MapPin className="inline-block mr-2 w-4 h-4" />
                          Gestion facile de la localisation de votre braderie.
                        </li>
                        <li>
                          <Users className="inline-block mr-2 w-4 h-4" />
                          Suivi des inscriptions et des participants.
                        </li>
                      </ul>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
                <p className="text-primary/80">
                  Nous espérons que ce site vous aidera à trouver et organiser
                  les meilleures braderies de la région. Bonne recherche !
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="w-full sm:w-auto">
                    Commencer la recherche
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Organiser une braderie
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Carte des braderies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <EventMapComponent events={events} />
            ) : (
              <p className="text-center text-primary/80">
                Aucun événement trouvé.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventMap;
