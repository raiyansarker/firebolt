<script lang="ts">
	import { env } from "$env/dynamic/public";
	import { buttonVariants } from "$lib/components/ui/button";
	import PageShell from "$lib/components/ui/page/pageshell.svelte";
	import { Separator } from "$lib/components/ui/separator";
	import PlusIcon from "~icons/lucide/plus";
	import DomainTable from "./table.svelte";

	export let data;
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
			data-sveltekit-preload-data="tap"
			class={buttonVariants({ variant: "outline", class: "gap-x-1 pl-2.5 text-sm" })}
			href="/app/domains/create"
		>
			<PlusIcon class="h-4 w-4" />
			Add Domain
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
			<DomainTable data={data.domains} />
		</div>
	</div>
</PageShell>
