<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

	onMount(() => {
		const error = $page.url.searchParams.get("error");

		error && toast.error(error);
	});
</script>

<div class="h-screen w-screen bg-muted">
	<div class="grid h-screen place-items-center">
		<div
			class="mx-auto flex max-w-[26rem] flex-col items-center gap-y-8 rounded-md border bg-background p-6 shadow"
		>
			<div class="flex flex-col items-center gap-y-1 px-8">
				<h1 class="text-2xl font-medium">Password Guard</h1>
				<p class="text-center text-sm text-muted-foreground">
					This link is password protected. Please enter the password to access it.
				</p>
			</div>
			<form class="flex w-full flex-col gap-y-4" method="GET">
				<Input type="password" name="password" placeholder="Enter your password" class="bg-muted" />
				<Button class="w-full">Access</Button>
			</form>
		</div>
	</div>
</div>
