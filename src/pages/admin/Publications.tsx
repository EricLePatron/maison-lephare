import { useState } from "react";
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
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import {
  useAllPublications,
  useCreatePublication,
  useUpdatePublication,
  useDeletePublication,
  type Publication,
  type PublicationInsert,
  type PublicationType,
} from "@/hooks/usePublications";
import { useFeatureFlags, useUpdateFeatureFlag } from "@/hooks/useFeatureFlags";

const CATEGORIES = ["LIEU", "ÉVÉNEMENT", "PARTENARIAT", "ÉQUIPE", "AUTRE"];

type FormData = Omit<PublicationInsert, "id" | "created_at">;

const emptyForm: FormData = {
  type: "linkedin",
  auteur: "",
  extrait: "",
  url_linkedin: "",
  image_url: "",
  categorie: "",
  date_publication: new Date().toISOString().split("T")[0],
  featured: false,
  actif: true,
};

export default function AdminPublications() {
  const { data: publications, isLoading } = useAllPublications();
  const { data: flags } = useFeatureFlags();
  const createPublication = useCreatePublication();
  const updatePublication = useUpdatePublication();
  const deletePublication = useDeletePublication();
  const updateFlag = useUpdateFeatureFlag();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const flagHeader = flags?.find((f) => f.key === "actualites_header")?.enabled ?? false;
  const flagHome = flags?.find((f) => f.key === "actualites_home")?.enabled ?? false;

  const handleFlagToggle = async (key: string, enabled: boolean) => {
    try {
      await updateFlag.mutateAsync({ key, enabled });
      toast({ title: enabled ? "Activé" : "Désactivé" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de modifier ce paramètre.", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setIsDialogOpen(true); };

  const openEdit = (pub: Publication) => {
    setEditing(pub);
    setFormData({
      type: pub.type,
      auteur: pub.auteur,
      extrait: pub.extrait,
      url_linkedin: pub.url_linkedin ?? "",
      image_url: pub.image_url ?? "",
      categorie: pub.categorie ?? "",
      date_publication: pub.date_publication,
      featured: pub.featured,
      actif: pub.actif,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      url_linkedin: formData.url_linkedin || null,
      image_url: formData.image_url || null,
      categorie: formData.categorie || null,
    };
    try {
      if (editing) {
        await updatePublication.mutateAsync({ id: editing.id, ...payload });
        toast({ title: "Publication modifiée" });
      } else {
        await createPublication.mutateAsync(payload);
        toast({ title: "Publication créée" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: "Erreur", description: "Impossible d'enregistrer.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette publication ?")) return;
    try {
      await deletePublication.mutateAsync(id);
      toast({ title: "Publication supprimée" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer.", variant: "destructive" });
    }
  };

  const toggleActif = async (pub: Publication) => {
    try {
      await updatePublication.mutateAsync({ id: pub.id, actif: !pub.actif });
      toast({ title: pub.actif ? "Désactivée" : "Activée" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const activeCount = publications?.filter((p) => p.actif).length ?? 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-medium text-foreground">Publications</h1>
          <p className="text-sm text-muted-foreground">{publications?.length ?? 0} publication(s) · {activeCount} active(s)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier la publication" : "Nouvelle publication"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v as PublicationType })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">Post LinkedIn</SelectItem>
                    <SelectItem value="actualite">Actualité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auteur">Auteur *</Label>
                <Input
                  id="auteur"
                  value={formData.auteur}
                  onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                  placeholder={formData.type === "linkedin" ? "ex : Maison lePhare" : "ex : L'équipe lePhare"}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="extrait">
                  {formData.type === "linkedin" ? "Extrait du post (2-3 phrases)" : "Texte de l'actualité"} *
                </Label>
                <Textarea
                  id="extrait"
                  value={formData.extrait}
                  onChange={(e) => setFormData({ ...formData, extrait: e.target.value })}
                  rows={4}
                  placeholder={
                    formData.type === "linkedin"
                      ? "Copiez-collez les premières phrases du post LinkedIn…"
                      : "Rédigez votre actualité ici…"
                  }
                  required
                />
              </div>

              {formData.type === "linkedin" && (
                <div className="space-y-2">
                  <Label htmlFor="url_linkedin">URL du post LinkedIn</Label>
                  <Input
                    id="url_linkedin"
                    type="url"
                    value={formData.url_linkedin ?? ""}
                    onChange={(e) => setFormData({ ...formData, url_linkedin: e.target.value })}
                    placeholder="https://www.linkedin.com/posts/…"
                  />
                  <p className="text-xs text-muted-foreground">Apparaît en lien "Lire sur LinkedIn →"</p>
                </div>
              )}

              {formData.type === "actualite" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="categorie">Catégorie</Label>
                    <Select
                      value={formData.categorie ?? ""}
                      onValueChange={(v) => setFormData({ ...formData, categorie: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL de l'image (optionnel)</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url ?? ""}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://…"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="date_publication">Date de publication *</Label>
                <Input
                  id="date_publication"
                  type="date"
                  value={formData.date_publication}
                  onChange={(e) => setFormData({ ...formData, date_publication: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(v) => setFormData({ ...formData, featured: v })}
                />
                <Label htmlFor="featured">Mettre en avant (bannière pleine largeur)</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="actif"
                  checked={formData.actif}
                  onCheckedChange={(v) => setFormData({ ...formData, actif: v })}
                />
                <Label htmlFor="actif">Visible sur le site</Label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={createPublication.isPending || updatePublication.isPending}>
                  {(createPublication.isPending || updatePublication.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editing ? "Enregistrer" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Visibilité de la page Actualités</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 flex-1 rounded-md border p-3">
            <Switch
              id="flag-header"
              checked={flagHeader}
              onCheckedChange={(v) => handleFlagToggle("actualites_header", v)}
              disabled={updateFlag.isPending}
            />
            <div>
              <Label htmlFor="flag-header" className="font-medium cursor-pointer">Afficher dans le header</Label>
              <p className="text-xs text-muted-foreground">Lien "Actualités" dans la navigation principale</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-1 rounded-md border p-3">
            <Switch
              id="flag-home"
              checked={flagHome}
              onCheckedChange={(v) => handleFlagToggle("actualites_home", v)}
              disabled={updateFlag.isPending}
            />
            <div>
              <Label htmlFor="flag-home" className="font-medium cursor-pointer">Afficher sur la home</Label>
              <p className="text-xs text-muted-foreground">Bloc aperçu sur la page d'accueil</p>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Ces options n'ont aucun effet si aucun atelier à venir ni aucune publication active n'est présent.</span>
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Extrait</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-20">En avant</TableHead>
                <TableHead className="w-20">Actif</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publications?.map((pub) => (
                <TableRow key={pub.id}>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      pub.type === "linkedin" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {pub.type === "linkedin" ? "LinkedIn" : "Actualité"}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{pub.auteur}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">
                    <span className="line-clamp-2">{pub.extrait}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(pub.date_publication).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={pub.featured}
                      onCheckedChange={() => updatePublication.mutate({ id: pub.id, featured: !pub.featured })}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch checked={pub.actif} onCheckedChange={() => toggleActif(pub)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(pub)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(pub.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!publications || publications.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Aucune publication. Cliquez sur "Ajouter" pour commencer.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
