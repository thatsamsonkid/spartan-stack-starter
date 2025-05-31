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
			noExternal: [
				'@spartan-ng/**',
				'@angular/cdk/**',
				'@ng-icons/**',
				'ngx-scrollbar/**',
				'ng-signal-forms/**',
				'@analogjs/trpc',
				'@trpc/server',
			],
		},

		build: {
			outDir: '../../dist/./app/client',
			reportCompressedSize: true,
			commonjsOptions: { transformMixedEsModules: true },
			target: ['es2020'],
		},
		optimizeDeps: {
			include: [
				'@supabase/supabase-js',
				'@spartan-ng/brain',
				'class-variance-authority',
				'ngx-sonner',
				'@angular/core',
				'@angular/common',
				'@angular/platform-browser',
				'@angular/platform-browser-dynamic',
				'@angular/forms',
				'@angular/router',
			],
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
