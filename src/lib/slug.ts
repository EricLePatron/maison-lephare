export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function professionnelSlug(prenom: string, nom: string): string {
  return `${slugify(prenom)}-${slugify(nom)}`.replace(/^-+|-+$/g, "");
}