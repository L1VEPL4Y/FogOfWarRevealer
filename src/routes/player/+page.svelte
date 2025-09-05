<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import IconBolt from '@lucide/svelte/icons/bolt';
	import IconImage from '@lucide/svelte/icons/image';
	import OpenSeadragonViewer from '../OpenSeadragonViewer.svelte';
	import '../../app.css';
  	// State
  	let value = $state('files');
	let mapFromServer = $state('');
	let maskFromServer = $state('');

	const mapEvtSource = new EventSource("/upload-map");
	mapEvtSource.onmessage = (event) => {
		mapFromServer = event.data;
		maskFromServer = "";
	}

	const maskEvtSource = new EventSource("/upload-mask");
	maskEvtSource.onmessage = (event) => {
		maskFromServer = event.data;
	}
</script>
<!-- 
<div class="card border-surface-100-900 grid h-full w-full grid-cols-[auto_1fr] border-[1px] ">

		<Navigation.Rail {value} onValueChange={(newValue) => (value = newValue)} >
			{#snippet tiles()}
				<Navigation.Tile href="/" label="DM View"><IconBolt /></Navigation.Tile>
				<Navigation.Tile href="/player" label="Player View"><IconImage /></Navigation.Tile>
			{/snippet}
		</Navigation.Rail>

		<div class="flex items-start justify-center">
			
		</div>
</div> -->
<OpenSeadragonViewer styleClasses="w-full h-300" currentMapSrc={mapFromServer} currentMaskSrc={maskFromServer} dmView={false} revealMode={false} revealRadius={1}/>