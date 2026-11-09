export interface AuthAccount {
  name: string;
  email: string;
  role: string | null;
}

const AUTH_STORAGE_KEY = "samudrava-account";
const AUTH_CHANGE_EVENT = "samudrava-auth-change";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function createAuthAccount(
  response: unknown,
  fallbackEmail: string,
): AuthAccount {
  const responseRecord = isRecord(response) ? response : {};
  const nestedData = isRecord(responseRecord.data) ? responseRecord.data : {};
  const userRecord = isRecord(responseRecord.user)
    ? responseRecord.user
    : isRecord(nestedData.user)
      ? nestedData.user
      : responseRecord;
  const roleValue = userRecord.role ?? responseRecord.role ?? nestedData.role;
  const roleRecord = isRecord(roleValue) ? roleValue : null;

  return {
    name:
      getString(userRecord.name) ??
      getString(userRecord.nama) ??
      fallbackEmail,
    email: getString(userRecord.email) ?? fallbackEmail,
    role:
      getString(roleValue) ??
      getString(roleRecord?.name) ??
      getString(roleRecord?.nama),
  };
}

export function getAuthAccount(): AuthAccount | null {
  const storedAccount = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedAccount) return null;

  try {
    const account: unknown = JSON.parse(storedAccount);
    if (
      isRecord(account) &&
      typeof account.name === "string" &&
      typeof account.email === "string" &&
      (typeof account.role === "string" || account.role === null)
    ) {
      return {
        name: account.name,
        email: account.email,
        role: account.role,
      };
    }
  } catch (error) {
    console.error("Data akun tersimpan tidak dapat dibaca.", error);
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  return null;
}

export function saveAuthAccount(account: AuthAccount): void {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAuthAccount(): void {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function subscribeToAuthChanges(onChange: () => void): () => void {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === AUTH_STORAGE_KEY) onChange();
  };

  window.addEventListener(AUTH_CHANGE_EVENT, onChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}
