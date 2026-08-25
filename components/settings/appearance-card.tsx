"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const THEME_OPTIONS = [
  { value: "light", label: "Clair", icon: SunIcon },
  { value: "dark", label: "Sombre", icon: MoonIcon },
  { value: "system", label: "Système", icon: MonitorIcon },
] as const;

export function AppearanceCard() {
  const { theme, setTheme } = useTheme();
  const current = theme ?? "system";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apparence</CardTitle>
        <CardDescription>
          Thème de l&apos;interface (clair, sombre ou système).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          role="group"
          aria-label="Choix du thème"
          className="flex flex-wrap gap-2"
        >
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const selected = current === option.value;
            return (
              <Button
                key={option.value}
                type="button"
                variant={selected ? "default" : "outline"}
                size="sm"
                aria-pressed={selected}
                onClick={() => {
                  setTheme(option.value);
                }}
              >
                <Icon data-icon="inline-start" />
                {option.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
