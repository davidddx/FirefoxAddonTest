import {useState, useEffect, useMemo} from 'react';
import CarouselHeader from './CarouselHeader.jsx'
import CarouselContent from './CarouselContent.jsx'
import * as dataFetching from './UserDataFetching.js'
import {NumRowsContext, FriendDataContext} from './AppContext.jsx'
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
	const [friend_data, set_friend_data] = useState({})
	const friend_data_context_memo = useMemo(() => ({
		friend_data, 
		set_friend_data
	}), [friend_data])
	return (
		<div className={app_wrapper_class_name}>
			<NumRowsContext.Provider value={num_rows_context_memo}>
			<FriendDataContext.Provider value={friend_data_context_memo}>
				<CarouselHeader num_friends={user_friends.length}/>
				<CarouselContent friends={user_friends}/>
			</FriendDataContext.Provider>
			</NumRowsContext.Provider>
		</div>	
	);
}

export default App;
