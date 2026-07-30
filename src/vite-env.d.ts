/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string | undefined;
  readonly VITE_SUPABASE_ANON_KEY: string | undefined;
  readonly VITE_SUPABASE_TABLE: string | undefined;
  readonly VITE_SUPABASE_AUTH_EMAIL: string | undefined;
  readonly VITE_SUPABASE_AUTH_PASSWORD: string | undefined;
  readonly NEXT_PUBLIC_SUPABASE_URL: string | undefined;
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string | undefined;
  readonly NEXT_PUBLIC_SUPABASE_TABLE: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
