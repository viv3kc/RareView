import { get_collection_assets, get_nft_meta_data } from './FetchData';

function get_collection_from_opensea(_collection_name) {
  let api: string = "https://api.opensea.io/api/v1/collection/" + _collection_name;
  return fetch(api).then(res => res.json());
}

function save_data_in_chrome(_obj) {
  // stores data in chrome.storage
  chrome.storage.local.set(_obj);
}

export function get_data_from_chrome(_key) {
  // retrieve data from chrome.storage
  return chrome.storage.local.get(_key);
}

export async function chrome_data_exist(_key) {
  let data = await get_data_from_chrome(_key);
  let keys: string[] = Object.keys(data);
  return keys.length > 0 ? true : false;
}

async function get_collection_data(_collection_name) {
  // get collection data from opensea.
  if (! _collection_name) return;

  let collection_obj = await get_collection_from_opensea(_collection_name);
  if (! collection_obj) return;

  collection_obj = collection_obj.collection;
  let primary_asset = collection_obj.primary_asset_contracts[0];
  let collection_address: string, schema_name: string;
  let collection_traits = collection_obj.traits;
  let collection_stats = collection_obj.stats;
  let total_collection_count: number = collection_stats.count;

  if (! primary_asset) return;
  collection_address = primary_asset.address;
  schema_name = primary_asset.schema_name;

  // for now, we only collect ERC721 collections. because the mint address is 0x000
  if (schema_name !== "ERC721") return;
  if (! collection_address) return;
  
  let all_collection_ids: number[] = await get_collection_assets(collection_address, total_collection_count);
  return {
    address: collection_address,
    token_ids: all_collection_ids
  };
}

export async function get_collection_address(_collection_name) {
  let contract_data = await get_collection_data(_collection_name);
  
  if (! contract_data) return;
  if (! contract_data.hasOwnProperty("token_ids")) return;
  if (! contract_data.hasOwnProperty("address")) return;
  return contract_data;
}

export async function store_entire_collection (_collection_name) {
  let contract_data = await get_collection_address(_collection_name);
  
  // check if collection already exists in chrome
  // if not store it.
  let address = contract_data.address;
  let found_data_in_chrome = await chrome_data_exist(address);
  if (found_data_in_chrome) return;
  
  let token_ids = contract_data.token_ids;
  let all_tokens = [];
  token_ids.forEach(id => {
    all_tokens.push(get_contract_meta_data(contract_data.address, id));
  });
  let all_token_promise = await (Promise as any).allSettled(all_tokens);
  let all_token_data = all_token_promise.map(td => {
    if (td.status === "fulfilled") {
      return td.value;
    }
  });
  let obj = { [address]: all_token_data };
  save_data_in_chrome(obj);
}

async function get_contract_meta_data(_contract_address, _id) {
  // fetch data from solidity contract
  let token_data = await get_nft_meta_data(_contract_address, _id);
  let metadata = token_data.metadata;
  metadata.id = token_data.id.tokenId;
  return metadata;
}
