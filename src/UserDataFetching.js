const users_api = "https://users.roblox.com"
const friends_api = "https://friends.roblox.com"
const thumbnails_api = "https://thumbnails.roblox.com"
export async function getUserId() {
	try {
		const authResponse = await fetch(`${users_api}/v1/users/authenticated`, {
			credentials: 'include' 
		});
		const data = await authResponse.json();
		return data.id

	} catch (e) {
		console.error("Communication error:", e);
	}
}

// id: user id
export async function getUserFriends(id) {
	try {
		console.log(id)
		const url = `${friends_api}/v1/users/${id}/friends`
		const authResponse = await fetch(url, {
			credentials: 'include' 
		});
		const data = await authResponse.json();
		const friend_ids = data.data.map(entry => entry.id)
		return friend_ids

	} catch (e) {
		console.error("Communication error:", e);
	}
}
// id: user id
export async function getUserInfo(id) {
	const url = `${users_api}/v1/users/${id}`
	try {
		const response = await fetch(url, {credentials: 'include'})
		const data = await response.json()
		console.log("data: ", data)
		return data
	}
	catch (e) {
		console.error("Error getting user info: ", e)

	}
}
// excluded: list of excluded id's from the friends list.
// id: user id
export async function getModifiedFriends(id, excluded) {
	try {
		const excluded_set = new Set(excluded)
		const friends = await getUserFriends(id)
		const friends_set = new Set(friends)
		const remove_set = excluded_set.intersection(friends_set)
		const result = [...friends_set.difference(remove_set)]
		return result
	}
	catch (e) {
		console.error("Could not get modified friends:", e)
	}
}
export async function getUserAvatarHeadshot(id) {
	const base_url = `${thumbnails_api}/v1/users/avatar-headshot`
	const params = new URLSearchParams({
		userIds: `${id}`,
		size: '150x150',
		format: 'Png',
		isCircular: true,
	});
	const paramsString = new URLSearchParams(params).toString();
	const request_url = `${base_url}?${paramsString}`
	try {
		const response = await fetch(request_url, {credentials: 'include'})
		const data = await response.json()
		return data.data[0].imageUrl
	}
	catch (e) {
		console.error(`Error getting user ${id} avatar headshot: `, e)
	}
}
