import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ThemeSettings {
  fonts: Record<string, string>;
  colors: Record<string, string>;
  images: Record<string, string>;
}

// Available Google Fonts options
export const AVAILABLE_FONTS = [
  { label: "Playfair Display", value: "Playfair Display", category: "serif" },
  { label: "Merriweather", value: "Merriweather", category: "serif" },
  { label: "Lora", value: "Lora", category: "serif" },
  { label: "Cormorant Garamond", value: "Cormorant Garamond", category: "serif" },
  { label: "DM Serif Display", value: "DM Serif Display", category: "serif" },
  { label: "Libre Baskerville", value: "Libre Baskerville", category: "serif" },
  { label: "Inter", value: "Inter", category: "sans-serif" },
  { label: "DM Sans", value: "DM Sans", category: "sans-serif" },
  { label: "Outfit", value: "Outfit", category: "sans-serif" },
  { label: "Plus Jakarta Sans", value: "Plus Jakarta Sans", category: "sans-serif" },
  { label: "Nunito", value: "Nunito", category: "sans-serif" },
  { label: "Work Sans", value: "Work Sans", category: "sans-serif" },
  { label: "Raleway", value: "Raleway", category: "sans-serif" },
  { label: "Source Sans 3", value: "Source Sans 3", category: "sans-serif" },
];

// Editable color keys with French labels
export const EDITABLE_COLORS = [
  { key: "primary", label: "Couleur principale", cssVar: "--primary" },
  { key: "accent", label: "Couleur d'accent", cssVar: "--accent" },
  { key: "background", label: "Fond de page", cssVar: "--background" },
  { key: "foreground", label: "Texte principal", cssVar: "--foreground" },
  { key: "secondary", label: "Fond secondaire", cssVar: "--secondary" },
  { key: "muted", label: "Fond atténué", cssVar: "--muted" },
  { key: "muted-foreground", label: "Texte atténué", cssVar: "--muted-foreground" },
];

// Site images that can be replaced
export const SITE_IMAGES = [
  { key: "chateau-main", label: "Photo principale du château (Hero)", fallback: "/src/assets/chateau-main.jpg" },
  { key: "cabinet-room", label: "Salle de cabinet", fallback: "/src/assets/cabinet-room.png" },
  { key: "association-room", label: "Salle de l'association", fallback: "/src/assets/association-room.png" },
  { key: "cafe-phare", label: "Le Café Le Phare", fallback: "/src/assets/cafe-phare.jpg" },
];

export function useThemeSettings() {
  return useQuery({
    queryKey: ["site_content", "theme"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("page_key", "theme");

      if (error) throw error;

      const settings: ThemeSettings = { fonts: {}, colors: {}, images: {} };

      data?.forEach((item) => {
        if (item.section_key === "fonts") {
          settings.fonts[item.content_key] = item.content_value;
        } else if (item.section_key === "colors") {
          settings.colors[item.content_key] = item.content_value;
        } else if (item.section_key === "images") {
          settings.images[item.content_key] = item.content_value;
        }
      });

      return settings;
    },
  });
}

export function useApplyTheme() {
  const { data: settings } = useThemeSettings();

  useEffect(() => {
    if (!settings) return;

    // Apply fonts
    const headingFont = settings.fonts["heading_font"];
    const bodyFont = settings.fonts["body_font"];

    if (headingFont) {
      loadGoogleFont(headingFont);
      document.documentElement.style.setProperty(
        "--font-heading",
        `'${headingFont}', Georgia, serif`
      );
      // Apply to heading elements
      const style = document.getElementById("theme-fonts") || document.createElement("style");
      style.id = "theme-fonts";
      style.textContent = `
        h1, h2, h3, h4, h5, h6 { font-family: '${headingFont}', Georgia, serif !important; }
        ${bodyFont ? `body { font-family: '${bodyFont}', system-ui, sans-serif !important; }` : ""}
      `;
      if (!document.getElementById("theme-fonts")) {
        document.head.appendChild(style);
      }
    }

    if (bodyFont && !headingFont) {
      loadGoogleFont(bodyFont);
      const style = document.getElementById("theme-fonts") || document.createElement("style");
      style.id = "theme-fonts";
      style.textContent = `body { font-family: '${bodyFont}', system-ui, sans-serif !important; }`;
      if (!document.getElementById("theme-fonts")) {
        document.head.appendChild(style);
      }
    }

    // Apply colors
    Object.entries(settings.colors).forEach(([key, value]) => {
      const colorDef = EDITABLE_COLORS.find((c) => c.key === key);
      if (colorDef && value) {
        document.documentElement.style.setProperty(colorDef.cssVar, value);
      }
    });

    return () => {
      // Cleanup on unmount
      const style = document.getElementById("theme-fonts");
      if (style) style.remove();
    };
  }, [settings]);
}

function loadGoogleFont(fontName: string) {
  const linkId = `google-font-${fontName.replace(/\s+/g, "-")}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

export function useSiteImage(imageKey: string, fallbackImport: string) {
  const { data: settings } = useThemeSettings();
  const dynamicUrl = settings?.images[imageKey];
  return dynamicUrl || fallbackImport;
}
