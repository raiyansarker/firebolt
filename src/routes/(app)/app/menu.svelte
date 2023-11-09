<script lang="ts">
	import { page } from "$app/stores";
	import { env } from "$env/dynamic/public";
	import { buttonVariants } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import { afterUpdate, beforeUpdate, onMount } from "svelte";
	import { linear } from "svelte/easing";
	import { slide } from "svelte/transition";
	import XIcon from "~icons/lucide/x";

	export const csr = true;
	export let menuOpen: boolean = false;
	export let menuItems: {
		name: string;
		href: string;
	}[] = [];

	let closeButton: HTMLButtonElement;
	export let menuOpenButton: HTMLButtonElement;

	onMount(() => {
		closeButton.focus();

		return () => menuOpenButton.focus();
	});
	beforeUpdate(() => {
		if (menuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflowY = "auto";
		}
	});
	afterUpdate(() => {
		if (menuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflowY = "auto";
		}
	});
</script>

<svelte:window on:keydown={(e) => e.key === "Escape" && (menuOpen = false)} />
<div
	transition:slide={{ duration: 300, axis: "y", easing: linear }}
	class="absolute inset-0 z-[9999] space-y-4 bg-highlight px-4 py-6 text-background/70 md:hidden"
>
	<div class="flex flex-row items-center justify-between px-2">
		<h1 class="text-xl font-bold tracking-wide">{env.PUBLIC_APP_NAME}</h1>
		<button
			bind:this={closeButton}
			on:click={() => (menuOpen = false)}
			class={cn(buttonVariants({ variant: "ghost", size: "icon", class: "rounded-full" }))}
		>
			<XIcon class="h-6 w-6" />
		</button>
	</div>
	<nav class="flex flex-col items-start justify-center gap-y-1">
		{#each [...menuItems, { name: "Settings", href: "/app/settings" }] as item}
			<a
				class="w-full rounded-sm px-2 py-1 font-medium outline-none ring-ring transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground focus-visible:ring-1"
				class:mainmenu__nav_link_active={item.href === $page.url.pathname}
				href={item.href}
			>
				{item.name}
			</a>
		{/each}
	</nav>
</div>
