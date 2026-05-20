import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Globe, Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePageContent } from "@/hooks/useSiteContent";
import { trackContactFormSubmit } from "@/lib/analytics";
import { Seo } from "@/components/Seo";

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
      <Seo
        title="Contact – Le Phare, Maison de la Santé Mentale"
        description="Contactez Le Phare à Mérignac : informations, rendez-vous avec un professionnel, propositions d'ateliers ou installation en libéral."
        path="/contact"
      />
      {/* Hero — fond bleu ciel + carte coordonnées avec bandeaux bordeaux */}
      <section className="relative bg-sky-100 overflow-hidden">
        {/* Bandeau bordeaux haut-gauche */}
        <div className="absolute top-0 left-0 h-16 sm:h-24 w-1/2 bg-primary z-0" aria-hidden />
        {/* Bandeau bordeaux bas-gauche */}
        <div className="absolute bottom-0 left-0 h-16 sm:h-24 w-1/2 bg-primary z-0" aria-hidden />

        <div className="container-wide relative z-10 py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-2 items-start max-w-6xl mx-auto">
            {/* Carte coordonnées */}
            <div className="bg-sky-100 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-soft">
              <h1 className="font-script text-primary leading-[1.05] text-[clamp(2.5rem,6vw,4.5rem)] mb-8 sm:mb-10 text-center">
                {getContent("info", "title", "Contactez-nous !")}
              </h1>

              <ul className="space-y-5 sm:space-y-6">
                <li className="flex items-start gap-5 pb-5 sm:pb-6 border-b border-dashed border-foreground/30">
                  <span className="flex-shrink-0 mt-1">
                    <MapPin className="h-8 w-8 text-accent" strokeWidth={2} fill="currentColor" />
                  </span>
                  <span className="text-foreground text-base sm:text-lg leading-snug">
                    {getContent("info", "address", "12 rue Jean Jacques Rousseau 33700 Mérignac")}
                  </span>
                </li>
                <li className="flex items-center gap-5 pb-5 sm:pb-6 border-b border-dashed border-foreground/30">
                  <span className="flex-shrink-0">
                    <Phone className="h-8 w-8 text-accent" strokeWidth={2} fill="currentColor" />
                  </span>
                  <a
                    href={`tel:${getContent("info", "phone", "06 32 80 24 98").replace(/\s/g, "")}`}
                    className="text-foreground text-base sm:text-lg hover:text-primary transition-colors"
                  >
                    {getContent("info", "phone", "06 32 80 24 98")}
                  </a>
                </li>
                <li className="flex items-center gap-5 pb-5 sm:pb-6 border-b border-dashed border-foreground/30">
                  <span className="flex-shrink-0">
                    <Mail className="h-8 w-8 text-accent" strokeWidth={2} fill="currentColor" />
                  </span>
                  <a
                    href={`mailto:${getContent("info", "email", "contact@maison-lephare.com")}`}
                    className="text-foreground text-base sm:text-lg hover:text-primary transition-colors break-all"
                  >
                    {getContent("info", "email", "contact@maison-lephare.com")}
                  </a>
                </li>
                <li className="flex items-center gap-5">
                  <span className="flex-shrink-0">
                    <Globe className="h-8 w-8 text-accent" strokeWidth={2} />
                  </span>
                  <span className="text-foreground text-base sm:text-lg">
                    {getContent("info", "social", "@lamaisonlephare")}
                  </span>
                </li>
              </ul>
            </div>

            {/* Formulaire de contact */}
            <div className="bg-background rounded-3xl p-8 sm:p-10 lg:p-12 shadow-soft">
              <h2 className="font-script text-primary leading-[1.05] text-[clamp(2rem,4.5vw,3rem)] mb-3 text-center">
                {getContent("form", "title", "Envoyez-nous un message")}
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                {getContent("form", "intro", "Une question, un projet, une demande de rendez-vous ? Écrivez-nous, nous vous répondrons rapidement.")}
              </p>

              {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-script text-primary text-3xl mb-2">
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
      </section>
    </>
  );
}
