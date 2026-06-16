import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  useAteliers,
  useCreateAtelier,
  useUpdateAtelier,
  useDeleteAtelier,
  type Atelier,
  type AtelierInsert,
} from "@/hooks/useAteliers";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Loader2,
  Brain,
  Palette,
  MessageCircle,
  Users,
  Heart,
  Sparkles,
  LogOut,
  BookOpen,
  Music,
  Lightbulb,
} from "lucide-react";

const ICONS = [
  { value: "Brain", label: "Cerveau", icon: Brain },
  { value: "Palette", label: "Palette", icon: Palette },
  { value: "MessageCircle", label: "Discussion", icon: MessageCircle },
  { value: "Users", label: "Groupe", icon: Users },
  { value: "Heart", label: "Cœur", icon: Heart },
  { value: "Sparkles", label: "Étoiles", icon: Sparkles },
  { value: "BookOpen", label: "Livre", icon: BookOpen },
  { value: "Music", label: "Musique", icon: Music },
  { value: "Lightbulb", label: "Ampoule", icon: Lightbulb },
];

const getIconComponent = (iconName: string) => {
  const found = ICONS.find((i) => i.value === iconName);
  return found ? found.icon : Brain;
};

const CATEGORIES = [
  "Écoute & Partage",
  "Comprendre & Agir",
  "Expression & Créativité",
  "Entraide & Soutien",
  "Bien-être",
  "Sensibilisation",
];

type FormData = Omit<AtelierInsert, "id" | "created_at" | "updated_at">;

const emptyForm: FormData = {
  titre: "",
  categorie: "",
  description: "",
  format: "",
  public_cible: "",
  objectifs: [],
  icone: "Brain",
  actif: true,
  ordre_affichage: 0,
  lien_inscription: "",
  image_url: "",
  date_evenement: null,
  nombre_places: null,
  complet: false,
};

