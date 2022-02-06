export function rareFetch(path) {
	let res = fetch(path).catch(err => {
		console.error("Failed to get data from opensea", err);
	});

	return res.then(response => {
		if (response.status !== 200 && response.status !== 502) {
			console.error("Failed to get data from opensea");
			return;
		}
		return response.json();
	});
}