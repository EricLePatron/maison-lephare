import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProfessionnels, useProfessions } from "@/hooks/useProfessionnels";
import { usePageContent } from "@/hooks/useSiteContent";
import { useSiteImage } from "@/hooks/useTheme";
import chateauImageStatic from "@/assets/chateau-main.jpg";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";

export default function Professionnels() {
  const { data: professionnels, isLoading, error } = useProfessionnels();
  const { data: professions = [] } = useProfessions();
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const { getContent } = usePageContent("professionnels");
  const chateauImage = useSiteImage("chateau-main", chateauImageStatic);

  const filteredProfessionnels = selectedProfession
    ? professionnels?.filter((p) => p.profession === selectedProfession)
    : professionnels;

  return (
    <>
      <Seo
        title="Les professionnels de la Santé Mentale – Le Phare"
        description="Découvrez l'équipe de psychiatres, psychologues, neuropsychologues et thérapeutes qui exercent au Phare, à Mérignac près de Bordeaux."
        path="/professionnels"
      />
      {/* Titre script */}
      <section className="bg-background pt-16 sm:pt-24 pb-10 sm:pb-14">
        <div className="container-wide text-center">
          <Reveal variant="up">
            <h1 className="font-script text-primary leading-[1.05] text-[clamp(2.25rem,6vw,4.5rem)] max-w-4xl mx-auto">
              <span className="block">{getContent("hero", "title_line_1", "Les professionnels de la Santé Mentale")}</span>
              <span className="block">{getContent("hero", "title_line_2", "qui exercent au Phare")}</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Filtres par profession */}
      {professions.length > 0 && (
        <section className="bg-background pb-6">
          <div className="container-wide">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedProfession(null)}
                className={`px-4 py-1.5 rounded-2xl text-sm font-medium border-2 transition-colors ${
                  selectedProfession === null
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-primary border-primary/40 hover:border-primary"
                }`}
              >
                Tous
              </button>
              {professions.map((profession) => (
                <button
                  key={profession}
                  onClick={() => setSelectedProfession(profession)}
                  className={`px-4 py-1.5 rounded-2xl text-sm font-medium border-2 transition-colors ${
                    selectedProfession === profession
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-primary border-primary/40 hover:border-primary"
                  }`}
                >
                  {profession}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grille des professionnels */}
      <section className="bg-background pb-16 sm:pb-24">
        <div className="container-wide">
          <h2 className="sr-only">Liste des professionnels</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Erreur lors du chargement des professionnels.</p>
            </div>
          ) : filteredProfessionnels && filteredProfessionnels.length > 0 ? (
            <div className="grid gap-x-16 sm:gap-x-20 gap-y-16 sm:gap-y-20 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {filteredProfessionnels.map((pro, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                return (
                <Reveal key={pro.id} variant="up" delay={row * 150 + col * 100}>
                <Link
                  to={`/professionnels/${pro.id}`}
                  className="group flex flex-col items-center text-center"
                >
                  {/* Photo ronde avec bordure bordeaux */}
                  {pro.photo_url && (
                    <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full border-[3px] border-primary overflow-hidden bg-background transition-transform duration-300 group-hover:scale-[1.02]">
                      <img
                        src={pro.photo_url}
                        alt={`${pro.prenom} ${pro.nom}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Nom Prénom */}
                  <h3 className="mt-5 font-sans uppercase tracking-wide text-primary font-bold text-base">
                    {pro.prenom} {pro.nom}
                  </h3>

                  {/* Métier */}
                  <p className="mt-1 uppercase tracking-[0.15em] text-foreground/70 text-xs font-medium">
                    {pro.profession}
                  </p>

                  {/* Description */}
                  <p className="mt-3 text-foreground/85 text-sm leading-relaxed max-w-[18rem] line-clamp-3">
                    {pro.description}
                  </p>

                  {/* Pill "Voir le profil" */}
                  <span className="mt-4 inline-flex items-center px-5 py-1.5 rounded-2xl border-2 border-primary text-primary text-xs font-medium tracking-wide group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Voir le profil
                  </span>
                </Link>
                </Reveal>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Aucun professionnel trouvé.</p>
            </div>
          )}
        </div>
      </section>

      {/* Bannière château avec invitation à rejoindre */}
      <section className="relative w-full overflow-hidden">
        <div className="relative aspect-[16/7] sm:aspect-[21/8] w-full">
          <img
            src={chateauImage}
            alt={getContent("cta", "image_alt", "Château LePhare")}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <Link
              to="/contact"
              className="font-script text-primary-foreground text-center leading-[1.05] text-[clamp(2rem,6vw,4.5rem)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] hover:opacity-90 transition-opacity"
            >
              <span className="block">{getContent("cta", "line_1", "Vous souhaitez vous installer ?")}</span>
              <span className="block">{getContent("cta", "line_2", "Contactez-nous")}</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
