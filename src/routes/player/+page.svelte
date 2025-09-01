<script lang="ts">
    import { Navigation } from '@skeletonlabs/skeleton-svelte';
  import IconBolt from '@lucide/svelte/icons/bolt';
  import IconImage from '@lucide/svelte/icons/image';
	
  // State
  let value = $state('files');
</script>
<div class="card border-surface-100-900 grid h-full w-full grid-cols-[auto_1fr] border-[1px] ">
		<!-- Component -->
		<Navigation.Rail {value} onValueChange={(newValue) => (value = newValue)} >
			{#snippet tiles()}
				<Navigation.Tile href="/" label="DM View"><IconBolt /></Navigation.Tile>
				<Navigation.Tile href="/player" label="Player View"><IconImage /></Navigation.Tile>
			{/snippet}
		</Navigation.Rail>
		<!-- Content -->
		<div class="flex items-start justify-center">
		</div>
</div>