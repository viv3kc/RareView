<script lang="ts">
  import { onDestroy } from 'svelte';
  import { collection_data } from 'src/static/Store';

  export const token_id: string = undefined;

  function get_rarity() {

  }

  async function generate_rarity(_collection_data) {
    let data: any = await _collection_data;
    if (! data) return;
    let contract = Object.keys(data)[0];
    let contract_data = data[contract];
  }

  const unsub_collection_data = collection_data.subscribe(c_data => {
    generate_rarity(c_data);
  }); 

  onDestroy(() => {
    unsub_collection_data;
  })
</script>