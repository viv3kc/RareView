<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { get_data_from_chrome, chrome_data_exist, get_collection_address, store_entire_collection } from 'src/static/CollectionManagement';
	import Rarity from './Rarity.svelte';
	import { collection_data } from 'src/static/Store';

	export let contract: string = undefined;
	export let collection_name: string = undefined;
	export let token_id: string = undefined;

	async function generate_collection_data_from_opensea() {
		if (contract) {
			// check if collection already exists in chrome
			// if not extract name from contract and store the entire collection.
			let found_data_in_chrome: boolean = await chrome_data_exist(contract);
			if (found_data_in_chrome) return get_data_from_chrome(contract);
			
			// let's find the name of the collection from opensea
			let contract_name: string;
			let collection_detail = document.querySelector(".item--collection-detail");
			let collection_detail_div = collection_detail.children[0];
			let collection_div_children = collection_detail_div.children;
			for (let i = 0; i < collection_div_children.length; i++) {
				let c_node = collection_div_children[i].getAttribute('href');
				if (c_node) {
					contract_name = c_node.replace('/collection', '').split(/[/?#]/)[1];
					break;
				}
			}
			if (! contract_name) return;
			store_entire_collection(contract_name);
		} else {
			let contract_data = await get_collection_address(collection_name);
			let address: string = contract_data.address;
			// check if collection already exists in chrome
			let found_data_in_chrome: boolean = await chrome_data_exist(address);
			if (found_data_in_chrome) return get_data_from_chrome(address);
			
			store_entire_collection(collection_name);
		}
	}
	onMount(() => {
		collection_data.set(generate_collection_data_from_opensea());
	});
	afterUpdate(() => {
		collection_data.set(generate_collection_data_from_opensea());
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

<Rarity
	{token_id}
/>