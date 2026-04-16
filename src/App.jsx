import {useRef, useState, useEffect, useMemo } from 'react';
import CarouselHeader from './CarouselHeader.jsx'
import CarouselContent from './CarouselContent.jsx'
import * as dataFetching from './UserDataFetching.js'
import {NumRowsContext, MaxNumRowsContext} from './AppContext.jsx'
function App() {
	const app_wrapper_class_name = "better-carousel-extension-container"
	const [user_id, set_user_id] = useState(null)
	const [user_friends, set_user_friends] = useState([])
	const [friends_presences, set_friends_presences] = useState({})
	const [loading_finished, set_loading_finished] = useState(false)
	const [refresh_button_pressed, set_refresh_button_pressed] = useState(true)
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
		set_max_num_rows(R)
	}
	const max_num_rows_context_memo = useMemo(() => ({
		max_num_rows, 
		update_max_num_rows
	}), [max_num_rows])
	const [friend_data, set_friend_data] = useState({})
	const friend_data_ref = useRef({})
	console.log("Friend data: ", friend_data)
	useEffect(() => {
		const fetchData = async () => {
			set_loading_finished(false)
			const user_id_fetched = await dataFetching.getUserId()
			set_user_id(user_id_fetched)
			const user_friends_fetched = []
			const show_followers = await dataFetching.showFollowers()
			const show_following = await dataFetching.showFollowing()
			if(show_followers) {
				const user_followers_fetched = await dataFetching.getUserFollowers(user_id_fetched)
				user_friends_fetched.push(...user_followers_fetched)
			}
			if(show_following) {
				const user_following_fetched = await dataFetching.getUserFollowing(user_id_fetched)
				user_friends_fetched.push(...user_following_fetched)
			}
			user_friends_fetched.push(...(await dataFetching.getModifiedFriends(user_id_fetched)))

			console.log("USER FRIENDS FETCHED: ", user_friends_fetched)
			const fetched_presences = await dataFetching.getUserPresences(user_friends_fetched)
			const user_friends_sorted = user_friends_fetched.sort((a, b) => dataFetching.compareIdsByPresence(a, b, fetched_presences))
			user_friends_sorted.forEach((F) => {
				dataFetching.getUserInfoAndHeadshot(F).then((value) => {
					const curr = {...friend_data_ref.current, [F]: value}
					friend_data_ref.current = curr
					set_friend_data(structuredClone(curr))
					console.log("Friend data ref current: ", friend_data_ref.current)
				}
				)
			})
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
	const [search_name, set_search_name] = useState('')
	let filtered_friends = user_friends.slice()
	if(search_name !== '') {
		const filter_function = (friend) => {
			if (!Object.hasOwn(friend_data, friend)) {
				return true	
			}
			const data = friend_data[friend]
			const displayName = data.displayName.toLowerCase()
			const name = data.name.toLowerCase()
			return name.search(search_name.toLowerCase()) !== -1 || displayName.search(search_name.toLowerCase()) !== -1 
		}
		filtered_friends = user_friends.filter((friend) => filter_function(friend)) 
	}
	const filtered_data = Object.fromEntries(
		Object.entries(friend_data)
		.filter(([key, val]) => filtered_friends.includes(parseInt(key)))
	)
	return (
		<div className={app_wrapper_class_name}>
			<NumRowsContext value={num_rows_context_memo}>
			<MaxNumRowsContext value={max_num_rows_context_memo}>
				<CarouselHeader num_friends={user_friends.length} on_header_press={on_header_click} loading_finished={loading_finished} friend_search_name={search_name} set_friend_search_name={set_search_name}/>
				<CarouselContent friends={filtered_friends} presences={friends_presences} friend_data={filtered_data}/>
			</MaxNumRowsContext>
			</NumRowsContext>
		</div>	
	);
}

export default App;
