"use client";

import React, { useState, useEffect } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const EventCalendar = ({ closeModal }) => {
  const [events, setEvents] = useState([]);
  const [eventDates, setEventDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const fetchAllEventDates = async () => {
      try {
        const response = await fetch("/api/events/all-dates");
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des dates des événements"
          );
        }
        const data = await response.json();
        const dates = data.map((event) => parseISO(event.date));
        setEventDates(dates);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des dates des événements:",
          error
        );
      }
    };

    fetchAllEventDates();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const response = await fetch(`/api/events/date?date=${formattedDate}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des événements");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
      }
    };

    fetchEvents();
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    navigateToEventsForDate(date);
    closeModal();
  };

  const navigateToEventsForDate = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    router.push(`/date/events/${formattedDate}`);
  };

  return (
    <div className="p-4">
      <CalendarComponent
        mode="single"
        selected={selectedDate}
        onSelect={handleDateChange}
        locale={fr}
        modifiers={{
          eventDay: (date) =>
            eventDates.some((eventDate) => isSameDay(eventDate, date)),
        }}
        modifiersClassNames={{
          eventDay: "bg-primary text-primary-foreground font-bold",
        }}
      />
    </div>
  );
};

export default EventCalendar;
