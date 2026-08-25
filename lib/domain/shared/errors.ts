export type DomainErrorCode =
  | "NOT_FOUND"
  | "VALIDATION"
  | "REPOSITORY"
  | "UNAUTHORIZED"
  | "CONFLICT";

export type DomainError = {
  readonly code: DomainErrorCode;
  readonly message: string;
  readonly cause?: unknown;
};

export function notFoundError(
  entity: string,
  id?: string,
  cause?: unknown,
): DomainError {
  const suffix = id ? ` (${id})` : "";
  return {
    code: "NOT_FOUND",
    message: `${entity} introuvable${suffix}`,
    cause,
  };
}

export function validationError(
  message: string,
  cause?: unknown,
): DomainError {
  return {
    code: "VALIDATION",
    message,
    cause,
  };
}

export function repositoryError(
  message: string,
  cause?: unknown,
): DomainError {
  return {
    code: "REPOSITORY",
    message,
    cause,
  };
}

export function conflictError(message: string, cause?: unknown): DomainError {
  return {
    code: "CONFLICT",
    message,
    cause,
  };
}

export function unauthorizedError(
  message: string = "Action non autorisée",
  cause?: unknown,
): DomainError {
  return {
    code: "UNAUTHORIZED",
    message,
    cause,
  };
}
