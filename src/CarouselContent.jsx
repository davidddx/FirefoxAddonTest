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

function FriendTile({id, ref}) {
	const [info, set_info] = useState({})
	const [fetched_info_cache, set_fetched_info_cache] = useState({})
	useEffect(() => {
		const fetchdata = async () => {
			const fetched_user_info = await getUserInfo(id)
			const headshot = await getUserAvatarHeadshot(id)
			console.log("fetched_user_info: ", fetched_user_info)
			console.log("Headshot: ", headshot)	
			const entry = {...info, headshot: headshot}
			set_info(entry)
			fetched_info_cache[id] = fetched_user_info
		}
		fetchdata()
	}, [id])
	console.log("fetched_info_cache: ", fetched_info_cache)
	let headshot_src = ""
	if (info != undefined) {
		headshot_src = info.headshot	
	}
	if (ref != undefined) {
		return (
			<div className="better-carousel-friend-tile" ref={ref} style={{visibility: 'hidden', position:'fixed'}}>
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
	const containerRef = useRef(null)
	const tileRef = useRef(null)
	const [max_tiles_per_row, set_max_tiles_per_row] = useState(0)
	const [is_measuring, set_is_measuring] = useState(true);
	const [hover, set_hover] = useState(false);
	const mouse_enter_handler = (e) => {
		set_hover(true)
		console.log("mouse entered")
	}
	const mouse_leave_handler = (e) => {
		/*
		set_hover(false)
		console.log("mouse left")
		*/
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
		set_is_measuring(false);

		window.addEventListener('resize', () => {
			set_is_measuring(true); // Switch back to measurement mode on resize
			calculateFit();
		});
		return () => window.removeEventListener('resize', calculateFit);
	}, []);
	// extra fit calculation measure for some setups
	
	const current_render_fit = calculateFit()
	if (current_render_fit != max_tiles_per_row) {
		set_max_tiles_per_row(current_render_fit)
		console.log("current render fit=", current_render_fit)
		console.log("max tiles per row=", max_tiles_per_row)
	}
	

	const default_user_id = 156 // builderman's roblox id. 
	const left = 0
	const sliced_friends = friends.slice(left, max_tiles_per_row)
	console.log("page rerendering")
	console.log("Max tiles per row: ", max_tiles_per_row)
	return (
		<div className="better-carousel-content" ref={containerRef} onMouseEnter={mouse_enter_handler} onMouseLeave={mouse_leave_handler}>
			{hover && <LeftArrow/>}
			{<FriendTile id={default_user_id} key={default_user_id} ref={tileRef}/>}
			{sliced_friends.map((friend) =>  <FriendTile id={friend} key={friend}/>)} 
			{hover && <RightArrow/>}
		</div>
	)
}

export default CarouselContent;
