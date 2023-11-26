<script lang="ts">
	import { dev } from "$app/environment";
	import { page } from "$app/stores";
	import { env } from "$env/dynamic/public";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import PageShell from "$lib/components/ui/page/pageshell.svelte";
	import { Separator } from "$lib/components/ui/separator";
	import { Image } from "@unpic/svelte";
	import format from "date-fns/format";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { writable } from "svelte/store";

	import CopyIcon from "~icons/lucide/copy";
	import MoreVerticalIcon from "~icons/lucide/more-vertical";
	import PlusIcon from "~icons/lucide/plus";
	import PenIcon from "~icons/lucide/pen-line";
	import TrashIcon from "~icons/lucide/trash-2";
	import ArchiveIcon from "~icons/lucide/archive";
	import DuplicateIcon from "~icons/lucide/copy-plus";
	import QRCodeIcon from "~icons/lucide/qr-code";

	onMount(() => {
		const message = $page.url.searchParams.get("message");
		const description = $page.url.searchParams.get("description");

		message &&
			toast.error(message, {
				description: description ?? undefined
			});
	});

	export let data;

	const links = writable(data.links);
	const dateFormat = (date: string | Date) => {
		let formatString = "MMM d";
		if (new Date().getFullYear() !== new Date(date).getFullYear()) {
			formatString += ", yyyy";
		}
		return format(new Date(date), formatString);
	};
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
			data-sveltekit-preload-data="tap"
			class={buttonVariants({ variant: "outline", class: "gap-x-1 pl-3.5 text-sm" })}
			href="/app/links/create"
		>
			<PlusIcon class="h-4 w-4" />
			Add Link
		</a>
	</div>
	<Separator class="my-3 lg:my-6" />
	<div class="flex flex-col items-start justify-between gap-6 md:flex-row">
		<div class="w-full md:sticky md:top-6 md:w-80">
			<!-- Placeholder for search queryies -->
			<h3 class="text-sm font-medium">Domains</h3>
			<p class="text-xs leading-relaxed text-muted-foreground">
				Manage your domain and configure it to connect with {env.PUBLIC_APP_NAME}
			</p>
		</div>
		<ul class="grid w-full grid-cols-1 gap-y-4 md:w-[calc(100%_-_theme(space.80))]">
			{#each $links as link}
				<li
					class="flex h-16 flex-row items-center justify-between gap-x-4 overflow-hidden rounded-md bg-stone-100 px-4 text-muted-foreground shadow transition-shadow hover:shadow-md"
				>
					<!-- Image -->
					<Image
						src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=128`}
						class="rounded-full"
						layout="fixed"
						alt="Favicon"
						height={36}
						width={36}
					/>
					<!-- Details -->
					<div class="flex w-full shrink flex-col items-start justify-center">
						<div class="space-x-0.5">
							<a
								target="_blank"
								rel="noreferer"
								href={new URL(
									`${dev ? "http" : "https"}://${link.domain?.name}/${link.key}`
								).toString()}
								class="text-sm font-semibold text-primary">{link.domain?.name}/{link.key}</a
							>
							<button
								class={buttonVariants({
									variant: "default",
									size: "icon",
									class: "h-auto w-auto rounded-full p-1.5"
								})}
								on:click={() => {
									navigator.clipboard.writeText(
										new URL(
											`${dev ? "http" : "https"}://${link.domain?.name}/${link.key}`
										).toString()
									);
									toast.success("Copied to clipboard");
								}}
							>
								<CopyIcon class="h-2 w-2" />
							</button>
						</div>
						<p class="w-[33rem] text-sm">
							<span class="font-light text-primary">
								{dateFormat(link.createdAt)}
							</span>
							<span>·</span>
							<a
								class="truncate text-primary hover:underline hover:underline-offset-2 focus-visible:underline focus-visible:underline-offset-2"
								href={link.url}
								rel="noreferer">{link.url}</a
							>
						</p>
					</div>
					<!-- Actions -->
					<DropdownMenu.Root
						positioning={{
							placement: "bottom-end"
						}}
					>
						<DropdownMenu.Trigger>
							<MoreVerticalIcon />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="[&>*]:cursor-pointer [&>*]:pr-4 [&>*]:text-sm">
							<DropdownMenu.Item href="/app/links/{link.id}/edit">
								<PenIcon class="mr-2 inline-block h-4 w-4" />
								Edit
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<DuplicateIcon class="mr-2 inline-block h-4 w-4" />
								Duplicate
							</DropdownMenu.Item>
							<DropdownMenu.Item href="/app/links/{link.id}/qr">
								<QRCodeIcon class="mr-2 inline-block h-4 w-4" />
								QR Code
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<ArchiveIcon class="mr-2 inline-block h-4 w-4" />
								Archieve
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<TrashIcon class="mr-2 inline-block h-4 w-4" />
								Delete
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</li>
			{/each}
		</ul>
	</div>
</PageShell>
