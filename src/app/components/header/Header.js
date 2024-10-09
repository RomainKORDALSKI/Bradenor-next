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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [user, setUser] = useState(null);
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

  const MenuItems = ({ mobile = false }) => (
    <ul className={`${mobile ? "space-y-4" : "flex space-x-4"}`}>
      <li>
        <Button variant="ghost" asChild className="w-full justify-start">
          <Link
            href="/"
            className="text-primary hover:text-secondary transition-colors duration-200"
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Accueil</span>
          </Link>
        </Button>
      </li>
      {!user ? (
        <>
          <li>
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link
                href="/user/login"
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Se connecter</span>
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link
                href="/user/register"
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Créer un compte</span>
              </Link>
            </Button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link
                href="/user/formulaire"
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>Créer un événement</span>
              </Link>
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start text-primary hover:text-secondary transition-colors duration-200"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </li>
        </>
      )}
      <li>
        <Button variant="ghost" asChild className="w-full justify-start">
          <Link
            href="#"
            className="text-primary hover:text-secondary transition-colors duration-200"
          >
            <Mail className="mr-2 h-4 w-4" />
            <span>Contact</span>
          </Link>
        </Button>
      </li>
    </ul>
  );

  return (
    <header className="bg-background border-b border-primary">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-primary hover:text-secondary transition-colors duration-200"
        >
          BradEnOr
        </Link>

        <nav className="hidden md:block">
          <MenuItems />
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-primary">
                Bonjour, {user.prenom}
              </span>
              <Avatar>
                <AvatarImage src={user.avatar || ""} alt={user.prenom} />
                <AvatarFallback className="bg-secondary text-text">
                  {user.prenom[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <Button
              asChild
              className="bg-primary text-background hover:bg-secondary transition-colors duration-200"
            >
              <Link href="/user/login">Se connecter</Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[400px] bg-background"
            >
              <nav className="mt-6">
                <MenuItems mobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
