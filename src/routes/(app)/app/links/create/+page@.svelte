<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { cn } from "$lib/utils.js";
	import ChevronLeftIcon from "~icons/lucide/chevron-left";
	import LoadingIcon from "$lib/components/icons/loading.svelte";
	import ShuffleIcon from "~icons/lucide/shuffle";
	import { superForm } from "sveltekit-superforms/client";
	import { api } from "$lib/axios";
	import { toast } from "svelte-sonner";

	export let data;
	const { form, constraints, errors, enhance, delayed } = superForm(data.form, {
		onError({ result }) {
			toast.error(result.error.message);
		},
		onUpdated({ form }) {
			if (form.message) {
				switch (form.message.type) {
					case "success":
						toast.success(form.message.text);
						break;
					case "error":
						toast.error(form.message.text);
						break;
				}
			}
		}
	});

	const getRandomShortUrl = () => {
		api
			.get<{ id: string }>("/links/generate")
			.then((res) => {
				$form.shortUrl = res.data.id;
			})
			.catch((error) => toast.error(error.message));
	};
</script>

<div class="h-screen w-screen bg-background">
	<a
		class={buttonVariants({ variant: "ghost", class: "absolute left-6 top-6 gap-x-1 pl-2" })}
		href="/app/links"
	>
		<ChevronLeftIcon class="h-5 w-5" />
		Back
	</a>
	<div class="grid h-screen w-screen place-items-center">
		<div class="mx-auto w-full space-y-6 md:w-2/3 lg:w-3/5">
			<div class="px-6 lg:px-0">
				<h1 class="text-xl font-semibold md:text-2xl lg:text-3xl">Create new link</h1>
				<p class="text-sm leading-relaxed text-muted-foreground">
					Links are scoped to their domain, so you can have the same short link on multiple domains.
				</p>
			</div>
			<div class="grid grid-cols-1 gap-x-6 px-6 lg:grid-cols-2 lg:px-0">
				<form method="POST" class="flex flex-col gap-y-4 [&>div]:space-y-0.5" use:enhance>
					<div>
						<Label for="links_create__destination_url">Destination URL</Label>
						<Input
							type="text"
							name="destinationUrl"
							id="links_create__destination_url"
							placeholder="https://example.com"
							aria-invalid={$errors.destinationUrl ? "true" : undefined}
							bind:value={$form.destinationUrl}
							{...$constraints.destinationUrl}
						/>
						{#if $errors.destinationUrl}<span class="text-xs text-destructive"
								>{$errors.destinationUrl}</span
							>{/if}
					</div>
					<div>
						<div class="flex flex-row items-center justify-between">
							<Label for="links_create__short_url">Destination URL</Label>
							<Button on:click={getRandomShortUrl} type="button" variant="link" size="sm">
								<ShuffleIcon class="mr-1 h-3 w-3" />
								Random
							</Button>
						</div>
						<div class="grid grid-cols-3 divide-x-[1px]">
							<select
								class={cn(
									"flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
									"rounded-r-none border-r-0 text-xs"
								)}
								name="domainId"
								bind:value={$form.domainId}
								aria-invalid={$errors.domainId ? "true" : undefined}
								id="links_create__short_url"
								{...$constraints.domainId}
							>
								{#each data.domains as domain}
									<option value={domain.id}>{domain.name}</option>
								{/each}
							</select>
							<Input
								type="text"
								name="shortUrl"
								id="links_create__short_url"
								placeholder="random"
								class="col-span-2 rounded-l-none border-l-0"
								aria-invalid={$errors.shortUrl ? "true" : undefined}
								bind:value={$form.shortUrl}
								{...$constraints.shortUrl}
							/>
							{#if $errors.shortUrl}<span class="text-xs text-destructive">{$errors.shortUrl}</span
								>{/if}
							{#if $errors.domainId}<span class="text-xs text-destructive">{$errors.domainId}</span
								>{/if}
						</div>
					</div>
					<Button type="submit">
						{#if $delayed}
							<LoadingIcon class="mr-2 h-4 w-4" />
						{/if}
						Create Link
					</Button>
				</form>
				<h1>Hi</h1>
			</div>
		</div>
	</div>
</div>
