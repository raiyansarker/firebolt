<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	type $$Props = DropdownMenuPrimitive.SeparatorProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<DropdownMenuPrimitive.Separator
	class={cn('-mx-2 my-2 h-px bg-muted', className)}
	{...$$restProps}
/>
