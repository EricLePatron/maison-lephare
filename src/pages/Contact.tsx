import { Mail, MapPin, Globe } from "lucide-react";
import { usePageContent } from "@/hooks/useSiteContent";
import { Seo } from "@/components/Seo";

export default function Contact() {
  const { getContent, isLoading: contentLoading } = usePageContent("contact");

  const address = getContent("info", "address", "12 rue Jean Jacques Rousseau 33700 Mérignac");
  const email = getContent("info", "email", "contact@maison-lephare.com");
  const social = getContent("info", "social", "@lamaisonlephare");

  if (contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Seo
        title="Contact – Le Phare, Maison de la Santé Mentale à Mérignac"
        description="Contactez Le Phare à Mérignac : informations, rendez-vous avec un professionnel, propositions d'ateliers ou installation en libéral."
        path="/contact"
      />
      {/* Hero — fond bleu ciel + carte coordonnées centrée */}
      <section className="relative bg-sky-100 overflow-hidden min-h-[80vh] flex items-center">
        {/* Bandeau bordeaux haut-gauche */}
        <div className="absolute top-0 left-0 h-16 sm:h-24 w-1/2 bg-primary z-0" aria-hidden />
        {/* Bandeau bordeaux bas-gauche */}
        <div className="absolute bottom-0 left-0 h-16 sm:h-24 w-1/2 bg-primary z-0" aria-hidden />

        <div className="container-wide relative z-10 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto">
            {/* Carte coordonnées */}
            <div className="bg-sky-100 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-soft border border-primary/10">
              <h1 className="font-script text-primary leading-[1.05] text-[clamp(2.5rem,6vw,4.5rem)] mb-10 sm:mb-12 text-center">
                {getContent("info", "title", "Contactez-nous !")}
              </h1>

              <ul className="space-y-6 sm:space-y-8">
                <li className="flex items-start gap-5 pb-6 sm:pb-8 border-b border-dashed border-foreground/30">
                  <span className="flex-shrink-0 mt-1">
                    <MapPin className="h-8 w-8 text-accent" strokeWidth={2} fill="currentColor" />
                  </span>
                  <span className="text-foreground text-lg sm:text-xl leading-snug">
                    {address}
                  </span>
                </li>
                <li className="flex items-center gap-5 pb-6 sm:pb-8 border-b border-dashed border-foreground/30">
                  <span className="flex-shrink-0">
                    <Mail className="h-8 w-8 text-accent" strokeWidth={2} fill="currentColor" />
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-foreground text-lg sm:text-xl hover:text-primary transition-colors break-all font-medium"
                  >
                    {email}
                  </a>
                </li>
                <li className="flex items-center gap-5">
                  <span className="flex-shrink-0">
                    <Globe className="h-8 w-8 text-accent" strokeWidth={2} />
                  </span>
                  <span className="text-foreground text-lg sm:text-xl">
                    {social}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}