import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Home, Coffee } from "lucide-react";
import chateauImage from "@/assets/chateau-main.jpg";
import cabinetImage from "@/assets/cabinet-room.png";
import associationImage from "@/assets/association-room.png";
import cafeImage from "@/assets/cafe-phare.jpg";

const features = [
  {
    icon: Home,
    title: "Un lieu unique",
    description: "Un château chargé d'histoire dédié entièrement à la santé mentale, avec vue sur un parc de 2 hectares.",
  },
  {
    icon: Users,
    title: "Des professionnels engagés",
    description: "Une équipe pluridisciplinaire de praticiens passionnés : psychiatres, psychologues, thérapeutes.",
  },
  {
    icon: Heart,
    title: "Une approche humaine",
    description: "Des ateliers, groupes de parole et activités conçus pour accompagner chacun dans son parcours.",
  },
  {
    icon: Coffee,
    title: "Un espace ouvert",
    description: "Un café ouvert à tous pour déstigmatiser la santé mentale et créer du lien dans le quartier.",
  },
];

const spaces = [
  {
    image: cabinetImage,
    title: "Le Cabinet",
    description: "8 cabinets de consultation lumineux donnant sur le parc, pour des accompagnements individuels.",
    link: "/professionnels",
    linkText: "Découvrir les professionnels",
  },
  {
    image: associationImage,
    title: "L'Association",
    description: "Des salles de vie pour les ateliers thérapeutiques, groupes de parole et moments de partage.",
    link: "/association",
    linkText: "En savoir plus",
  },
  {
    image: cafeImage,
    title: "Le Café",
    description: "Un espace chaleureux ouvert à tout le quartier, pour des café-débats et rencontres.",
    link: "/le-lieu",
    linkText: "Découvrir le lieu",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={chateauImage}
            alt="Château Le Phare"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sage-700/95 via-sage-600/80 to-sage-500/60" />
        </div>

        {/* Content */}
        <div className="container-wide relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full mb-6 animate-fade-up">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-primary-foreground/90 text-sm font-medium">
                Un lieu dédié à la santé mentale
              </span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-primary-foreground leading-tight mb-6 animate-fade-up-delay">
              Bienvenue au Phare
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-foreground/85 leading-relaxed mb-8 animate-fade-up-delay-2">
              Une maison chaleureuse au cœur de Bordeaux, où professionnels et association s'unissent pour accompagner chacun vers le rétablissement.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-up-delay-2">
              <Button asChild variant="warm" size="xl">
                <Link to="/professionnels">
                  Découvrir les professionnels
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/ateliers">Voir les ateliers</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-b from-background to-secondary/30">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-4">
              Un lieu pas comme les autres
            </h2>
            <p className="text-muted-foreground text-lg">
              Le Phare réunit soins, accompagnement et convivialité dans un cadre exceptionnel.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-elevated group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-sage-100 flex items-center justify-center mb-4 group-hover:bg-sage-200 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spaces Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-4">
              Trois espaces, une mission
            </h2>
            <p className="text-muted-foreground text-lg">
              Découvrez les différents espaces qui composent Le Phare, chacun avec sa vocation propre.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {spaces.map((space) => (
              <div key={space.title} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3]">
                  <img
                    src={space.image}
                    alt={space.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                  {space.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {space.description}
                </p>
                <Link
                  to={space.link}
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  {space.linkText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-sage-600">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary-foreground mb-4">
            Besoin d'être accompagné ?
          </h2>
          <p className="text-primary-foreground/85 text-lg mb-8 max-w-xl mx-auto">
            Que vous cherchiez un professionnel ou souhaitiez participer à nos activités, nous sommes là pour vous accueillir.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="warm" size="xl">
              <Link to="/contact">
                Nous contacter
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <Link to="/professionnels">Trouver un professionnel</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-6">
                Nos valeurs
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-8 w-1 bg-accent rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-1">
                      Bienveillance
                    </h3>
                    <p className="text-muted-foreground">
                      Accueillir chaque personne avec respect et sans jugement, dans sa singularité.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-8 w-1 bg-primary rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-1">
                      Déstigmatisation
                    </h3>
                    <p className="text-muted-foreground">
                      Contribuer à changer le regard sur la santé mentale, ouvrir le dialogue.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-8 w-1 bg-sage-400 rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-1">
                      Collectif
                    </h3>
                    <p className="text-muted-foreground">
                      Croire en la force du groupe et de l'entraide pour accompagner le rétablissement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img
                  src={chateauImage}
                  alt="Le Château Le Phare"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-6 shadow-elevated max-w-xs hidden sm:block">
                <p className="font-serif text-lg text-foreground italic">
                  "Un lieu où l'on prend soin de la santé mentale, ensemble."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