export default function AdminAteliers() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: ateliers, isLoading, error } = useAteliers();
  const createAtelier = useCreateAtelier();
  const updateAtelier = useUpdateAtelier();
  const deleteAtelier = useDeleteAtelier();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAtelier, setEditingAtelier] = useState<Atelier | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [objectifsText, setObjectifsText] = useState("");

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setObjectifsText("");
    setEditingAtelier(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (atelier: Atelier) => {
    setEditingAtelier(atelier);
    setFormData({
      titre: atelier.titre,
      categorie: atelier.categorie,
      description: atelier.description || "",
      format: atelier.format || "",
      public_cible: atelier.public_cible || "",
      objectifs: atelier.objectifs || [],
      icone: atelier.icone || "Brain",
      actif: atelier.actif,
      ordre_affichage: atelier.ordre_affichage || 0,
      lien_inscription: (atelier as any).lien_inscription || "",
      image_url: (atelier as any).image_url || "",
      date_evenement: (atelier as any).date_evenement || null,
      nombre_places: (atelier as any).nombre_places ?? null,
      complet: (atelier as any).complet ?? false,
    });
    setObjectifsText((atelier.objectifs || []).join("\n"));
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const objectifsArray = objectifsText
      .split("\n")
      .map((o) => o.trim())
      .filter((o) => o.length > 0);

    const dataToSave = {
      ...formData,
      objectifs: objectifsArray,
    };

    try {
      if (editingAtelier) {
        await updateAtelier.mutateAsync({ id: editingAtelier.id, ...dataToSave });
        toast({
          title: "Atelier modifié",
          description: "Les modifications ont été enregistrées.",
        });
      } else {
        await createAtelier.mutateAsync(dataToSave);
        toast({
          title: "Atelier créé",
          description: "L'atelier a été ajouté avec succès.",
        });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet atelier ?")) return;

    try {
      await deleteAtelier.mutateAsync(id);
      toast({
        title: "Atelier supprimé",
        description: "L'atelier a été supprimé.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'atelier.",
        variant: "destructive",
      });
    }
  };

  const toggleActif = async (atelier: Atelier) => {
    try {
      await updateAtelier.mutateAsync({ id: atelier.id, actif: !atelier.actif });
      toast({
        title: atelier.actif ? "Atelier désactivé" : "Atelier activé",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Erreur lors du chargement des ateliers.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/professionnels">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Professionnels
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-serif font-medium text-foreground">
                  Gestion des Ateliers
                </h1>
                <p className="text-sm text-muted-foreground">
                  {ateliers?.length || 0} atelier(s) enregistré(s)
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button variant="outline" asChild>
                <Link to="/ateliers">Voir le site</Link>
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un atelier
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAtelier ? "Modifier l'atelier" : "Nouvel atelier"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="titre">Titre *</Label>
                        <Input
                          id="titre"
                          value={formData.titre}
                          onChange={(e) =>
                            setFormData({ ...formData, titre: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categorie">Catégorie *</Label>
                        <Input
                          id="categorie"
                          value={formData.categorie}
                          onChange={(e) =>
                            setFormData({ ...formData, categorie: e.target.value })
                          }
                          placeholder="Ex: Écoute & Partage"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="format">Format</Label>
                        <Input
                          id="format"
                          value={formData.format || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, format: e.target.value })
                          }
                          placeholder="Ex: Hebdomadaire, 1h30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="public_cible">Public cible</Label>
                        <Input
                          id="public_cible"
                          value={formData.public_cible || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, public_cible: e.target.value })
                          }
                          placeholder="Ex: Tous publics"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="icone">Icône</Label>
                        <Select
                          value={formData.icone || "Brain"}
                          onValueChange={(value) =>
                            setFormData({ ...formData, icone: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ICONS.map((icon) => {
                              const IconComp = icon.icon;
                              return (
                                <SelectItem key={icon.value} value={icon.value}>
                                  <div className="flex items-center gap-2">
                                    <IconComp className="h-4 w-4" />
                                    {icon.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ordre">Ordre d'affichage</Label>
                        <Input
                          id="ordre"
                          type="number"
                          value={formData.ordre_affichage || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              ordre_affichage: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="objectifs">Objectifs (un par ligne)</Label>
                      <Textarea
                        id="objectifs"
                        value={objectifsText}
                        onChange={(e) => setObjectifsText(e.target.value)}
                        rows={4}
                        placeholder="Rompre l'isolement&#10;Partager son vécu&#10;Se sentir compris"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lien_inscription">Lien d'inscription (formulaire AssoConnect)</Label>
                      <Input
                        id="lien_inscription"
                        type="url"
                        value={(formData as any).lien_inscription || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, lien_inscription: e.target.value } as FormData)
                        }
                        placeholder="https://www.assoconnect.com/..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Le bouton "S'inscrire" apparaîtra sur le site si un lien est renseigné.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_evenement">Date de l'événement (optionnel)</Label>
                      <Input
                        id="date_evenement"
                        type="datetime-local"
                        value={
                          (formData as any).date_evenement
                            ? new Date((formData as any).date_evenement)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            date_evenement: e.target.value
                              ? new Date(e.target.value).toISOString()
                              : null,
                          } as FormData)
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Si la date est passée, l'atelier s'affichera comme « Événement terminé » (photo grisée) au lieu d'être masqué.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Photo (optionnel)</Label>
                      <ImageUpload
                        value={(formData as any).image_url || ""}
                        onChange={(url) =>
                          setFormData({ ...formData, image_url: url } as FormData)
                        }
                        folder="ateliers"
                      />
                      <p className="text-xs text-muted-foreground">
                        Si renseignée, la photo remplace l'icône sur la page Ateliers.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre_places">Nombre de places (optionnel)</Label>
                        <Input
                          id="nombre_places"
                          type="number"
                          min={0}
                          value={(formData as any).nombre_places ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nombre_places: e.target.value === "" ? null : parseInt(e.target.value),
                            } as FormData)
                          }
                          placeholder="Ex : 12"
                        />
                      </div>
                      <div className="flex items-end gap-2 pb-2">
                        <Switch
                          id="complet"
                          checked={(formData as any).complet ?? false}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, complet: checked } as FormData)
                          }
                        />
                        <Label htmlFor="complet">Atelier complet</Label>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="actif"
                        checked={formData.actif}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, actif: checked })
                        }
                      />
                      <Label htmlFor="actif">Actif (visible sur le site)</Label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={createAtelier.isPending || updateAtelier.isPending}
                      >
                        {(createAtelier.isPending || updateAtelier.isPending) && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        {editingAtelier ? "Enregistrer" : "Créer"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="Se déconnecter">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Icône</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Public</TableHead>
                <TableHead className="w-20">Actif</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ateliers?.map((atelier) => {
                const IconComp = getIconComponent(atelier.icone || "Brain");
                return (
                  <TableRow key={atelier.id}>
                    <TableCell>
                      <div className="h-10 w-10 rounded-lg bg-sage-100 flex items-center justify-center">
                        <IconComp className="h-5 w-5 text-primary" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{atelier.titre}</TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">
                        {atelier.categorie}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {atelier.format || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {atelier.public_cible || "-"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={atelier.actif}
                        onCheckedChange={() => toggleActif(atelier)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(atelier)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(atelier.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {(!ateliers || ateliers.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucun atelier enregistré. Cliquez sur "Ajouter un atelier" pour commencer.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
