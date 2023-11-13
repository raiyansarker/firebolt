<script lang="ts">
	import { page } from "$app/stores";
	import { env } from "$env/dynamic/public";
	import * as Avatar from "$lib/components/ui/avatar";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import Pageshell from "$lib/components/ui/page/pageshell.svelte";
	import { cn, getShortName } from "$lib/utils";
	import { signOut } from "@auth/sveltekit/client";
	import BellIcon from "~icons/lucide/bell";
	import HelpCircleIcon from "~icons/lucide/help-circle";
	import LogOutIcon from "~icons/lucide/log-out";
	import MenuIcon from "~icons/lucide/menu";
	import PlusIcon from "~icons/lucide/plus";
	import SearchIcon from "~icons/lucide/search";
	import SettingsIcon from "~icons/lucide/settings";
	import MobileMenu from "./menu.svelte";

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
	let parentNode: HTMLElement;
</script>

<div class="relative h-2 w-screen bg-primary" bind:this={parentNode}>
	{#if menuOpen}
		<MobileMenu bind:menuOpen {menuItems} bind:menuOpenButton bind:parentNode />
	{/if}
</div>
<Pageshell class="!my-0 flex flex-row items-center justify-between py-4">
	<div class="flex flex-row gap-x-10">
		<h1 class="text-xl font-bold tracking-wide">{env.PUBLIC_APP_NAME}</h1>
		<nav class="hidden flex-row items-center gap-x-4 md:flex">
			{#each menuItems as item}
				<a
					class="mainmenu__nav_link rounded-sm px-0.5 py-1 text-[.8rem] font-semibold leading-5 outline-none ring-ring"
					href={item.href}
					class:mainmenu__nav_link_active={item.href === $page.url.pathname}
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
				class:
					"group hidden h-7 w-7 px-0 hover:bg-primary hover:text-primary-foreground md:inline-flex"
			})}
		>
			<SearchIcon class="h-4 w-4 [&>g]:fill-[#E2E3E4] [&>g]:group-hover:fill-none" />
		</button>
		<a
			href="/app/settings"
			class={buttonVariants({
				variant: "ghost",
				size: "sm",
				class:
					"group hidden h-7 w-7 px-0 hover:bg-primary hover:text-primary-foreground md:inline-flex"
			})}
		>
			<SettingsIcon class="h-4 w-4 [&>g]:fill-[#E2E3E4] [&>g]:group-hover:fill-none" />
		</a>
		<button
			class={buttonVariants({
				variant: "ghost",
				size: "sm",
				class: "hidden h-7 w-7 px-0 hover:bg-primary hover:text-primary-foreground md:inline-flex"
			})}
		>
			<BellIcon class="h-4 w-4 [&>path]:fill-[#E2E3E4]" />
		</button>
		<DropdownMenu.Root
			positioning={{
				placement: "bottom-start"
			}}
		>
			<DropdownMenu.Trigger
				class="rounded-full outline-none ring-primary ring-offset-2 ring-offset-background focus-visible:ring-1"
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
			class={cn(
				buttonVariants({
					variant: "ghost",
					size: "sm",
					class: "h-7 w-7 px-0 hover:bg-primary hover:text-primary-foreground md:hidden"
				})
			)}
		>
			<MenuIcon class="h-4 w-4" />
		</button>
	</div>
</Pageshell>

<slot />

<style lang="postcss">
	.mainmenu__nav_link {
		@apply relative origin-left after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-[250ms] after:ease-in after:content-[""] hover:after:origin-left hover:after:scale-x-100  focus-visible:outline-none focus-visible:after:origin-left focus-visible:after:scale-x-100;
	}

	.mainmenu__nav_link_active {
		@apply before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-current before:content-[""];
	}
</style>
