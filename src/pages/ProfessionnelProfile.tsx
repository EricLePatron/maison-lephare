import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProfessionnel } from "@/hooks/useProfessionnels";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Calendar,
  Users,
  Heart,
  Briefcase,
  MapPin,
} from "lucide-react";
import cabinetImage from "@/assets/cabinet-room.png";

export default function ProfessionnelProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: pro, isLoading, error } = useProfessionnel(id || "");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !pro) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Professionnel introuvable.</p>
          <Button asChild variant="outline">
            <Link to="/professionnels">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux professionnels
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={cabinetImage}
            alt="Cabinet de consultation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sage-800/95 via-sage-700/70 to-sage-600/40" />
        </div>

        <div className="container-wide relative z-10 pb-12 pt-20">
          <Link
            to="/professionnels"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux professionnels
          </Link>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Photo */}
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-sage-100 flex items-center justify-center overflow-hidden border-4 border-primary-foreground/20 flex-shrink-0">
              {pro.photo_url ? (
                <img
                  src={pro.photo_url}
                  alt={`${pro.prenom} ${pro.nom}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-serif text-4xl text-primary font-semibold">
                  {pro.prenom[0]}{pro.nom[0]}
                </span>
              )}
            </div>

            {/* Name & Profession */}
            <div className="flex-1">
              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-primary-foreground mb-2">
                {pro.prenom} {pro.nom}
              </h1>
              <p className="text-xl text-accent font-medium">{pro.profession}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {pro.description && (
                <div className="card-elevated">
                  <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                    Présentation
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {pro.description}
                  </p>
                </div>
              )}

              {/* Approche */}
              {pro.approche && (
                <div className="card-elevated">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-sage-100 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="font-serif text-xl font-medium text-foreground">
                      Approche thérapeutique
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {pro.approche}
                  </p>
                </div>
              )}

              {/* Spécialités */}
              {pro.specialites && pro.specialites.length > 0 && (
                <div className="card-elevated">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-sage-100 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="font-serif text-xl font-medium text-foreground">
                      Spécialités
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pro.specialites.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1.5 bg-cream-100 text-sm font-medium text-foreground rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Infos pratiques */}
              <div className="card-elegant">
                <h3 className="font-serif text-lg font-medium text-foreground mb-4">
                  Informations pratiques
                </h3>
                <ul className="space-y-4">
                  {pro.public_cible && (
                    <li className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Public accueilli</p>
                        <p className="text-sm text-muted-foreground">{pro.public_cible}</p>
                      </div>
                    </li>
                  )}
                  {pro.jours_presence && (
                    <li className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Jours de présence</p>
                        <p className="text-sm text-muted-foreground">{pro.jours_presence}</p>
                      </div>
                    </li>
                  )}
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Lieu</p>
                      <p className="text-sm text-muted-foreground">Le Phare – Château</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="card-elegant">
                <h3 className="font-serif text-lg font-medium text-foreground mb-4">
                  Prendre rendez-vous
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pour contacter {pro.prenom} {pro.nom}, utilisez notre formulaire de contact. Nous transmettrons votre demande.
                </p>
                <Button asChild variant="hero" className="w-full">
                  <Link to="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-foreground mb-4">
            Découvrir notre équipe
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Le Phare réunit une équipe pluridisciplinaire pour vous accompagner dans votre parcours de rétablissement.
          </p>
          <Button asChild variant="outline" size="lg">
            <Link to="/professionnels">
              <ArrowLeft className="h-5 w-5" />
              Voir tous les professionnels
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
