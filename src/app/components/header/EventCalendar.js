"use client";

import React, { useState, useEffect } from "react";
import { format, isSameDay, parseISO, addMonths, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Calendar as CalendarComponent } from "@/app/components/ui/calendar";
import { Button } from "@/app/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const EventCalendar = ({ closeModal }) => {
  const [events, setEvents] = useState([]);
  const [eventDates, setEventDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAllEventDates = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllEventDates();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-4 bg-background rounded-lg shadow-lg max-w-sm mx-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={handlePrevMonth}
          variant="ghost"
          size="icon"
          className="text-primary hover:text-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold text-primary">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </h2>
        <Button
          onClick={handleNextMonth}
          variant="ghost"
          size="icon"
          className="text-primary hover:text-secondary"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <CalendarComponent
        mode="single"
        selected={selectedDate}
        onSelect={handleDateChange}
        locale={fr}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        modifiers={{
          eventDay: (date) =>
            eventDates.some((eventDate) => isSameDay(eventDate, date)),
        }}
        className="rounded-md border border-primary"
        classNames={{
          day_today: "bg-primary text-primary-foreground font-bold",
          day_selected:
            "bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/20 focus:bg-primary/20 rounded-full transition-colors",
          nav_button: "text-primary hover:text-secondary",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          caption: "relative flex justify-center items-center",
          caption_label: "text-sm font-medium",
        }}
        components={{
          DayContent: (props) => (
            <div
              className={`h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/20 focus:bg-primary/20 rounded-full flex items-center justify-center transition-colors ${
                eventDates.some((eventDate) => isSameDay(eventDate, props.date))
                  ? "bg-primary text-primary-foreground text-secondary font-bold"
                  : ""
              }`}
            >
              {props.date.getDate()}
            </div>
          ),
        }}
      />
      {isLoading && (
        <div className="mt-4 text-center text-primary">
          Chargement des événements...
        </div>
      )}
      {!isLoading && events.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Événements pour le{" "}
            {format(selectedDate, "d MMMM yyyy", { locale: fr })}
          </h3>
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id} className="text-sm text-primary">
                {event.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default EventCalendar;
