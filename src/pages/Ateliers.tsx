import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Palette, MessageCircle, Users, Heart, Clock, MapPin } from "lucide-react";
import associationImage from "@/assets/association-room.png";

const workshops = [
  {
    icon: MessageCircle,
    title: "Groupes de parole",
    category: "Écoute & Partage",
    description: "Des espaces d'écoute et de partage entre pairs, animés par des professionnels ou des pair-aidants formés. Un lieu où la parole se libère en toute confiance.",
    format: "Hebdomadaire, 1h30",
    audience: "Personnes concernées, aidants",
    objectives: [
      "Rompre l'isolement",
      "Partager son vécu",
      "S'enrichir des expériences des autres",
      "Se sentir compris",
    ],
  },
  {
    icon: Brain,
    title: "Psycho-éducation",
    category: "Comprendre & Agir",
    description: "Des ateliers pour mieux comprendre les troubles psychiques, leurs mécanismes et développer des stratégies d'adaptation au quotidien.",
    format: "Sessions de 6 semaines",
    audience: "Personnes concernées, proches",
    objectives: [
      "Comprendre son trouble",
      "Reconnaître les signaux d'alerte",
      "Développer des stratégies d'adaptation",
      "Améliorer sa qualité de vie",
    ],
  },
  {
    icon: Palette,
    title: "Art-thérapie",
    category: "Expression & Créativité",
    description: "Explorer ses émotions à travers la création artistique : peinture, collage, sculpture... Aucun talent artistique n'est requis, seule l'envie d'explorer compte.",
    format: "Hebdomadaire, 2h",
    audience: "Tous publics",
    objectives: [
      "Exprimer ses émotions autrement",
      "Développer sa créativité",
      "Prendre du recul sur soi",
      "Retrouver confiance",
    ],
  },
  {
    icon: Users,
    title: "Pair-aidance",
    category: "Entraide & Soutien",
    description: "Un accompagnement par des personnes qui ont traversé des difficultés similaires et qui, grâce à leur parcours de rétablissement, peuvent aujourd'hui aider les autres.",
    format: "Sur demande",
    audience: "Personnes concernées",
    objectives: [
      "Bénéficier d'un soutien vécu",
      "Avoir un modèle de rétablissement",
      "Recevoir des conseils pratiques",
      "Retrouver espoir",
    ],
  },
  {
    icon: Heart,
    title: "Gestion des émotions",
    category: "Bien-être",
    description: "Apprendre à identifier, accueillir et réguler ses émotions grâce à des techniques de relaxation, de pleine conscience et d'expression corporelle.",
    format: "Sessions de 8 semaines",
    audience: "Tous publics",
    objectives: [
      "Identifier ses émotions",
      "Techniques de relaxation",
      "Gestion du stress",
      "Améliorer son bien-être",
    ],
  },
];

const cafeDebats = {
  title: "Café-débats",
  description: "Des moments de rencontre ouverts à tous pour échanger sur la santé mentale dans une ambiance conviviale. Thèmes variés : préjugés, rétablissement, témoignages, actualités...",
  format: "1 fois par mois",
  location: "Café Le Phare",
};

export default function Ateliers() {
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
          <div className="grid gap-8 lg:grid-cols-2">
            {workshops.map((workshop) => (
              <div key={workshop.title} className="card-elevated">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-14 w-14 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <workshop.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-accent uppercase tracking-wider">
                      {workshop.category}
                    </span>
                    <h3 className="font-serif text-xl font-medium text-foreground">
                      {workshop.title}
                    </h3>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {workshop.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{workshop.format}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{workshop.audience}</span>
                  </div>
                </div>

                <div className="bg-cream-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Objectifs</h4>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {workshop.objectives.map((obj) => (
                      <li key={obj} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
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
                <li className="flex items-center gap-3 text-sm">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-foreground">Vivre avec un proche concerné</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-foreground">Les préjugés sur la santé mentale</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="h-2 w-2 rounded-full bg-sage-400" />
                  <span className="text-foreground">Témoignages de rétablissement</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="h-2 w-2 rounded-full bg-cream-300" />
                  <span className="text-foreground">Santé mentale au travail</span>
                </li>
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
