import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { usePageContent } from "@/hooks/useSiteContent";
import { useSiteImage } from "@/hooks/useTheme";
import { trackCtaClick } from "@/lib/analytics";
import chateauImageStatic from "@/assets/chateau-hero.jpg";
import logoLePhare from "@/assets/logo-lephare.png";
import featureConsultation from "@/assets/feature-consultation.jpg";
import featureAssociation from "@/assets/feature-association.jpg";
import featureCafe from "@/assets/feature-cafe.jpg";
import gridConsulter from "@/assets/grid-consulter.jpg";
import gridProgrammation from "@/assets/grid-programmation.jpg";
import gridLieu from "@/assets/grid-lieu.jpg";
import gridRejoindre from "@/assets/grid-rejoindre.jpg";
import gridProposer from "@/assets/grid-proposer.jpg";
import gridAccompagner from "@/assets/grid-accompagner.jpg";
import gridLouer from "@/assets/grid-louer.jpg";
import gridInstaller from "@/assets/grid-installer.jpg";
import gridCafe from "@/assets/grid-cafe.jpg";

export default function Index() {
  const { getContent, isLoading } = usePageContent("home");
  const chateauImage = useSiteImage("chateau-main", chateauImageStatic);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const features = [
    {
      image: featureConsultation,
      title: "L'Espace\nConsultation",
      link: "/professionnels",
      ctaName: "Découvrir les professionnels",
    },
    {
      image: featureAssociation,
      title: "L'Association\nLePhare",
      link: "/association",
      ctaName: "Voir les ateliers",
    },
    {
      image: featureCafe,
      title: "Le Café\nInclusif",
      link: "/le-lieu",
      ctaName: "Découvrir le café",
    },
  ];

  const wishes = [
    { text: "Consulter un professionnel de la santé mentale ?", image: gridConsulter, link: "/professionnels" },
    { text: "Trouver la programmation de l'association ?", image: gridProgrammation, link: "/ateliers" },
    { text: "En savoir plus sur le lieu ?", image: gridLieu, link: "/le-lieu" },
    { text: "Rejoindre le projet ?", image: gridRejoindre, link: "/contact" },
    { text: "Proposer une activité ?", image: gridProposer, link: "/contact" },
    { text: "Chercher à vous faire accompagner ?", image: gridAccompagner, link: "/professionnels" },
    { text: "Louer une salle pour une activité sur la Santé Mentale ?", image: gridLouer, link: "/contact" },
    { text: "Vous installer en libéral ?", image: gridInstaller, link: "/contact" },
    { text: "Venir boire un café ou nous rencontrer ?", image: gridCafe, link: "/le-lieu" },
  ];

  return (
    <>
      {/* Hero - Sky blue with chateau photo + script logo */}
      <section className="w-full bg-sky-100">
        <div className="container-wide py-12 sm:py-16 lg:py-20">
          <div className="grid gap-8 lg:gap-16 lg:grid-cols-2 items-center">
            {/* Photo du château - cadre arrondi */}
            <div className="flex justify-center lg:justify-start">
              <figure className="text-center">
                <div className="overflow-hidden rounded-[2.5rem] shadow-elevated max-w-[420px]">
                  <img
                    src={chateauImage}
                    alt="Château du Tenet, Mérignac"
                    className="w-full h-auto aspect-square object-cover"
                    width={800}
                    height={800}
                  />
                </div>
                <figcaption className="font-script text-lg sm:text-xl text-primary/80 mt-3">
                  Château du Tenet — Mérignac (33)
                </figcaption>
              </figure>
            </div>

            {/* Bloc logo + tagline + CTA */}
            <div className="text-center lg:text-left">
              <h1 className="leading-none">
                <img
                  src={logoLePhare}
                  alt="lePhare — Maison dédiée à la Santé Mentale"
                  className="w-full max-w-[640px] lg:max-w-[720px] xl:max-w-[820px] h-auto mx-auto lg:mx-0"
                />
              </h1>
              <span className="sr-only">
                {getContent("hero", "tagline", "Maison dédiée à la Santé Mentale")}
              </span>

              <div className="mt-8">
                <Link
                  to="/ateliers"
                  onClick={() => trackCtaClick("Voir la programmation", "home_hero")}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-background text-primary border-2 border-primary rounded-full text-base font-medium hover:bg-primary hover:text-primary-foreground transition-colors shadow-soft"
                >
                  Voir la programmation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 3 photos rondes avec doodles */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container-wide">
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-script text-3xl sm:text-4xl lg:text-5xl text-primary font-bold leading-tight">
              {getContent("features", "title", "Un lieu entièrement dédié à la Santé Mentale")}
            </h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                onClick={() => trackCtaClick(feature.ctaName, "home_features")}
                className="group flex flex-col items-center text-center"
              >
                {/* Photo dans cadre arrondi avec bord terracotta */}
                <div className="w-full max-w-[280px] aspect-[4/3] overflow-hidden rounded-[2rem] border-[3px] border-primary p-1 bg-background shadow-soft transition-transform group-hover:-translate-y-1">
                  <img
                    src={feature.image}
                    alt={feature.title.replace("\n", " ")}
                    className="w-full h-full object-cover rounded-[1.5rem]"
                    loading="lazy"
                    width={800}
                    height={512}
                  />
                </div>

                <h3 className="font-serif text-base sm:text-lg font-semibold text-sage-700 mt-6 mb-5 uppercase tracking-wider whitespace-pre-line leading-tight">
                  {feature.title}
                </h3>

                <span className="inline-flex items-center gap-2 px-6 py-2 bg-background border-2 border-primary text-primary rounded-full text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  En savoir +
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bandeau citation : photo château + grand titre */}
      <section className="w-full bg-sky-100">
        <div className="container-wide py-12 sm:py-16 lg:py-20">
          <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
            <div>
              <img
                src={chateauImage}
                alt="Château LePhare"
                className="w-full h-auto rounded-2xl shadow-elevated object-cover aspect-[4/3]"
                loading="lazy"
                width={800}
                height={600}
              />
            </div>
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary leading-tight">
                {getContent("quote", "title", "La Santé Mentale mérite sa propre maison.")}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* "Vous souhaitez..." - grille de 9 cartes-photos avec overlay */}
      <section className="section-padding">
        <div className="container-wide">
          <p className="font-serif italic text-foreground/70 text-xl sm:text-2xl mb-10">
            Vous souhaitez …
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wishes.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                onClick={() => trackCtaClick(item.text, "home_vous_souhaitez")}
                className="group relative block aspect-[16/9] overflow-hidden rounded-2xl shadow-soft hover:shadow-elevated transition-shadow"
              >
                <img
                  src={item.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={800}
                  height={450}
                />
                {/* Overlay sombre */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/55 to-foreground/30" />
                {/* Texte + flèche */}
                <div className="relative h-full flex flex-col justify-center items-center text-center p-5">
                  <p className="font-serif text-background text-base sm:text-lg font-semibold leading-snug max-w-[85%]">
                    {item.text}
                  </p>
                  <ArrowRight className="h-5 w-5 text-background mt-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
