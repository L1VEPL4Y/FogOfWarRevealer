<script lang="ts">
  import { AppBar } from '@skeletonlabs/skeleton-svelte';
  import ImageUp from '@lucide/svelte/icons/image-up';
  import Blend from '@lucide/svelte/icons/blend';
  import Save from '@lucide/svelte/icons/save';
  import Pen from '@lucide/svelte/icons/pen';
  import Radius from '@lucide/svelte/icons/radius';
  import '../app.css';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
  import IconBolt from '@lucide/svelte/icons/bolt';
  import IconImage from '@lucide/svelte/icons/image';
	import { read } from '$app/server';
	import { onMount } from 'svelte';
  import OpenSeadragonViewer from './OpenSeadragonViewer.svelte';
  // State
  let value = $state('files');
  let loadedMapSrc = $state("");
  let loadedMaskSrc = $state("");
  let revealMode = $state(false);
  let revealRadius = $state(50);
  let radiusSelectActive = $state(false);
  // Logic
  //Handlers for the click event of the buttons to open a Map & Mask
  function openMapFilePicker(){
    document.getElementById("mapFileInput")?.click();
  }
  function openMaskFilePicker(){
    document.getElementById("maskFileInput")?.click();
  }
  function toggleRevealMode(){
    revealMode = !revealMode;
  }
  function toggleRadiusSelect(){
    radiusSelectActive = !radiusSelectActive;
  }
  //Load file for a Map or Mask. Display it in the openSeadragon Viewer when loaded
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
            //Initialize Empty Mask for new Map
            loadedMaskSrc = "";
          } else {
            loadedMaskSrc = loadEvent.target.result as string;
            console.log("loaded mask:", loadedMaskSrc);
          }
        }
      }
    }
  }
</script>

<AppBar padding="pl-30 pt-4 pb-4">
  {#snippet lead()}
    <!-- Select new Map -->
    <ImageUp size={32} onclick={openMapFilePicker} class="hover:preset-filled-surface-50-950 p-1"/>
    <!-- Load Mask -->
    <Blend size={32} onclick={openMaskFilePicker} class="hover:preset-filled-surface-50-950 p-1"/>
    <!-- Save Mask -->
    <Save size={32} class="hover:preset-filled-surface-50-950 p-1"/>
    <!-- Toggle Reveal Mode (Brush) -->
    <Pen size={32} onclick={toggleRevealMode} class="hover:preset-filled-surface-50-950 p-1" style="border: {revealMode? '2px solid black' : ''}"/>
    <!-- Configure Brush Size -->
    <Radius size={32} onclick={toggleRadiusSelect} class="hover:preset-filled-surface-50-950 p-1" style="border: {radiusSelectActive? '2px solid black' : ''}"/>
  {/snippet}
  {#snippet children()}
    <form class="mx-auto w-full max-w-md space-y-4" style="{radiusSelectActive? '':'display:none'};">
      <!-- Range -->
      <label class="label">
        <span class="label-text">Reveal Radius: {revealRadius}</span>
        <input class="input" type="range" bind:value={revealRadius} max="200" min="1" />
      </label>
    </form>
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
      <OpenSeadragonViewer styleClasses="w-full h-300" currentMapSrc={loadedMapSrc} currentMaskSrc={loadedMaskSrc} dmView={true} revealMode={revealMode} revealRadius={revealRadius}/>
		</div>
</div>


