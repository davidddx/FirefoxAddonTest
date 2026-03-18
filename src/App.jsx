import {useState, useEffect, useMemo} from 'react';
import CarouselHeader from './CarouselHeader.jsx'
import CarouselContent from './CarouselContent.jsx'
import * as dataFetching from './UserDataFetching.js'
import {NumRowsContext} from './AppContext.jsx'
function App() {
	const app_wrapper_class_name = "better-carousel-extension-container"
	const [user_id, set_user_id] = useState(null)
	const [user_friends, set_user_friends] = useState([])

	const test_excluded = [2036305627] 
	useEffect(() => {
		const fetchData = async () => {
			const user_id_fetched = await dataFetching.getUserId()
			const user_friends_fetched = await dataFetching.getModifiedFriends(user_id_fetched, test_excluded)
			set_user_id(user_id_fetched)
			set_user_friends(user_friends_fetched)
		}
		fetchData()

	}, [])
	const [num_rows, set_num_rows] = useState(1)
	const update_num_rows = (val) => {
		if (val <= 0) {
			set_num_rows(1)
			return
		}
		set_num_rows(val)
	}
	const num_rows_context_memo = useMemo(() => ({
		num_rows,
		update_num_rows	
	}), [num_rows])
	const friend_cache = {}
	const presence_cache = {}
	let fetched_presence = false
	if (user_friends.length > 0) {
		if(!fetched_presence) {
			fetched_presence = true
			const fetchPresenceData = async () => {
				try {
					const D = await dataFetching.getUserPresences(user_friends);
					Object.assign(presence_cache, ...D)
				} catch (e) {
					console.error("Could not fetch presence: ", e);
				}
			};
			fetchPresenceData()
		}
	}
	const compareIds = (a, b) => {
		if (!Object.hasOwn(presence_cache, a) && !Object.hasOwn(presence_cache, b)) {
			return 0
		}
		if (!Object.hasOwn(presence_cache, a)) {
			return -1
		}
		if (!Object.hasOwn(presence_cache, b)) {
			return 1
		}
		if (presence_cache[a][dataFetching.presence] === in_game) {
			return 1
		}
		if (presence_cache[b][dataFetching.presence] === in_game) {
			return -1
		}
		if (presence_cache[a][dataFetching.presence] === in_studio) {
			return 1
		}
		if (presence_cache[b][dataFetching.presence] === in_studio) {
			return -1
		}
		if (presence_cache[a][dataFetching.presence] === online) {
			return 1
		}
		if (presence_cache[b][dataFetching.presence] === online) {
			return -1
		}
		if (presence_cache[a][dataFetching.presence] === invisible) {
			return 1
		}
		if (presence_cache[b][dataFetching.presence] === invisible) {
			return -1
		}
		if (presence_cache[a][dataFetching.presence] === offline) {
			return 1
		}
		if (presence_cache[b][dataFetching.presence] === offline) {
			return -1
		}
		return 1
	}
	const sorted_friends = user_friends.sort((a, b) => compareIds(a, b))
	console.log("Sorted friends: ", sorted_friends)
	console.log("Presence cache: ", presence_cache)
	return (
		<div className={app_wrapper_class_name}>
			<NumRowsContext.Provider value={num_rows_context_memo}>
				<CarouselHeader num_friends={user_friends.length}/>
				<CarouselContent friends={sorted_friends} cache={friend_cache} presence_cache={presence_cache}/>
			</NumRowsContext.Provider>
		</div>	
	);
}

export default App;
