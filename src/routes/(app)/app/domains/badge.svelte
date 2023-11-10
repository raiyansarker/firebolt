<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import type { Domain } from "./types";
	import { cn } from "$lib/utils";
	export let content: Domain["status"];
</script>

<Badge variant="outline" class="inline-flex items-center justify-between gap-x-1.5">
	<span
		class={cn(
			"h-1.5 w-1.5 rounded-full",
			{ "bg-yellow-500": content === "hold" },
			{ "bg-destructive": content === "banned" },
			{ "bg-emerald-500": content === "active" }
		)}
	/>
	{content}
</Badge>
