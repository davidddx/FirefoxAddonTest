const storage = (typeof browser === 'undefined') ? chrome.storage : browser.storage

export async function saveData(key, value) {
	try {
		await storage.local.set({[key]: value})
	}
	catch(e) {
		console.error(`error saving ${value}, ${e}`)
	}
}
export async function loadData(key) {
	try {
		const result = await storage.local.get([key]);
		console.log("RESULT: ", result)
		if(Object.keys(result).length === 0) {
			return null
		}
		return result[key];
	}
	catch (e) {
		console.error(`Could not load data for ${key}`, e) 
	}
	return null
}
