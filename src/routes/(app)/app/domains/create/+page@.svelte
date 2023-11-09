<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import ChevronLeftIcon from "~icons/lucide/chevron-left";
</script>

<div class="h-screen w-screen bg-background">
	<a
		class={buttonVariants({ variant: "ghost", class: "absolute left-6 top-6 gap-x-1 pl-2" })}
		href="/app/domains"
	>
		<ChevronLeftIcon class="h-5 w-5" />
		Back
	</a>
	<div class="grid h-screen w-screen place-items-center">Not available at the moment</div>
</div>
