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
	console.log("User id" + user_id)
	console.log("user_friends: ", user_friends)
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
		console.log("USER FRIENDS: ", user_friends)
		if(!fetched_presence) {
			fetched_presence = true
			
			const fetchPresenceData = async (L) => {
				if (L >= user_friends.length) return presence_cache;
				const processing_length = 50;
				const R = Math.min(L + processing_length, user_friends.length);
				const slice = user_friends.slice(L, R);
				try {
					const D = await dataFetching.getUserPresences(slice);
					if (D) Object.assign(presence_cache, D);
				} catch (e) {
					console.error(e);
				}
				const cd  = 350
				await wait(cd); 
				console.log("presence_cache: ", presence_cache)
				fetchPresenceData(L + processing_length)
			};
			fetchPresenceData()
		}
	}
	return (
		<div className={app_wrapper_class_name}>
			<NumRowsContext.Provider value={num_rows_context_memo}>
				<CarouselHeader num_friends={user_friends.length}/>
				<CarouselContent friends={user_friends} cache={friend_cache} presence_cache = {presence_cache}/>
			</NumRowsContext.Provider>
		</div>	
	);
}

export default App;
