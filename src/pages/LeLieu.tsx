import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TreePine, Building2, Loader2 } from "lucide-react";
import { usePageContent } from "@/hooks/useSiteContent";
import chateauImage from "@/assets/chateau-main.jpg";
import cabinetImage from "@/assets/cabinet-room.png";
import associationImage from "@/assets/association-room.png";
import cafeImage from "@/assets/cafe-phare.jpg";

const timeline = [
  {
    year: "1965",
    title: "Construction du château",
    description: "Le bâtiment est érigé, alliant architecture classique et espaces généreux.",
  },
  {
    year: "2024",
    title: "Naissance du projet",
    description: "L'idée du Phare germe : créer un lieu dédié à la santé mentale, différent, chaleureux.",
  },
  {
    year: "2025",
    title: "Ouverture du Phare",
    description: "Le château ouvre ses portes pour accueillir professionnels, association et café.",
  },
];

const spaces = [
  {
    image: cabinetImage,
    title: "Les cabinets de consultation",
    description: "8 cabinets lumineux de 18m² donnant sur le parc, offrant un cadre apaisant pour les consultations individuelles.",
    features: ["Vue sur le parc de 2ha", "Salles d'attente confortables", "Espace détente pour l'équipe"],
  },
  {
    image: associationImage,
    title: "Les salles de vie",
    description: "De grands espaces polyvalents pour les ateliers thérapeutiques, groupes de parole et moments de partage collectifs.",
    features: ["Ateliers thérapeutiques", "Groupes de parole", "Art-thérapie"],
  },
  {
    image: cafeImage,
    title: "Le Café Le Phare",
    description: "Un espace convivial ouvert à tout le quartier, pour déstigmatiser la santé mentale autour d'un café.",
    features: ["Café-débats", "Ouvert à tous", "Rencontres conviviales"],
  },
];

export default function LeLieu() {
  const { getContent, isLoading } = usePageContent("le-lieu");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={chateauImage}
            alt="Château Le Phare"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sage-700/95 via-sage-600/85 to-sage-500/70" />
        </div>

        <div className="container-wide relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full mb-6">
              <Building2 className="h-4 w-4 text-accent" />
              <span className="text-primary-foreground/90 text-sm font-medium">
                {getContent("hero", "badge", "Un château à Bordeaux")}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-primary-foreground leading-tight mb-6">
              {getContent("hero", "title", "Le Lieu")}
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-foreground/85 leading-relaxed">
              {getContent("hero", "description", "Un château chargé d'histoire, transformé en maison dédiée à la santé mentale. Un lieu où l'on pense différemment l'accompagnement.")}
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-6">
                {getContent("philosophy", "title", "Notre philosophie")}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {getContent("philosophy", "paragraph_1", "Le Phare est né d'une conviction : la santé mentale mérite un lieu à sa hauteur. Pas un hôpital froid, mais une maison chaleureuse où l'on se sent accueilli.")}
                </p>
                <p>
                  {getContent("philosophy", "paragraph_2", "Dans ce château aux espaces généreux, nous avons voulu créer un environnement propice au rétablissement. La lumière naturelle, la vue sur le parc, les matériaux nobles – tout contribue à apaiser et rassurer.")}
                </p>
                <p>
                  {getContent("philosophy", "paragraph_3", "Ici, professionnels de santé, association et café cohabitent pour offrir un accompagnement global, où le soin côtoie le lien social et la convivialité.")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src={cabinetImage} alt="Cabinet" className="w-full h-full object-cover" />
                </div>
                <div className="card-elegant">
                  <TreePine className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Parc de 2 hectares</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="card-elegant">
                  <Sparkles className="h-8 w-8 text-accent mb-2" />
                  <p className="text-sm text-muted-foreground">Lumière naturelle</p>
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src={associationImage} alt="Salle de vie" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground text-center mb-12">
            {getContent("timeline", "title", "Histoire du lieu")}
          </h2>
          
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-semibold text-sm">
                    {item.year.slice(2)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-accent font-medium">{item.year}</span>
                  <h3 className="font-serif text-xl font-medium text-foreground mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spaces Section */}
      <section className="section-padding">
        <div className="container-wide">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground text-center mb-4">
            {getContent("spaces", "title", "Nos espaces")}
          </h2>
          <p className="text-muted-foreground text-center text-lg mb-12 max-w-2xl mx-auto">
            {getContent("spaces", "description", "Trois espaces distincts qui composent Le Phare, chacun avec sa vocation propre.")}
          </p>
          
          <div className="space-y-16">
            {spaces.map((space, index) => (
              <div
                key={space.title}
                className={`grid gap-8 lg:grid-cols-2 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                      src={space.image}
                      alt={space.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="font-serif text-2xl font-medium text-foreground mb-4">
                    {space.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {space.description}
                  </p>
                  <ul className="space-y-2">
                    {space.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-sage-600">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary-foreground mb-4">
            {getContent("cta", "title", "Envie de visiter ?")}
          </h2>
          <p className="text-primary-foreground/85 text-lg mb-8">
            {getContent("cta", "description", "Contactez-nous pour organiser une visite du lieu ou en savoir plus sur nos activités.")}
          </p>
          <Button asChild variant="warm" size="xl">
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
