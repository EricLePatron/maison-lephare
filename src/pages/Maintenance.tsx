import maintenanceImage from "@/assets/maintenance-icon.png";

export default function Maintenance() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: "#7a3b4e" }}>
      <img
        src={maintenanceImage}
        alt="Le Phare - Site en construction"
        className="max-w-3xl w-full px-4"
      />
    </div>
  );
}
