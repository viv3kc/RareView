import { get_collection_assets } from './FetchData.js';

export async function get_collection_data(collection_name) {
  // get collection data from opensea.
  if (! collection_name) return;

  let collection_obj = await get_collection_from_opensea(collection_name);
  if (! collection_obj) return;

  collection_obj = collection_obj.collection;
  let primary_asset = collection_obj.primary_asset_contracts[0];
  let collection_address, schema_name;
  let collection_traits = collection_obj.traits;
  let collection_stats = collection_obj.stats;
  let total_collection_count = collection_stats.count;

  if (! primary_asset) return;
  collection_address = primary_asset.address;
  schema_name = primary_asset.schema_name;

  // for now, we only collect ERC721 collections. because the mint address is 0x000
  if (schema_name !== "ERC721") return;
  if (! collection_address) return;
  
  let all_collection_ids = await get_collection_assets(collection_address, total_collection_count);
  return {
    address: collection_address,
    token_ids: all_collection_ids
  };
}

function get_collection_from_opensea(collection_name) {
  let api = "https://api.opensea.io/api/v1/collection/" + collection_name;
  return fetch(api).then(res => res.json());
}

