<script lang="ts">
	import { page } from "$app/stores";
	import { env } from "$env/dynamic/public";
	import * as Avatar from "$lib/components/ui/avatar";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { cn, getShortName } from "$lib/utils";
	import BellIcon from "~icons/lucide/bell";
	import HelpCircleIcon from "~icons/lucide/help-circle";
	import LogOutIcon from "~icons/lucide/log-out";
	import MenuIcon from "~icons/lucide/menu";
	import PlusIcon from "~icons/lucide/plus";
	import SearchIcon from "~icons/lucide/search";
	import SettingsIcon from "~icons/lucide/settings";
	import MobileMenu from "./menu.svelte";
	import { signOut } from "@auth/sveltekit/client";

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
	let menuOpen = false;
	let menuOpenButton: HTMLButtonElement;
</script>

{#if menuOpen}
	<MobileMenu bind:menuOpen {menuItems} bind:menuOpenButton />
{/if}
<div
	class="flex w-full flex-row items-center justify-between bg-highlight px-4 py-2 text-background/90 transition-all md:px-8 lg:px-14"
>
	<div class="flex flex-row gap-x-10">
		<h1 class="text-xl font-bold tracking-wide">{env.PUBLIC_APP_NAME}</h1>
		<nav class="hidden flex-row items-center gap-x-2 md:flex">
			{#each menuItems as item}
				<a
					class="rounded-sm px-2 py-1 text-xs font-medium outline-none ring-ring transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground focus-visible:ring-1"
					class:mainmenu__nav_link_active={item.href === $page.url.pathname}
					href={item.href}
				>
					{item.name}
				</a>
			{/each}
		</nav>
	</div>
	<div class="flex flex-row items-center gap-x-2">
		<button
			class={buttonVariants({
				variant: "ghost",
				size: "sm",
				class: "hidden h-7 w-7 px-0 md:inline-flex"
			})}
		>
			<SearchIcon class="h-4 w-4" />
		</button>
		<a
			href="/app/settings"
			class={buttonVariants({
				variant: "ghost",
				size: "sm",
				class: "hidden h-7 w-7 px-0 md:inline-flex"
			})}
		>
			<SettingsIcon class="h-4 w-4" />
		</a>
		<button
			class={buttonVariants({
				variant: "ghost",
				size: "sm",
				class: "hidden h-7 w-7 px-0 md:inline-flex"
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
				<DropdownMenu.Item on:click={() => signOut()} class="cursor-pointer">
					Logout
					<DropdownMenu.Shortcut>
						<LogOutIcon class="h-4 w-4" />
					</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<button
			on:click={() => (menuOpen = true)}
			bind:this={menuOpenButton}
			class={cn(buttonVariants({ variant: "ghost", size: "sm", class: "h-7 w-7 px-0 md:hidden" }))}
		>
			<MenuIcon class="h-4 w-4" />
		</button>
	</div>
</div>
<slot />

<style lang="postcss">
	.mainmenu__nav_link_active {
		@apply bg-secondary text-secondary-foreground;
	}
</style>
