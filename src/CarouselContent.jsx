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

function LeftArrow({}) {
	console.log("Left arrow rendering")
	return (
		<div className="better-carousel-arrow-wrapper" style={{left: 0}}>
		<svg className="better-carousel-arrow-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
			<path d="M20 4V20M4 12H16M4 12L8 8M4 12L8 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		</div>
	)
}

function RightArrow({}) {
	console.log("Right arrow rendering")
	return (
		<div className="better-carousel-arrow-wrapper" style={{right: 0}}>
			<svg className="better-carousel-arrow-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M4 4V20M8 12H20M20 12L16 8M20 12L16 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>

	)
}

function FriendTile({id, ref, cache}) {
	const [info, set_info] = useState({})
	useEffect(() => {
		const fetchdata = async () => {
			console.log(`cache before fetchdata on ${id}: `, cache)
			if (cache === undefined) {
				return
			}
			if (Object.hasOwn(cache, id)) {
				set_info(cache[id])
				return
			}
			const fetched_user_info = await getUserInfo(id)
			if (fetched_user_info.isBanned) {
				set_info(null)
				return
			}
			const headshot = await getUserAvatarHeadshot(id)
			console.log("fetched_user_info: ", fetched_user_info)
			console.log("Headshot: ", headshot)	
			const entry = {...fetched_user_info, headshot: headshot}
			set_info(entry)
			cache[id] = entry 
			console.log(`cache after fetchdata on ${id}: `, cache)
		}
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
	if (ref != undefined) {
		return (
			<div className="better-carousel-friend-tile" ref={ref} style={{visibility: 'hidden', position:'fixed'}}>
				<span className="better-carousel-image-box">
					<img src={headshot_src}/>
				</span>
			</div>
		)
	}
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
	return (
		<div className={tile_class_name} onMouseEnter={mouse_enter_handler} onMouseLeave={mouse_leave_handler}>
			<span className="better-carousel-image-box">
				<img src={headshot_src}/>
			</span>
			<div className="better-carousel-text-content better-carousel-bold-title">
				{display_name}
			</div>
			<div className="better-carousel-text-content">
				{username}
			</div>
		</div>
	)


}
function CarouselContent({friends}) {
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
		if (!tileRef.current) return 0;
		const container_width = getElementTotalWidth(containerRef.current) 
		const tile_width = getElementTotalWidth(tileRef.current);
		const horizontal_fit = Math.floor(container_width / tile_width);
		const total_fit = horizontal_fit 
		return total_fit
	};
	useLayoutEffect(() => {

		const total_fit = calculateFit();
		set_max_tiles_per_row(total_fit)
		console.log("Tile fit: ", total_fit)

		window.addEventListener('resize', () => {
			const fit = calculateFit();
			set_max_tiles_per_row(fit)
		});
		return () => window.removeEventListener('resize', calculateFit);
	}, []);
	const info_cache = {}
	const default_user_id = 156 // builderman's roblox id. 
	const left = 0
	const sliced_friends = friends.slice(left, max_tiles_per_row)
	console.log("page rerendering")
	console.log("Max tiles per row: ", max_tiles_per_row)
	const container_class_name = "better-carousel-content"
	return (
		<div className={container_class_name} ref={containerRef} onMouseEnter={mouse_enter_handler} onMouseLeave={mouse_leave_handler}>
			{hover && <LeftArrow/>}
			{<FriendTile id={default_user_id} key={default_user_id} ref={tileRef}/>}
			{sliced_friends.map((friend) =>  <FriendTile id={friend} key={friend} cache={info_cache}/>)} 
			{hover && <RightArrow/>}
		</div>
	)
}

export default CarouselContent;
