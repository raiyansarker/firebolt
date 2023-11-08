<script lang="ts">
	import "../styles/tailwind.postcss";
	import { Toaster } from "svelte-sonner";
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
	import { dev } from "$app/environment";

	const queryClient = new QueryClient();
</script>

<Toaster closeButton position="bottom-right" />
<QueryClientProvider client={queryClient}>
	<slot />
	{#if dev}
		<SvelteQueryDevtools styleNonce="" buttonPosition="bottom-right" />
	{/if}
</QueryClientProvider>
