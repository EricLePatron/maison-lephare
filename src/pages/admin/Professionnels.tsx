import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useAllProfessionnels,
  useCreateProfessionnel,
  useUpdateProfessionnel,
  useDeleteProfessionnel,
  type Professionnel,
  type ProfessionnelInsert,
} from "@/hooks/useProfessionnels";

const emptyForm: ProfessionnelInsert = {
  nom: "",
  prenom: "",
  profession: "",
  specialites: [],
  description: "",
  approche: "",
  public_cible: "",
  jours_presence: "",
  contact: "",
  site_web: "",
  photo_url: "",
  actif: true,
  ordre_affichage: 0,
};

export default function AdminProfessionnels() {
  const { toast } = useToast();
  const { data: professionnels, isLoading } = useAllProfessionnels();
  const createMutation = useCreateProfessionnel();
  const updateMutation = useUpdateProfessionnel();
  const deleteMutation = useDeleteProfessionnel();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfessionnelInsert>(emptyForm);
  const [specialitesInput, setSpecialitesInput] = useState("");

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setSpecialitesInput("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (pro: Professionnel) => {
    setEditingId(pro.id);
    setFormData({
      nom: pro.nom,
      prenom: pro.prenom,
      profession: pro.profession,
      specialites: pro.specialites || [],
      description: pro.description || "",
      approche: pro.approche || "",
      public_cible: pro.public_cible || "",
      jours_presence: pro.jours_presence || "",
      contact: pro.contact || "",
      site_web: pro.site_web || "",
      photo_url: pro.photo_url || "",
      actif: pro.actif,
      ordre_affichage: pro.ordre_affichage || 0,
    });
    setSpecialitesInput(pro.specialites?.join(", ") || "");
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const specialites = specialitesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const data = { ...formData, specialites };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...data });
        toast({ title: "Professionnel modifié avec succès" });
      } else {
        await createMutation.mutateAsync(data);
        toast({ title: "Professionnel créé avec succès" });
      }
      setIsFormOpen(false);
    } catch (error) {
      toast({ 
        title: "Erreur", 
        description: "Une erreur est survenue",
        variant: "destructive" 
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteMutation.mutateAsync(deletingId);
      toast({ title: "Professionnel supprimé" });
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (error) {
      toast({ 
        title: "Erreur", 
        description: "Impossible de supprimer ce professionnel",
        variant: "destructive" 
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container-wide py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au site
            </Link>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h1 className="font-serif text-xl font-medium">Administration - Professionnels</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/ateliers">Gérer les ateliers</Link>
            </Button>
            <Button onClick={handleOpenCreate} variant="hero">
              <Plus className="h-4 w-4" />
              Ajouter un professionnel
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-wide py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : professionnels && professionnels.length > 0 ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                    Nom
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                    Profession
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">
                    Jours
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">
                    Actif
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {professionnels.map((pro) => (
                  <tr key={pro.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                          {pro.photo_url ? (
                            <img
                              src={pro.photo_url}
                              alt={`${pro.prenom} ${pro.nom}`}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="font-serif text-sm text-primary font-semibold">
                              {pro.prenom[0]}{pro.nom[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {pro.prenom} {pro.nom}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {pro.profession}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                      {pro.jours_presence}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {pro.actif ? (
                        <Eye className="h-4 w-4 text-primary mx-auto" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(pro)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(pro.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-border">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Aucun professionnel enregistré
            </p>
            <Button onClick={handleOpenCreate} variant="hero">
              <Plus className="h-4 w-4" />
              Ajouter le premier professionnel
            </Button>
          </div>
        )}
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingId ? "Modifier le professionnel" : "Ajouter un professionnel"}
            </DialogTitle>
            <DialogDescription>
              Renseignez les informations du professionnel.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Profession *</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Ex: Psychiatre, Psychologue, Art-thérapeute..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialites">Spécialités</Label>
              <Input
                id="specialites"
                value={specialitesInput}
                onChange={(e) => setSpecialitesInput(e.target.value)}
                placeholder="Séparées par des virgules (ex: Anxiété, Dépression, Trauma)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Présentez brièvement le professionnel..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="approche">Approche thérapeutique</Label>
                <Input
                  id="approche"
                  name="approche"
                  value={formData.approche || ""}
                  onChange={handleChange}
                  placeholder="Ex: TCC, Psychanalyse..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="public_cible">Public accueilli</Label>
                <Input
                  id="public_cible"
                  name="public_cible"
                  value={formData.public_cible || ""}
                  onChange={handleChange}
                  placeholder="Ex: Adultes, Adolescents..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jours_presence">Jours de présence</Label>
              <Input
                id="jours_presence"
                name="jours_presence"
                value={formData.jours_presence || ""}
                onChange={handleChange}
                placeholder="Ex: Lundi, Mercredi, Vendredi"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact || ""}
                  onChange={handleChange}
                  placeholder="Email ou téléphone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_web">Site web</Label>
                <Input
                  id="site_web"
                  name="site_web"
                  value={formData.site_web || ""}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo_url">URL de la photo</Label>
              <Input
                id="photo_url"
                name="photo_url"
                value={formData.photo_url || ""}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ordre_affichage">Ordre d'affichage</Label>
                <Input
                  id="ordre_affichage"
                  name="ordre_affichage"
                  type="number"
                  value={formData.ordre_affichage || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ordre_affichage: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Visible sur le site</Label>
                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    checked={formData.actif ?? true}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, actif: checked }))
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.actif ? "Actif" : "Masqué"}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="hero"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {editingId ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce professionnel ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le professionnel sera définitivement supprimé de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
