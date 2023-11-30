import App from './App.svelte'

const app = new App({
	target: document.body,
})

declare global {
    interface Window {
        web3: unknown;
        // ethereum: unknown;
        // negotiator?: {
        //     Client: unknown,
        //     Outlet: unknown
        // };
        // devconTokenConfig: unknown;
    }
}

export default app
