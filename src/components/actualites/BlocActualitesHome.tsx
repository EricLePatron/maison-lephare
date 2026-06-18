import { Link } from "react-router-dom";
import { useActualitesVisible } from "@/hooks/usePublications";
import { CarteAtelier } from "@/components/actualites/CarteAtelier";
import { CarteLinkedin, CarteActualite } from "@/components/actualites/CartePublication";

export function BlocActualitesHome() {
  const { ateliers, publications } = useActualitesVisible();
  const sorted = [...ateliers].sort(
    (a, b) => new Date(a.date_evenement!).getTime() - new Date(b.date_evenement!).getTime()
  );
  const nextAteliers = sorted.slice(0, 2);
  const lastPub = publications[0];

  if (nextAteliers.length === 0 && !lastPub) return null;

  return (
    <section className="bg-sky-50 py-16">
      <div className="container-wide max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-script text-primary text-3xl sm:text-4xl">
            Ce qui se passe au Phare
          </h2>
          <Link to="/actualites" className="text-sm text-primary hover:underline">
            Tout voir →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {nextAteliers.map((a) => (
            <CarteAtelier key={a.id} atelier={a} />
          ))}
          {lastPub &&
            (lastPub.type === "actualite" ? (
              <CarteActualite publication={lastPub} />
            ) : (
              <CarteLinkedin publication={lastPub} />
            ))}
        </div>
      </div>
    </section>
  );
}