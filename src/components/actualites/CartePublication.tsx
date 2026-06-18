import { Linkedin, Building2 } from "lucide-react";
import type { Publication } from "@/hooks/usePublications";

function initiales(nom: string) {
  return nom
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ilYA(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const j = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (j <= 0) return "aujourd'hui";
  if (j === 1) return "il y a 1 jour";
  if (j < 30) return `il y a ${j} jours`;
  const m = Math.floor(j / 30);
  if (m < 12) return `il y a ${m} mois`;
  return `il y a ${Math.floor(m / 12)} an${m >= 24 ? "s" : ""}`;
}

export function CarteLinkedin({ publication, featured = false }: { publication: Publication; featured?: boolean }) {
  if (featured) {
    return (
      <article className="md:col-span-3 bg-[#708F8B] text-white rounded-2xl p-8 md:p-10 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-semibold">
            {initiales(publication.auteur)}
          </div>
          <div>
            <div className="font-medium">{publication.auteur}</div>
            <div className="text-xs opacity-80">{ilYA(publication.date_publication)}</div>
          </div>
          <Linkedin className="ml-auto w-6 h-6" />
        </div>
        <p className="font-script text-2xl md:text-3xl leading-snug mb-6">{publication.extrait}</p>
        {publication.url_linkedin && (
          <a
            href={publication.url_linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#FFFEF3] text-[#708F8B] rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Suivre sur LinkedIn →
          </a>
        )}
      </article>
    );
  }

  return (
    <article className="relative bg-[#FFFEF3] rounded-2xl p-6 shadow-soft overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#708F8B]" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#708F8B]/15 text-[#708F8B] flex items-center justify-center text-sm font-semibold">
          {initiales(publication.auteur)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{publication.auteur}</div>
          <div className="text-xs text-muted-foreground">{ilYA(publication.date_publication)}</div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0A66C2] text-white text-xs rounded">
          <Linkedin className="w-3 h-3" /> in
        </span>
      </div>
      <p className="font-script text-xl text-foreground/90 leading-snug mb-4 flex-1">{publication.extrait}</p>
      {publication.url_linkedin && (
        <a
          href={publication.url_linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          Lire sur LinkedIn →
        </a>
      )}
    </article>
  );
}

export function CarteActualite({ publication }: { publication: Publication }) {
  return (
    <article className="md:col-span-2 bg-white rounded-2xl shadow-soft overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-2/5 bg-[#C8DEE8] flex items-center justify-center min-h-[180px]">
        {publication.image_url ? (
          <img src={publication.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <Building2 className="w-16 h-16 text-white/80" />
        )}
      </div>
      <div className="md:w-3/5 p-6 flex flex-col">
        {publication.categorie && (
          <span className="inline-block self-start px-3 py-1 mb-3 rounded-full bg-amber-100 text-amber-900 text-xs font-medium">
            {publication.categorie}
          </span>
        )}
        <h3 className="font-script text-2xl text-primary mb-2">{publication.auteur}</h3>
        <p className="text-foreground/80 mb-4 flex-1">{publication.extrait}</p>
        {publication.url_linkedin && (
          <a
            href={publication.url_linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Lire la suite →
          </a>
        )}
      </div>
    </article>
  );
}

export function CartePromoNewsletter() {
  return (
    <article className="rounded-2xl border-2 border-dashed border-primary/30 bg-[#FFFEF3] p-6 flex flex-col items-center justify-center text-center">
      <h3 className="font-script text-2xl text-primary mb-2">Restez connectés</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Recevez les prochains ateliers et actualités du Phare.
      </p>
      <a
        href="mailto:contact@maison-lephare.fr?subject=Inscription%20newsletter"
        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
      >
        S'inscrire à la newsletter
      </a>
    </article>
  );
}

export function EmptyStatePublications() {
  return (
    <article className="md:col-span-3 rounded-2xl border-2 border-dashed border-[#0A66C2]/30 bg-white p-8 text-center">
      <Linkedin className="w-10 h-10 text-[#0A66C2] mx-auto mb-3" />
      <h3 className="font-script text-2xl text-primary mb-2">Suivez-nous sur LinkedIn</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Les actualités du Phare arrivent bientôt ici. En attendant, retrouvez-nous sur LinkedIn.
      </p>
      <a
        href="https://www.linkedin.com/company/lephare-sante-mentale"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A66C2] text-white rounded-xl text-sm font-medium"
      >
        <Linkedin className="w-4 h-4" /> Suivre sur LinkedIn
      </a>
    </article>
  );
}