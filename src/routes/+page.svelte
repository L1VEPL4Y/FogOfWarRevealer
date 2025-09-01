<script lang="ts">
  import { AppBar } from '@skeletonlabs/skeleton-svelte';
  import ImageUp from '@lucide/svelte/icons/image-up';
  import Blend from '@lucide/svelte/icons/blend';
  import Save from '@lucide/svelte/icons/save';
  import Pen from '@lucide/svelte/icons/pen';
  import Radius from '@lucide/svelte/icons/radius';
  import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
  import IconBolt from '@lucide/svelte/icons/bolt';
  import IconImage from '@lucide/svelte/icons/image';
	import { read } from '$app/server';
	
  // State
  let value = $state('files');
  let loadedMapSrc = $state("");
  let loadedMaskSrc = $state("");
  // Logic
  function openMapFilePicker(){
    document.getElementById("mapFileInput")?.click();
  }
  function openMaskFilePicker(){
    document.getElementById("maskFileInput")?.click();
  }
  function loadFile(isMap:boolean, event:Event){
    if(event.target instanceof HTMLInputElement){
      if(event.target.files && event.target.files[0]){
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (loadEvent) => {
          if(loadEvent.target == null) return;
          if(loadEvent.target.result == null) return;
          if(isMap) {
            loadedMapSrc = loadEvent.target.result as string;
          } else {
            loadedMaskSrc = loadEvent.target.result as string;
          }
        }
      }
    }
  }
</script>


<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<AppBar padding="pl-30 pt-4 pb-4">
  {#snippet lead()}
    <ImageUp size={32} onclick={openMapFilePicker} class="hover:preset-filled-surface-50-950 p-1"/>
    <Blend size={32} onclick={openMaskFilePicker} class="hover:preset-filled-surface-50-950 p-1"/>
    <Save size={32} class="hover:preset-filled-surface-50-950 p-1"/>
    <Pen size={32} class="hover:preset-filled-surface-50-950 p-1"/>
    <Radius size={32} class="hover:preset-filled-surface-50-950 p-1"/>
  {/snippet}
</AppBar>	
<div class="card border-surface-100-900 grid h-full w-full grid-cols-[auto_1fr] border-[1px] ">
		<!-- Component -->
		<Navigation.Rail {value} onValueChange={(newValue) => (value = newValue)} >
			{#snippet tiles()}
				<Navigation.Tile href="/" label="DM View"><IconBolt /></Navigation.Tile>
				<Navigation.Tile href="/player" label="Player View"><IconImage /></Navigation.Tile>
			{/snippet}
		</Navigation.Rail>
		<!-- Content -->
    <input type="file" id="mapFileInput" accept="image/*" style="display: none;" onchange={(event) => loadFile(true, event)}>
    <input type="file" id="maskFileInput" accept="image/*" style="display: none;" onchange={(event) => loadFile(false, event)}>
		<div class="flex items-start justify-center">
      <!-- ToDo: Display image in Canvas for future zoom and pan functionality -->
      <!-- ToDo: Show image with hidden Areas Masked Out using a Mask -->
			<div class="w-full">
        <img alt="your map goes here when it is loaded" src={loadedMapSrc} />
      </div>
		</div>
</div>


