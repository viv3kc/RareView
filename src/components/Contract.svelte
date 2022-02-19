<script>
	import { ethers } from "ethers";
	import { onMount, afterUpdate } from 'svelte';
	import { get_collection_from_opensea, get_collection_assets } from '../static/FetchData';

	export let contract = undefined;
	export let collection_name = undefined;
	export let token_id = undefined;

	const alchemy_api = "https://eth-mainnet.alchemyapi.io/v2/A8RlXYDE-mEf5JidAgy7jSkzLcnVgB3L";
	const contract_abi = JSON.parse(`[
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

	function get_contract_data() {
		// fetch data from solidity contract
	}

	async function get_collection_data() {
		// get collection data from opensea.
		if (collection_name) {
			let collection_obj = await get_collection_from_opensea(collection_name);
			if (collection_obj) {
				collection_obj = collection_obj.collection;
				let primary_asset = collection_obj.primary_asset_contracts[0];
				let collection_address, schema_name;
				let collection_traits = collection_obj.traits;
				let collection_stats = collection_obj.stats;
				let total_collection_count = collection_stats.count;
				if (primary_asset) {
					collection_address = primary_asset.address;
					schema_name = primary_asset.schema_name;
				}
				// for now, we only collect ERC721 collections. because the mint address is 0x000
				if (schema_name !== "ERC721") return;
				if (collection_address) {
					let all_collection_ids = await get_collection_assets(collection_address, total_collection_count);
					console.log(all_collection_ids);
				}
			}
		}
	}

	afterUpdate(() => {
		if (contract) {
			get_contract_data();
		} else {
			get_collection_data();
		}
	});


	// if (provider) {
	// 		let contract = new ethers.Contract(contract_name, contract_abi, provider);
	// 		console.log(contract)
	// 		console.log(contract.name());
	// 		console.log(contract.tokenURI(1))
	// 	}

	// function load_data() {
		// extract_contract_details();
		// find the current NFT and add our information
		// let articles = document.getElementsByTagName('article');
		// for (let i = 0; i < articles.length; i++) {
		// 	let article = articles[i];

		// 	if (article.hasChildNodes()) {
		// 		let contract_address, asset_id;
		// 		let article_children = article.childNodes;
		// 		let found_div = false;
		// 		for (let j = 0; j < article_children.length; j++) {
		// 			// make sure we're only adding the info once
		// 			if (article_children[j] && article_children[j].className === 'RareView_AssetInfo--grid') {
		// 				found_div = true;
		// 				break;
		// 			}
		// 		}

		// 		for (var j = 0; j < article_children.length; j++) {
		// 			// get the current collection token id
		// 			let asset_link = article_children[j].getAttribute('href');
		// 			if (asset_link) {
		// 				asset_id = asset_link.replace('/assets/', '').split("/")[1]
		// 				break;
		// 			}
		// 		}
				
		// 		if (! found_div) {
		// 			// only inject the content once
		// 			let div = document.createElement("div"); 
		// 			div.className = 'RareView_AssetInfo--grid';
		// 			div.innerHTML = `
		// 				<div class="rank-div">
		// 					<span class="rank-data">Rank:</span>
		// 				</div>
		// 				<div class="floor-div">
		// 					<span class="floor-data">Floor:</span>
		// 					<svg height="100%" width="0.5em" version="1.1" viewBox="0 0 653 1063" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" focusable="false" style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2;">
		// 						<g transform="matrix(1,0,0,1,-1240,-305)">
		// 							<g transform="matrix(1,0,0,1,435.571,533.916)">
		// 								<g transform="matrix(1,0,0,1,729.844,-228.242)">
		// 									<g transform="matrix(1,0,0,1,-849.263,0.0312411)">
		// 										<path d="M923.983,541.032L1250.06,733.681L1250.06,0L923.983,541.032Z" style="fill: rgb(140, 140, 140); fill-rule: nonzero;"></path>
		// 									</g>
		// 									<g transform="matrix(1,0,0,1,-849.263,0.0312411)">
		// 										<path d="M1250.06,0L1250.06,733.682L1576.02,541.033L1250.06,0Z" style="fill: rgb(52, 52, 52); fill-rule: nonzero;"></path>
		// 									</g>
		// 									<g transform="matrix(1,0,0,1,-849.263,0.0312411)">
		// 										<path d="M923.983,602.813L1250.06,1062.2L1250.06,795.463L923.983,602.813Z" style="fill: rgb(140, 140, 140); fill-rule: nonzero;"></path>
		// 									</g>
		// 									<g transform="matrix(1,0,0,1,-849.263,0.0312411)">
		// 										<path d="M1250.06,795.463L1250.06,1062.2L1576.27,602.813L1250.06,795.463Z" style="fill: rgb(52, 52, 52); fill-rule: nonzero;"></path>
		// 									</g>
		// 									<g transform="matrix(1,0,0,1,-849.263,0.0312411)">
		// 										<path d="M1250.06,392.732L923.983,541.032L1250.06,733.681L1576.02,541.032L1250.06,392.732Z" style="fill-opacity: 0.66; fill-rule: nonzero;"></path>
		// 									</g>
		// 								</g>
		// 							</g>
		// 						</g>
		// 					</svg>
		// 					<span class="floor-price"></span>
		// 				</div>
		// 			`;
		// 			article.appendChild(div)
		// 		}
		// 	}
		// }
	// }

	// document.addEventListener('scroll', function(e) {
	// 	load_data();
	// });
	
	// load_data();
</script>
