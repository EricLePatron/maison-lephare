import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProfessionnels } from "@/hooks/useProfessionnels";
import { useSiteImage } from "@/hooks/useTheme";
import { professionnelSlug } from "@/lib/slug";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Calendar,
  Users,
  Heart,
  Briefcase,
  MapPin,
  Phone,
  Globe,
  CalendarCheck,
  XCircle,
} from "lucide-react";
import cabinetImage from "@/assets/cabinet-room.png";
import {
  trackProProfileView,
  trackRdvClick,
  trackProContactClick,
} from "@/lib/analytics";

export default function ProfessionnelProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: professionnels, isLoading, error } = useProfessionnels();
  const pro = professionnels?.find(
    (p) => professionnelSlug(p.prenom, p.nom) === slug
  );
  const fallbackHero = useSiteImage("professionnel-hero", cabinetImage);
  const heroImage = (pro as any)?.hero_photo_url || fallbackHero;
  const doctolibUrl = (pro as any)?.doctolib_url as string | undefined;
  const accepteNouveauxPatients = (pro as any)?.accepte_nouveaux_patients as boolean | null | undefined;

  const heroRef = useRef<HTMLElement | null>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const contactCtaRef = useRef<HTMLAnchorElement | null>(null);
  const [contactCtaVisible, setContactCtaVisible] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pro?.id]);

  useEffect(() => {
    const el = contactCtaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactCtaVisible(entry.isIntersecting),
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pro?.id, doctolibUrl]);

  // Tracke la vue du profil dès que les données sont disponibles (une seule fois par slug)
  const trackedSlug = useRef<string | null>(null);
  useEffect(() => {
    if (pro && slug && trackedSlug.current !== slug) {
      trackedSlug.current = slug;
      trackProProfileView(slug, `${pro.prenom} ${pro.nom}`, pro.profession);
    }
  }, [pro, slug]);

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

  const proSlug = slug!;
  const proName = `${pro.prenom} ${pro.nom}`;

  return (
    <>
      {/* Bouton Doctolib flottant — desktop uniquement */}
      {doctolibUrl && heroVisible && (
        accepteNouveauxPatients === false ? (
          <span
            className="hidden md:inline-flex fixed top-24 right-6 z-40 items-center gap-2 px-5 py-3 rounded-2xl bg-primary/30 text-primary-foreground/60 font-semibold cursor-not-allowed"
            aria-disabled="true"
          >
            <XCircle className="h-5 w-5" />
            Pas de nouveaux patients
          </span>
        ) : (
          <a
            href={doctolibUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex fixed top-24 right-6 z-40 items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-elevated hover:bg-sage-600 transition-colors"
            onClick={() => trackRdvClick(proSlug, proName, doctolibUrl)}
          >
            <CalendarCheck className="h-5 w-5" />
            Prendre rendez-vous en ligne
          </a>
        )
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[40vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Cabinet de consultation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sage-900/95 via-sage-800/80 to-sage-700/60" />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <Link
          to="/professionnels"
          className="absolute top-20 left-4 sm:left-6 lg:left-8 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/40 backdrop-blur-sm text-primary-foreground hover:bg-foreground/60 transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux professionnels
        </Link>

        <div className="container-wide relative z-10 pb-12 pt-32 sm:pt-20">
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
            <div className="flex-1 [text-shadow:_0_2px_12px_rgba(0,0,0,0.55)]">
              <h1 className="font-serif text-4xl sm:text-5xl font-medium text-primary-foreground mb-2 drop-shadow-lg">
                {pro.prenom} {pro.nom}
              </h1>
              <p className="font-sans uppercase tracking-[0.18em] text-sm sm:text-base text-primary-foreground font-semibold">
                {pro.profession}
              </p>
              {pro.specialites && pro.specialites.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {pro.specialites.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 rounded-full bg-primary-foreground/95 text-primary text-xs font-semibold shadow-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding pb-28 lg:pb-16">
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
                      <p className="text-sm text-muted-foreground">LePhare - 12 rue Jean Jacques Rousseau 33 700 Merignac</p>
                    </div>
                  </li>
                </ul>
              </div>

              {((pro as any).telephone ||
                (pro as any).email ||
                (pro as any).site_web ||
                (pro as any).doctolib_url) && (
                <div className="card-elegant">
                  <h3 className="font-serif text-lg font-medium text-foreground mb-4">
                    Contact
                  </h3>
                  <ul className="space-y-4">
                    {(pro as any).telephone && (
                      <li className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <a
                          href={`tel:${(pro as any).telephone}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {(pro as any).telephone}
                        </a>
                      </li>
                    )}
                    {(pro as any).email && (
                      <li className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <a
                          href={`mailto:${(pro as any).email}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                          onClick={() => trackProContactClick(proSlug, proName)}
                        >
                          {(pro as any).email}
                        </a>
                      </li>
                    )}
                    {(pro as any).site_web && (
                      <li className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <a
                          href={(pro as any).site_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                        >
                          Site web
                        </a>
                      </li>
                    )}
                    {(pro as any).doctolib_url && (
                      <li className="pt-2">
                        {accepteNouveauxPatients === false ? (
                          <div className="space-y-2">
                            <button
                              disabled
                              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary/20 text-primary-foreground/50 text-sm font-semibold cursor-not-allowed"
                            >
                              <XCircle className="h-4 w-4" />
                              Prendre rendez-vous sur Doctolib
                            </button>
                            <p className="text-xs text-muted-foreground text-center leading-relaxed">
                              {pro.prenom} n'accepte pas de nouveaux patients pour le moment.
                            </p>
                          </div>
                        ) : (
                          <a
                            ref={contactCtaRef}
                            href={(pro as any).doctolib_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => trackRdvClick(proSlug, proName, (pro as any).doctolib_url)}
                          >
                            <CalendarCheck className="h-4 w-4" />
                            Prendre rendez-vous sur Doctolib
                          </a>
                        )}
                      </li>
                    )}
                  </ul>
                </div>
              )}
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

      {/* Barre sticky RDV mobile */}
      {doctolibUrl && (
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-sm border-t border-primary/20 shadow-elevated transition-all duration-300 ${
            !heroVisible && !contactCtaVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
          role="complementary"
          aria-label="Prise de rendez-vous"
        >
          {accepteNouveauxPatients === false ? (
            <div className="space-y-1">
              <button
                disabled
                className="flex items-center justify-center gap-2 w-full h-12 rounded-lg bg-primary/30 text-primary-foreground/60 text-sm font-medium cursor-not-allowed"
              >
                <XCircle className="h-5 w-5" />
                Prendre rendez-vous
              </button>
              <p className="text-xs text-muted-foreground text-center">
                {pro.prenom} n'accepte pas de nouveaux patients.
              </p>
            </div>
          ) : (
            <a
              href={doctolibUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => trackRdvClick(proSlug, proName, doctolibUrl)}
              aria-label={`Prendre rendez-vous avec ${pro.prenom} sur Doctolib (ouvre un nouvel onglet)`}
            >
              <CalendarCheck className="h-5 w-5" />
              Prendre rendez-vous sur Doctolib
            </a>
          )}
        </div>
      )}
    </>
  );
}
