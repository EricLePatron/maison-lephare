import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface CategoryComboboxProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const normalize = (v: string) =>
  v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

export function CategoryCombobox({
  value,
  options,
  onChange,
  placeholder = "Sélectionner ou créer une catégorie",
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const sorted = useMemo(
    () => Array.from(new Set(options.map((o) => o.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, "fr")),
    [options]
  );

  const query = search.trim();
  const exists = sorted.some((o) => normalize(o) === normalize(query));

  const select = (v: string) => {
    onChange(v);
    setSearch("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value ? (
            <span className="flex items-center gap-1">
              <Badge variant="secondary" className="font-normal">
                {value}
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label="Retirer la catégorie"
                  className="ml-1 inline-flex opacity-60 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter>
          <CommandInput
            placeholder="Rechercher ou créer…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {sorted.length === 0 && !query && (
              <CommandEmpty>Aucune catégorie. Saisissez un nom pour en créer une.</CommandEmpty>
            )}
            {sorted.length > 0 && (
              <CommandGroup heading="Catégories existantes">
                {sorted.map((option) => (
                  <CommandItem key={option} value={option} onSelect={() => select(option)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        normalize(option) === normalize(value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {query && !exists && (
              <CommandGroup heading="Nouvelle catégorie">
                <CommandItem value={`__create__${query}`} onSelect={() => select(query)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer
                  <Badge variant="secondary" className="ml-2 font-normal">
                    {query}
                  </Badge>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
