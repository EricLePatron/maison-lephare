import { Heart, Loader2 } from "lucide-react";
import { usePageContent } from "@/hooks/useSiteContent";
import { useSiteImage } from "@/hooks/useTheme";
import chateauImageStatic from "@/assets/chateau-main.jpg";
import lieuSolidarityStatic from "@/assets/lieu-solidarity.jpg";

export default function LeLieu() {
  const { getContent, isLoading } = usePageContent("le-lieu");
  const chateauImage = useSiteImage("chateau-main", chateauImageStatic);
  const solidarityImage = useSiteImage("lieu-solidarity", lieuSolidarityStatic);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const welcomeItems = [
    getContent("welcome", "item_1", "les enfants,"),
    getContent("welcome", "item_2", "les étudiants,"),
    getContent("welcome", "item_3", "les aidants,"),
    getContent("welcome", "item_4", "les jeunes parents,"),
    getContent("welcome", "item_5", "les personnes en activité ou non,"),
    getContent("welcome", "item_6", "les personnes vivant des souffrances parfois très intenses ou parfois plus diffuses."),
  ];

  return (
    <>
      {/* Hero — Photo du château avec logo script en surimpression */}
      <section className="relative w-full overflow-hidden">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full">
          <img
            src={chateauImage}
            alt={getContent("hero", "image_alt", "Château LePhare")}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="font-script text-primary-foreground leading-[0.9] drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] text-[clamp(4rem,16vw,12rem)]">
              <span className="block">le</span>
              <span className="block -mt-4 sm:-mt-6">Phare</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-primary-foreground/95 text-sm sm:text-base md:text-lg font-light tracking-wide drop-shadow">
              {getContent("hero", "tagline", "Maison dédiée à la Santé Mentale")}
            </p>
          </div>
        </div>
      </section>

      {/* Bannière statistique — fond cream, citation en script bordeaux */}
      <section className="bg-background py-14 sm:py-20">
        <div className="container-narrow text-center">
          <p className="font-script text-primary text-[clamp(2.5rem,7vw,5rem)] leading-tight">
            {getContent("stat", "headline", "13 millions de personnes")}
          </p>
          <p className="mt-3 sm:mt-4 text-foreground/80 text-lg sm:text-xl font-light">
            {getContent("stat", "subline", "souffrent de troubles psychiques en France")}
          </p>
        </div>
      </section>

      {/* Bienvenue — fond bleu ciel, cœur + liste */}
      <section className="bg-sky-100 py-16 sm:py-24">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[auto,1fr] items-start max-w-5xl mx-auto">
            <div className="flex justify-center lg:justify-start lg:pt-16">
              <Heart
                className="h-24 w-24 sm:h-32 sm:w-32 text-secondary"
                fill="hsl(var(--secondary))"
                strokeWidth={0}
              />
            </div>
            <div>
              <p className="text-foreground text-lg sm:text-xl text-center lg:text-left mb-6">
                {getContent("welcome", "intro", "Tous, sont les bienvenues à la Maison LePhare :")}
              </p>
              <ul className="space-y-2 text-foreground text-base sm:text-lg list-disc pl-6 sm:pl-10 marker:text-foreground">
                {welcomeItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-16 sm:mt-20">
            <h2 className="font-script text-primary text-[clamp(2rem,5vw,3.5rem)] leading-tight mb-6">
              {getContent("why", "title", "Pourquoi ouvrir une maison ?")}
            </h2>
            <p className="text-foreground text-lg sm:text-xl leading-relaxed font-light">
              {getContent(
                "why",
                "paragraph",
                "Les lieux ouverts où des personnes concernées peuvent se retrouver, échanger collectivement et partager une expérience commune restent peu nombreux, surtout en dehors du cadre strict du soin."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Bannière image — soutien collectif avec texte en surimpression */}
      <section className="relative w-full overflow-hidden">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full">
          <img
            src={solidarityImage}
            alt={getContent("banner", "image_alt", "Soutien collectif et rétablissement")}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <h2 className="font-sans text-primary-foreground text-center text-[clamp(1.75rem,5vw,3.75rem)] font-light leading-tight max-w-4xl drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
              {getContent(
                "banner",
                "title",
                "Soutenir le rétablissement dans un lieu dédié à la Santé Mentale"
              )}
            </h2>
          </div>
        </div>
      </section>

    </>
  );
}
