<script lang="ts">
	import { page } from "$app/stores";
	import { env } from "$env/dynamic/public";
	import * as Avatar from "$lib/components/ui/avatar";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { getShortName } from "$lib/utils";
	import BellIcon from "~icons/lucide/bell";
	import HelpCircleIcon from "~icons/lucide/help-circle";
	import LogOutIcon from "~icons/lucide/log-out";
	import PlusIcon from "~icons/lucide/plus";
	import SearchIcon from "~icons/lucide/search";
	import SettingsIcon from "~icons/lucide/settings";

	const menuItems = [
		{
			name: "Home",
			href: "/"
		},
		{
			name: "Dashboard",
			href: "/app"
		},
		{
			name: "Links",
			href: "/app/links"
		},
		{
			name: "Domains",
			href: "/app/domains"
		},
		{
			name: "Activity",
			href: "/app/activity"
		},
		{
			name: "Tickets",
			href: "/app/tickets"
		}
	];
</script>

<nav
	class="flex w-full flex-row items-center justify-between bg-highlight px-4 py-2 text-background/90 md:px-8 lg:px-14"
>
	<div class="flex flex-row items-center gap-x-2">
		<h1 class="pr-10 text-xl font-bold tracking-wide">{env.PUBLIC_APP_NAME}</h1>
		{#each menuItems as item}
			<a
				class="rounded-sm px-2 py-1 text-xs font-medium outline-none ring-ring transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground focus-visible:ring-1"
				class:mainmenu__nav_link_active={item.href === $page.url.pathname}
				href={item.href}
			>
				{item.name}
			</a>
		{/each}
	</div>
	<div class="flex flex-row items-center gap-x-2">
		<button class={buttonVariants({ variant: "ghost", size: "sm", class: "h-7 w-7 px-0" })}>
			<SearchIcon class="h-4 w-4" />
		</button>
		<a
			href="/app/settings"
			class={buttonVariants({ variant: "ghost", size: "sm", class: "h-7 w-7 px-0" })}
		>
			<SettingsIcon class="h-4 w-4" />
		</a>
		<button
			class={buttonVariants({
				variant: "ghost",
				size: "sm",
				class: "h-7 w-7 px-0"
			})}
		>
			<BellIcon class="h-4 w-4" />
		</button>
		<DropdownMenu.Root
			positioning={{
				placement: "bottom-start"
			}}
		>
			<DropdownMenu.Trigger
				class="rounded-full outline-none ring-ring ring-offset-2 ring-offset-slate-950 focus-visible:ring-1"
			>
				<Avatar.Root class="h-7 w-7">
					<Avatar.Image src={$page.data.session?.user.image} alt="User Image" />
					<Avatar.Fallback class="text-xs text-foreground"
						>{getShortName($page.data.session?.user.name ?? "Harry Potter")}</Avatar.Fallback
					>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="[&>*]:text-xs">
				<DropdownMenu.Label class="flex flex-col pr-8">
					<h2 class="text-sm text-foreground">{$page.data.session?.user.name}</h2>
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
						<PlusIcon class="h-4 w-4" />
					</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Item class="cursor-pointer" href="/app/tickets">
					Support
					<DropdownMenu.Shortcut>
						<HelpCircleIcon class="h-4 w-4" />
					</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="cursor-pointer">
					Logout
					<DropdownMenu.Shortcut>
						<LogOutIcon class="h-4 w-4" />
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
