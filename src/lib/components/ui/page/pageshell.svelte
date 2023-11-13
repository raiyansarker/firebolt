<script>
	import { cn } from "$lib/utils";
</script>

<div
	class={cn(
		"mx-auto my-6 w-[calc(100vw_-_8%)] md:w-[calc(100vw_-_10%)] lg:my-12",
		$$restProps.class
	)}
>
	<slot />
</div>
