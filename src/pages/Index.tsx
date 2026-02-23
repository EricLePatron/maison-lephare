import { Link } from "react-router-dom";
import { ArrowRight, Heart, Handshake, Coffee, Sprout, Loader2 } from "lucide-react";
import { usePageContent } from "@/hooks/useSiteContent";
import { useSiteImage } from "@/hooks/useTheme";
import chateauImageStatic from "@/assets/chateau-main.jpg";
import heroBanner from "@/assets/hero-banner.png";
import photoBanner from "@/assets/photo-banner.png";
import valuesBanner from "@/assets/values-banner.png";

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
      <section className="py-16 sm:py-24 bg-[hsl(var(--muted)_/_0.3)]">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground italic leading-snug">
              {getContent("features", "title", "Un lieu pas comme les autres,\nentièrement dédié à la santé mentale")}
            </h2>
            <div className="flex justify-center mt-5">
              <div className="decorative-line-terra" />
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: Heart,
                title: "L'espace\nConsultations",
                description: "8 bureaux pour professionnels de santé mentale installés en libéral",
                link: "/professionnels",
              },
              {
                icon: Handshake,
                title: "L'association\nLePhare",
                description: "Des ateliers, des groupes et des rencontres pour parler santé mentale autrement",
                link: "/association",
              },
              {
                icon: Coffee,
                title: "Le café\ninclusif",
                description: "Un espace ouvert à tous pour se retrouver et échanger",
                link: "/le-lieu",
              },
            ].map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group relative block"
              >
                {/* Hand-drawn border using SVG */}
                <div className="relative p-8 sm:p-10 text-center transition-all duration-300">
                  {/* Outer hand-drawn border */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 350" preserveAspectRatio="none" fill="none">
                    <path
                      d="M12 8 C 60 4, 240 6, 290 10 C 294 60, 296 290, 292 340 C 240 344, 60 346, 8 342 C 4 290, 6 60, 12 8 Z"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      className="transition-all duration-300 group-hover:stroke-[4]"
                    />
                  </svg>

                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <feature.icon className="h-14 w-14 text-primary/60 stroke-[1.2] group-hover:text-primary/80 transition-colors" />
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-foreground mb-4 whitespace-pre-line leading-tight">
                      {feature.title}
                    </h3>

                    {/* Description - visible on hover */}
                    <p className="text-sm text-muted-foreground mb-4 max-h-0 overflow-hidden opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300">
                      {feature.description}
                    </p>

                    <span className="inline-flex items-center gap-1 px-5 py-2 bg-muted/60 rounded-full text-sm text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      en savoir +
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Banner - exact mockup image */}
      <section className="w-full">
        <img
          src={photoBanner}
          alt="LePhare - Château du Tenet"
          className="w-full h-auto"
        />
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
                  <div className="flex-shrink-0 ml-4">
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="group-hover:scale-105 transition-transform">
                      {/* Outer hand-drawn circle */}
                      <ellipse cx="22" cy="22" rx="19" ry="19.5" stroke="hsl(var(--primary))" strokeWidth="1.2" strokeOpacity="0.35" strokeLinecap="round" />
                      {/* Inner hand-drawn circle */}
                      <ellipse cx="22" cy="22" rx="16.5" ry="17" stroke="hsl(var(--primary))" strokeWidth="1.8" strokeOpacity="0.5" strokeLinecap="round" className="group-hover:stroke-[hsl(var(--primary))] group-hover:[stroke-opacity:1]" />
                      {/* Arrow */}
                      <path d="M18 22H27M24 18.5L27.5 22L24 25.5" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" className="group-hover:[stroke-opacity:1]" />
                    </svg>
                  </div>
                </Link>
                {/* Hand-drawn wavy underline */}
                <svg width="180" height="8" viewBox="0 0 180 8" fill="none" className="ml-0">
                  <path
                    d={`M2 ${4 + Math.sin(index) * 1.5} C 30 ${2 + Math.cos(index * 2)}, 50 ${5 + Math.sin(index * 3) * 1.2}, 80 ${4 + Math.cos(index)} S 130 ${3 + Math.sin(index * 1.5)}, 160 ${4 + Math.cos(index * 2.5) * 0.8} L 178 ${4 + Math.sin(index + 1)}`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Banner - exact mockup image */}
      <section className="w-full">
        <img
          src={valuesBanner}
          alt="Consulter. Participer. Echanger. Se rencontrer. Faire-ensemble autour de la Santé Mentale."
          className="w-full h-auto"
        />
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
