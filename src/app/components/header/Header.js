import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/router";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
        <ul className={`header__menu ${menuOpen ? "open" : ""}`}>
          <li>
            <Link href="/">Accueil</Link>
          </li>
          {!user ? (
            <>
              <li>
                <Link href="/user/login">Se connecter</Link>
              </li>
              <li>
                <Link href="/user/register">Créer un compte</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/user/formulaire">Créer un événenement</Link>
              </li>
              <li>
                <a href="#" onClick={handleLogout}>
                  Déconnexion
                </a>
              </li>
            </>
          )}
          <li>
            <Link href="#">Contact</Link>
          </li>
        </ul>
      </div>
      <Link className="header__a" href="/">
        <div className="header__middle">
          <h1>BradEnOr*</h1>
        </div>
      </Link>
      <div className="header__right">
        {!user ? (
          <button className="header__login-button cta-button">
            <Link href="/user/login">
              <FiUser />
            </Link>
          </button>
        ) : (
          <div className="header__user-info">
            <span>Bonjour, {user.prenom}</span>
            <button
              className="header__logout-button cta-button"
              onClick={handleLogout}
            >
              <FiLogOut />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
