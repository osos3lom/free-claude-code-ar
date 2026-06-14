import axios from "axios";

const api = axios.create({
  baseURL: "/api/admin",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

export interface ConfigField {
  key: string;
  label: string;
  section: string;
  type: "text" | "secret" | "number" | "boolean" | "tri_boolean" | "select" | "textarea";
  value: string;
  configured: boolean;
  source: string;
  locked: boolean;
  secret: boolean;
  advanced: boolean;
  restart_required: boolean;
  session_sensitive: boolean;
  options: string[];
  description: string;
}

export interface ConfigSection {
  id: string;
  label: string;
  description: string;
  advanced: boolean;
}

export interface ProviderStatus {
  provider_id: string;
  kind: "remote" | "local";
  status: string;
  label: string;
  credential_env?: string;
  base_url?: string;
}

export interface ConfigResponse {
  sections: ConfigSection[];
  fields: ConfigField[];
  paths: { managed: string | null; repo: string | null; explicit: string | null };
  provider_status: ProviderStatus[];
}

export interface AdminStatus {
  status: string;
  host: string;
  port: number;
  model: string;
  provider: string;
  pending_fields: string[];
  provider_status: ProviderStatus[];
  cached_models: Record<string, string[]>;
}

export interface ValidateResponse {
  valid: boolean;
  errors: string[];
  env_preview: string;
}

export interface ApplyResponse extends ValidateResponse {
  applied: boolean;
  path?: string;
  pending_fields: string[];
  restart: {
    required: boolean;
    automatic: boolean;
    admin_url: string | null;
    fields: string[];
  };
}

export interface LocalProviderCheck {
  provider_id: string;
  status: string;
  label: string;
  base_url: string;
  status_code?: number;
  error_type?: string;
}

export const adminApi = {
  getConfig: () => api.get<ConfigResponse>("/config").then((r) => r.data),

  validate: (values: Record<string, string>) =>
    api.post<ValidateResponse>("/config/validate", { values }).then((r) => r.data),

  apply: (values: Record<string, string>) =>
    api.post<ApplyResponse>("/config/apply", { values }).then((r) => r.data),

  getStatus: () => api.get<AdminStatus>("/status").then((r) => r.data),

  getLocalStatus: () =>
    api
      .get<{ providers: LocalProviderCheck[] }>("/providers/local-status")
      .then((r) => r.data),

  testProvider: (providerId: string) =>
    api
      .post<{ provider_id: string; ok: boolean; models?: string[]; error_type?: string }>(
        `/providers/${providerId}/test`,
      )
      .then((r) => r.data),

  refreshModels: () =>
    api
      .post<{ cached_models: Record<string, string[]> }>("/models/refresh")
      .then((r) => r.data),
};
