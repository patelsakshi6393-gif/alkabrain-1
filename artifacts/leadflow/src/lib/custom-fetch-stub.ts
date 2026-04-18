export function setBaseUrl(url: string | null) {}
export function setAuthTokenGetter(getter: any) {}
export type AuthTokenGetter = () => Promise<string | null> | string | null;
export type ErrorType<T = unknown> = unknown;
export type BodyType<T> = T;
