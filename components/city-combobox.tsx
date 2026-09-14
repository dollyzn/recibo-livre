"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { loadBrazilianCities, type BrazilianCity } from "@/lib/cities";

const MAX_VISIBLE_CITIES = 80;

type CityComboboxProps = {
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export function CityCombobox({
  id,
  value,
  error,
  onChange,
}: CityComboboxProps) {
  const [cities, setCities] = useState<BrazilianCity[]>(
    value ? [{ label: value, value }] : [],
  );
  const [query, setQuery] = useState(value);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    loadBrazilianCities()
      .then((items) => {
        if (cancelled) return;
        setCities(items);
        setStatus("idle");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    const source =
      value && !cities.some((city) => city.value === value)
        ? [{ label: value, value }, ...cities]
        : cities;
    const q = query.trim().toLowerCase();
    const matches = q
      ? source.filter((city) => city.label.toLowerCase().includes(q))
      : source;
    return matches.slice(0, MAX_VISIBLE_CITIES);
  }, [cities, query, value]);

  const selected = items.find((city) => city.value === value) ?? null;

  return (
    <Field data-invalid={Boolean(error) || undefined}>
      <FieldLabel htmlFor={id}>Cidade / UF</FieldLabel>
      <Combobox
        items={items}
        value={selected}
        autoHighlight
        isItemEqualToValue={(left, right) => left.value === right.value}
        itemToStringValue={(city) => city.label}
        onValueChange={(city) => onChange(city?.value ?? "")}
        onInputValueChange={(next) => setQuery(next)}
      >
        <ComboboxInput
          id={id}
          className="w-full"
          placeholder="Busque a cidade"
          aria-invalid={Boolean(error) || undefined}
          disabled={status === "loading"}
          onBlur={(event) => {
            const typed = event.currentTarget.value.trim();
            if (typed && typed !== value) onChange(typed);
          }}
        />
        <ComboboxContent>
          <ComboboxEmpty>
            {status === "error"
              ? "Não foi possível carregar as cidades. Digite manualmente."
              : "Nenhuma cidade encontrada."}
          </ComboboxEmpty>
          <ComboboxList>
            {(city: BrazilianCity) => (
              <ComboboxItem key={city.value} value={city}>
                {city.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
