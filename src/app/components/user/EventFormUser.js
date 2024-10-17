"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function EventSubmissionForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      pays: "",
      departement: "",
      arrondissement: "",
      code_postal: "",
      ville: "",
      salle: "",
      rue: "",
      type_braderie: "",
      date: "",
      heure_debut_visiteur: "",
      heure_fin_visiteur: "",
      nb_exposants: "",
      toilettes_publiques: false,
      reserve_aux_particuliers: false,
      exposant_heure_arrivee: "",
      emplacement_prix: "",
      commentaire: "",
      organisateur_personne_morale: "",
      organisateur_telephone: "",
      organisateur_facebook: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/user/login");
    }
  }, [router]);

  async function onSubmit(values) {
    try {
      const res = await fetch("/api/user/createEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast({
          title: "Événement créé",
          description: "Votre événement a été créé avec succès.",
        });
        router.push("/events");
      } else {
        const data = await res.json();
        toast({
          title: "Erreur",
          description:
            data.message ||
            "Une erreur est survenue lors de la création de l'événement.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création de l'événement.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Ajouter un événement</CardTitle>
        <CardDescription>
          Remplissez les détails de votre événement ci-dessous. Les champs
          marqués d'un * sont obligatoires.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="organisateur">Organisateur</TabsTrigger>
                <TabsTrigger value="autres">Autres</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pays *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un pays" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FR">France</SelectItem>
                            <SelectItem value="BE">Belgique</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="departement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Département *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un département" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Nord">Nord</SelectItem>
                            <SelectItem value="Pas-de-Calais">
                              Pas-de-Calais
                            </SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="code_postal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal *</FormLabel>
                        <FormControl>
                          <Input placeholder="Code postal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ville"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ville" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rue *</FormLabel>
                        <FormControl>
                          <Input placeholder="Rue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salle</FormLabel>
                        <FormControl>
                          <Input placeholder="Salle (optionnel)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="details">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type_braderie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de braderie *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Marché aux puces">
                              Marché aux puces
                            </SelectItem>
                            <SelectItem value="Brocante">Brocante</SelectItem>
                            <SelectItem value="Vide grenier">
                              Vide grenier
                            </SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heure_debut_visiteur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure de début pour les visiteurs</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heure_fin_visiteur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure de fin pour les visiteurs</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nb_exposants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre d'exposants</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emplacement_prix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix de l'emplacement</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="organisateur">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="organisateur_personne_morale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organisateur (personne morale)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="organisateur_telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone de l'organisateur</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="organisateur_facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook de l'organisateur</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="autres">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="toilettes_publiques"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Toilettes publiques</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reserve_aux_particuliers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Réservé aux particuliers</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="exposant_heure_arrivee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure d'arrivée des exposants</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="commentaire"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commentaire</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ajoutez des informations supplémentaires ici"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <Button type="submit" className="w-full">
              Ajouter l'événement
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
