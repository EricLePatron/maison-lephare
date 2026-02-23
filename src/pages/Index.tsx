import { Link } from "react-router-dom";
import { ArrowRight, Heart, Handshake, Coffee, Sprout, Loader2 } from "lucide-react";
import { usePageContent } from "@/hooks/useSiteContent";
import { useSiteImage } from "@/hooks/useTheme";
import chateauImageStatic from "@/assets/chateau-main.jpg";
import heroBanner from "@/assets/hero-banner.png";

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

  return (
    <>
      {/* Hero Banner - exact mockup image */}
      <section className="w-full">
        <img
          src={heroBanner}
          alt="LePhare - Maison dédiée à la Santé Mentale - Château du Tenet, Mérignac (33)"
          className="w-full h-auto"
        />
      </section>

      {/* Features Section - 3 hand-drawn cards */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground mb-4 italic">
              {getContent("features", "title", "Un lieu pas comme les autres,\nentièrement dédié à la santé mentale")}
            </h2>
            <div className="decorative-line-terra mx-auto" />
          </div>

          <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                icon: Heart,
                title: getContent("features", "feature_1_title", "L'espace\nConsultations"),
                link: "/professionnels",
              },
              {
                icon: Handshake,
                title: getContent("features", "feature_2_title", "L'association\nLePhare"),
                link: "/association",
              },
              {
                icon: Coffee,
                title: getContent("features", "feature_3_title", "Le café\ninclusif"),
                link: "/le-lieu",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="hand-drawn-border p-8 text-center group hover:bg-secondary/50 transition-colors"
              >
                <div className="flex justify-center mb-6">
                  <feature.icon className="h-12 w-12 text-primary/70 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mb-6 whitespace-pre-line">
                  {feature.title}
                </h3>
                <Link
                  to={feature.link}
                  className="inline-flex items-center gap-1 px-4 py-1.5 border border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                >
                  en savoir +
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Banner - Full width château photo */}
      <section className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <img
          src={chateauImage}
          alt="Le Phare - Château du Tenet"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="font-script text-5xl sm:text-7xl lg:text-8xl text-[hsl(10_80%_70%)] font-bold drop-shadow-lg">
            LePhare
          </h2>
        </div>
      </section>

      {/* "Vous voulez..." Section */}
      <section className="section-padding">
        <div className="container-narrow">
          <p className="text-muted-foreground text-lg mb-8">Vous voulez …</p>
          <div className="space-y-0">
            {[
              { text: "Consulter un professionnel de la Santé Mentale du Phare ?", link: "/professionnels" },
              { text: "Trouver la programmation des activités de l'association ?", link: "/ateliers" },
              { text: "En savoir plus sur le Lieu ?", link: "/le-lieu" },
              { text: "Rejoindre le projet ?", link: "/contact" },
              { text: "Proposer une activité ?", link: "/contact" },
              { text: "Chercher à vous faire accompagner ?", link: "/professionnels" },
              { text: "Louer une salle pour une activité sur la Santé Mentale ?", link: "/contact" },
              { text: "Vous installer en libéral ?", link: "/contact" },
              { text: "Venir boire un café et nous rencontrer ?", link: "/le-lieu" },
            ].map((item, index) => (
              <div key={index}>
                <Link
                  to={item.link}
                  className="group flex items-center justify-between py-4 transition-colors hover:text-primary"
                >
                  <span className="text-base sm:text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.text}
                  </span>
                  <div className="flex-shrink-0 ml-4 h-10 w-10 rounded-full border-2 border-primary/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                    <ArrowRight className="h-4 w-4 text-primary/50 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
                <div className="h-0.5 w-48 bg-primary/30 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Banner - Sage green */}
      <section className="py-16 sm:py-20 bg-[hsl(var(--sage-500))]">
        <div className="container-narrow text-center">
          <div className="flex items-center justify-center gap-8">
            <Heart className="h-10 w-10 text-white/70 stroke-[1.5] hidden sm:block" />
            <div>
              <p className="font-serif text-xl sm:text-2xl text-white italic leading-relaxed">
                Consulter. Participer. Echanger.<br />
                Se rencontrer.
              </p>
              <p className="font-serif text-xl sm:text-2xl text-white font-semibold mt-2">
                Faire-ensemble autour de la Santé Mentale.
              </p>
            </div>
            <Heart className="h-10 w-10 text-white/70 stroke-[1.5] hidden sm:block" />
          </div>
        </div>
      </section>

      {/* Values Section - "Ce qui compte pour nous" */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-foreground mb-8 italic">
                {getContent("values", "title", "Ce qui compte pour nous")}
              </h2>
              <div className="space-y-8">
                {[
                  {
                    icon: Handshake,
                    title: getContent("values", "value_1_title", "Faire confiance"),
                    description: getContent("values", "value_1_description", "Accorder du crédit à la parole et à l'expérience de chacun"),
                  },
                  {
                    icon: Heart,
                    title: getContent("values", "value_2_title", "Faire ensemble"),
                    description: getContent("values", "value_2_description", "Croire en la force du collectif pour accompagner le rétablissement"),
                  },
                  {
                    icon: Sprout,
                    title: getContent("values", "value_3_title", "Faire grandir"),
                    description: getContent("values", "value_3_description", "Croire en la capacité de chacun à avancer, à son rythme vers le rétablissement"),
                  },
                ].map((value, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <value.icon className="h-6 w-6 text-primary/60 flex-shrink-0 mt-1 stroke-[1.5]" />
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="hand-drawn-border p-3 inline-block">
                <img
                  src={chateauImage}
                  alt="Le Château Le Phare"
                  className="rounded-lg w-full max-w-md object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
