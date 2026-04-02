import maintenanceImage from "@/assets/maintenance-icon.png";

export default function Maintenance() {
  return (
    <div className="min-h-screen w-full">
      <img
        src={maintenanceImage}
        alt="Le Phare - Site en construction"
        className="w-full h-screen object-cover object-top"
      />
    </div>
  );
}
