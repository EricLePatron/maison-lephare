import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, Loader2, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import {
  useSiteContent,
  useUpdateSiteContent,
  useCreateSiteContent,
  useDeleteSiteContent,
  SiteContent,
} from "@/hooks/useSiteContent";

const PAGE_LABELS: Record<string, string> = {
  global: "Site (header / footer)",
  home: "Accueil",
  "le-lieu": "Le Lieu",
  association: "L'Association",
  contact: "Contact",
};

const SECTION_LABELS: Record<string, string> = {
  nav: "Menu de navigation",
  footer: "Pied de page",
  hero: "En-tête (Hero)",
  features: "Caractéristiques",
  quote: "Citation",
  wishes: "Vous souhaitez…",
  spaces: "Espaces",
  cta: "Appel à l'action (CTA)",
  values: "Valeurs",
  philosophy: "Philosophie",
  timeline: "Historique",
  mission: "Mission",
  activities: "Activités",
  publics: "Publics",
};

export default function AdminContenu() {
  const { toast } = useToast();
  const { data: contents, isLoading } = useSiteContent();
  const updateMutation = useUpdateSiteContent();
  const createMutation = useCreateSiteContent();
  const deleteMutation = useDeleteSiteContent();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContent, setNewContent] = useState({
    page_key: "",
    section_key: "",
    content_key: "",
    content_value: "",
  });

  // Group contents by page and section
  const groupedContents = contents?.reduce(
    (acc, item) => {
      if (!acc[item.page_key]) {
        acc[item.page_key] = {};
      }
      if (!acc[item.page_key][item.section_key]) {
        acc[item.page_key][item.section_key] = [];
      }
      acc[item.page_key][item.section_key].push(item);
      return acc;
    },
    {} as Record<string, Record<string, SiteContent[]>>
  );

  // Filter contents based on search
  const filteredContents = searchQuery
    ? contents?.filter(
        (item) =>
          item.content_value.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.page_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.section_key.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const handleStartEdit = (item: SiteContent) => {
    setEditingId(item.id);
    setEditValue(item.content_value);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateMutation.mutateAsync({ id, content_value: editValue });
      setEditingId(null);
      toast({
        title: "Contenu mis à jour",
        description: "Le texte a été modifié avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le contenu.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleCreate = async () => {
    if (!newContent.page_key || !newContent.section_key || !newContent.content_key || !newContent.content_value) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMutation.mutateAsync(newContent);
      setIsAddDialogOpen(false);
      setNewContent({
        page_key: "",
        section_key: "",
        content_key: "",
        content_value: "",
      });
      toast({
        title: "Contenu créé",
        description: "Le nouveau texte a été ajouté.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le contenu.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contenu ?")) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Contenu supprimé",
        description: "Le texte a été supprimé.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contenu.",
        variant: "destructive",
      });
    }
  };

  const renderContentItem = (item: SiteContent) => {
    const isEditing = editingId === item.id;

    return (
      <div
        key={item.id}
        className="border rounded-lg p-4 bg-card hover:border-primary/50 transition-colors"
      >
        <div className="flex justify-between items-start mb-2">
          <Label className="text-xs text-muted-foreground font-mono">
            {item.content_key}
          </Label>
          <div className="flex gap-1">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={updateMutation.isPending}
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSaveEdit(item.id)}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStartEdit(item)}
                >
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        {isEditing ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="min-h-[100px]"
            autoFocus
          />
        ) : (
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {item.content_value}
          </p>
        )}
      </div>
    );
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h1 className="font-serif text-xl font-semibold">Gestion des textes</h1>
              </div>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un texte
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau texte</DialogTitle>
                  <DialogDescription>
                    Créez un nouveau contenu éditable pour le site.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Page</Label>
                    <Select
                      value={newContent.page_key}
                      onValueChange={(value) =>
                        setNewContent({ ...newContent, page_key: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une page" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PAGE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Input
                      value={newContent.section_key}
                      onChange={(e) =>
                        setNewContent({ ...newContent, section_key: e.target.value })
                      }
                      placeholder="ex: hero, features, cta..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Clé du contenu</Label>
                    <Input
                      value={newContent.content_key}
                      onChange={(e) =>
                        setNewContent({ ...newContent, content_key: e.target.value })
                      }
                      placeholder="ex: title, description..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Texte</Label>
                    <Textarea
                      value={newContent.content_value}
                      onChange={(e) =>
                        setNewContent({ ...newContent, content_value: e.target.value })
                      }
                      placeholder="Le contenu à afficher..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreate} disabled={createMutation.isPending}>
                    {createMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Créer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container-wide py-8">
        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les textes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {filteredContents && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">
                Résultats de recherche ({filteredContents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContents.map((item) => (
                  <div key={item.id}>
                    <p className="text-xs text-muted-foreground mb-1">
                      {PAGE_LABELS[item.page_key] || item.page_key} /{" "}
                      {SECTION_LABELS[item.section_key] || item.section_key}
                    </p>
                    {renderContentItem(item)}
                  </div>
                ))}
                {filteredContents.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun résultat trouvé
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grouped by Page */}
        {!searchQuery &&
          groupedContents &&
          Object.entries(groupedContents).map(([pageKey, sections]) => (
            <Card key={pageKey} className="mb-6">
              <CardHeader>
                <CardTitle>{PAGE_LABELS[pageKey] || pageKey}</CardTitle>
                <CardDescription>
                  Textes de la page {PAGE_LABELS[pageKey]?.toLowerCase() || pageKey}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {Object.entries(sections).map(([sectionKey, items]) => (
                    <AccordionItem key={sectionKey} value={sectionKey}>
                      <AccordionTrigger className="hover:no-underline">
                        <span className="font-medium">
                          {SECTION_LABELS[sectionKey] || sectionKey}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({items.length} texte{items.length > 1 ? "s" : ""})
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-4">
                          {items.map(renderContentItem)}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
      </main>
    </div>
  );
}
