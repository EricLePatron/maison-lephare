import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, UserCheck, Mail, Loader2 } from "lucide-react";
import { useProfessionnels, useProfessions } from "@/hooks/useProfessionnels";
import cabinetImage from "@/assets/cabinet-room.png";

export default function Professionnels() {
  const { data: professionnels, isLoading, error } = useProfessionnels();
  const { data: professions = [] } = useProfessions();
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);

  const filteredProfessionnels = selectedProfession
    ? professionnels?.filter((p) => p.profession === selectedProfession)
    : professionnels;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={cabinetImage}
            alt="Cabinet de consultation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sage-700/95 via-sage-600/85 to-sage-500/70" />
        </div>

        <div className="container-wide relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full mb-6">
              <UserCheck className="h-4 w-4 text-accent" />
              <span className="text-primary-foreground/90 text-sm font-medium">
                Équipe pluridisciplinaire
              </span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-primary-foreground leading-tight mb-6">
              Nos Professionnels
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-foreground/85 leading-relaxed">
              Une équipe de praticiens passionnés, aux approches variées, pour vous accompagner selon vos besoins.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-border bg-secondary/30">
        <div className="container-wide">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-foreground">Filtrer par :</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedProfession(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedProfession === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-muted"
                }`}
              >
                Tous
              </button>
              {professions.map((profession) => (
                <button
                  key={profession}
                  onClick={() => setSelectedProfession(profession)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedProfession === profession
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {profession}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                Erreur lors du chargement des professionnels.
              </p>
            </div>
          ) : filteredProfessionnels && filteredProfessionnels.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProfessionnels.map((pro) => (
                <div key={pro.id} className="card-elevated group">
                  {/* Photo or placeholder */}
                  <div className="h-48 rounded-xl bg-sage-100 flex items-center justify-center mb-4 overflow-hidden">
                    {pro.photo_url ? (
                      <img
                        src={pro.photo_url}
                        alt={`${pro.prenom} ${pro.nom}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="h-20 w-20 rounded-full bg-sage-200 flex items-center justify-center mx-auto mb-2">
                          <span className="font-serif text-2xl text-primary font-semibold">
                            {pro.prenom[0]}{pro.nom[0]}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-foreground">
                        {pro.prenom} {pro.nom}
                      </h3>
                      <p className="text-primary font-medium text-sm">{pro.profession}</p>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {pro.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {pro.specialites?.slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          className="px-2 py-1 bg-cream-100 text-xs font-medium text-foreground rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        <Users className="h-4 w-4 inline mr-1" />
                        {pro.public_cible}
                      </span>
                      <span className="text-muted-foreground">
                        {pro.jours_presence?.split(",")[0]}...
                      </span>
                    </div>

                    <Button asChild variant="outline" size="sm" className="w-full mt-2">
                      <Link to={`/professionnels/${pro.id}`}>
                        Voir le profil
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                Aucun professionnel trouvé.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow">
          <div className="card-elegant text-center">
            <div className="h-16 w-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-foreground mb-4">
              Vous êtes professionnel de la santé mentale ?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Le Phare accueille des praticiens de toutes disciplines. Si vous souhaitez rejoindre notre équipe et installer votre cabinet au château, contactez-nous.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/contact">
                Nous contacter
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
