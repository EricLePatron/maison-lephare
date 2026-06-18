import { Link } from "react-router-dom";
import type { Atelier } from "@/hooks/useAteliers";

const STATUT_BAR: Record<string, string> = {
  dispo: "bg-[#732B3E]",
  dernieres_places: "bg-[#F59E0B]",
  complet: "bg-[#EF4444]",
};

const STATUT_PILL: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  dispo: { bg: "bg-[#D1FAE5]", text: "text-[#065F46]", dot: "bg-[#10B981]", label: "Places disponibles" },
  dernieres_places: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", dot: "bg-[#F59E0B]", label: "Dernières places" },
  complet: { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", dot: "bg-[#EF4444]", label: "Complet" },
};

const MOIS = ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

function formatTime(d: Date) {
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

interface Props {
  atelier: Atelier;
  horizontal?: boolean;
}

export function CarteAtelier({ atelier, horizontal = false }: Props) {
  const statut = (atelier.statut ?? "dispo") as "dispo" | "dernieres_places" | "complet";
  const isComplet = statut === "complet";
  const date = atelier.date_evenement ? new Date(atelier.date_evenement) : null;
  const pill = STATUT_PILL[statut];
  const mailtoComplet = `mailto:contact@maison-lephare.fr?subject=${encodeURIComponent(
    `Atelier complet — ${atelier.titre}`
  )}&body=${encodeURIComponent(
    `Bonjour,\n\nJe souhaiterais être prévenu(e) de la prochaine date de l'atelier "${atelier.titre}".\n\nMerci !`
  )}`;

  const InscriptionBtn = !isComplet && atelier.lien_inscription ? (
    <a
      href={atelier.lien_inscription}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity min-h-[44px]"
    >
      S'inscrire →
    </a>
  ) : isComplet ? (
    <div className="space-y-2">
      <button
        disabled
        className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-muted text-muted-foreground rounded-xl text-sm font-medium min-h-[44px] cursor-not-allowed"
      >
        Complet
      </button>
      <a
        href={mailtoComplet}
        className="block text-center text-sm text-primary hover:underline"
      >
        Me prévenir de la prochaine date →
      </a>
    </div>
  ) : null;

  return (
    <article
      className={`relative bg-[#F9F1F2] rounded-2xl overflow-hidden shadow-soft flex ${
        horizontal ? "flex-col md:flex-row md:items-stretch" : "flex-col"
      }`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${STATUT_BAR[statut]}`} />
      {date && (
        <div
          className={`flex ${
            horizontal ? "md:flex-col md:items-center md:justify-center md:w-40 md:border-r md:border-foreground/10" : "items-baseline gap-3"
          } px-6 pt-6 ${horizontal ? "md:pt-6" : ""}`}
        >
          <div className={`font-script text-[#732B3E] leading-none ${horizontal ? "text-6xl md:text-7xl" : "text-5xl"}`}>
            {date.getDate()}
          </div>
          <div className={`uppercase tracking-wide text-xs text-[#708F8B] ${horizontal ? "md:mt-2" : ""} ${isComplet ? "opacity-55" : ""}`}>
            {MOIS[date.getMonth()]} {date.getFullYear()}
            <div className="mt-0.5">{formatTime(date)}</div>
          </div>
        </div>
      )}
      <div className={`flex-1 p-6 ${horizontal ? "md:flex md:items-center md:gap-6" : ""}`}>
        <div className={horizontal ? "flex-1" : ""}>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${pill.bg} ${pill.text} mb-3`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pill.dot}`} />
            {pill.label}
          </div>
          <h3 className={`text-xl font-semibold mb-1 ${isComplet ? "opacity-55" : ""}`}>{atelier.titre}</h3>
          <p className={`text-sm text-muted-foreground mb-4 ${isComplet ? "opacity-55" : ""}`}>
            {atelier.format ?? atelier.categorie}
            {atelier.public_cible ? ` · ${atelier.public_cible}` : ""}
          </p>
        </div>
        <div className={horizontal ? "md:w-56 md:flex-shrink-0" : ""}>{InscriptionBtn}</div>
      </div>
    </article>
  );
}