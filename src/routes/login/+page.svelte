<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { StarFilled as StarFilledIcon } from 'radix-icons-svelte';
	import GoogleIcon from '$lib/icons/google.svelte';
	import GithubIcon from '$lib/icons/github.svelte';
	import { signIn } from '@auth/sveltekit/client';
</script>

<div
	class="sm:w-3/5 mx-auto lg:w-screen h-screen lg:h-auto bg-background grid place-items-center lg:place-items-stretch lg:grid-cols-3"
>
	<div class="relative">
		<a
			class={buttonVariants({ variant: 'ghost', class: 'fixed lg:absolute top-4 right-4' })}
			href="/">Home</a
		>
		<div class="h-full w-full container space-y-6 grid content-center">
			<div class="space-y-1">
				<h1 class="text-2xl font-medium text-foreground">Create account</h1>
				<p class="text-muted-foreground text-xs">Sign up now – it's free!</p>
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
				<Button on:click={() => signIn('github')} variant="outline" class="w-full" type="submit">
					<GithubIcon class="mr-2 h-4 w-4" />
					Github
				</Button>
				<Button on:click={() => signIn('google')} variant="outline" class="w-full" type="submit">
					<GoogleIcon class="mr-2 h-4 w-4" />
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
	<div class="hidden relative lg:block col-span-2 h-screen">
		<div
			class="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1581261946248-3f8d138d74dc?auto=format&fit=crop&q=80&w=1000&flip=h)] bg-no-repeat bg-bottom bg-blend-overlay bg-yellow-900/60 bg-cover"
		/>
		<span
			class="absolute aspect-square w-32 rounded-md ring-1 ring-white/50 bg-white/20 top-[15%] -right-4 backdrop-blur-sm"
		/>
		<span
			class="absolute aspect-square w-24 left-[15%] top-[10%] rounded-md ring-1 ring-white/50 bg-white/20 backdrop-blur-sm"
		/>
		<span
			class="absolute aspect-square w-12 left-[calc(15%_-_1.5rem)] top-[calc(10%_+_4.5rem)] rounded-md ring-1 ring-white/50 bg-white/20 backdrop-blur-sm"
		/>
		<div class="absolute bottom-0 inset-x-0 p-12 space-y-6">
			<h2 class="text-background/90 text-4xl font-medium leading-relaxed">
				Unlocking Endless Opportunities,<br /> One Link at a Time.
			</h2>
			<p class="text-background/60 text-sm leading-relaxed">
				Create your free account today and unlock fastest link shortener. No credit card required.
				Our link shortener, built on Cloudflare, offers unparalleled speed and in depth analytics.
				Join us for the fastest link shortening experience!
			</p>
			<div class="flex flex-row gap-x-4">
				<div class="flex flex-row items-center -space-x-2">
					<!-- This is temporary for markup -->
					<Avatar.Root class="ring-1 w-8 h-8 ring-background">
						<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root class="ring-1 w-8 h-8 ring-background">
						<Avatar.Image src="https://github.com/raiyansarker.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root class="ring-1 w-8 h-8 ring-background">
						<Avatar.Image src="https://github.com/shuding.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root class="ring-1 w-8 h-8 ring-background">
						<Avatar.Image src="https://github.com/adamwathan.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
					<Avatar.Root class="ring-1 w-8 h-8 ring-background">
						<Avatar.Image src="https://github.com/Rich-Harris.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
				</div>
				<div class="flex flex-col">
					<div class="flex flex-row gap-x-1 items-center [&>p]:pl-1">
						{#each Array(5) as _}
							<StarFilledIcon class="w-4 h-4 stroke-yellow-400 text-yellow-500" />
						{/each}
						<p class="text-xs text-background/60">5.0</p>
					</div>
					<p class="text-xs text-background/60">from 200+ reviews</p>
				</div>
			</div>
		</div>
	</div>
</div>
