import type {
  ContactFormErrors,
  ContactFormValues,
} from "@/hooks/use-contact-form";

export function validateContactForm(
  values: ContactFormValues,
): ContactFormErrors {
  return {
    firstName:
      values.firstName.trim().length === 0
        ? "Le prénom est obligatoire"
        : undefined,
    lastName:
      values.lastName.trim().length === 0
        ? "Le nom est obligatoire"
        : undefined,
    email: isOptionalEmail(values.email) ? undefined : "Email invalide",
    linkedinUrl: isOptionalHttpUrl(values.linkedinUrl)
      ? undefined
      : "URL LinkedIn invalide",
  };
}

export function hasContactFieldErrors(errors: ContactFormErrors): boolean {
  return (
    errors.firstName !== undefined ||
    errors.lastName !== undefined ||
    errors.email !== undefined ||
    errors.linkedinUrl !== undefined
  );
}

function isOptionalEmail(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return true;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function isOptionalHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return true;
  }
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
