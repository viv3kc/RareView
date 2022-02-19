import { get_collection_assets, get_nft_meta_data } from './FetchData.js';

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

export function save_data_chrome(obj) {
  chrome.storage.local.set(obj);
}

export function get_data_chrome(key) {
  return chrome.storage.local.get(key);
}

export async function chrome_data_exist(key) {
  let data = await get_data_chrome(key);
  let keys = Object.keys(data);
  console.log(data)
  return keys.length > 0 ? true : false;
}

export async function save_collection_data (collection_name) {
  let contract_data = await get_collection_data(collection_name);
  
  if (! contract_data) return;
  if (! contract_data.hasOwnProperty("token_ids")) return;
  if (! contract_data.hasOwnProperty("address")) return;
  
  // check if collection already exists in chrome
  // if not store it.
  let address = contract_data.address;
  let found_data_in_chrome = await chrome_data_exist(address);
  if (found_data_in_chrome) return;
  
  let token_ids = contract_data.token_ids;
  let all_tokens = [];
  token_ids.forEach(id => {
    all_tokens.push(get_contract_data(contract_data.address, id));
  });
  let all_token_promise = await Promise.allSettled(all_tokens);
  let all_token_data = all_token_promise.map(td => {
    if (td.status === "fulfilled") {
      return td.value;
    }
  });
  let obj = { [address]: all_token_data };
  save_data_chrome(obj);
}

export async function get_contract_data(contract_address, id) {
  // fetch data from solidity contract
  let token_data = await get_nft_meta_data(contract_address, id);
  let metadata = token_data.metadata;
  metadata.id = token_data.id.tokenId;
  return metadata;
}