const alchemy_api = "https://eth-mainnet.alchemyapi.io/v2/A8RlXYDE-mEf5JidAgy7jSkzLcnVgB3L";
const nft_abi = JSON.parse(`[
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]`);

function get_tx_history(contract, page_key) {
  // in most cases, mint address is 0x0000000000000000000000000000000000000000
  let param_obj;
  let mint_address = "0x0000000000000000000000000000000000000000";
  let from_block = "0x0";
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (page_key) {
    param_obj = {
      "fromBlock": from_block,
      "toBlock": "latest",
      "fromAddress": mint_address,
      "contractAddresses": [ contract ],
      "excludeZeroValue": true,
      "category": [
        "external",
        "token"
      ],
      "pageKey": page_key
    };
  } else {
    param_obj = {
      "fromBlock": from_block,
      "toBlock": "latest",
      "fromAddress": mint_address,
      "contractAddresses": [ contract ],
      "excludeZeroValue": true,
      "category": [
        "external",
        "token"
      ]
    };
  }
  
  let myBody = JSON.stringify({
    "jsonrpc": "2.0",
    "id": 0,
    "method": "alchemy_getAssetTransfers",
    "params": [ param_obj ]
  });
  
  return {
    method: 'POST',
    headers: myHeaders,
    body: myBody,
    redirect: 'follow'
  };
}

export async function get_collection_assets(contract, total_collection) {
  let page_key;
  let nft_counter = 0;
  let token_ids = [];
  while(total_collection > nft_counter ) {
    let request_options = get_tx_history(contract, page_key);
    let data = await fetch(alchemy_api, request_options).then(res => res.json());
    if (! data) return;

    let result = data.result;
    if (! result) return;
    
    if (result.hasOwnProperty("pageKey")) {
      page_key = result.pageKey;
    }

    if (result.hasOwnProperty("transfers")) {
      let transfers = result.transfers;
      nft_counter += transfers.length;
      transfers.forEach(transfer => {
        let token_id = parseInt(transfer.tokenId)
        token_ids.push(token_id);
      });
    }
  }
  return token_ids;
}

export function get_nft_meta_data(contract, token_id, token_type = "erc721") {
  const baseURL = alchemy_api + "/getNFTMetadata";
  const url = `${baseURL}?contractAddress=${contract}&tokenId=${token_id}&tokenType=${token_type}`;
  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  return fetch(url, requestOptions).then(res => res.json());
}