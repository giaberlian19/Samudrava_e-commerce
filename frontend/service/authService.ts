export interface AuthAccount {
  name: string;
  email: string;
  role: string | null;
  token: string | null;
}

const AUTH_STORAGE_KEY = "samudrava-account";
const AUTH_CHANGE_EVENT = "samudrava-auth-change";
let cachedAuthStorage: string | null | undefined;
let cachedAuthAccount: AuthAccount | null = null;

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
    token: getString(responseRecord.token) ?? getString(nestedData.token),
  };
}

export function getAuthAccount(): AuthAccount | null {
  const storedAccount = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (storedAccount === cachedAuthStorage) {
    return cachedAuthAccount;
  }

  cachedAuthStorage = storedAccount;
  if (!storedAccount) {
    cachedAuthAccount = null;
    return cachedAuthAccount;
  }

  try {
    const account: unknown = JSON.parse(storedAccount);
    if (
      isRecord(account) &&
      typeof account.name === "string" &&
      typeof account.email === "string" &&
      (typeof account.role === "string" || account.role === null) &&
      (typeof account.token === "string" ||
        account.token === null ||
        account.token === undefined)
    ) {
      cachedAuthAccount = {
        name: account.name,
        email: account.email,
        role: account.role,
        token: typeof account.token === "string" ? account.token : null,
      };
      return cachedAuthAccount;
    }
  } catch (error) {
    console.error("Data akun tersimpan tidak dapat dibaca.", error);
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  cachedAuthStorage = null;
  cachedAuthAccount = null;
  return cachedAuthAccount;
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
