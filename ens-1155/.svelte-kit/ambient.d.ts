
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const TERM_SESSION_ID: string;
	export const GJS_DEBUG_TOPICS: string;
	export const LESSOPEN: string;
	export const npm_package_dev: string;
	export const LANGUAGE: string;
	export const SNAP_INSTANCE_KEY: string;
	export const USER: string;
	export const SNAP_COMMON: string;
	export const npm_config_user_agent: string;
	export const XDG_SESSION_TYPE: string;
	export const npm_node_execpath: string;
	export const npm_package_resolved: string;
	export const SNAP_UID: string;
	export const SHLVL: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const SNAP_LIBRARY_PATH: string;
	export const OLDPWD: string;
	export const npm_package_optional: string;
	export const DESKTOP_SESSION: string;
	export const SNAP_USER_DATA: string;
	export const NVM_BIN: string;
	export const npm_package_json: string;
	export const NVM_INC: string;
	export const TERMINAL_EMULATOR: string;
	export const rvm_stored_umask: string;
	export const GIO_LAUNCHED_DESKTOP_FILE: string;
	export const npm_package_engines_node: string;
	export const GNOME_SHELL_SESSION_MODE: string;
	export const GTK_MODULES: string;
	export const rvm_user_install_flag: string;
	export const MANAGERPID: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const npm_package_integrity: string;
	export const SYSTEMD_EXEC_PID: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const SNAP_REVISION: string;
	export const GIO_LAUNCHED_DESKTOP_FILE_PID: string;
	export const COLOR: string;
	export const NVM_DIR: string;
	export const npm_config_metrics_registry: string;
	export const IM_CONFIG_PHASE: string;
	export const WAYLAND_DISPLAY: string;
	export const LOGNAME: string;
	export const SNAP_CONTEXT: string;
	export const rvm_bin_path: string;
	export const JOURNAL_STREAM: string;
	export const _: string;
	export const npm_config_prefix: string;
	export const XDG_SESSION_CLASS: string;
	export const SNAP_VERSION: string;
	export const USERNAME: string;
	export const TERM: string;
	export const npm_config_cache: string;
	export const GNOME_DESKTOP_SESSION_ID: string;
	export const SNAP_INSTANCE_NAME: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const SESSION_MANAGER: string;
	export const INVOCATION_ID: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const XDG_MENU_PREFIX: string;
	export const BAMF_DESKTOP_FILE_HINT: string;
	export const GNOME_SETUP_DISPLAY: string;
	export const SNAP_DATA: string;
	export const XDG_RUNTIME_DIR: string;
	export const DISPLAY: string;
	export const DESKTOP_STARTUP_ID: string;
	export const LANG: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const XMODIFIERS: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XAUTHORITY: string;
	export const LS_COLORS: string;
	export const npm_lifecycle_script: string;
	export const SSH_AGENT_LAUNCHER: string;
	export const SNAP_USER_COMMON: string;
	export const SSH_AUTH_SOCK: string;
	export const SNAP_ARCH: string;
	export const SNAP_COOKIE: string;
	export const SHELL: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const QT_ACCESSIBILITY: string;
	export const rvm_prefix: string;
	export const SNAP_REEXEC: string;
	export const rvm_loaded_flag: string;
	export const GDMSESSION: string;
	export const LESSCLOSE: string;
	export const SNAP_NAME: string;
	export const npm_package_dev_optional: string;
	export const rvm_version: string;
	export const GJS_DEBUG_OUTPUT: string;
	export const QT_IM_MODULE: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const npm_package_peer: string;
	export const PWD: string;
	export const npm_execpath: string;
	export const XDG_CONFIG_DIRS: string;
	export const SNAP_REAL_HOME: string;
	export const NVM_CD_FLAGS: string;
	export const XDG_DATA_DIRS: string;
	export const npm_config_global_prefix: string;
	export const SNAP_EUID: string;
	export const SNAP: string;
	export const npm_command: string;
	export const PNPM_HOME: string;
	export const rvm_path: string;
	export const INIT_CWD: string;
	export const EDITOR: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		TERM_SESSION_ID: string;
		GJS_DEBUG_TOPICS: string;
		LESSOPEN: string;
		npm_package_dev: string;
		LANGUAGE: string;
		SNAP_INSTANCE_KEY: string;
		USER: string;
		SNAP_COMMON: string;
		npm_config_user_agent: string;
		XDG_SESSION_TYPE: string;
		npm_node_execpath: string;
		npm_package_resolved: string;
		SNAP_UID: string;
		SHLVL: string;
		npm_config_noproxy: string;
		HOME: string;
		SNAP_LIBRARY_PATH: string;
		OLDPWD: string;
		npm_package_optional: string;
		DESKTOP_SESSION: string;
		SNAP_USER_DATA: string;
		NVM_BIN: string;
		npm_package_json: string;
		NVM_INC: string;
		TERMINAL_EMULATOR: string;
		rvm_stored_umask: string;
		GIO_LAUNCHED_DESKTOP_FILE: string;
		npm_package_engines_node: string;
		GNOME_SHELL_SESSION_MODE: string;
		GTK_MODULES: string;
		rvm_user_install_flag: string;
		MANAGERPID: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		npm_package_integrity: string;
		SYSTEMD_EXEC_PID: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		SNAP_REVISION: string;
		GIO_LAUNCHED_DESKTOP_FILE_PID: string;
		COLOR: string;
		NVM_DIR: string;
		npm_config_metrics_registry: string;
		IM_CONFIG_PHASE: string;
		WAYLAND_DISPLAY: string;
		LOGNAME: string;
		SNAP_CONTEXT: string;
		rvm_bin_path: string;
		JOURNAL_STREAM: string;
		_: string;
		npm_config_prefix: string;
		XDG_SESSION_CLASS: string;
		SNAP_VERSION: string;
		USERNAME: string;
		TERM: string;
		npm_config_cache: string;
		GNOME_DESKTOP_SESSION_ID: string;
		SNAP_INSTANCE_NAME: string;
		npm_config_node_gyp: string;
		PATH: string;
		SESSION_MANAGER: string;
		INVOCATION_ID: string;
		NODE: string;
		npm_package_name: string;
		XDG_MENU_PREFIX: string;
		BAMF_DESKTOP_FILE_HINT: string;
		GNOME_SETUP_DISPLAY: string;
		SNAP_DATA: string;
		XDG_RUNTIME_DIR: string;
		DISPLAY: string;
		DESKTOP_STARTUP_ID: string;
		LANG: string;
		XDG_CURRENT_DESKTOP: string;
		XMODIFIERS: string;
		XDG_SESSION_DESKTOP: string;
		XAUTHORITY: string;
		LS_COLORS: string;
		npm_lifecycle_script: string;
		SSH_AGENT_LAUNCHER: string;
		SNAP_USER_COMMON: string;
		SSH_AUTH_SOCK: string;
		SNAP_ARCH: string;
		SNAP_COOKIE: string;
		SHELL: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		QT_ACCESSIBILITY: string;
		rvm_prefix: string;
		SNAP_REEXEC: string;
		rvm_loaded_flag: string;
		GDMSESSION: string;
		LESSCLOSE: string;
		SNAP_NAME: string;
		npm_package_dev_optional: string;
		rvm_version: string;
		GJS_DEBUG_OUTPUT: string;
		QT_IM_MODULE: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		npm_package_peer: string;
		PWD: string;
		npm_execpath: string;
		XDG_CONFIG_DIRS: string;
		SNAP_REAL_HOME: string;
		NVM_CD_FLAGS: string;
		XDG_DATA_DIRS: string;
		npm_config_global_prefix: string;
		SNAP_EUID: string;
		SNAP: string;
		npm_command: string;
		PNPM_HOME: string;
		rvm_path: string;
		INIT_CWD: string;
		EDITOR: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
