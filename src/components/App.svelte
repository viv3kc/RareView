<script lang="ts">
	import Contract from './Contract.svelte';
	
	let current_href: string = window.location.href;
	let found_domain: boolean = false;
	let collection_name: string, contract: string, token_id: string;

	function init() {
		let domain: string = window.location.hostname;
		domain = domain.replace('http://', '').replace('https://', '').replace('www.','').split(/[/?#]/)[0];
		if (domain !== "opensea.io") {
			found_domain = false;
			return;
		}
		found_domain = true;
		collection_name = get_collection_from_url();
		let assets: string[] = get_assets_from_url();
		if (assets) {
			contract = assets[0];
			token_id = assets[1];
		} else {
			contract = undefined;
			token_id = undefined;
		}
	}

	function get_collection_from_url() {
		// get collection name from url
		let path: string = window.location.pathname;
		path = path.replace('http://', '').replace('https://', '').replace('www.','').replace('opensea.io','').replace('/collection', '').split(/[/?#]/)[1];
		return path;
	}

	function get_assets_from_url() {
		// get contract and token id from url
		let path: string = window.location.pathname;
		if (path.search('\/assets\/') === -1) return;
		
		let path_list: string[] = path.replace('http://', '').replace('https://', '').replace('www.','').replace('opensea.io','').replace('/assets', '').split(/[/?#]/);
		path_list.shift();
		return path_list;
	}

	init();

	// track url changes
	setInterval(() => {
		if (current_href !== window.location.href) {
			current_href = window.location.href;
			init();
		}
	}, 500);
</script>

{#if found_domain}
	<Contract
		{contract}
		{collection_name}
		{token_id}
	/>
{/if}