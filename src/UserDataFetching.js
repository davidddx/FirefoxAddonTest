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

export async function getUserFollowers(userId) {
	let followers = [];
	let cursor = null;
	let hasNextPage = true;

	console.log(`Starting fetch for User ID: ${userId}...`);

	while (hasNextPage) {
		let url = `${friends_api}/v1/users/${userId}/followers?limit=100`;
		if (cursor) {
			url += `&cursor=${cursor}`;
		}
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			followers = followers.concat(data.data.map((D) => D.id));
			cursor = data.nextPageCursor;
			hasNextPage = cursor !== null;
			console.log(`Fetched ${followers.length} followers so far...`);
		} catch (error) {
			console.error("Fetch failed:", error);
			hasNextPage = false;
		}
	}
	console.log("Finished! Total followers collected:", followers.length);
	console.log("Followers: ", followers)
	return followers;
}

// Usage:
// getAllFollowers(1).then(list => console.log(list));

export async function getUserFollowing(id) {
	try {
		const url = `${friends_api}/v1/users/${id}/followings`
		const authResponse = await fetch(url, {
			credentials: 'include' 
		});
		const data = await authResponse.json();
		const following_ids = data.data.map(entry => entry.id)
		return following_ids
	}
	catch (e) {
		console.error("communication error: ", e)
	}
}

// id: user id
export async function getUserInfo(id) {
	const url = `${users_api}/v1/users/${id}`
	try {
		const response = await fetch(url, {credentials: 'include'})
		const data = await response.json()
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
export async function getUserInfoAndHeadshot(id) {
	try {
		const info = await getUserInfo(id)
		const headshot = await getUserAvatarHeadshot(id)
		const rv = {
			...info,
			headshot: headshot,
		}
		return rv
	}
	catch(e) {
		console.error(`Error getting user ${id} headshot and info: `, e) 
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
export async function getUserPresences(user_ids) {
	const base_url = `${presence_url}/v1/presence/users`
	const chunkArray = (arr, size_to_chunk) => {
		const rv = []
		let idx = 0
		let inner_arr = []
		for(let i = 0; i < arr.length; ++i) {
			if(idx == size_to_chunk) {
				rv.push(inner_arr)
				inner_arr = []		
				idx = 0
			}
			inner_arr.push(arr[i])
			idx += 1
		}
		console.log("CHUNKED ARRAY: ")
		console.log(rv)
		return rv
	}
	const chunk_size = 100
	const chunked_arr = chunkArray(user_ids, chunk_size)
	for(const ids of chunked_arr) {
		try {
			const response = await fetch(base_url, {
				method: 'POST',	
				body: JSON.stringify({userIds: ids}),
				credentials: 'include'
			})
			const data = await response.json()
			const editFormat = (D) => {
				const id = D.userId
				let curr_presence = offline 
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
			const reformatted = data.userPresences.map(D => editFormat(D))
			const rv = Object.assign({}, ...reformatted)
			return rv
		}
		catch (e) {
			console.error(`Error getting presence for users ${ids}: `, e)
		}
	}
}
export const compareIdsByPresence = (a, b, presences) => {
	if (!Object.hasOwn(presences, a) && !Object.hasOwn(presences, b)) {
		return 0
	}
	if (!Object.hasOwn(presences, a)) {
		return 1
	}
	if (!Object.hasOwn(presences, b)) {
		return -1
	}
	if (presences[a][presence] === in_game) {
		return -1
	}
	if (presences[b][presence] === in_game) {
		return 1
	}
	if (presences[a][presence] === in_studio) {
		return -1
	}
	if (presences[b][presence] === in_studio) {
		return 1
	}
	if (presences[a][presence] === online) {
		return -1
	}
	if (presences[b][presence] === online) {
		return 1
	}
	if (presences[a][presence] === invisible) {
		return -1
	}
	if (presences[b][presence] === invisible) {
		return 1
	}
	if (presences[a][presence] === offline) {
		return -1
	}
	if (presences[b][presence] === offline) {
		return 1
	}
	return -1
}
const storage = (typeof browser === 'undefined') ? chrome.storage : browser.storage
const show_account_create_date_keyname = "better-carousel-show-create-date";
const show_friend_userid_keyname = "better-carousel-show-friend-userid";
const show_last_online_keyname = "better-carousel-show-last-online";
const show_followers_keyname = "better-carousel-show-followers";
const show_following_keyname = "better-carousel-show-following";

async function getOrInitBoolean(key) {
	try {
		let data = await loadData(key);
		if (data === null) {
			await saveData(key, false);
			data = false;
		}
		return data;
	} catch (e) {
		console.error(`Error fetching key ${key}: `, e);
		return false; 
	}
}

export async function showAccountCreateDate() {
	return await getOrInitBoolean(show_account_create_date_keyname);
}

export async function showFriendUserId() {
	return await getOrInitBoolean(show_friend_userid_keyname);
}

export async function showLastOnline() {
	return await getOrInitBoolean(show_last_online_keyname);
}

export async function showFollowers() {
	return await getOrInitBoolean(show_followers_keyname);
}

export async function showFollowing() {
	return await getOrInitBoolean(show_following_keyname);
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
