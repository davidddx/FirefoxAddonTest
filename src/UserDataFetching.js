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
const presence_url = "https://presence.roblox.com"
export const presence = "PRESENCE"
export const online = "ONLINE"
export const in_game = "INGAME"
export const offline = "OFFLINE"
export const in_studio = "INSTUDIO"
export const invisible = "INVISIBLE"
export const game_id = "GAME_ID"
export const place_id = "PLACE_ID"
export const last_location = "LAST_LOCATION"
export async function getUserPresences(ids) {
	const base_url = `${presence_url}/v1/presence/users`
	try {
		const response = await fetch(base_url, {
			method: 'POST',	
			body: JSON.stringify({userIds: ids}),
			credentials: 'include'
		})
		console.log("RESPONSE: ", response)
		const data = await response.json()
		const editFormat = (D) => {
			const id = D.userId
			let curr_presence = "offline"
			let curr_game_id = null
			let curr_place_id = null
			switch (D.userPresenceType) {
				case 1:
					curr_presence = online
					break;
				case 2:
					curr_presence = in_game 
					curr_game_id = D.gameId
					curr_place_id = D.placeId
					break;
				case 3: 
					curr_presence = in_studio
					curr_game_id = D.gameId
					curr_place_id = D.placeId
					break;
				case 4:
					curr_presence = invisible
					curr_game_id = D.gameId
					curr_place_id = D.placeId
					break;
			}
			const entries = {
				[presence]: curr_presence,
				[game_id]: curr_game_id,
				[place_id]: curr_place_id,
				[last_location]: D.lastLocation
			}
			return {
				[id]: entries,
			}
		}
		console.log("USERS PRESENCE: ", data)
		const rv = data.userPresences.map(D => editFormat(D))
		console.log("RV: ", rv)
		return rv
	}
	catch (e) {
		console.error(`Error getting presence for users ${ids}: `, e)
	}
}
