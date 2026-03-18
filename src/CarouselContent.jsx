import { useState, useEffect, useRef, useLayoutEffect, useContext} from 'react'
import { getUserInfo, getUserAvatarHeadshot } from './UserDataFetching.js'
import { NumRowsContext, FriendDataContext } from './AppContext.jsx'

function getElementTotalWidth(element) {
	const style = window.getComputedStyle(element);
	const elementWidth = element.offsetWidth;
	const marginLeft = parseFloat(style.marginLeft) || 0;
	const marginRight = parseFloat(style.marginRight) || 0;
	const totalWidth = elementWidth + marginLeft + marginRight;
	return totalWidth;
}

const right_arrow_id = "better-carousel-right-arrow-id"
const left_arrow_id = "better-carousel-left-arrow-id"

function LeftArrow({clickable}) {
	console.log("Left arrow rendering")
	const [hover, set_hover] = useState(false)
	const mouse_enter_handler = () => set_hover(true)
	const mouse_leave_handler = () => set_hover(false)
	let container_class_name = "better-carousel-arrow-tile"
	if (hover) {
		container_class_name = "better-carousel-arrow-tile-focused"
	}
	if (!clickable) {
		container_class_name = "better-carousel-arrow-tile-muted"
	}
	return (
		<div className={container_class_name} style={{left: 0, borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px'}} onMouseEnter={mouse_enter_handler} onMouseLeave={mouse_leave_handler} id={left_arrow_id}>
			<div className="better-carousel-arrow-wrapper">
				<svg className="better-carousel-arrow-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
					<path d="M20 4V20M4 12H16M4 12L8 8M4 12L8 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
		</div>
	)
}

function RightArrow({clickable}) {
	console.log("Right arrow rendering")
	let container_class_name = "better-carousel-arrow-tile"
	const [hover, set_hover] = useState(false)
	const mouse_enter_handler = () => set_hover(true)
	const mouse_leave_handler = () => set_hover(false)
	if (hover) {
		container_class_name = "better-carousel-arrow-tile-focused"
	}
	if (!clickable) {
		container_class_name = "better-carousel-arrow-tile-muted"
	}
	return (
		<div className={container_class_name} style={{right: 0, borderTopRightRadius: '12px', borderBottomRightRadius: '12px'}} onMouseEnter={mouse_enter_handler} onMouseLeave={mouse_leave_handler} id={right_arrow_id}>
			<div className="better-carousel-arrow-wrapper" >
				<svg className="better-carousel-arrow-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M4 4V20M8 12H20M20 12L16 8M20 12L16 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
		</div>
	)
}

const default_user_id = 156 // builderman roblox id

function FriendTile({id, ref, edit_max_tiles}) {
	const [info, set_info] = useState({})
	const friendDataContextVal = useContext(FriendDataContext)
	useEffect(() => {
		const fetchdata = async () => {
			const cache = friendDataContextVal.friend_cache.current
			const update_cache = friendDataContextVal.update_friend_cache
			console.log(`cache before fetchdata on ${id}: `, cache)
			if (Object.hasOwn(cache, id)) {
				set_info(cache[id])
				return
			}
			const fetched_user_info = await getUserInfo(id)
			if (fetched_user_info.isBanned) {
				set_info(null)
				update_cache(id, null)
				return
			}
			const headshot = await getUserAvatarHeadshot(id)
			console.log("fetched_user_info: ", fetched_user_info)
			console.log("Headshot: ", headshot)	
			const entry = {...fetched_user_info, headshot: headshot}
			set_info(entry)
			update_cache(id, entry)
			console.log(`cache after fetchdata on ${id}: `, cache)
			if (id === default_user_id) {
				// need to rerender parent the first time.
				edit_max_tiles()
			}
		}
		console.log("Fetch data for id ", id)
		fetchdata()
	}, [id])
	let headshot_src = ""
	let username = ""
	let display_name = ""
	if (info !== undefined) {
		headshot_src = info.headshot	
		username = info.name
		display_name = info.displayName
	}
	console.assert(info !== null, "info === null implies a banned user")

	const [hover, set_hover] = useState(false)
	const mouse_enter_handler = (e) => {
		set_hover(true)
		console.log("Entered friend tile " + id)
	}
	const mouse_leave_handler = (e) => {
		set_hover(false)
		console.log("Left friend tile " + id)
	}
	let tile_class_name = "better-carousel-friend-tile"
	if (hover) {
		tile_class_name += ' ' + 'better-carousel-focused-background'
	}
	const redirecting_link = `https://www.roblox.com/users/${id}/profile` 
	const avatar_card_class_name = "better-carousel-avatar-card"
	if (ref !== undefined) {
		console.log(" ref not undefined ")
		console.log(" id: ", id)
		return (
			<div className="better-carousel-friend-tile" ref={ref} style={{visibility: 'hidden', position:'fixed'}}>
				<div className={avatar_card_class_name}>
					<span className="better-carousel-image-box">
						<img src={headshot_src}/>
					</span>
				</div>
			</div>
		)
	}
	const generatePresenceDiv = () => {
		return (null)
	}
	return (
		<a href={redirecting_link}>
			<div className={tile_class_name} onMouseEnter={mouse_enter_handler} onMouseLeave={mouse_leave_handler}>
				<div className={avatar_card_class_name}>
					<span className="better-carousel-image-box">
						<img src={headshot_src}/>
					</span>
					{generatePresenceDiv()}
				</div>
				<div className="better-carousel-text-content better-carousel-bold-title">
					{display_name}
				</div>
				<div className="better-carousel-text-content">
					{username}
				</div>
			</div>
		</a>
	)
}
function CarouselContent({friends, presences}) {
	const containerRef = useRef(null)
	const tileRef = useRef(null)
	const [max_tiles_per_row, set_max_tiles_per_row] = useState(0)
	const [hover, set_hover] = useState(false);
	const mouse_enter_handler = (e) => {
		set_hover(true)
		console.log("mouse entered friend carousel")
	}
	const mouse_leave_handler = (e) => {
		set_hover(false)
		console.log("mouse left friend carousel")
	}
	console.log("Container ref: ", containerRef)
	// calculate tile fit
	const calculateFit = () => {
		console.log("Container ref: ", containerRef)
		console.log("Tile ref: ", tileRef)
		if (!containerRef.current) return 0;
		console.log("Tile ref: ", tileRef)
		if (!tileRef.current) return 0;
		const container_width = getElementTotalWidth(containerRef.current) 
		const tile_width = getElementTotalWidth(tileRef.current);
		const horizontal_fit = Math.floor(container_width / tile_width);
		const total_fit = horizontal_fit 
		return total_fit
	};
	const editMaxTiles = () => {
		const fit = calculateFit();
		set_max_tiles_per_row(fit)
	}
	useLayoutEffect(() => {
		const total_fit = calculateFit();
		set_max_tiles_per_row(total_fit)
		console.log("Tile fit: ", total_fit)
		window.addEventListener('resize', editMaxTiles)
		return () => window.removeEventListener('resize', editMaxTiles);
	}, []);
	const num_rows_context_val = useContext(NumRowsContext)
	const num_rows = num_rows_context_val.num_rows
	const [left, set_left] = useState(0)
	const max_left = Math.max(0, (friends.length - max_tiles_per_row*num_rows))
	if (left > max_left) {
		// needs a rerender in this case
		set_left(max_left)
	}
	const sliced_friends = friends.slice(left, left + max_tiles_per_row)
	let left_ptr = left
	const carousel_rows = []
	for (let i = 0; i < num_rows; ++i, left_ptr = left_ptr + max_tiles_per_row) {
		if (left_ptr >= friends.length) {
			break
		}
		const sliced_friends_row = friends.slice(left_ptr, left_ptr + max_tiles_per_row)
		console.log("Left ptr: ", left_ptr, " right: ", left_ptr + max_tiles_per_row)
		console.log(`row ${i} sliced friends: `, sliced_friends_row)
		carousel_rows.push(sliced_friends_row)
		
	}
	console.log("Carousel Rows", carousel_rows)
	console.log("Num rows: ", num_rows)
	console.log("page rerendering")
	console.log("Max tiles per row: ", max_tiles_per_row)
	const container_class_name = "better-carousel-content"
	const click_handler = (e) => {
		console.log("e.target ", e.target)
		console.log("e.target.idd ", e.target.id)
		const left_closest = e.target.closest(`#${left_arrow_id}`)
		const right_closest = e.target.closest(`#${right_arrow_id}`)
		if(left_closest === null && right_closest === null) {
			return
		}
		let closest_id = left_arrow_id 
		if (right_closest) {
			closest_id = right_arrow_id	
		}
		console.log("Arrow: ", closest_id)
		
		const min_left = 0
		let old_left = left
		if(closest_id === left_arrow_id) {
			old_left -= max_tiles_per_row * num_rows
			old_left = Math.max(old_left, min_left)
		}
		else {
			old_left += max_tiles_per_row * num_rows
			old_left = Math.min(old_left, max_left)
		}
		set_left(old_left)	
	}
	console.log('sliced friends: ', sliced_friends)
	const generate_friend_row = (row_ids) => {
		const friend_row_class_name = "better-carousel-friend-row"
		return (
			<div className={friend_row_class_name}>
				{<FriendTile id={default_user_id} key={default_user_id} ref={tileRef} edit_max_tiles={editMaxTiles}/>}
				{row_ids.map((friend) =>  <FriendTile id={friend} key={friend}/>)} 
			</div>
		)
	}
	const left_arrow_clickable = left != 0
	const right_arrow_clickable = left < max_left 
	return (
		<div className={container_class_name} ref={containerRef} onMouseEnter={mouse_enter_handler} onMouseLeave={mouse_leave_handler} onClick={click_handler}>
			{hover && <LeftArrow clickable={left_arrow_clickable}/>}
			{carousel_rows.map((row) => generate_friend_row(row))}
			{hover && <RightArrow clickable={right_arrow_clickable}/>}
		</div>
	)
}

export default CarouselContent;
