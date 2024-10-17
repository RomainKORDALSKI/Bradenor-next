"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as yup from "yup";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const schema = yup.object().shape({
  email: yup.string().email("Email invalide").required("Email est requis"),
  nom: yup.string().min(2, "Nom trop court").required("Nom est requis"),
  prenom: yup
    .string()
    .min(2, "Prénom trop court")
    .required("Prénom est requis"),
  password: yup
    .string()
    .min(8, "Mot de passe trop court")
    .matches(/[A-Z]/, "Doit contenir une majuscule")
    .matches(/[a-z]/, "Doit contenir une minuscule")
    .matches(/[0-9]/, "Doit contenir un chiffre")
    .matches(/[@$!%*?&#]/, "Doit contenir un caractère spécial")
    .required("Mot de passe est requis"),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Les mots de passe doivent correspondre"
    )
    .required("Confirmation du mot de passe est requise"),
});

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    nom: "",
    prenom: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await schema.validate(formData, { abortEarly: false });
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/user/login");
      } else {
        setError(
          data.message || "Erreur lors de l'enregistrement de l'utilisateur."
        );
      }
    } catch (err) {
      if (err.inner) {
        setError(err.inner.map((e) => e.message).join(". "));
      } else {
        setError("Erreur lors de l'enregistrement de l'utilisateur.");
      }
      console.error("Erreur lors de l'enregistrement de l'utilisateur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password) => {
    const checks = [
      { regex: /.{8,}/, message: "8 caractères minimum" },
      { regex: /[A-Z]/, message: "Une majuscule" },
      { regex: /[a-z]/, message: "Une minuscule" },
      { regex: /[0-9]/, message: "Un chiffre" },
      { regex: /[@$!%*?&#]/, message: "Un caractère spécial" },
    ];

    return checks.map((check, index) => (
      <div key={index} className="flex items-center space-x-2">
        {check.regex.test(formData.password) ? (
          <CheckCircle2 className="text-green-500" size={16} />
        ) : (
          <AlertCircle className="text-gray-300" size={16} />
        )}
        <span
          className={
            check.regex.test(formData.password)
              ? "text-green-500"
              : "text-gray-500"
          }
        >
          {check.message}
        </span>
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Inscription
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Créez votre compte pour rejoindre notre communauté
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  type="text"
                  id="nom"
                  name="nom"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  type="text"
                  id="prenom"
                  name="prenom"
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="text-sm space-y-1 mt-2">
                  {passwordStrength(formData.password)}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center space-x-2">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link href="/user/login" className="text-primary hover:underline">
                Connectez-vous
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
