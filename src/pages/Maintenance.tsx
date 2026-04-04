import maintenanceImage from "@/assets/maintenance-icon.png";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <img
        src={maintenanceImage}
        alt="Le Phare - Site en construction"
        className="max-w-3xl w-full"
      />
    </div>
  );
}
