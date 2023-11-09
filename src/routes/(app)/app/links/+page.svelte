<script lang="ts">
	import { env } from "$env/dynamic/public";
	import { buttonVariants } from "$lib/components/ui/button";
	import PageShell from "$lib/components/ui/page/pageshell.svelte";
	import { Separator } from "$lib/components/ui/separator";
	import PlusIcon from "~icons/lucide/plus";
</script>

<PageShell>
	<div class="flex w-full flex-row items-start justify-between gap-x-2">
		<div>
			<h2 class="text-xl font-bold md:text-2xl">Manage Your Links</h2>
			<p class="text-sm leading-relaxed text-muted-foreground">
				Links are scoped to their domain, so you can have the same short link on multiple domains.
			</p>
		</div>
		<a
			class={buttonVariants({ variant: "outline", class: "gap-x-2 px-4 text-sm" })}
			href="/app/links/create"
		>
			<PlusIcon class="h-5 w-5" />
			Add Link
		</a>
	</div>
	<Separator class="my-3 lg:my-6" />
	<div class="flex flex-col items-start justify-between gap-6 md:flex-row">
		<div class="w-full md:sticky md:top-16 md:w-1/3">
			<!-- Placeholder for search queryies -->
			<h3 class="text-sm font-medium">Domains</h3>
			<p class="text-xs leading-relaxed text-muted-foreground">
				Manage your domain and configure it to connect with {env.PUBLIC_APP_NAME}
			</p>
		</div>
		<div class="w-full">
			<h1>Hello</h1>
		</div>
	</div>
</PageShell>
