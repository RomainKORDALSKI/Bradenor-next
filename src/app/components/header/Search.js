"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, MapPin, Heart, ChevronDown, ChevronUp } from "lucide-react";
import EventCalendar from "@/app/components/header/EventCalendar";
import Searchbis from "@/app/components/header/NavNearby";
import Bookmark from "@/app/components/header/Bookmark";
import { motion, AnimatePresence } from "framer-motion";

const Search = () => {
  const [activeButton, setActiveButton] = useState(null);
  const calendarButtonRef = useRef(null);
  const locationButtonRef = useRef(null);
  const bookmarkButtonRef = useRef(null);

  const toggleModal = (buttonRef) => {
    setActiveButton((current) =>
      current === buttonRef.current ? null : buttonRef.current
    );
  };

  const closeModal = () => {
    setActiveButton(null);
  };

  const renderPopover = (triggerRef, icon, text, content, key) => (
    <Popover key={key}>
      <PopoverTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            ref={triggerRef}
            variant="outline"
            className="w-full md:w-auto justify-between text-primary hover:text-secondary transition-all duration-200 bg-background hover:bg-primary/10 border-2 border-primary rounded-full px-6 py-3 shadow-md hover:shadow-lg"
            onClick={() => toggleModal(triggerRef)}
          >
            <div className="flex items-center space-x-2">
              {icon}
              <span className="hidden md:inline">{text}</span>
            </div>
            <AnimatePresence>
              {activeButton === triggerRef.current ? (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  exit={{ rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp className="h-4 w-4 ml-2" />
                </motion.div>
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 rounded-lg shadow-lg border-2 border-primary"
        align="start"
      >
        {content}
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="bg-gradient-to-r from-background to-primary/10 p-6 rounded-xl shadow-xl">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-center justify-center">
        {renderPopover(
          calendarButtonRef,
          <Calendar className="h-5 w-5" />,
          "Recherche par Date",
          <EventCalendar closeModal={closeModal} />,
          "calendar"
        )}
        {renderPopover(
          locationButtonRef,
          <MapPin className="h-5 w-5" />,
          "Recherche par Localisation",
          <Searchbis closeModal={closeModal} />,
          "location"
        )}
        {renderPopover(
          bookmarkButtonRef,
          <Heart className="h-5 w-5" />,
          "Favoris",
          <Bookmark closeModal={closeModal} />,
          "bookmark"
        )}
      </div>
    </div>
  );
};

export default Search;
