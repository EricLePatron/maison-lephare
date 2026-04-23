import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePageContent } from "@/hooks/useSiteContent";
import { trackContactFormSubmit } from "@/lib/analytics";
import chateauImage from "@/assets/chateau-main.jpg";

// Validation schema for contact form
const contactSchema = z.object({
  nom: z.string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z.string()
    .trim()
    .email("Adresse email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  sujet: z.string()
    .trim()
    .min(5, "Le sujet doit contenir au moins 5 caractères")
    .max(200, "Le sujet ne peut pas dépasser 200 caractères"),
  message: z.string()
    .trim()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(5000, "Le message ne peut pas dépasser 5000 caractères"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { getContent, isLoading: contentLoading } = usePageContent("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation with Zod
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        if (field) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      trackContactFormSubmit(false, "validation_error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call edge function for server-side validation and processing
      const { data, error } = await supabase.functions.invoke("contact-form", {
        body: result.data,
      });

      if (error) {
        console.error("Contact form error:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi du message.",
          variant: "destructive",
        });
        trackContactFormSubmit(false, "server_error");
        setIsSubmitting(false);
        return;
      }

      if (data?.error) {
        toast({
          title: "Erreur de validation",
          description: data.error,
          variant: "destructive",
        });
        trackContactFormSubmit(false, "server_validation_error");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      trackContactFormSubmit(true);
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive",
      });
      trackContactFormSubmit(false, "exception");
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={chateauImage}
            alt="Château Le Phare"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sage-700/95 via-sage-600/85 to-sage-500/70" />
        </div>

        <div className="container-wide relative z-10 py-20">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-primary-foreground leading-tight mb-6">
              {getContent("hero", "title", "Contact")}
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/85 leading-relaxed">
              {getContent("hero", "description", "Une question, une demande d'information ou envie de nous rejoindre ? Nous sommes à votre écoute.")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
                Nos coordonnées
              </h2>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Adresse</h3>
                    <p className="text-muted-foreground">
                      12 rue Jean-Jacques Rousseau<br />
                      33700 Mérignac
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Email</h3>
                    <a
                      href="mailto:contact@maison-lephare.com"
                      className="text-primary hover:underline"
                    >
                      contact@maison-lephare.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="aspect-video rounded-2xl overflow-hidden bg-sage-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="h-12 w-12 text-sage-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Carte interactive à venir
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="card-elegant">
                <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
                  Envoyez-nous un message
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                      Message envoyé !
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ nom: "", email: "", sujet: "", message: "" });
                      }}
                    >
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom</Label>
                        <Input
                          id="nom"
                          name="nom"
                          placeholder="Votre nom"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                          maxLength={100}
                          className={`bg-background ${errors.nom ? "border-destructive" : ""}`}
                        />
                        {errors.nom && (
                          <p className="text-sm text-destructive">{errors.nom}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="votre@email.fr"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          maxLength={255}
                          className={`bg-background ${errors.email ? "border-destructive" : ""}`}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sujet">Sujet</Label>
                      <Input
                        id="sujet"
                        name="sujet"
                        placeholder="L'objet de votre message"
                        value={formData.sujet}
                        onChange={handleChange}
                        required
                        maxLength={200}
                        className={`bg-background ${errors.sujet ? "border-destructive" : ""}`}
                      />
                      {errors.sujet && (
                        <p className="text-sm text-destructive">{errors.sujet}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Votre message..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        maxLength={5000}
                        className={`bg-background resize-none ${errors.message ? "border-destructive" : ""}`}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          Envoyer le message
                          <Send className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-narrow">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-foreground text-center mb-10">
            Questions fréquentes
          </h2>
          
          <div className="space-y-4">
            <div className="card-elevated">
              <h3 className="font-medium text-foreground mb-2">
                Comment prendre rendez-vous avec un professionnel ?
              </h3>
              <p className="text-muted-foreground text-sm">
                Vous pouvez nous contacter via ce formulaire ou par téléphone. Nous vous orienterons vers le professionnel le plus adapté à votre demande.
              </p>
            </div>
            
            <div className="card-elevated">
              <h3 className="font-medium text-foreground mb-2">
                Les ateliers sont-ils payants ?
              </h3>
              <p className="text-muted-foreground text-sm">
                Certains ateliers sont gratuits, d'autres font l'objet d'une participation libre ou d'un tarif adapté aux revenus. Contactez-nous pour en savoir plus.
              </p>
            </div>
            
            <div className="card-elevated">
              <h3 className="font-medium text-foreground mb-2">
                Peut-on visiter le lieu avant de s'engager ?
              </h3>
              <p className="text-muted-foreground text-sm">
                Bien sûr ! Nous organisons régulièrement des portes ouvertes. Vous pouvez aussi demander une visite individuelle en nous contactant.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
