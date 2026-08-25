"use client";

import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

type ContactFormFieldProps = {
  readonly id: string;
  readonly label: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly children: ReactNode;
};

export function ContactFormField({
  id,
  label,
  error,
  required = false,
  children,
}: ContactFormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error !== undefined ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
