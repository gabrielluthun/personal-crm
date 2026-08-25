"use client";

import { EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listTemplateVariablesInBody } from "@/lib/services/template-renderer";
import { templateVariableToken } from "@/lib/domain/template-variables";
import type { MessageTemplate } from "@/lib/domain/template";

type TemplateCardProps = {
  readonly template: MessageTemplate;
  readonly onPreview: (template: MessageTemplate) => void;
};

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
  const variables = listTemplateVariablesInBody(template.body);
  const preview = template.body.slice(0, 140);
  const truncated = template.body.length > 140;

  return (
    <Card size="sm" className="h-full">
      <CardHeader>
        <CardTitle>{template.title}</CardTitle>
        {template.description !== null ? (
          <CardDescription>{template.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {preview}
          {truncated ? "…" : ""}
        </p>
        {variables.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Variables :{" "}
            {variables.map((key) => templateVariableToken(key)).join(" · ")}
          </p>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            onPreview(template);
          }}
        >
          <EyeIcon data-icon="inline-start" />
          Aperçu
        </Button>
      </CardFooter>
    </Card>
  );
}
