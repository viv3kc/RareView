<script>
	// get current domain
	let domain = window.location.hostname;

	domain = domain.replace('http://', '').replace('https://', '').replace('www.','').split(/[/?#]/)[0];

	function load_data() {
		if (domain === "opensea.io") {
			// find the current NFT and add out content
			let articles = document.getElementsByTagName('article');
			for (var i = 0; i < articles.length; i++) {
				let article = articles[i];
				let last_child_class = article.lastChild.className;
				// only inject the content once
				if (last_child_class !== 'RareView_AssetInfo--grid') {
					let div = document.createElement("div"); 
					div.className = 'RareView_AssetInfo--grid';
					div.innerHTML = `
					    <div class="rank-div">
					    	<span class="rank-data">Rank:</span>
					    </div>
					    <div class="floor-div">
					    	<span class="floor-data">Floor:</span>
					    	<svg height="100%" width="100%" version="1.1" viewBox="0 0 653 1063" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" focusable="false" class="eth-icon" style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2;">
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
					    </div>
					`;
					article.appendChild(div)
				}
			}
		}
	}	

	document.addEventListener('scroll', function(e) {
		load_data();
	});
</script>

<style>
	.eth-icon {
		width: 0.5em;
	}
</style>