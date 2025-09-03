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
	import { onMount } from 'svelte';
  import OpenSeadragonViewer from './OpenSeadragonViewer.svelte';
  // State
  let value = $state('files');
  let loadedMapSrc = $state("");
  let loadedMaskSrc = $state("");
  // Logic
  //Handlers for the click event of the buttons to open a Map & Mask
  function openMapFilePicker(){
    document.getElementById("mapFileInput")?.click();
  }
  function openMaskFilePicker(){
    document.getElementById("maskFileInput")?.click();
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
            var memoryImg = new Image();
            memoryImg.onload = () => {
              var width = memoryImg.width;
              var height = memoryImg.height;
              loadedMaskSrc = createBlackPng(width, height);
            }
            memoryImg.src = loadedMapSrc;
          } else {
            loadedMaskSrc = loadEvent.target.result as string;
            console.log("loaded new mask:");
            console.log(loadedMaskSrc);
          }
        }
      }
    }
  }
  //Create Full Black Mask (nothing revealed for players)
  function createBlackPng(width:number, height:number) {
    // Create an in-memory canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // Fill the entire canvas black
    if(ctx){
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
    }
    // Export as a PNG data URL
    return canvas.toDataURL("image/png");
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
      <OpenSeadragonViewer styleClasses="w-full h-300" currentMapSrc={loadedMapSrc} currentMaskSrc={loadedMaskSrc} dmView={true}/>
		</div>
</div>


