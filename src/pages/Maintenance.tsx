import maintenanceImage from "@/assets/maintenance-icon.png";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - logo only, no navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/40">
        <div className="container-wide">
          <div className="flex h-16 sm:h-18 items-center justify-center">
            <span className="font-script text-2xl sm:text-3xl text-primary font-bold tracking-wide">
              LePhare
            </span>
          </div>
        </div>
      </header>

      {/* Main content - centered maintenance image */}
      <main className="flex-1 flex items-center justify-center pt-16 sm:pt-20 px-4">
        <img
          src={maintenanceImage}
          alt="Le Phare - Site en construction"
          className="max-w-3xl w-full"
        />
      </main>
    </div>
  );
}