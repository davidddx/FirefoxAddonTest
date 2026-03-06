import {useState, useEffect} from 'react';
import CarouselHeader from './CarouselHeader.jsx'
import CarouselContent from './CarouselContent.jsx'
import * as dataFetching from './UserDataFetching.js'
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
	return (
		<div className={app_wrapper_class_name}>
			<CarouselHeader num_friends={user_friends.length}/>
			<CarouselContent friends={user_friends}/>
		</div>	
	);
}

export default App;
