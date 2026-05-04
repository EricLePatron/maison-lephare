import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  Paintbrush,
  Type,
  Image,
  Upload,
  RotateCcw,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  useThemeSettings,
  AVAILABLE_FONTS,
  EDITABLE_COLORS,
  SITE_IMAGES,
} from "@/hooks/useTheme";

// Default color values (HSL without hsl() wrapper)
const DEFAULT_COLORS: Record<string, string> = {
  primary: "344 46% 31%",          // #742B3F bordeaux
  accent: "173 12% 50%",           // #708F8A sage
  background: "50 100% 96%",       // cream
  foreground: "344 30% 18%",
  secondary: "50 100% 85%",        // #FFF1B5 cream yellow
  muted: "200 44% 83%",            // #C1DBE8 sky
  "muted-foreground": "173 14% 35%",
};

function hslStringToHex(hsl: string): string {
  const parts = hsl.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return "#000000";
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  const toHex = (n: number) =>
    Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export default function AdminApparence() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: themeSettings, isLoading } = useThemeSettings();

  const [headingFont, setHeadingFont] = useState("Sweet Belly Script");
  const [bodyFont, setBodyFont] = useState("Nunito");
  const [colors, setColors] = useState<Record<string, string>>(DEFAULT_COLORS);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    if (!themeSettings) return;
    if (themeSettings.fonts["heading_font"])
      setHeadingFont(themeSettings.fonts["heading_font"]);
    if (themeSettings.fonts["body_font"])
      setBodyFont(themeSettings.fonts["body_font"]);

    const merged = { ...DEFAULT_COLORS };
    Object.entries(themeSettings.colors).forEach(([k, v]) => {
      merged[k] = v;
    });
    setColors(merged);
    setImageUrls(themeSettings.images);
  }, [themeSettings]);

  const upsertThemeSetting = async (
    sectionKey: string,
    contentKey: string,
    value: string
  ) => {
    // Check if exists
    const { data: existing } = await supabase
      .from("site_content")
      .select("id")
      .eq("page_key", "theme")
      .eq("section_key", sectionKey)
      .eq("content_key", contentKey)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("site_content")
        .update({ content_value: value })
        .eq("id", existing.id);
    } else {
      await supabase.from("site_content").insert({
        page_key: "theme",
        section_key: sectionKey,
        content_key: contentKey,
        content_value: value,
        content_type: "text",
      });
    }
  };

  const handleSaveFonts = async () => {
    setSaving(true);
    try {
      await upsertThemeSetting("fonts", "heading_font", headingFont);
      await upsertThemeSetting("fonts", "body_font", bodyFont);
      queryClient.invalidateQueries({ queryKey: ["site_content"] });
      toast({ title: "Polices sauvegardées", description: "Les polices ont été mises à jour." });
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleSaveColors = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(colors)) {
        await upsertThemeSetting("colors", key, value);
      }
      queryClient.invalidateQueries({ queryKey: ["site_content"] });
      toast({ title: "Couleurs sauvegardées", description: "Les couleurs ont été mises à jour." });
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleResetColors = () => {
    setColors(DEFAULT_COLORS);
  };

  const handleImageUpload = async (imageKey: string, file: File) => {
    setUploadingKey(imageKey);
    try {
      const ext = file.name.split(".").pop();
      const path = `${imageKey}.${ext}`;

      // Delete old file if exists
      await supabase.storage.from("site-images").remove([path]);

      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("site-images")
        .getPublicUrl(path);

      const publicUrl = urlData.publicUrl + `?t=${Date.now()}`;

      await upsertThemeSetting("images", imageKey, publicUrl);

      setImageUrls((prev) => ({ ...prev, [imageKey]: publicUrl }));
      queryClient.invalidateQueries({ queryKey: ["site_content"] });

      toast({ title: "Image mise à jour", description: `L'image "${SITE_IMAGES.find(i => i.key === imageKey)?.label}" a été remplacée.` });
    } catch (err: any) {
      toast({ title: "Erreur d'upload", description: err.message || "Impossible d'uploader l'image.", variant: "destructive" });
    }
    setUploadingKey(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container-wide py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Paintbrush className="h-5 w-5 text-primary" />
              <h1 className="font-serif text-xl font-semibold">Apparence du site</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container-wide py-8">
        <Tabs defaultValue="fonts">
          <TabsList className="mb-8">
            <TabsTrigger value="fonts" className="gap-2">
              <Type className="h-4 w-4" />
              Polices
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-2">
              <Paintbrush className="h-4 w-4" />
              Couleurs
            </TabsTrigger>
            <TabsTrigger value="images" className="gap-2">
              <Image className="h-4 w-4" />
              Photos
            </TabsTrigger>
          </TabsList>

          {/* FONTS TAB */}
          <TabsContent value="fonts">
            <Card>
              <CardHeader>
                <CardTitle>Polices de caractères</CardTitle>
                <CardDescription>
                  Choisissez les polices utilisées pour les titres et le texte courant.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Police des titres</Label>
                    <Select value={headingFont} onValueChange={setHeadingFont}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_FONTS.filter((f) => f.category === "serif").map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                        {AVAILABLE_FONTS.filter((f) => f.category === "sans-serif").map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div
                      className="mt-3 p-4 border rounded-lg bg-card"
                      style={{ fontFamily: `'${headingFont}', serif` }}
                    >
                      <p className="text-2xl font-semibold">Aperçu du titre</p>
                      <p className="text-lg mt-1">Bienvenue au Phare</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Police du texte</Label>
                    <Select value={bodyFont} onValueChange={setBodyFont}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_FONTS.filter((f) => f.category === "sans-serif").map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                        {AVAILABLE_FONTS.filter((f) => f.category === "serif").map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div
                      className="mt-3 p-4 border rounded-lg bg-card"
                      style={{ fontFamily: `'${bodyFont}', sans-serif` }}
                    >
                      <p className="text-base">
                        Ceci est un aperçu du texte courant avec la police sélectionnée. Le Phare est un lieu dédié à la santé mentale.
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveFonts} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Sauvegarder les polices
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COLORS TAB */}
          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Palette de couleurs</CardTitle>
                    <CardDescription>
                      Personnalisez les couleurs du site. Les valeurs sont en format HSL.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleResetColors} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Réinitialiser
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {EDITABLE_COLORS.map((colorDef) => {
                    const hslValue = colors[colorDef.key] || DEFAULT_COLORS[colorDef.key] || "0 0% 0%";
                    const hexValue = hslStringToHex(hslValue);

                    return (
                      <div key={colorDef.key} className="space-y-2">
                        <Label className="text-sm">{colorDef.label}</Label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={hexValue}
                            onChange={(e) => {
                              const newHsl = hexToHsl(e.target.value);
                              setColors((prev) => ({ ...prev, [colorDef.key]: newHsl }));
                            }}
                            className="h-10 w-14 rounded-md border border-input cursor-pointer"
                          />
                          <Input
                            value={hslValue}
                            onChange={(e) =>
                              setColors((prev) => ({
                                ...prev,
                                [colorDef.key]: e.target.value,
                              }))
                            }
                            className="font-mono text-xs"
                            placeholder="H S% L%"
                          />
                        </div>
                        <div
                          className="h-8 rounded-md border"
                          style={{ backgroundColor: `hsl(${hslValue})` }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Preview */}
                <div className="border rounded-lg p-6 space-y-3" style={{
                  backgroundColor: `hsl(${colors.background})`,
                  color: `hsl(${colors.foreground})`,
                }}>
                  <h3 className="font-serif text-xl font-semibold">Aperçu des couleurs</h3>
                  <p style={{ color: `hsl(${colors["muted-foreground"]})` }}>
                    Texte secondaire avec la couleur atténuée.
                  </p>
                  <div className="flex gap-3">
                    <div className="px-4 py-2 rounded-lg text-sm font-medium" style={{
                      backgroundColor: `hsl(${colors.primary})`,
                      color: `hsl(${colors.background})`,
                    }}>
                      Bouton principal
                    </div>
                    <div className="px-4 py-2 rounded-lg text-sm font-medium" style={{
                      backgroundColor: `hsl(${colors.accent})`,
                      color: `hsl(${colors.foreground})`,
                    }}>
                      Bouton accent
                    </div>
                    <div className="px-4 py-2 rounded-lg text-sm font-medium" style={{
                      backgroundColor: `hsl(${colors.secondary})`,
                      color: `hsl(${colors.foreground})`,
                    }}>
                      Secondaire
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveColors} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Sauvegarder les couleurs
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IMAGES TAB */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Photos du site</CardTitle>
                <CardDescription>
                  Remplacez les photos existantes du site. Formats acceptés : JPG, PNG, WebP.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  {SITE_IMAGES.map((img) => (
                    <div key={img.key} className="space-y-3">
                      <Label className="text-sm font-medium">{img.label}</Label>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted relative group">
                        <img
                          src={imageUrls[img.key] || img.fallback}
                          alt={img.label}
                          className="w-full h-full object-cover"
                        />
                        {uploadingKey === img.key && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        )}
                        {imageUrls[img.key] && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-3 w-3" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(img.key, file);
                              e.target.value = "";
                            }}
                          />
                          <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors cursor-pointer">
                            <Upload className="h-4 w-4" />
                            Remplacer l'image
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
