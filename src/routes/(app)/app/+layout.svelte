<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import * as Avatar from '$lib/components/ui/avatar';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getShortName } from '$lib/utils';
	import {
		BellIcon,
		HelpCircleIcon,
		LogOutIcon,
		PlusIcon,
		SearchIcon,
		SettingsIcon
	} from 'lucide-svelte';

	const menuItems = [
		{
			name: 'Home',
			href: '/'
		},
		{
			name: 'Dashboard',
			href: '/app'
		},
		{
			name: 'Links',
			href: '/app/links'
		},
		{
			name: 'Domains',
			href: '/app/domains'
		},
		{
			name: 'Activity',
			href: '/app/activity'
		},
		{
			name: 'Tickets',
			href: '/app/tickets'
		}
	];
</script>

<nav
	class="px-4 md:px-8 lg:px-14 flex w-full bg-highlight text-background/90 flex-row items-center justify-between py-2"
>
	<div class="flex flex-row items-center gap-x-2">
		<h1 class="text-xl font-bold tracking-wide pr-10">{env.PUBLIC_APP_NAME}</h1>
		{#each menuItems as item}
			<a
				class="hover:bg-secondary focus-visible:bg-secondary focus-visible:text-secondary-foreground outline-none focus-visible:ring-1 ring-ring px-2 py-1 rounded-sm transition-colors hover:text-secondary-foreground text-xs font-medium"
				class:mainmenu__nav_link_active={item.href === $page.url.pathname}
				href={item.href}
			>
				{item.name}
			</a>
		{/each}
	</div>
	<div class="flex flex-row items-center gap-x-2">
		<button class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'h-7 w-7 px-0' })}>
			<SearchIcon size="1rem" />
		</button>
		<a
			href="/app/settings"
			class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'h-7 w-7 px-0' })}
		>
			<SettingsIcon size="1rem" />
		</a>
		<button
			class={buttonVariants({
				variant: 'ghost',
				size: 'sm',
				class: 'h-7 w-7 px-0'
			})}
		>
			<BellIcon size="1rem" />
		</button>
		<DropdownMenu.Root
			positioning={{
				placement: 'bottom-start'
			}}
		>
			<DropdownMenu.Trigger
				class="outline-none focus-visible:ring-1 ring-ring ring-offset-2 ring-offset-slate-950 rounded-full"
			>
				<Avatar.Root class="w-7 h-7">
					<Avatar.Image src={$page.data.session?.user.image} alt="User Image" />
					<Avatar.Fallback
						>{getShortName($page.data.session?.user.name ?? 'Harry Potter')}</Avatar.Fallback
					>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="[&>*]:text-xs">
				<DropdownMenu.Label class="flex flex-col pr-8">
					<h2 class="text-foreground text-sm">{$page.data.session?.user.name}</h2>
					<p class="text-xs font-light text-muted-foreground">
						{$page.data.session?.user.email}
					</p>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="cursor-pointer" href="/app/settings/profile"
					>Profile</DropdownMenu.Item
				>
				<DropdownMenu.Item class="cursor-pointer" href="/app/settings/billing"
					>Billing</DropdownMenu.Item
				>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="cursor-pointer" href="/app/team">Team</DropdownMenu.Item>
				<DropdownMenu.Item class="cursor-pointer" href="/app/team/create">
					Create Team
					<DropdownMenu.Shortcut>
						<PlusIcon size="1rem" />
					</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Item class="cursor-pointer" href="/app/tickets">
					Support
					<DropdownMenu.Shortcut>
						<HelpCircleIcon size="1rem" />
					</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="cursor-pointer">
					Logout
					<DropdownMenu.Shortcut>
						<LogOutIcon size="1rem" />
					</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</nav>
<slot />

<style lang="postcss">
	.mainmenu__nav_link_active {
		@apply bg-secondary text-secondary-foreground;
	}
</style>
