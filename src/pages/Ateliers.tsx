import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePageContent } from "@/hooks/useSiteContent";
import { useSiteImage } from "@/hooks/useTheme";
import atelierImageStatic from "@/assets/atelier-collectif.jpg";
import chateauImageStatic from "@/assets/chateau-main.jpg";
import { Reveal } from "@/components/Reveal";

export default function Ateliers() {
  const { getContent } = usePageContent("ateliers");
  const atelierImage = useSiteImage("atelier-collectif", atelierImageStatic);
  const chateauImage = useSiteImage("chateau-main", chateauImageStatic);

  const categories = [
    { key: "cat_1", label: getContent("categories", "cat_1", "Médiation créatives") },
    { key: "cat_2", label: getContent("categories", "cat_2", "Ateliers psychoeducatifs") },
    { key: "cat_3", label: getContent("categories", "cat_3", "Groupes de parole") },
    { key: "cat_4", label: getContent("categories", "cat_4", "Groupe de sensibilisation") },
  ];

  return (
    <>
      {/* Hero — fond bleu ciel : image atelier + texte script */}
      <section className="bg-sky-100 py-12 sm:py-20">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-2 items-center max-w-6xl mx-auto">
            <Reveal variant="left" className="rounded-2xl overflow-hidden shadow-soft">
              <img
                src={atelierImage}
                alt={getContent("hero", "image_alt", "Atelier collectif à LePhare")}
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </Reveal>
            <Reveal variant="right" delay={120}>
              <h1 className="font-script text-primary leading-[1.05] text-[clamp(2.5rem,6vw,4.5rem)] mb-6">
                {getContent("hero", "title_line_1", "Echanger entre pairs.")}
              </h1>
              <p className="text-foreground text-base sm:text-lg leading-relaxed mb-4">
                {getContent("hero", "intro", "L'Association LePhare propose des ateliers collectifs dans ses grandes salles.")}
              </p>
              <ul className="space-y-2 text-foreground text-base sm:text-lg list-disc pl-6 marker:text-foreground">
                <li>{getContent("hero", "item_1", "une salle de 52m2 aménagée en salon")}</li>
                <li>{getContent("hero", "item_2", "une salle de 50m2 modulable pouvant accueillir des grandes tables, des chaises ou … rester vide !")}</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Catégories d'ateliers */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container-wide">
          <Reveal variant="up">
            <h2 className="font-script text-primary text-center leading-[1.05] text-[clamp(2rem,5vw,3.75rem)] mb-12 sm:mb-16">
              {getContent("categories", "title", "Trouvez l'atelier qui résonne chez vous")}
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {categories.map((cat, index) => (
              <Reveal key={cat.key} variant="up" delay={index * 100} className="flex flex-col items-center text-center">
                <div className="w-full aspect-[4/3] rounded-2xl border-[3px] border-primary overflow-hidden">
                  <img
                    src={atelierImage}
                    alt={cat.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 sm:mt-5 uppercase tracking-wide text-primary font-bold text-sm sm:text-base leading-tight">
                  {cat.label}
                </h3>
              </Reveal>
            ))}
          </div>

          <div className="text-center mt-14 sm:mt-20">
            <p className="uppercase tracking-[0.15em] text-secondary font-semibold text-base sm:text-lg mb-6">
              {getContent("categories", "tagline", "Et beaucoup d'autres initiatives …")}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {getContent("categories", "cta_button", "Voir l'agenda complet →")}
            </Link>
          </div>
        </div>
      </section>

      {/* Bannière château — recherche d'intervenants */}
      <section className="relative w-full overflow-hidden">
        <div className="relative aspect-[16/7] sm:aspect-[21/8] w-full">
          <img
            src={chateauImage}
            alt={getContent("cta", "image_alt", "Château LePhare")}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <Link
              to="/contact"
              className="font-script text-primary-foreground text-center leading-[1.05] text-[clamp(1.75rem,5.5vw,4rem)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] hover:opacity-90 transition-opacity"
            >
              <span className="block">{getContent("cta", "line_1", "Vous souhaitez animer un atelier ?")}</span>
              <span className="block">{getContent("cta", "line_2", "nous recherchons des intervenants !")}</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
