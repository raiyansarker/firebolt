<script>
	import { page } from "$app/stores";
	import Pageshell from "$lib/components/ui/page/pageshell.svelte";
	import { cn } from "$lib/utils";
	import { onNavigate } from "$app/navigation";

	onNavigate((navigation) => {
		// @ts-expect-error
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// @ts-expect-error
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const menuItems = [
		{
			name: "My Details",
			href: "/app/settings"
		},
		{
			name: "Profile",
			href: "/app/settings/profile"
		},
		{
			name: "Plan",
			href: "/app/settings/plan"
		},
		{
			name: "Billing",
			href: "/app/settings/billing"
		},
		{
			name: "Notifications",
			href: "/app/settings/notifications"
		},
		{
			name: "API",
			href: "/app/settings/api"
		}
	];
</script>

<div class="border-b pt-4 transition-all lg:pt-8">
	<div
		class="mx-auto w-[calc(100vw_-_8%)] space-y-0.5 md:w-[calc(100vw_-_10%)] md:space-y-1 lg:space-y-4"
	>
		<h2 class="text-xl font-semibold md:text-2xl lg:text-3xl">Settings</h2>
		<ul class="flex flex-row items-center gap-x-4 overflow-x-auto">
			{#each menuItems as item (item.href)}
				<li
					class="relative mt-3 pb-1"
					aria-current={$page.url.pathname === item.href ? "page" : undefined}
				>
					<a
						class={cn(
							"text-xs text-foreground/80 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none",
							{
								"!text-foreground": $page.url.pathname === item.href
							}
						)}
						href={item.href}
					>
						{item.name}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<Pageshell>
	<slot />
</Pageshell>

<style lang="postcss">
	li[aria-current="page"]::before {
		@apply absolute inset-x-0 bottom-0 h-px bg-primary content-[''] [view-transition-name:indicator];
	}

	::view-transition-old(indicator)::before,
	::view-transition-new(indicator)::before {
		height: 1px !important;
	}
</style>
