// This simple script targets the body and adds a thick red border
//
console.log("Borderify is active!");
async function retryWithDelay(func, maxAttempts, delayMs) {
	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			console.log(`Attempt ${attempt} of ${maxAttempts}...`);
			const result = await func();
			return result; 
		} catch (error) {
			console.error(`Attempt ${attempt} failed:`, error.message || error);
			if (attempt === maxAttempts) {
				throw new Error('Max retries reached. All attempts failed.');
			}
			console.log(`Retrying in ${delayMs} seconds...`);
			await new Promise(resolve => setTimeout(resolve, delayMs)); 
		}
	}
}

const removeFriendCarouselDiv = async () => {
	const friend_carousel_container = 'friend-carousel-container'
	const container_div = document.querySelector(`.${friend_carousel_container}`)
	if(container_div === null) {
		throw new Error('container div null')		
	}
	container_div.remove()
	console.log("successfully deleted carousel.")
};
const modifyCarousel = async () => {
	const carousel_container_class = 'react-friends-carousel-container'
	const carousel_container_div = document.getElementsByClassName(`${carousel_container_class}`)[0]
	console.log(carousel_container_div)
	//carousel_container_div.style.visibility = "hidden"
	const carousel_header_classes = ['container-header', 'people-list-header']
	const carousel_header_search_string = carousel_header_classes.reduce((accumulator, curr) => `${accumulator} ${curr}`, carousel_header_classes[0])
	console.log(carousel_header_search_string)
	const carousel_header_div = carousel_container_div.getElementsByClassName(`${carousel_header_search_string}`)[0]
	const header = carousel_header_div.querySelector(`h2`)
	const excluded_ids = [335458611]
	const user_id = await getUserId()
	const modified_friends = await getModifiedFriends(user_id, excluded_ids)
	const modified_friend_count = modified_friends.length
	header.textContent = `Friends (${modified_friend_count})` 
}
const tryModifyCarousel = async () => {
	try {
		const num_attempts = 100
		const cooldown = 100
		await retryWithDelay(modifyCarousel, num_attempts, cooldown)
	}
	catch (e) {
		console.error("tried but could not modify friend carousel: ", e)	
	}
}

const replaceCarousel = () => {
	const carousel_container_classname = 'friend-carousel-container'
	const original = document.querySelector(`.${carousel_container_classname}`)
	const new_carousel = document.createElement("div")
	const new_carousel_container_classname = 'extension-friend-carousel-container'
	new_carousel.classList.add(new_carousel_container_classname)
	original.replaceWith(new_carousel);
}
const tryReplaceCarousel = async () => {
	try {
		const num_attempts = 100
		const cooldown = 100
		await retryWithDelay(replaceCarousel, num_attempts, cooldown)
	}
	catch (e) {
		console.error("tried but could not modify friend carousel: ", e)	
	}
}
const tryRemovingFriendCarousel = async () => {
	try {
		const num_attempts = 15 
		const cooldown = 2000 // ms
		const result = await retryWithDelay(removeFriendCarouselDiv, num_attempts, cooldown); 
		console.log(`Result: ${result}`);
	} catch (e) {
		console.error(e.message);
	}
}

const users_api = "https://users.roblox.com"
const friends_api = "https://friends.roblox.com"

async function getUserId() {
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
async function getUserFriendCount(id) {
	const url = `${friends_api}/v1/users/${id}/friends/count` 
	try {
		const response = await fetch(url, {credentials: 'include'})
		const data = await response.json()
		console.log(data)
		return data.count
	}
	catch (e) {
		console.error("Could not get friend count: ", e)
	}
}
async function getUserFriends(id) {
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
async function getUserInfo(id) {
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
async function getModifiedFriends(id, excluded) {
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
async function main() {
	const userId = await getUserId()
	const userFriendIds = await getUserFriends(userId)
	const friendInfo = await Promise.all(userFriendIds.map( async (id) => getUserInfo(id)))
}

//tryRemovingFriendCarousel()
//tryModifyCarousel()
tryReplaceCarousel()
//main()
