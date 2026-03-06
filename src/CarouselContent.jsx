import { useState, useEffect, useRef, useLayoutEffect} from 'react'
import { getUserInfo, getUserAvatarHeadshot } from './UserDataFetching.js'
function getElementTotalWidth(element) {
	const style = window.getComputedStyle(element);
	const elementWidth = element.offsetWidth;
	const marginLeft = parseFloat(style.marginLeft) || 0;
	const marginRight = parseFloat(style.marginRight) || 0;
	const totalWidth = elementWidth + marginLeft + marginRight;
	return totalWidth;
}

function FriendTile({info, ref}) {
	console.log("Info ", info)
	console.log("Ref ", ref)
	let headshot_src = ""
	if (info != undefined) {
		headshot_src = info.headshot	
	}
	if (ref != undefined) {
		return (
			<div className="better-carousel-friend-tile" ref={ref}>
				<span className="better-carousel-image-box">
					<img src={headshot_src}/>
				</span>
			</div>
		)
	}
	return (
		<div className="better-carousel-friend-tile">
			<span className="better-carousel-image-box">
				<img src={headshot_src}/>
			</span>
		</div>
	)


}
function CarouselContent({friends}) {
	const [friend_info, set_friend_info] = useState({}) // map {friend_id : info of this friend.}
	const [default_user_info, set_default_user_info] = useState(null)
	const containerRef = useRef(null)
	const tileRef = useRef(null)
	const [max_tiles_per_row, set_max_tiles_per_row] = useState(0)
	const [is_measuring, set_is_measuring] = useState(true);
	console.log("Container ref: ", containerRef)
	// calculate tile fit
	useLayoutEffect(() => {
		const calculateFit = () => {
			console.log("Container ref: ", containerRef)
			console.log("Tile ref: ", tileRef)
			if (!containerRef.current) return 0;
			if (!tileRef.current) return 0;
			const container_width = getElementTotalWidth(containerRef.current) 
			const tile_width = getElementTotalWidth(tileRef.current);
			const horizontal_fit = Math.floor(container_width / tile_width);
			const total_fit = horizontal_fit 
			set_max_tiles_per_row(total_fit)
			console.log("Tile fit: ", total_fit)
			set_is_measuring(false);
		};
		calculateFit();
		window.addEventListener('resize', () => {
			set_is_measuring(true); // Switch back to measurement mode on resize
			calculateFit();
		});
		return () => window.removeEventListener('resize', calculateFit);
	}, [default_user_info]);
	// load api data
	useEffect( () => {
		const friend_info_cpy = {...friend_info}
		const fetchData = async () => {
			for (const friend of friends) {
				const info = await getUserInfo(friend)
				console.log("info: ", info)
				const headshot = await getUserAvatarHeadshot(friend)
				console.log("Headshot: ", headshot)	
				const info_entry = {...info, headshot: headshot}
				friend_info_cpy[friend] = info_entry
			}
			console.log(friend_info_cpy)
			set_friend_info(friend_info_cpy)
		}
		const fetchBuilderman = async() => {
			const builderman_id = 156
			const builderman_info = await getUserInfo(builderman_id)
			console.log("info: ", builderman_info)
			const headshot_builderman = await getUserAvatarHeadshot(builderman_id)
			console.log("Headshot: ", headshot_builderman)
			const builderman_info_entry = {...builderman_info, headshot: headshot_builderman}
			set_default_user_info(builderman_info_entry)
		}
		fetchBuilderman()
		fetchData()
	}, [friends])
	console.log("Rerender Carousel Content")
	const left = 0
	const sliced_friends = friends.slice(left, max_tiles_per_row)
	return (
		<div className="better-carousel-content" ref={containerRef}>
			{default_user_info != null && is_measuring && <FriendTile info={default_user_info} key={default_user_info.id} ref={tileRef}/>}
			{sliced_friends.map((friend) =>  <FriendTile info={friend_info[friend]} key={friend}/>)} 
		</div>
	)
}

export default CarouselContent;
