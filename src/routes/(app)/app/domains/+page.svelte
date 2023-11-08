<script>
	import { env } from "$env/dynamic/public";
	import { Button } from "$lib/components/ui/button";
	import DomainTable from "./table.svelte";
	import { Separator } from "$lib/components/ui/separator";
	import PlusIcon from "~icons/lucide/plus";
	import PageShell from "$lib/components/ui/page/pageshell.svelte";
</script>

<PageShell>
	<div class="flex w-full flex-row items-start justify-between">
		<div>
			<h2 class="text-xl font-bold md:text-2xl">Domain Management</h2>
			<p class="text-sm leading-relaxed text-muted-foreground">
				Manage your domain and configure it to connect with {env.PUBLIC_APP_NAME}
			</p>
		</div>
		<Button variant="outline" class="gap-x-2 px-4 text-sm">
			<PlusIcon class="h-5 w-5" />
			Add domain
		</Button>
	</div>
	<Separator class="my-3 lg:my-6" />
	<div class="flex flex-col items-start justify-between gap-6 md:flex-row">
		<div class="w-full md:w-1/3">
			<h3 class="text-sm font-medium">Domains</h3>
			<p class="text-xs leading-relaxed text-muted-foreground">
				Manage your domain and configure it to connect with {env.PUBLIC_APP_NAME}
			</p>
		</div>
		<DomainTable />
	</div>
</PageShell>
