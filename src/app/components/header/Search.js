"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
    if (activeButton === buttonRef.current) {
      setActiveButton(null);
    } else {
      setActiveButton(buttonRef.current);
    }
  };

  const closeModal = () => {
    setActiveButton(null);
  };

  return (
    <div className="bg-background p-4 rounded-lg shadow-md">
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              ref={calendarButtonRef}
              variant="outline"
              className="w-full justify-between text-primary hover:text-secondary transition-colors duration-200"
              onClick={() => toggleModal(calendarButtonRef)}
            >
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Recherche par Date</span>
              </div>
              {activeButton === calendarButtonRef.current ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background">
            <EventCalendar closeModal={closeModal} />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              ref={locationButtonRef}
              variant="outline"
              className="w-full justify-between text-primary hover:text-secondary transition-colors duration-200"
              onClick={() => toggleModal(locationButtonRef)}
            >
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>Recherche par Localisation/Ville</span>
              </div>
              {activeButton === locationButtonRef.current ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background">
            <Searchbis closeModal={closeModal} />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              ref={bookmarkButtonRef}
              variant="outline"
              className="w-full justify-between text-primary hover:text-secondary transition-colors duration-200"
              onClick={() => toggleModal(bookmarkButtonRef)}
            >
              <div className="flex items-center">
                <Heart className="mr-2 h-4 w-4" />
                <span>Favoris</span>
              </div>
              {activeButton === bookmarkButtonRef.current ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background">
            <Bookmark closeModal={closeModal} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Search;
