<script>
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';

	const menuItems = [
		{
			name: 'My Details',
			href: '/app/settings'
		},
		{
			name: 'Profile',
			href: '/app/settings/profile'
		},
		{
			name: 'Plan',
			href: '/app/settings/plan'
		},
		{
			name: 'Billing',
			href: '/app/settings/billing'
		},
		{
			name: 'Notifications',
			href: '/app/settings/notifications'
		},
		{
			name: 'API',
			href: '/app/settings/api'
		}
	];
</script>

<div class="px-4 md:px-8 lg:px-14 bg-highlight w-full text-background/90 pt-8 space-y-4">
	<h2 class="text-3xl font-semibold">Settings</h2>
	<nav class="flex flex-row gap-x-4 items-center">
		{#each menuItems as item}
			<a
				class={cn(
					'text-xs text-background/60 relative py-3 hover:text-background/90 focus-visible:text-background/90 focus-visible:outline-none',
					{
						'!text-background/90': $page.url.pathname === item.href
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

<div class="px-4 md:px-8 lg:px-14 my-12">
	<slot />
</div>
