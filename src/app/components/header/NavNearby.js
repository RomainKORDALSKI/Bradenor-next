"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NavNearby = ({ closeModal }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [cachedPosition, setCachedPosition] = useState(null);

  const handleInputChange = async (value) => {
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://geo.api.gouv.fr/communes?nom=${value}&fields=nom,code,codesPostaux,codeDepartement&boost=population&limit=10`
        );
        const options = response.data.map((item) => ({
          value: item,
          label: `${item.nom}, ${item.codesPostaux}`,
        }));
        setSuggestions(options);
        setOpen(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  };

  const handleSuggestionSelect = (selectedOption) => {
    if (selectedOption) {
      const { nom, codeDepartement, codesPostaux } = selectedOption.value;
      const codePostal =
        codesPostaux && codesPostaux.length > 0 ? codesPostaux[0] : "";
      setQuery(`${nom}, ${codeDepartement} (${codePostal})`);
      setSuggestions([]);
      setOpen(false);
      router.push(`/${codeDepartement}/${nom}?cp=${codePostal}`);
      closeModal();
    }
  };

  const handleLocateMe = async () => {
    setLoading(true);

    try {
      let position = cachedPosition;

      if (!position) {
        position = await getCurrentPosition();
        setCachedPosition(position);
      }

      const { latitude, longitude } = position.coords;
      const response = await axios.get(
        `https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=nom,codeDepartement&limit=1`
      );
      const city = response.data[0];
      const department = city.codeDepartement;
      const cityName = city.nom;
      router.push(
        `/${department}/${cityName}?lat=${latitude}&lon=${longitude}`
      );
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la localisation :", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) =>
          reject(new Error("Impossible d'obtenir la position actuelle."))
      );
    });
  };

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {query || "Recherchez une ville"}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Recherchez une ville"
              value={query}
              onValueChange={handleInputChange}
            />
            <CommandEmpty>Aucune suggestion trouvée</CommandEmpty>
            <CommandGroup>
              {suggestions.map((option) => (
                <CommandItem
                  key={option.value.code}
                  onSelect={() => handleSuggestionSelect(option)}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex space-x-2">
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => handleSuggestionSelect(suggestions[0])}
          disabled={!suggestions.length}
        >
          <Search className="mr-2 h-4 w-4" /> Rechercher
        </Button>
        <Button
          className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={handleLocateMe}
          disabled={loading}
        >
          <MapPin className="mr-2 h-4 w-4" />
          {loading ? "Recherche..." : "Me localiser"}
        </Button>
      </div>
    </div>
  );
};

export default NavNearby;
