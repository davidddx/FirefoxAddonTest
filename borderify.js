// This simple script targets the body and adds a thick red border
const prefers_dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
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

const replaceCarousel = () => {
	const carousel_container_classname = 'friend-carousel-container'
	const original = document.querySelector(`.${carousel_container_classname}`)
	const new_carousel = document.createElement("div")
	original.replaceWith(new_carousel);
	const new_carousel_container_classname = 'extension-friend-carousel-container'
	new_carousel.classList.add(new_carousel_container_classname)
	let arrow_color = "#FFFFFF"
	let muted_arrow_color = "#F5F5DC"
	if(!prefers_dark) {
		arrow_color = "#000000"
		muted_arrow_color = "#708090"
	}
	const right_arrow_svg = `
	<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	  <g id="Arrow / Arrow_Right_MD">
	    <path id="Vector" d="M5 12H19M19 12L13 6M19 12L13 18" stroke="${arrow_color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
	  </g>
	</svg>
	`;
	const left_arrow_svg = `
	<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	  <g id="Arrow / Arrow_Left_MD">
	    <path id="Vector" d="M19 12H5M5 12L11 18M5 12L11 6" stroke="${arrow_color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
	  </g>
	</svg>
	`;
	
	const header_class_name = 'extension-friend-carousel-header' 
	const body_class_name = 'extension-friend-carousel-body'
	const header_div = document.createElement("div")
	const body_div = document.createElement("div")
	header_div.classList.add(header_class_name)
	body_div.classList.add(body_class_name)
	body_div.innerHTML += `${left_arrow_svg}`;
	//
	//
	//
	body_div.innerHTML += `${right_arrow_svg}`;
	new_carousel.appendChild(header_div)
	new_carousel.appendChild(body_div)

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
