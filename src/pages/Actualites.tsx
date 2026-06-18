import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useActualitesVisible } from "@/hooks/usePublications";
import { CarteAtelier } from "@/components/actualites/CarteAtelier";
import {
  CarteLinkedin,
  CarteActualite,
  CartePromoNewsletter,
  EmptyStatePublications,
} from "@/components/actualites/CartePublication";

function formatDateFr(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

export default function Actualites() {
  const { visible, isLoading, ateliers, publications } = useActualitesVisible();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !visible) navigate("/ateliers", { replace: true });
  }, [isLoading, visible, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!visible) return null;

  const sortedAteliers = [...ateliers].sort((a, b) => {
    const urgentA = a.statut === "dernieres_places" ? 0 : 1;
    const urgentB = b.statut === "dernieres_places" ? 0 : 1;
    if (urgentA !== urgentB) return urgentA - urgentB;
    return new Date(a.date_evenement!).getTime() - new Date(b.date_evenement!).getTime();
  });

  const featuredPub = publications.find((p) => p.featured);
  const normalPubs = publications.filter((p) => !p.featured);

  const nextAtelier = sortedAteliers[0];
  const lastPub = publications[0];
  const description = nextAtelier
    ? `${nextAtelier.titre} le ${formatDateFr(nextAtelier.date_evenement!)} — suivez la vie de Maison lePhare à Mérignac.`
    : "Ateliers, actualités et vie de l'association Maison lePhare à Mérignac.";

  // Ateliers slot: handle edge cases
  const renderAteliers = () => {
    if (sortedAteliers.length === 1) {
      return <CarteAtelier atelier={sortedAteliers[0]} horizontal />;
    }
    if (sortedAteliers.length === 2) {
      return (
        <div className="grid gap-6 md:grid-cols-3">
          <CarteAtelier atelier={sortedAteliers[0]} />
          <CarteAtelier atelier={sortedAteliers[1]} />
          <CartePromoNewsletter />
        </div>
      );
    }
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {sortedAteliers.map((a) => (
          <CarteAtelier key={a.id} atelier={a} />
        ))}
      </div>
    );
  };

  const renderPublications = () => {
    if (publications.length === 0) {
      return (
        <div className="grid gap-6 md:grid-cols-3">
          <EmptyStatePublications />
        </div>
      );
    }
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {normalPubs.map((p) =>
          p.type === "actualite" ? (
            <CarteActualite key={p.id} publication={p} />
          ) : (
            <CarteLinkedin key={p.id} publication={p} />
          )
        )}
        {featuredPub && <CarteLinkedin publication={featuredPub} featured />}
      </div>
    );
  };

  return (
    <>
      <Seo
        title="Actualités – Maison lePhare"
        description={description}
        path="/actualites"
      />
      <section className="bg-sky-100 py-16 sm:py-24">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <p className="font-script text-[#708F8B] text-2xl mb-2">Maison lePhare — Mérignac</p>
          <h1 className="font-script text-primary text-[clamp(2.5rem,6vw,3.5rem)] leading-tight mb-3">
            Ce qui se passe au Phare
          </h1>
          <p className="font-script text-primary/60 text-2xl">
            ateliers, actualités &amp; inspirations
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-wide max-w-6xl mx-auto space-y-12">
          {sortedAteliers.length > 0 && renderAteliers()}
          {renderPublications()}
        </div>
      </section>

      <section className="bg-[#E1EAE9] py-16">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <h2 className="font-script text-primary text-4xl mb-3">Rejoignez la vie du Phare</h2>
          <p className="font-script text-[#708F8B] text-xl mb-6">
            chaque geste compte, chaque voix résonne
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Je souhaite m'engager →
            </Link>
            <a
              href="mailto:contact@maison-lephare.fr?subject=Inscription%20newsletter"
              className="text-sm text-primary hover:underline"
            >
              S'inscrire à la newsletter
            </a>
          </div>
        </div>
      </section>
    </>
  );
}