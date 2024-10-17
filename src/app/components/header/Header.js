"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  UserPlus,
  Calendar,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/app/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUser(decodedToken);
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const MenuItems = ({ mobile = false, onItemClick = () => {} }) => (
    <ul className={`${mobile ? "space-y-4" : "flex space-x-2"}`}>
      {[
        { href: "/", icon: Home, text: "Accueil" },
        { href: "/user/formulaire", icon: Calendar, text: "Créer Événement" },
        { href: "/map", icon: MapPin, text: "Carte" },
        { href: "/user/dashboard", icon: Mail, text: "Compte" },
      ].map((item) => (
        <li key={item.href}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={mobile ? "ghost" : "outline"}
              asChild
              className={`w-full justify-start ${
                mobile ? "text-lg" : "text-sm"
              } text-primary hover:text-secondary transition-all duration-200 bg-background hover:bg-primary/10 border-2 border-primary rounded-full px-6 py-3 shadow-md hover:shadow-lg`}
              onClick={onItemClick}
            >
              <Link href={item.href} className="flex items-center space-x-2">
                <item.icon className={`${mobile ? "h-5 w-5" : "h-4 w-4"}`} />
                <span>{item.text}</span>
              </Link>
            </Button>
          </motion.div>
        </li>
      ))}
    </ul>
  );

  return (
    <header className="bg-background border-b border-primary/20 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-primary rounded-full p-2"
            >
              <MapPin className="h-6 w-6 text-background" />
            </motion.div>
            <span className="text-2xl font-bold text-primary">BradEnOr</span>
          </Link>

          <nav className="hidden md:block">
            <MenuItems />
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-primary hidden sm:inline">
                  Bonjour, {user.prenom}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full md:w-auto justify-between text-primary hover:text-secondary transition-all duration-200 bg-background hover:bg-primary/10 border-2 border-primary rounded-full px-6 py-3 shadow-md hover:shadow-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </div>
            ) : (
              <Button
                asChild
                className="w-full md:w-auto justify-between text-primary hover:text-secondary transition-all duration-200 bg-background hover:bg-primary/10 border-2 border-primary rounded-full px-6 py-3 shadow-md hover:shadow-lg"
              >
                <Link href="/user/login">
                  <User className="h-4 w-4 mr-2" />
                  <span>Se connecter</span>
                </Link>
              </Button>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden text-primary hover:text-secondary transition-all duration-200 bg-background hover:bg-primary/10 border-2 border-primary rounded-full shadow-md hover:shadow-lg"
                  onClick={() => setIsOpen(true)}
                >
                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 90 }}
                        exit={{ rotate: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 0 }}
                        exit={{ rotate: -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-background"
              >
                <SheetClose asChild>
                  <Link href="/" className="flex items-center space-x-2 mb-10">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="bg-primary rounded-full p-2"
                    >
                      <MapPin className="h-6 w-6 text-background" />
                    </motion.div>
                    <span className="text-2xl font-bold text-primary">
                      BradEnOr
                    </span>
                  </Link>
                </SheetClose>
                <nav className="mt-6">
                  <MenuItems mobile onItemClick={() => setIsOpen(false)} />
                </nav>
                {!user && (
                  <div className="mt-6">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full md:w-auto justify-between text-primary hover:text-secondary transition-all duration-200 bg-background hover:bg-primary/10 border-2 border-primary rounded-full px-6 py-3 shadow-md hover:shadow-lg"
                    >
                      <Link href="/user/register">
                        <UserPlus className="h-4 w-4 mr-2" />
                        <span>Créer un compte</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
