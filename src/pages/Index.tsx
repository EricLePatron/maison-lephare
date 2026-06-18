import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { usePageContent } from "@/hooks/useSiteContent";
import { useSiteImage } from "@/hooks/useTheme";
import { trackCtaClick } from "@/lib/analytics";
import { Reveal } from "@/components/Reveal";
import { Seo } from "@/components/Seo";
import { BlocActualitesHome } from "@/components/actualites/BlocActualitesHome";
import { useFeatureFlag, useActualitesVisible } from "@/hooks/usePublications";
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
  const { enabled: flagHome } = useFeatureFlag("actualites_home");
  const { visible: actuVisible } = useActualitesVisible();
  const showBlocActu = flagHome && actuVisible;
  const logoSrc = useSiteImage("logo-main", logoLePhare);
  const featureConsultationImg = useSiteImage("feature-consultation", featureConsultation);
  const featureAssociationImg = useSiteImage("feature-association", featureAssociation);
  const featureCafeImg = useSiteImage("feature-cafe", featureCafe);
  const gridConsulterImg = useSiteImage("grid-consulter", gridConsulter);
  const gridProgrammationImg = useSiteImage("grid-programmation", gridProgrammation);
  const gridLieuImg = useSiteImage("grid-lieu", gridLieu);
  const gridRejoindreImg = useSiteImage("grid-rejoindre", gridRejoindre);
  const gridProposerImg = useSiteImage("grid-proposer", gridProposer);
  const gridAccompagnerImg = useSiteImage("grid-accompagner", gridAccompagner);
  const gridLouerImg = useSiteImage("grid-louer", gridLouer);
  const gridInstallerImg = useSiteImage("grid-installer", gridInstaller);
  const gridCafeImg = useSiteImage("grid-cafe", gridCafe);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const features = [
    {
      image: featureConsultationImg,
      title: getContent("features", "card_1_title", "L'Espace\nConsultation"),
      link: "/professionnels",
      ctaName: "Découvrir les professionnels",
    },
    {
      image: featureAssociationImg,
      title: getContent("features", "card_2_title", "L'Association\nLePhare"),
      link: "/association",
      ctaName: "Voir les ateliers",
    },
    {
      image: featureCafeImg,
      title: getContent("features", "card_3_title", "Le Café\nInclusif"),
      link: "/le-lieu",
      ctaName: "Découvrir le café",
    },
  ];

  const wishes = [
    { text: getContent("wishes", "item_1", "Consulter un professionnel de la santé mentale ?"), image: gridConsulterImg, link: "/professionnels" },
    { text: getContent("wishes", "item_2", "Trouver la programmation de l'association ?"), image: gridProgrammationImg, link: "/ateliers" },
    { text: getContent("wishes", "item_3", "En savoir plus sur le lieu ?"), image: gridLieuImg, link: "/le-lieu" },
    { text: getContent("wishes", "item_4", "Rejoindre le projet ?"), image: gridRejoindreImg, link: "/contact" },
    { text: getContent("wishes", "item_5", "Proposer une activité ?"), image: gridProposerImg, link: "/contact" },
    { text: getContent("wishes", "item_6", "Chercher à vous faire accompagner ?"), image: gridAccompagnerImg, link: "/professionnels" },
    { text: getContent("wishes", "item_7", "Louer une salle pour une activité sur la Santé Mentale ?"), image: gridLouerImg, link: "/contact" },
    { text: getContent("wishes", "item_8", "Vous installer en libéral ?"), image: gridInstallerImg, link: "/contact" },
    { text: getContent("wishes", "item_9", "Venir boire un café ou nous rencontrer ?"), image: gridCafeImg, link: "/le-lieu" },
  ];

  return (
    <>
      <Seo
        title="Le Phare – Maison dédiée à la Santé Mentale à Bordeaux"
        description="Un château à Mérignac dédié à la santé mentale : cabinets de consultation, ateliers, groupes de parole et café inclusif ouvert à tous."
        path="/"
      />
      {/* Hero - Photo pleine largeur avec logo/CTA en overlay */}
      <section className="relative w-full overflow-hidden bg-sky-100">
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/10] w-full">
          <img
            src={chateauImage}
            alt="Château du Tenet, Mérignac"
            className="absolute inset-0 w-full h-full object-cover object-[center_60%] animate-fade-in"
            width={1920}
            height={820}
          />
          {/* Dégradés discrets pour lisibilité du contenu sans masquer la photo */}
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-foreground/65 via-foreground/25 to-transparent pointer-events-none" />

          {/* Contenu superposé en bas */}
          <div className="absolute inset-x-0 bottom-0">
            <div className="container-wide pb-6 sm:pb-10 lg:pb-14">
              <Reveal variant="up" delay={150} className="text-center">
                <h1 className="leading-none">
                  <img
                    src={logoSrc}
                    alt="lePhare — Maison dédiée à la Santé Mentale"
                    className="w-full max-w-[260px] sm:max-w-[360px] lg:max-w-[440px] xl:max-w-[500px] h-auto mx-auto drop-shadow-[0_2px_18px_rgba(255,255,255,0.85)]"
                  />
                </h1>
                <span className="sr-only">
                  {getContent("hero", "tagline", "Maison dédiée à la Santé Mentale")}
                </span>
                <p className="font-script text-base sm:text-lg text-background mt-2 sm:mt-3 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                  {getContent("hero", "image_caption", "Château du Tenet — Mérignac (33)")}
                </p>

                <div className="mt-4 sm:mt-6 flex justify-center">
                  <Link
                    to="/ateliers"
                    onClick={() => trackCtaClick(getContent("hero", "cta", "Voir la programmation"), "home_hero")}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-background/95 backdrop-blur text-primary border-2 border-background rounded-2xl text-sm sm:text-base font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-elevated"
                  >
                    {getContent("hero", "cta", "Voir la programmation")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {showBlocActu && <BlocActualitesHome />}

      {/* Features Section - 3 photos rondes avec doodles */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container-wide">
          <Reveal variant="up" className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-script text-4xl sm:text-5xl lg:text-6xl text-primary leading-tight">
              {getContent("features", "title", "Un lien entièrement dédié à la Santé Mentale")}
            </h2>
          </Reveal>

          <div className="grid gap-10 sm:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Reveal key={index} variant="up" delay={index * 100}>
                <Link
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

                <h3 className="font-sans text-base sm:text-lg font-semibold text-primary/85 mt-6 mb-5 uppercase tracking-wider whitespace-pre-line leading-tight">
                  {feature.title}
                </h3>

                <span className="inline-flex items-center gap-2 px-6 py-2 bg-background border-2 border-primary text-primary rounded-2xl text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {getContent("features", "card_cta", "En savoir +")}
                </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* "Vous souhaitez..." - grille de 9 cartes-photos avec overlay */}
      <section className="section-padding">
        <div className="container-wide">
          <Reveal variant="up">
            <p className="font-sans text-primary text-xl sm:text-2xl mb-10">
              {getContent("wishes", "title", "Vous souhaitez …")}
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wishes.map((item, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              return (
              <Reveal
                key={index}
                variant="up"
                delay={row * 150 + col * 60}
              >
              <Link
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
                  <p className="font-sans text-background text-base sm:text-lg font-semibold leading-snug max-w-[85%]">
                    {item.text}
                  </p>
                  <ArrowRight className="h-5 w-5 text-background mt-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
