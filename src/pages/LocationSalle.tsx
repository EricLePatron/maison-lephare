import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { useSiteImage } from "@/hooks/useTheme";
import heroAsset from "@/assets/location-hero.jpg.asset.json";
import feat1Asset from "@/assets/location-feature-1.jpg.asset.json";
import feat2Asset from "@/assets/location-feature-2.jpg.asset.json";
import feat3Asset from "@/assets/location-feature-3.jpg.asset.json";
import feat4Asset from "@/assets/location-feature-4.jpg.asset.json";
import chateauAsset from "@/assets/location-chateau.jpg.asset.json";

export default function LocationSalle() {
  const heroImage = useSiteImage("location-hero", heroAsset.url);
  const feat1 = useSiteImage("location-feature-1", feat1Asset.url);
  const feat2 = useSiteImage("location-feature-2", feat2Asset.url);
  const feat3 = useSiteImage("location-feature-3", feat3Asset.url);
  const feat4 = useSiteImage("location-feature-4", feat4Asset.url);
  const chateauImage = useSiteImage("location-chateau", chateauAsset.url);

  const features = [
    { src: feat1, label: "Parc de 2ha", alt: "Parc verdoyant de 2 hectares" },
    { src: feat2, label: "Écran portatif", alt: "Écran portatif disponible dans la salle" },
    { src: feat3, label: "Cadre chaleureux", alt: "Détail du sol en mosaïque du château" },
    { src: feat4, label: "Baigné de lumière", alt: "Salle lumineuse avec grandes fenêtres" },
  ];

  return (
    <>
      <Seo
        title="Location de salle – Le Phare, Mérignac"
        description="Louez une salle de 42m² dans le château LePhare à Mérignac : séminaires, formations et réunions dans un cadre chaleureux niché dans un parc de 2ha."
        path="/location-salle"
      />

      {/* Hero — fond bleu ciel, photo + titre */}
      <section className="bg-sky-100 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            <Reveal variant="left">
              <img
                src={heroImage}
                alt="Salon lumineux du château LePhare"
                className="w-full aspect-[4/3] object-cover rounded-3xl shadow-soft"
              />
            </Reveal>
            <Reveal variant="right" delay={120}>
              <h1 className="font-script text-primary leading-[1.05] text-[clamp(2.5rem,6vw,4.5rem)]">
                Louer un espace de 42m²
              </h1>
              <div className="mt-6 space-y-4 text-foreground text-lg sm:text-xl leading-relaxed">
                <p>
                  Niché dans un parc de 2ha, l'une des magnifiques salles de 42m²
                  du château du Tenet est à louer.
                </p>
                <p>
                  Cet espace accueille vos séminaires, formations ou réunions
                  ponctuelles.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features — 4 vignettes */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container-wide">
          <Reveal variant="up">
            <h2 className="font-script text-primary text-center leading-tight text-[clamp(2rem,5vw,3.5rem)] mb-12 sm:mb-16">
              Loin d'une salle de réunion impersonnelle
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <Reveal key={f.label} variant="up" delay={i * 100}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-full aspect-square overflow-hidden rounded-3xl border-2 border-primary/60 shadow-soft">
                    <img
                      src={f.src}
                      alt={f.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-4 text-primary font-medium text-base sm:text-lg">
                    {f.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bon à savoir */}
      <section className="bg-sky-100 py-16 sm:py-24">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <Reveal variant="up">
              <h2 className="flex items-center gap-3 text-foreground text-3xl sm:text-4xl font-medium mb-8">
                Bon à savoir
                <Heart
                  className="h-8 w-8 text-secondary"
                  fill="hsl(var(--secondary))"
                  strokeWidth={0}
                />
              </h2>
            </Reveal>
            <Reveal variant="up" delay={100}>
              <ul className="space-y-4 text-foreground text-lg sm:text-xl leading-relaxed list-disc pl-6">
                <li>
                  jusqu'à 18 personnes en configuration réunion (tables et
                  chaises), ou 25 en configuration théâtre.
                </li>
                <li>
                  un espace salon attenant permet d'accueillir les moments
                  informels.
                </li>
                <li>
                  le parc de 2ha est accessible pour une pause au grand air.
                </li>
                <li>
                  des prestations annexes peuvent également être proposées sur
                  demande.
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA devis */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container-narrow text-center">
          <Reveal variant="up">
            <p className="text-primary tracking-[0.2em] uppercase text-sm sm:text-base font-medium mb-6">
              Un lieu hors du commun
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-background border-2 border-primary text-primary rounded-2xl text-base sm:text-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Demander un devis
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Bannière château — récurrent */}
      <section className="relative w-full overflow-hidden">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full">
          <img
            src={chateauImage}
            alt="Château LePhare vu depuis le parc"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <p className="font-script text-primary-foreground text-center leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] text-[clamp(1.75rem,5vw,4rem)] max-w-4xl">
              Vous cherchez à louer de manière récurrente l'espace ? c'est possible !
            </p>
          </div>
        </div>
      </section>
    </>
  );
}