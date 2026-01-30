import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, UserCheck, Mail } from "lucide-react";
import cabinetImage from "@/assets/cabinet-room.png";

// Mock data for professionals (will be replaced by database)
const professionals = [
  {
    id: "1",
    nom: "Dupont",
    prenom: "Marie",
    profession: "Psychiatre",
    specialites: ["Troubles de l'humeur", "Anxiété", "Addictions"],
    description: "Psychiatre depuis 15 ans, je propose un accompagnement personnalisé alliant écoute et thérapeutiques adaptées.",
    approche: "Approche intégrative",
    public: "Adultes",
    presence: "Lundi, Mercredi, Vendredi",
    photo: null,
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Sophie",
    profession: "Psychologue clinicienne",
    specialites: ["Thérapie cognitive", "Trauma", "Gestion du stress"],
    description: "Psychologue spécialisée en TCC, j'accompagne les personnes dans la compréhension et le dépassement de leurs difficultés.",
    approche: "Thérapie cognitive et comportementale",
    public: "Adultes, Adolescents",
    presence: "Mardi, Jeudi",
    photo: null,
  },
  {
    id: "3",
    nom: "Bernard",
    prenom: "Thomas",
    profession: "Psychologue",
    specialites: ["Psychanalyse", "Troubles de la personnalité"],
    description: "Formé à la psychanalyse, je propose un espace de parole libre pour explorer les fondements de la souffrance psychique.",
    approche: "Psychanalytique",
    public: "Adultes",
    presence: "Lundi, Mardi, Jeudi",
    photo: null,
  },
  {
    id: "4",
    nom: "Petit",
    prenom: "Claire",
    profession: "Infirmière en santé mentale",
    specialites: ["Suivi thérapeutique", "Éducation à la santé", "Pair-aidance"],
    description: "Infirmière diplômée d'État spécialisée en psychiatrie, j'accompagne les personnes dans leur parcours de rétablissement.",
    approche: "Accompagnement global",
    public: "Tous publics",
    presence: "Lundi au Vendredi",
    photo: null,
  },
  {
    id: "5",
    nom: "Moreau",
    prenom: "Julie",
    profession: "Art-thérapeute",
    specialites: ["Expression créative", "Gestion des émotions", "Développement personnel"],
    description: "Artiste et thérapeute, j'utilise la création comme médiation pour favoriser l'expression et le mieux-être.",
    approche: "Art-thérapie",
    public: "Adultes, Enfants",
    presence: "Mercredi, Samedi",
    photo: null,
  },
  {
    id: "6",
    nom: "Dubois",
    prenom: "Antoine",
    profession: "Psychomotricien",
    specialites: ["Relaxation", "Conscience corporelle", "Anxiété"],
    description: "Je travaille sur le lien corps-esprit pour aider à retrouver un équilibre et une harmonie intérieure.",
    approche: "Psychomotricité relationnelle",
    public: "Tous publics",
    presence: "Mardi, Vendredi",
    photo: null,
  },
];

const professions = [...new Set(professionals.map((p) => p.profession))];

export default function Professionnels() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={cabinetImage}
            alt="Cabinet de consultation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sage-700/95 via-sage-600/85 to-sage-500/70" />
        </div>

        <div className="container-wide relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full mb-6">
              <UserCheck className="h-4 w-4 text-accent" />
              <span className="text-primary-foreground/90 text-sm font-medium">
                Équipe pluridisciplinaire
              </span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-primary-foreground leading-tight mb-6">
              Nos Professionnels
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-foreground/85 leading-relaxed">
              Une équipe de praticiens passionnés, aux approches variées, pour vous accompagner selon vos besoins.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-border bg-secondary/30">
        <div className="container-wide">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-foreground">Filtrer par :</span>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium transition-colors">
                Tous
              </button>
              {professions.map((profession) => (
                <button
                  key={profession}
                  className="px-4 py-2 bg-card text-foreground rounded-full text-sm font-medium hover:bg-muted transition-colors"
                >
                  {profession}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((pro) => (
              <div key={pro.id} className="card-elevated group">
                {/* Photo or placeholder */}
                <div className="h-48 rounded-xl bg-sage-100 flex items-center justify-center mb-4 overflow-hidden">
                  {pro.photo ? (
                    <img
                      src={pro.photo}
                      alt={`${pro.prenom} ${pro.nom}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="h-20 w-20 rounded-full bg-sage-200 flex items-center justify-center mx-auto mb-2">
                        <span className="font-serif text-2xl text-primary font-semibold">
                          {pro.prenom[0]}{pro.nom[0]}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground">
                      {pro.prenom} {pro.nom}
                    </h3>
                    <p className="text-primary font-medium text-sm">{pro.profession}</p>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {pro.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {pro.specialites.slice(0, 3).map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 bg-cream-100 text-xs font-medium text-foreground rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      <Users className="h-4 w-4 inline mr-1" />
                      {pro.public}
                    </span>
                    <span className="text-muted-foreground">{pro.presence.split(",")[0]}...</span>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full mt-2">
                    <Link to={`/professionnels/${pro.id}`}>
                      Voir le profil
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow">
          <div className="card-elegant text-center">
            <div className="h-16 w-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-foreground mb-4">
              Vous êtes professionnel de la santé mentale ?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Le Phare accueille des praticiens de toutes disciplines. Si vous souhaitez rejoindre notre équipe et installer votre cabinet au château, contactez-nous.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/contact">
                Nous contacter
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
