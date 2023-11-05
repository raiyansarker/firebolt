<script lang="ts">
	import "../styles/tailwind.postcss";
	import { Toaster } from "svelte-sonner";
</script>

<Toaster closeButton position="bottom-right" />
<slot />
