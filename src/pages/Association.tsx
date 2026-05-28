import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Brain, Handshake, Palette, MessageCircle, Loader2 } from "lucide-react";
import { usePageContent } from "@/hooks/useSiteContent";
import { useSiteImage } from "@/hooks/useTheme";
import associationImageStatic from "@/assets/association-room.png";
import { Seo } from "@/components/Seo";

const activities = [
  {
    icon: MessageCircle,
    title: "Groupes de parole",
    description: "Des espaces d'écoute et de partage entre pairs, animés par des professionnels ou des pair-aidants.",
    audience: "Personnes concernées, aidants",
  },
  {
    icon: Brain,
    title: "Psycho-éducation",
    description: "Des ateliers pour mieux comprendre les troubles psychiques et développer des stratégies d'adaptation.",
    audience: "Personnes concernées, proches",
  },
  {
    icon: Palette,
    title: "Art-thérapie",
    description: "Explorer ses émotions à travers la création artistique, dans un cadre bienveillant et sans jugement.",
    audience: "Tous publics",
  },
  {
    icon: Users,
    title: "Pair-aidance",
    description: "Un accompagnement par des personnes qui ont traversé des difficultés similaires et se sont rétablies.",
    audience: "Personnes concernées",
  },
  {
    icon: Handshake,
    title: "Café-débats",
    description: "Des moments de rencontre ouverts à tous pour échanger sur la santé mentale autour d'un café.",
    audience: "Ouvert à tous",
  },
  {
    icon: Heart,
    title: "Sensibilisation",
    description: "Actions de déstigmatisation auprès du grand public, des entreprises et des institutions.",
    audience: "Grand public, professionnels",
  },
];

const values = [
  {
    title: "Accueil inconditionnel",
    description: "Chaque personne est accueillie avec respect et bienveillance, quelle que soit sa situation.",
  },
  {
    title: "Approche par le rétablissement",
    description: "Nous croyons au potentiel de chacun à se rétablir et à mener une vie épanouissante.",
  },
  {
    title: "Force du collectif",
    description: "L'entraide et le partage d'expériences sont au cœur de notre approche.",
  },
  {
    title: "Déstigmatisation",
    description: "Nous œuvrons pour changer le regard de la société sur la santé mentale.",
  },
];

export default function Association() {
  const { getContent, isLoading } = usePageContent("association");
  const associationImage = useSiteImage("association-room", associationImageStatic);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Seo
        title="L'Association Le Phare – Santé Mentale à Mérignac"
        description="L'association loi 1901 Le Phare propose ateliers, groupes de parole et événements pour soutenir le rétablissement et déstigmatiser la santé mentale."
        path="/association"
      />
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={associationImage}
            alt="Salle de l'association"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container-wide relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full mb-6">
              <Heart className="h-4 w-4 text-accent" />
              <span className="text-foreground text-sm font-medium">
                {getContent("hero", "badge", "Association loi 1901")}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-foreground leading-tight mb-6 [text-shadow:_0_2px_12px_hsl(var(--background)/0.8)]">
              {getContent("hero", "title", "L'Association Le Phare")}
            </h1>

            <p className="text-lg sm:text-xl text-foreground leading-relaxed [text-shadow:_0_1px_8px_hsl(var(--background)/0.8)]">
              {getContent("hero", "description", "Des activités collectives et un accompagnement chaleureux pour tous ceux qui sont concernés par la santé mentale.")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-6">
                {getContent("mission", "title", "Notre mission")}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {getContent("mission", "paragraph_1", "L'association Le Phare a pour vocation d'accompagner les personnes concernées par la santé mentale, leurs proches et tous ceux qui souhaitent s'informer.")}
                </p>
                <p>
                  {getContent("mission", "paragraph_2", "À travers nos ateliers thérapeutiques, groupes de parole et activités psycho-éducatives, nous créons des espaces de rencontre et de partage où chacun peut avancer à son rythme.")}
                </p>
                <p>
                  {getContent("mission", "paragraph_3", "Nous croyons fermement au rétablissement et à la capacité de chaque personne à mener une vie épanouissante, malgré les difficultés traversées.")}
                </p>
              </div>
              <Button asChild variant="hero" size="lg" className="mt-8">
                <Link to="/contact">
                  Nous rejoindre
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className={`card-elevated ${index === 0 ? "col-span-2" : ""}`}
                >
                  <h3 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="section-padding bg-terra-700">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary-foreground mb-4">
              {getContent("activities", "title", "Nos activités")}
            </h2>
            <p className="text-primary-foreground/85 text-lg">
              {getContent("activities", "description", "Des ateliers et moments de partage adaptés à chaque besoin et à chaque parcours.")}
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <div key={activity.title} className="card-elevated group">
                <div className="h-12 w-12 rounded-xl bg-sage-100 flex items-center justify-center mb-4 group-hover:bg-sage-200 transition-colors">
                  <activity.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                  {activity.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publics Section */}
      <section className="section-padding">
        <div className="container-narrow">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground text-center mb-12">
            {getContent("publics", "title", "À qui s'adresse l'association ?")}
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card-elegant border-l-4 border-primary">
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                Personnes concernées
              </h3>
              <p className="text-muted-foreground text-sm">
                Vous vivez avec un trouble psychique ou traversez une période difficile ? Nos activités sont conçues pour vous accompagner dans votre parcours.
              </p>
            </div>
            
            <div className="card-elegant border-l-4 border-accent">
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                Proches et aidants
              </h3>
              <p className="text-muted-foreground text-sm">
                Accompagner un proche peut être éprouvant. Des groupes de parole et ateliers spécifiques vous sont dédiés.
              </p>
            </div>
            
            <div className="card-elegant border-l-4 border-sage-400">
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                Professionnels
              </h3>
              <p className="text-muted-foreground text-sm">
                Vous travaillez dans le champ de la santé mentale ? Participez à nos échanges de pratiques et formations.
              </p>
            </div>
            
            <div className="card-elegant border-l-4 border-primary">
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                Grand public
              </h3>
              <p className="text-muted-foreground text-sm">
                Curieux ou sensibilisé à la cause ? Le café et nos événements sont ouverts à tous pour échanger et s'informer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-sage-600">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary-foreground mb-4">
            {getContent("cta", "title", "Rejoignez-nous")}
          </h2>
          <p className="text-primary-foreground/85 text-lg mb-8 max-w-xl mx-auto">
            {getContent("cta", "description", "Devenez adhérent, bénévole, ou participez simplement à nos activités. Toutes les formes d'engagement sont les bienvenues.")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="warm" size="xl">
              <Link to="/contact">
                Nous contacter
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <Link to="/ateliers">Voir les ateliers</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
