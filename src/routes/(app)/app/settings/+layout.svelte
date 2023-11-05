<script>
	import { page } from "$app/stores";
	import { cn } from "$lib/utils";

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

<div class="bg-highlight pt-4 text-background/90 transition-all lg:pt-8">
	<div
		class="mx-auto w-[calc(100vw_-_8%)] space-y-0.5 md:w-[calc(100vw_-_15%)] md:space-y-1 lg:space-y-4"
	>
		<h2 class="text-xl font-semibold md:text-2xl lg:text-3xl">Settings</h2>
		<nav class="flex flex-row items-center gap-x-4 overflow-x-auto">
			{#each menuItems as item}
				<a
					class={cn(
						"relative py-3 text-xs text-background/60 hover:text-background/90 focus-visible:text-background/90 focus-visible:outline-none",
						{
							"!text-background/90": $page.url.pathname === item.href
						}
					)}
					href={item.href}
				>
					{item.name}
					{#if $page.url.pathname === item.href}
						<span class="absolute inset-0 bottom-0 border-b-2 border-b-background/90" />
					{/if}
				</a>
			{/each}
		</nav>
	</div>
</div>

<div class="mx-auto my-6 w-[calc(100vw_-_8%)] md:w-[calc(100vw_-_15%)] lg:my-12">
	<slot />
</div>
