<script lang="ts">
	import { env } from "$env/dynamic/public";
	import { buttonVariants } from "$lib/components/ui/button";
	import PageShell from "$lib/components/ui/page/pageshell.svelte";
	import { Separator } from "$lib/components/ui/separator";
	import PlusIcon from "~icons/lucide/plus";
	import DomainTable from "./table.svelte";

	import { api } from "$lib/axios";
	import { createQuery } from "@tanstack/svelte-query";
	import type { Domain } from "./types";

	const query = createQuery({
		queryKey: ["domains"],
		queryFn: () => api.get<Domain[]>("/domains/list"),
		refetchOnWindowFocus: true,
		retry: 3
	});
</script>

<PageShell>
	<div class="flex w-full flex-row items-start justify-between gap-x-2">
		<div>
			<h2 class="text-xl font-bold md:text-2xl">Domain Management</h2>
			<p class="text-sm leading-relaxed text-muted-foreground">
				Manage your domain and configure it to connect with {env.PUBLIC_APP_NAME}
			</p>
		</div>
		<a
			href="/app/domains/create"
			class={buttonVariants({ variant: "outline", class: "gap-x-2 px-4 text-sm" })}
		>
			<PlusIcon class="h-5 w-5" />
			Add domain
		</a>
	</div>
	<Separator class="my-3 lg:my-6" />
	<div class="flex flex-col items-start justify-between gap-6 md:flex-row">
		<div class="w-full md:w-1/3">
			<h3 class="text-sm font-medium">Domains</h3>
			<p class="text-xs leading-relaxed text-muted-foreground">
				Manage your domain and configure it to connect with {env.PUBLIC_APP_NAME}
			</p>
		</div>

		<div class="w-full">
			{#if $query.isLoading}
				<p>Loading...</p>
			{:else if $query.isError}
				<div class="h-[17.5rem] rounded border border-dotted border-red-500 bg-red-50 p-6">
					<p class="grid h-full place-items-center text-red-500">Error: {$query.error.message}</p>
				</div>
			{:else if $query.isSuccess}
				<DomainTable data={$query.data.data} />
			{/if}
		</div>
	</div>
</PageShell>
