<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { StarFilled as StarFilledIcon } from "radix-icons-svelte";
	import GoogleIcon from "$lib/components/icons/google.svelte";
	import GithubIcon from "$lib/components/icons/github.svelte";
	import LoadingIcon from "$lib/components/icons/loading.svelte";
	import { signIn } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

	onMount(() => {
		const error = $page.url.searchParams.get("error");

		error && toast.error(error);
	});

	let googleLoading = false;
	let githubLoading = false;
</script>

<div
	class="mx-auto grid h-screen place-items-center bg-background sm:w-3/5 lg:h-auto lg:w-screen lg:grid-cols-3 lg:place-items-stretch"
>
	<div class="relative">
		<a
			class={buttonVariants({ variant: "ghost", class: "fixed right-4 top-4 lg:absolute" })}
			href="/">Home</a
		>
		<div class="container grid h-full w-full content-center space-y-6">
			<div class="space-y-1">
				<h1 class="text-2xl font-medium text-foreground">Create account</h1>
				<p class="text-xs text-muted-foreground">Sign up now – it's free!</p>
			</div>
			<form class="space-y-3">
				<div class="space-y-1">
					<Label class="pl-1" for="login__form_email">Email</Label>
					<Input
						type="email"
						autocomplete="email"
						id="login__form_email"
						placeholder="wizard@hogwarts.edu"
						required
					/>
				</div>
				<Button class="w-full" type="submit">Sign In With Email</Button>
			</form>
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-white px-2 text-zinc-500">Or continue with</span>
				</div>
			</div>
			<div class="space-y-2">
				<Button
					on:click={() => {
						githubLoading = true;
						signIn("github", { callbackUrl: $page.url.searchParams.get("callbackUrl") || "/app" });
					}}
					variant="outline"
					class="w-full"
					type="submit"
				>
					{#if githubLoading}
						<LoadingIcon class="mr-2 h-4 w-4" />
					{:else}
						<GithubIcon class="mr-2 h-4 w-4" />
					{/if}
					Github
				</Button>
				<Button
					on:click={() => {
						googleLoading = true;
						signIn("google", {
							callbackUrl: $page.url.searchParams.get("callbackUrl") || "/app"
						});
					}}
					variant="outline"
					class="w-full"
					type="submit"
				>
					{#if googleLoading}
						<LoadingIcon class="mr-2 h-4 w-4" />
					{:else}
						<GoogleIcon class="mr-2 h-4 w-4" />
					{/if}
					Google
				</Button>
			</div>
			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>
				and
				<a href="/privacy-policy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
			</p>
		</div>
	</div>
	<div class="relative col-span-2 hidden h-screen lg:block">
		<div
			class="absolute inset-0 bg-yellow-900/60 bg-[url(https://images.unsplash.com/photo-1581261946248-3f8d138d74dc?auto=format&fit=crop&q=80&w=1000&flip=h)] bg-cover bg-bottom bg-no-repeat bg-blend-overlay"
		/>
		<span
			class="absolute -right-4 top-[15%] aspect-square w-32 rounded-md bg-white/20 ring-1 ring-white/50 backdrop-blur-sm"
		/>
		<span
			class="absolute left-[15%] top-[10%] aspect-square w-24 rounded-md bg-white/20 ring-1 ring-white/50 backdrop-blur-sm"
		/>
		<span
			class="absolute left-[calc(15%_-_1.5rem)] top-[calc(10%_+_4.5rem)] aspect-square w-12 rounded-md bg-white/20 ring-1 ring-white/50 backdrop-blur-sm"
		/>
		<div class="absolute inset-x-0 bottom-0 space-y-6 p-12">
			<h2 class="text-4xl font-medium leading-relaxed text-background/90">
				Unlocking Endless Opportunities,<br /> One Link at a Time.
			</h2>
			<p class="text-sm leading-relaxed text-background/60">
				Create your free account today and unlock fastest link shortener. No credit card required.
				Our link shortener, built on Cloudflare, offers unparalleled speed and in depth analytics.
				Join us for the fastest link shortening experience!
			</p>
			<div class="flex flex-row gap-x-4">
				<div class="flex flex-row items-center -space-x-2">
					<!-- This is temporary for markup -->
					<Avatar.Root class="h-8 w-8 ring-1 ring-background">
						<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root class="h-8 w-8 ring-1 ring-background">
						<Avatar.Image src="https://github.com/raiyansarker.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root class="h-8 w-8 ring-1 ring-background">
						<Avatar.Image src="https://github.com/shuding.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root class="h-8 w-8 ring-1 ring-background">
						<Avatar.Image src="https://github.com/adamwathan.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root class="h-8 w-8 ring-1 ring-background">
						<Avatar.Image src="https://github.com/Rich-Harris.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
				</div>
				<div class="flex flex-col">
					<div class="flex flex-row items-center gap-x-1 [&>p]:pl-1">
						{#each Array(5) as _}
							<StarFilledIcon class="h-4 w-4 stroke-yellow-400 text-yellow-500" />
						{/each}
						<p class="text-xs text-background/60">5.0</p>
					</div>
					<p class="text-xs text-background/60">from 200+ reviews</p>
				</div>
			</div>
		</div>
	</div>
</div>
