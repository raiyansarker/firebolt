<script lang="ts">
	import { api } from "$lib/axios";
	import LoadingIcon from "$lib/components/icons/loading.svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { cn } from "$lib/utils";
	import { toast } from "svelte-sonner";
	import { superForm } from "sveltekit-superforms/client";
	import * as Collapsible from "$lib/components/ui/collapsible";
	import * as Select from "$lib/components/ui/select";
	import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
	import ChevronLeftIcon from "~icons/lucide/chevron-left";
	import ShuffleIcon from "~icons/lucide/shuffle";
	import PlusIcon from "~icons/lucide/plus";
	import MinusIcon from "~icons/lucide/minus";
	import XIcon from "~icons/lucide/x";

	export let data;
	const { form, constraints, errors, enhance, delayed } = superForm(data.form, {
		onUpdated({ form }) {
			if (!form.valid || form.errors) {
				toast.error(form.message);
			} else {
				toast.success(form.message);
			}
		}
	});

	const getRandomShortUrl = () => {
		api
			.get<{ id: string }>("/links/generate")
			.then((res) => {
				$form.key = res.data.id;
			})
			.catch((error) => toast.error(error.message));
	};
</script>

<SuperDebug data={$form} />
<form use:enhance method="POST" class="h-screen w-screen bg-background">
	<div
		class="sticky top-0 flex flex-row items-center justify-between border-b bg-background px-6 py-2 md:px-40 lg:px-52"
	>
		<a
			href="/app/links"
			class={buttonVariants({
				variant: "ghost",
				size: "sm",
				class: "group h-7 w-7 px-0 hover:bg-primary hover:text-primary-foreground md:inline-flex"
			})}
		>
			<XIcon class="h-4 w-4" />
		</a>
		<Button type="submit" size="sm">
			{#if $delayed}
				<LoadingIcon class="mr-2 h-4 w-4" />
			{/if}
			Create Link
		</Button>
	</div>
	<div class="mx-auto w-full space-y-6 px-6 py-8 md:w-2/3 lg:w-3/5 lg:px-0 lg:py-16">
		<div>
			<h1 class="text-xl font-semibold md:text-2xl lg:text-3xl">Create new link</h1>
			<p class="text-sm leading-relaxed text-muted-foreground">
				Links are scoped to their domain, so you can have the same short link on multiple domains.
			</p>
		</div>
		<div class="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
			<div class="flex flex-col gap-y-4 [&>div]:space-y-0.5">
				<div>
					<Label for="links_create__destination_url">Destination URL</Label>
					<Input
						type="text"
						name="url"
						id="links_create__destination_url"
						placeholder="https://example.com"
						aria-invalid={$errors.url ? true : undefined}
						bind:value={$form.url}
						{...$constraints.url}
					/>
					{#if $errors.url}<span class="text-xs text-destructive">{$errors.url}</span>{/if}
				</div>
				<div>
					<div class="flex flex-row items-center justify-between">
						<Label for="links_create__short_url">Destination URL</Label>
						<Button on:click={getRandomShortUrl} type="button" variant="link" size="sm">
							<ShuffleIcon class="mr-1 h-3 w-3" />
							Random
						</Button>
					</div>
					<div class="grid grid-cols-2 gap-x-2">
						<Select.Root
							positioning={{
								sameWidth: false,
								placement: "bottom"
							}}
						>
							<Select.Trigger>
								<Select.Value class="text-xs text-muted-foreground" placeholder="Select Domain" />
							</Select.Trigger>
							<Select.Content>
								{#each data.domains as domain}
									<Select.Item class="text-xs" value={domain.id}>{domain.name}</Select.Item>
								{/each}
							</Select.Content>
							<Select.Input
								name="domainId"
								aria-invalid={$errors.domainId ? true : undefined}
								{...$constraints.domainId}
							/>
						</Select.Root>
						<Input
							type="text"
							name="key"
							id="links_create__short_url"
							placeholder="random"
							aria-invalid={$errors.key ? true : undefined}
							bind:value={$form.key}
							{...$constraints.key}
						/>
						{#if $errors.key}<span class="text-xs text-destructive">{$errors.key}</span>{/if}
						{#if $errors.domainId}<span class="text-xs text-destructive">{$errors.domainId}</span
							>{/if}
					</div>
				</div>
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t"></span>
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background px-2 text-muted-foreground">Optional</span>
					</div>
				</div>
				<div class="flex flex-col divide-y-[1px] [&>*]:py-2">
					<Collapsible.Root class="!space-y-2">
						<div class="flex items-center justify-between">
							<Label for="links_create__password_collapse">Password Protection</Label>
							<Collapsible.Trigger asChild let:builder>
								<Button
									builders={[builder]}
									variant="ghost"
									size="sm"
									type="button"
									id="links_create__password_collapse"
									class="h-7 w-7 px-0 md:inline-flex [&>.minus]:data-[state=open]:block [&>.plus]:data-[state=open]:hidden"
								>
									<PlusIcon class="plus h-4 w-4 text-muted-foreground" />
									<MinusIcon class="minus hidden h-4 w-4 text-muted-foreground" />
									<span class="sr-only">Toggle</span>
								</Button>
							</Collapsible.Trigger>
						</div>
						<Collapsible.Content>
							<Input
								type="password"
								name="password"
								placeholder="Alohomora"
								aria-invalid={$errors.password ? true : undefined}
								bind:value={$form.password}
								{...$constraints.password}
							/>
							{#if $errors.password}<span class="text-xs text-destructive">{$errors.password}</span
								>{/if}
						</Collapsible.Content>
					</Collapsible.Root>
					<Collapsible.Root class="!space-y-2">
						<div class="flex items-center justify-between">
							<Label for="links_create__expire_collapse">Expiration Date</Label>
							<Collapsible.Trigger asChild let:builder>
								<Button
									builders={[builder]}
									variant="ghost"
									size="sm"
									type="button"
									id="links_create__expire_collapse"
									class="h-7 w-7 px-0 md:inline-flex [&>.minus]:data-[state=open]:block [&>.plus]:data-[state=open]:hidden"
								>
									<PlusIcon class="plus h-4 w-4 text-muted-foreground" />
									<MinusIcon class="minus hidden h-4 w-4 text-muted-foreground" />
									<span class="sr-only">Toggle</span>
								</Button>
							</Collapsible.Trigger>
						</div>
						<Collapsible.Content>
							<Input
								type="password"
								name="password"
								placeholder="Alohomora"
								aria-invalid={$errors.password ? true : undefined}
								bind:value={$form.password}
								{...$constraints.password}
							/>
							{#if $errors.password}<span class="text-xs text-destructive">{$errors.password}</span
								>{/if}
						</Collapsible.Content>
					</Collapsible.Root>
				</div>
			</div>
			<h1>Hi</h1>
		</div>
	</div>
</form>
