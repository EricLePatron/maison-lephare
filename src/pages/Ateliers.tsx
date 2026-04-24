import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Palette, MessageCircle, Users, Heart, Clock, MapPin, Sparkles, BookOpen, Music, Lightbulb, Loader2 } from "lucide-react";
import { useAteliers } from "@/hooks/useAteliers";
import { trackCtaClick } from "@/lib/analytics";
import associationImage from "@/assets/association-room.png";

const ICON_MAP: Record<string, React.ElementType> = {
  Brain,
  Palette,
  MessageCircle,
  Users,
  Heart,
  Sparkles,
  BookOpen,
  Music,
  Lightbulb,
};

const getIcon = (iconName: string | null) => ICON_MAP[iconName || "Brain"] || Brain;

const cafeDebats = {
  title: "Café-débats",
  description: "Des moments de rencontre ouverts à tous pour échanger sur la santé mentale dans une ambiance conviviale. Thèmes variés : préjugés, rétablissement, témoignages, actualités...",
  format: "1 fois par mois",
  location: "Café Le Phare",
};

export default function Ateliers() {
  const { data: ateliers, isLoading, error } = useAteliers();

  const ateliersActifs = ateliers?.filter((a) => a.actif) ?? [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={associationImage}
            alt="Salle d'ateliers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sage-700/95 via-sage-600/85 to-sage-500/70" />
        </div>

        <div className="container-wide relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full mb-6">
              <Brain className="h-4 w-4 text-accent" />
              <span className="text-primary-foreground/90 text-sm font-medium">
                Accompagnement collectif
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-primary-foreground leading-tight mb-6">
              Ateliers & Activités
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/85 leading-relaxed">
              Des moments de partage et d'apprentissage pour avancer ensemble dans son parcours de rétablissement.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-foreground mb-4">
            Une approche collective du soin
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Nos ateliers sont conçus comme des espaces de rencontre et de progression, où chacun avance à son rythme, soutenu par le groupe et accompagné par des professionnels bienveillants.
          </p>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Erreur lors du chargement des ateliers.</p>
            </div>
          ) : ateliersActifs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Aucun atelier disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {ateliersActifs.map((atelier) => {
                const IconComp = getIcon(atelier.icone);
                return (
                  <div key={atelier.id} className="card-elevated">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-14 w-14 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                        <IconComp className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-accent uppercase tracking-wider">
                          {atelier.categorie}
                        </span>
                        <h3 className="font-serif text-xl font-medium text-foreground">
                          {atelier.titre}
                        </h3>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {atelier.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {atelier.format && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{atelier.format}</span>
                        </div>
                      )}
                      {atelier.public_cible && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{atelier.public_cible}</span>
                        </div>
                      )}
                    </div>

                    {atelier.objectifs && atelier.objectifs.length > 0 && (
                      <div className="bg-cream-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-foreground mb-2">Objectifs</h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {atelier.objectifs.map((obj) => (
                            <li key={obj} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Café-débats Section */}
      <section className="section-padding bg-sage-100">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-medium text-accent uppercase tracking-wider mb-2 block">
                Ouvert à tous
              </span>
              <h2 className="font-serif text-3xl font-medium text-foreground mb-4">
                {cafeDebats.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {cafeDebats.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-foreground">{cafeDebats.format}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-foreground">{cafeDebats.location}</span>
                </div>
              </div>
            </div>
            <div className="card-elegant bg-card">
              <h3 className="font-serif text-lg font-medium text-foreground mb-4">
                Prochains thèmes abordés
              </h3>
              <ul className="space-y-3">
                {[
                  { color: "bg-accent", text: "Vivre avec un proche concerné" },
                  { color: "bg-primary", text: "Les préjugés sur la santé mentale" },
                  { color: "bg-sage-400", text: "Témoignages de rétablissement" },
                  { color: "bg-cream-300", text: "Santé mentale au travail" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-sm">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-sage-600">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary-foreground mb-4">
            Participer à nos ateliers
          </h2>
          <p className="text-primary-foreground/85 text-lg mb-8 max-w-xl mx-auto">
            Vous souhaitez vous inscrire à un atelier ou en savoir plus sur notre programme ? Contactez-nous pour échanger sur vos besoins.
          </p>
          <Button asChild variant="warm" size="xl" onClick={() => trackCtaClick("Nous contacter", "ateliers_cta")}>
            <Link to="/contact">
              Nous contacter
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
