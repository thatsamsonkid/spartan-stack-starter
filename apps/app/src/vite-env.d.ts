/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_DATABASE_REF: string;
	readonly VITE_DATABASE_PUB_KEY: string;
	readonly VITE_GOOGLE_AUTH_CLIENT_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
