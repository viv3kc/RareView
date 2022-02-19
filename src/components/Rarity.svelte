<script>
  import { onDestroy } from 'svelte';
  import { collection_data } from '../static/Store.js';

  export let token_id;

  function get_rarity() {

  }
  async function generate_rarity(_collection_data) {
    let data = await _collection_data;
    if (! data) return;
    let contract = Object.keys(data)[0];
    let contract_data = data[contract];
    console.log(contract_data)
  }

  const unsub_collection_data = collection_data.subscribe(c_data => {
    generate_rarity(c_data);
  }); 

  onDestroy(() => {
    unsub_collection_data;
  })
</script>