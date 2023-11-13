<script lang="ts">
	import { onNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import { env } from "$env/dynamic/public";
	import { buttonVariants } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import { timeline } from "motion";
	import { afterUpdate, beforeUpdate, onMount } from "svelte";
	import type { Action } from "svelte/action";
	import XIcon from "~icons/lucide/x";

	export const csr = true;
	export let menuOpen: boolean = false;
	export let menuItems: {
		name: string;
		href: string;
	}[] = [];

	let closeButton: HTMLButtonElement;
	export let menuOpenButton: HTMLButtonElement;
	export let parentNode: HTMLElement;

	onMount(() => {
		closeButton.focus();

		return () => menuOpenButton.focus();
	});

	onNavigate(() => {
		menuOpen = false;
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

	const mobileNavAnimation: Action<HTMLElement> = (node) => {
		timeline([
			[parentNode, { height: "100vh" }, { easing: [0.5, 0, 0.75, 0] }],
			[node, { opacity: 1 }, { delay: 0.05 }]
		]);

		return {
			destroy() {
				timeline([
					[node, { opacity: 0 }, { duration: 0 }],
					[parentNode, { height: "0.5rem" }, { easing: [0.25, 1, 0.5, 1] }]
				]);
			}
		};
	};
</script>

<svelte:window on:keydown={(e) => e.key === "Escape" && (menuOpen = false)} />
<div
	class="absolute inset-0 z-[9999] space-y-4 px-4 py-6 text-background/70 opacity-0 md:hidden"
	use:mobileNavAnimation
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
