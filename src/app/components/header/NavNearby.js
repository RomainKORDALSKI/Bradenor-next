"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const NavNearby = ({ closeModal }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [cachedPosition, setCachedPosition] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const response = await axios.get(
            `https://geo.api.gouv.fr/communes?nom=${query}&fields=nom,code,codesPostaux,codeDepartement&boost=population&limit=10`
          );
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionSelect = (selectedItem) => {
    if (selectedItem) {
      const { nom, codeDepartement, codesPostaux } = selectedItem;
      const codePostal =
        codesPostaux && codesPostaux.length > 0 ? codesPostaux[0] : "";
      setQuery(`${nom}, ${codeDepartement} (${codePostal})`);
      setSuggestions([]);
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
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Recherchez une ville"
          value={query}
          onChange={handleInputChange}
          className="w-full"
        />
        {suggestions.length > 0 && (
          <Command className="absolute w-full mt-1 bg-background border border-input rounded-md shadow-md">
            <CommandList>
              <CommandEmpty>Aucune suggestion trouvée</CommandEmpty>
              <CommandGroup>
                {suggestions.map((item) => (
                  <CommandItem
                    key={item.code}
                    onSelect={() => handleSuggestionSelect(item)}
                    className="cursor-pointer"
                  >
                    {item.nom}, {item.codeDepartement} (
                    {item.codesPostaux[0] || ""})
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </div>
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
