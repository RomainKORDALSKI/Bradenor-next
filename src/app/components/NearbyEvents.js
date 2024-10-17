"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Skeleton } from "@/app/components/ui/skeleton";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const EventList = lazy(() => import("@/app/components/EventList"));

const NearbyEvents = ({ lat, lon, city, cp }) => {
  const router = useRouter();
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distanceOption, setDistanceOption] = useState("under10km");
  const [distance, setDistance] = useState(10);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("all");

  const distanceOptions = [
    { label: "Moins de 10 km", value: "under10km", maxDistance: 10 },
    { label: "Moins de 20 km", value: "under20km", maxDistance: 20 },
    { label: "Moins de 35 km", value: "under35km", maxDistance: 35 },
    { label: "Plus de 35 km", value: "over35km", maxDistance: 1000 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if ((lat && lon) || city) {
        setLoading(true);
        try {
          const maxDistance = distanceOptions.find(
            (option) => option.value === distanceOption
          ).maxDistance;
          let response;

          if (city) {
            response = await axios.get(
              `/api/events/nearby?city=${city}&cp=${cp}&maxDistance=${maxDistance}`
            );
          } else if (lat && lon) {
            response = await axios.get(
              `/api/events/nearby?latitude=${lat}&longitude=${lon}&maxDistance=${maxDistance}`
            );
          }

          if (response) {
            setNearbyEvents(response.data);
            setFilteredEvents(response.data);
            const dates = Array.from(
              new Set(response.data.map((event) => event.date))
            );
            setAvailableDates(dates);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des événements proches :",
            error
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [lat, lon, city, distanceOption]);

  const handleOptionChange = (value) => {
    setDistanceOption(value);
    const maxDistance = distanceOptions.find(
      (option) => option.value === value
    ).maxDistance;
    setDistance(maxDistance);
    setSelectedDate("all");
  };

  const handleDateChange = (value) => {
    setSelectedDate(value);
    filterEventsByDate(value);
  };

  const filterEventsByDate = (date) => {
    if (date && date !== "all") {
      const filtered = nearbyEvents.filter((event) => event.date === date);
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(nearbyEvents);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <MapPin className="w-6 h-6 mr-2" />
          Événements proches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="distanceOption"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sélectionnez une distance :
              </label>
              <Select onValueChange={handleOptionChange} value={distanceOption}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une distance" />
                </SelectTrigger>
                <SelectContent>
                  {distanceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="dateOption"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sélectionnez une date :
              </label>
              <Select onValueChange={handleDateChange} value={selectedDate}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes les dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  {availableDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              }
            >
              <ScrollArea className="h-[600px]">
                <EventList
                  events={filteredEvents}
                  grouped={true}
                  showCity={true}
                  showDetails={true}
                />
              </ScrollArea>
            </Suspense>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default NearbyEvents;
