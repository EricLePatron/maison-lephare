import maintenanceImage from "@/assets/maintenance-icon.png";

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[hsl(var(--cream))] flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <svg viewBox="0 0 200 80" className="w-40 mb-8">
        <text
          x="100"
          y="50"
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="36"
          fontStyle="italic"
          fill="hsl(var(--burgundy))"
        >
          lePhare
        </text>
        <text
          x="100"
          y="70"
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="10"
          fill="hsl(var(--burgundy))"
        >
          Maison dédiée à la Santé Mentale
        </text>
      </svg>

      {/* Image */}
      <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-lg mb-10">
        <img
          src={maintenanceImage}
          alt="Le Château LePhare"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Message */}
      <div className="max-w-xl space-y-4">
        <p className="font-serif text-2xl sm:text-3xl text-[hsl(var(--burgundy))]">
          Nous sommes très occupés à ouvrir la maison, mais{" "}
          <strong>le site internet sera lancé prochainement.</strong>
        </p>
        <p className="font-serif text-xl sm:text-2xl text-[hsl(var(--burgundy))/0.8]">
          En attendant, retrouvez-nous sur Linkedin ou sur Instagram{" "}
          <span className="font-semibold">@lamaisonlephare</span>
        </p>
      </div>
    </div>
  );
}
