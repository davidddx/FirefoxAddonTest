import {useState, useEffect, useMemo, useRef} from 'react';
import CarouselHeader from './CarouselHeader.jsx'
import CarouselContent from './CarouselContent.jsx'
import * as dataFetching from './UserDataFetching.js'
import {FriendDataContext, NumRowsContext, MaxNumRowsContext} from './AppContext.jsx'
function App() {
	const app_wrapper_class_name = "better-carousel-extension-container"
	const [user_id, set_user_id] = useState(null)
	const [user_friends, set_user_friends] = useState([])
	const [friends_presences, set_friends_presences] = useState({})
	const test_excluded = [2036305627] 
	const [loading_finished, set_loading_finished] = useState(false)
	const [refresh_button_pressed, set_refresh_button_pressed] = useState(true)
	useEffect(() => {
		const fetchData = async () => {
			set_loading_finished(false)	
			const user_id_fetched = await dataFetching.getUserId()
			const user_friends_fetched = await dataFetching.getModifiedFriends(user_id_fetched, test_excluded)
			set_user_id(user_id_fetched)
			const fetched_presences = await dataFetching.getUserPresences(user_friends_fetched)
			fetched_presences[3117440379][dataFetching.presence] = dataFetching.online
			fetched_presences[335458611][dataFetching.presence] = dataFetching.in_game
			fetched_presences[110211612][dataFetching.presence] = dataFetching.in_studio
			const user_friends_sorted = user_friends_fetched.sort((a, b) => dataFetching.compareIdsByPresence(a, b, fetched_presences))
			set_user_id(user_id)
			console.log("SETTING USER FRIENDS")
			set_user_friends(user_friends_sorted)
			set_friends_presences(fetched_presences)
			set_loading_finished(true)
		}
		if (refresh_button_pressed) {
			fetchData()
			set_refresh_button_pressed(false)
		}
	}, [refresh_button_pressed])
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
	const [max_num_rows, set_max_num_rows] = useState(1)
	const update_max_num_rows = (R) => {
		console.log("Updating max num rows to ", R)
		set_max_num_rows(R)
	}
	const max_num_rows_context_memo = useMemo(() => ({
		max_num_rows, 
		update_max_num_rows
	}), [max_num_rows])
	console.log("Sorted friends: ", user_friends)
	console.log("Presences: ", friends_presences)
	const friend_cache = useRef({}); 
	const update_friend_cache = (userId, data) => {
		friend_cache.current[userId] =  data;
		console.log("Cache updated silently:", friend_cache.current);
	};
	const on_header_click = (e) => {
		if (!loading_finished) {
			return
		}
		const svg = e.target.closest("svg")
		if (svg === null) {
			return
		}
		set_refresh_button_pressed(true)
	}
	const friend_data_context_value = {friend_cache, update_friend_cache}
	const [search_name, set_search_name] = useState('')
	let filtered_friends = user_friends.slice()
	if(search_name !== '') {
		filtered_friends = user_friends.filter((friend) => friend.search(search_name) !== -1) 
		console.log("FILTERED FRIENDS: ", filtered_friends)
	}
	return (
		<div className={app_wrapper_class_name}>
			<NumRowsContext value={num_rows_context_memo}>
			<FriendDataContext value={friend_data_context_value}>
			<MaxNumRowsContext value={max_num_rows_context_memo}>
				<CarouselHeader num_friends={user_friends.length} on_header_press={on_header_click} loading_finished={loading_finished} friend_search_name={search_name} set_friend_search_name={set_search_name}/>
				<CarouselContent friends={filtered_friends} presences={friends_presences}/>
			</MaxNumRowsContext>
			</FriendDataContext>
			</NumRowsContext>
		</div>	
	);
}

export default App;
