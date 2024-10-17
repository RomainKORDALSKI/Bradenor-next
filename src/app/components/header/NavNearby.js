"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import { motion, AnimatePresence } from "framer-motion";

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
        setLoading(true);
        try {
          const response = await axios.get(
            `https://geo.api.gouv.fr/communes?nom=${query}&fields=nom,code,codesPostaux,codeDepartement&boost=population&limit=10`
          );
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-4 p-4 bg-background rounded-lg shadow-md"
    >
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Recherchez une ville"
          value={query}
          onChange={handleInputChange}
          className="w-full pr-10 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
        )}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full mt-1 bg-background border border-input rounded-md shadow-md z-10"
            >
              <Command>
                <CommandList>
                  <CommandEmpty>Aucune suggestion trouvée</CommandEmpty>
                  <CommandGroup>
                    {suggestions.map((item) => (
                      <CommandItem
                        key={item.code}
                        onSelect={() => handleSuggestionSelect(item)}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                      >
                        {item.nom}, {item.codeDepartement} (
                        {item.codesPostaux[0] || ""})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex space-x-2">
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          onClick={() => handleSuggestionSelect(suggestions[0])}
          disabled={!suggestions.length || loading}
        >
          <Search className="mr-2 h-4 w-4" /> Rechercher
        </Button>
        <Button
          className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors duration-200"
          onClick={handleLocateMe}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="mr-2 h-4 w-4" />
          )}
          {loading ? "Recherche..." : "Me localiser"}
        </Button>
      </div>
    </motion.div>
  );
};

export default NavNearby;
