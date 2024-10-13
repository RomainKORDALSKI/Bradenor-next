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
        <Button
          ref={triggerRef}
          variant="outline"
          className="w-full justify-between text-primary hover:text-secondary transition-colors duration-200"
          onClick={() => toggleModal(triggerRef)}
        >
          <div className="flex items-center">
            {icon}
            <span>{text}</span>
          </div>
          {activeButton === triggerRef.current ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        {content}
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="bg-background p-4 rounded-lg shadow-md">
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        {renderPopover(
          calendarButtonRef,
          <Calendar className="mr-2 h-4 w-4" />,
          "Recherche par Date",
          <EventCalendar closeModal={closeModal} />,
          "calendar"
        )}
        {renderPopover(
          locationButtonRef,
          <MapPin className="mr-2 h-4 w-4" />,
          "Recherche par Localisation/Ville",
          <Searchbis closeModal={closeModal} />,
          "location"
        )}
        {renderPopover(
          bookmarkButtonRef,
          <Heart className="mr-2 h-4 w-4" />,
          "Favoris",
          <Bookmark closeModal={closeModal} />,
          "bookmark"
        )}
      </div>
    </div>
  );
};

export default Search;
