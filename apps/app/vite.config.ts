/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		root: __dirname,
		publicDir: 'src/public',

		ssr: {
			noExternal: ['@analogjs/trpc', '@trpc/server'],
		},

		build: {
			outDir: '../../dist/./spar-tan-toe/client',
			reportCompressedSize: true,
			commonjsOptions: { transformMixedEsModules: true },
			target: ['es2022'],
		},
		optimizeDeps: {
			include: ['@supabase/supabase-js', '@spartan-ng/brain', 'class-variance-authority', 'ngx-sonner'],
		},
		resolve: {
			mainFields: ['browser', 'module'],
		},
		server: {
			fs: {
				allow: ['.', '../../libs/ui'],
			},
		},
		plugins: [analog({ ssr: true }), nxViteTsPaths(), splitVendorChunkPlugin()],
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: ['src/test-setup.ts'],
			include: ['**/*.spec.ts'],
			reporters: ['default'],
			cache: {
				dir: '../../node_modules/.vitest',
			},
		},
		define: {
			'import.meta.vitest': mode !== 'production',
		},
	};
});
