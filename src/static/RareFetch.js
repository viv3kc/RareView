export function rareFetch(path, request_options = undefined) {
	let res;
	if (request_options) {
		res = fetch(path, request_options).catch(err => {
			console.error("Failed to get data from " + path, err);
		});
	} else {
		res = fetch(path).catch(err => {
			console.error("Failed to get data from " + path, err);
		});
	}

	return res.then(response => {
		if (response.status !== 200 && response.status !== 502) {
			console.error("Failed to get data from " + path);
			return;
		}
		return response.json();
	});
}