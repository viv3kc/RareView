<script>
	import { ethers } from "ethers";
	import { rareFetch } from "../static/rare_view_management.js";

	// let linkpool = "https://main-rpc.linkpool.io/";
	// const connection = new ethers.providers.JsonRpcProvider(linkpool);

	// get current domain
	let domain = window.location.hostname;
	domain = domain.replace('http://', '').replace('https://', '').replace('www.','').split(/[/?#]/)[0];
	
	// get collection name	
	let collection = "";
	let collection_path = window.location.pathname;
	collection_path = collection_path.replace('http://', '').replace('https://', '').replace('www.','').replace('opensea.io','').split(/[/?#]/);
	for (let i = 0; i < collection_path.length; i++) {
		if (collection_path[i] && collection_path[i] === "collection") {
			if (collection_path[i+1]) {
				collection = collection_path[i+1];
			}
			break;
		}
	}

	function extract_contract_details(data) {
		return data.then(d => {
			if (d && d.hasOwnProperty("assets")) {
				let first_asset = d.assets[0]
				if (first_asset.hasOwnProperty("asset_contract")) {
					let contract_address = first_asset.asset_contract.address;
					return fetch_contract("collection_address", contract_address)
				}
			}
		})
	}

	function fetch_contract(type, address) {
		// fetch the contract and individual ids
		let url;
		switch(type) {
			case "assets":
				url = "https://api.opensea.io/api/v1/assets";

				let assets_api = new URL(url);
				let params = assets_api.searchParams;
				params.set('collection', collection);
				// params.set('token_ids', address);
				assets_api.search = params.toString();
				url = assets_api.toString();
				break;
			case "collection_stats":
				if (collection) {
					url = "https://api.opensea.io/api/v1/collection/" + collection + "/stats";
				}
				break;
			case "collection_address":
				url = "https://api.opensea.io/api/v1/assets?asset_contract_address=" + address;
				break;
		}
		if (! url) { return; }
		console.log(url)
		return rareFetch(url);
	}

	function load_data() {
		if (domain === "opensea.io") {
			let collection_stats = fetch_contract("collection_stats");
			console.log(extract_contract_details(fetch_contract("assets")))
			// find the current NFT and add our information
			let articles = document.getElementsByTagName('article');
			for (let i = 0; i < articles.length; i++) {
				let article = articles[i];

				if (article.hasChildNodes()) {
					let contract_address, asset_id;
					let article_children = article.childNodes;
					let found_div = false;
					for (let j = 0; j < article_children.length; j++) {
						// make sure we're only adding the info once
						if (article_children[j] && article_children[j].className === 'RareView_AssetInfo--grid') {
							found_div = true;
							break;
						}
					}

					for (var j = 0; j < article_children.length; j++) {
						// get the current collection token id
						let asset_link = article_children[j].getAttribute('href');
						if (asset_link) {
							asset_id = asset_link.replace('/assets/', '').split("/")[1]
							break;
						}
					}
					
					if (! found_div) {
						// only inject the content once
						let div = document.createElement("div"); 
						div.className = 'RareView_AssetInfo--grid';
						div.innerHTML = `
					    <div class="rank-div">
					    	<span class="rank-data">Rank:</span>
					    </div>`;
						collection_stats.then(data => {
							if (data) {
								div.innerHTML += `
							    <div class="floor-div">
							    	<span class="floor-data">Floor:</span>
							    	<svg height="100%" width="0.5em" version="1.1" viewBox="0 0 653 1063" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" focusable="false" style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2;">
								    	<g transform="matrix(1,0,0,1,-1240,-305)">
								    		<g transform="matrix(1,0,0,1,435.571,533.916)">
								    			<g transform="matrix(1,0,0,1,729.844,-228.242)">
								    				<g transform="matrix(1,0,0,1,-849.263,0.0312411)">
								    					<path d="M923.983,541.032L1250.06,733.681L1250.06,0L923.983,541.032Z" style="fill: rgb(140, 140, 140); fill-rule: nonzero;"></path>
								    				</g>
								    				<g transform="matrix(1,0,0,1,-849.263,0.0312411)">
								    					<path d="M1250.06,0L1250.06,733.682L1576.02,541.033L1250.06,0Z" style="fill: rgb(52, 52, 52); fill-rule: nonzero;"></path>
								    				</g>
								    				<g transform="matrix(1,0,0,1,-849.263,0.0312411)">
								    					<path d="M923.983,602.813L1250.06,1062.2L1250.06,795.463L923.983,602.813Z" style="fill: rgb(140, 140, 140); fill-rule: nonzero;"></path>
								    				</g>
								    				<g transform="matrix(1,0,0,1,-849.263,0.0312411)">
								    					<path d="M1250.06,795.463L1250.06,1062.2L1576.27,602.813L1250.06,795.463Z" style="fill: rgb(52, 52, 52); fill-rule: nonzero;"></path>
								    				</g>
								    				<g transform="matrix(1,0,0,1,-849.263,0.0312411)">
								    					<path d="M1250.06,392.732L923.983,541.032L1250.06,733.681L1576.02,541.032L1250.06,392.732Z" style="fill-opacity: 0.66; fill-rule: nonzero;"></path>
								    				</g>
								    			</g>
								    		</g>
								    	</g>
							    	</svg>
							    	<span class="floor-price">${data.stats.floor_price}</span>
							    </div>
								`;
							}
						});
						article.appendChild(div)
					}
				}
			}
		}
	}

	document.addEventListener('scroll', function(e) {
		load_data();
	});
</script>