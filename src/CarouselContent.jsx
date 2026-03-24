import {
	useState,
	useEffect,
	useRef,
	useLayoutEffect,
	useContext,
} from "react";
import { getUserInfo, getUserAvatarHeadshot } from "./UserDataFetching.js";
import { NumRowsContext, FriendDataContext } from "./AppContext.jsx";
import * as dataFetching from "./UserDataFetching.js";

function getElementTotalWidth(element) {
	const style = window.getComputedStyle(element);
	const elementWidth = element.offsetWidth;
	const marginLeft = parseFloat(style.marginLeft) || 0;
	const marginRight = parseFloat(style.marginRight) || 0;
	const totalWidth = elementWidth + marginLeft + marginRight;
	return totalWidth;
}

const right_arrow_id = "better-carousel-right-arrow-id";
const left_arrow_id = "better-carousel-left-arrow-id";

function LeftArrow({ clickable }) {
	console.log("Left arrow rendering");
	const [hover, set_hover] = useState(false);
	const mouse_enter_handler = () => set_hover(true);
	const mouse_leave_handler = () => set_hover(false);
	let container_class_name = "better-carousel-arrow-tile";
	if (hover) {
		container_class_name = "better-carousel-arrow-tile-focused";
	}
	if (!clickable) {
		container_class_name = "better-carousel-arrow-tile-muted";
	}
	return (
		<div
			className={container_class_name}
			style={{
				left: 0,
				borderTopLeftRadius: "12px",
				borderBottomLeftRadius: "12px",
			}}
			onMouseEnter={mouse_enter_handler}
			onMouseLeave={mouse_leave_handler}
			id={left_arrow_id}
		>
			<div className="better-carousel-arrow-wrapper">
				<svg
					className="better-carousel-arrow-svg"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M20 4V20M4 12H16M4 12L8 8M4 12L8 16"
						stroke="#000000"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</div>
	);
}

function RightArrow({ clickable }) {
	console.log("Right arrow rendering");
	let container_class_name = "better-carousel-arrow-tile";
	const [hover, set_hover] = useState(false);
	const mouse_enter_handler = () => set_hover(true);
	const mouse_leave_handler = () => set_hover(false);
	if (hover) {
		container_class_name = "better-carousel-arrow-tile-focused";
	}
	if (!clickable) {
		container_class_name = "better-carousel-arrow-tile-muted";
	}
	return (
		<div
			className={container_class_name}
			style={{
				right: 0,
				borderTopRightRadius: "12px",
				borderBottomRightRadius: "12px",
			}}
			onMouseEnter={mouse_enter_handler}
			onMouseLeave={mouse_leave_handler}
			id={right_arrow_id}
		>
			<div className="better-carousel-arrow-wrapper">
				<svg
					className="better-carousel-arrow-svg"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4 4V20M8 12H20M20 12L16 8M20 12L16 16"
						stroke="#000000"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</div>
	);
}

function IngameLogo({}) {
	const svg_name = "better-carousel-avatar-status-svg-ingame";
	const div_wrapper_name =
		"better-carousel-avatar-status-svg-ingame-wrapper";
	return (
		<div className={div_wrapper_name}>
			<svg
				className={svg_name}
				viewBox="0 0 512 512"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M467.51,248.83c-18.4-83.18-45.69-136.24-89.43-149.17A91.5,91.5,0,0,0,352,96c-26.89,0-48.11,16-96,16s-69.15-16-96-16a99.09,99.09,0,0,0-27.2,3.66C89,112.59,61.94,165.7,43.33,248.83c-19,84.91-15.56,152,21.58,164.88,26,9,49.25-9.61,71.27-37,25-31.2,55.79-40.8,119.82-40.8s93.62,9.6,118.66,40.8c22,27.41,46.11,45.79,71.42,37.16C487.1,399.86,486.52,334.74,467.51,248.83Z" />
				<circle cx="292" cy="224" r="20" />
				<circle cx="380" cy="224" r="20" />
				<line x1="160" y1="176" x2="160" y2="272" />
				<line x1="208" y1="224" x2="112" y2="224" />
			</svg>
		</div>
	);
}

function OnlineLogo({}) {
	const svg_name = "better-carousel-avatar-status-svg-online";
	const div_wrapper_name =
		"better-carousel-avatar-status-svg-online-wrapper";
	return (
		<div className={div_wrapper_name}>
			<svg
				className={svg_name}
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					id="Vector"
					d="M3 12H8M3 12C3 16.9706 7.02944 21 12 21M3 12C3 7.02944 7.02944 3 12 3M8 12H16M8 12C8 16.9706 9.79086 21 12 21M8 12C8 7.02944 9.79086 3 12 3M16 12H21M16 12C16 7.02944 14.2091 3 12 3M16 12C16 16.9706 14.2091 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12C21 16.9706 16.9706 21 12 21"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	);
}

function InstudioLogo({}) {
	const svg_name = "better-carousel-avatar-status-svg-instudio";
	const div_wrapper_name =
		"better-carousel-avatar-status-svg-instudio-wrapper";
	return (
		<div className={div_wrapper_name}>
			<svg
				className={svg_name}
				fill="#000000"
				viewBox="0 0 1024 1024"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M1006.37 215.936c-10.784-4.976-23.582-3.088-32.558 4.848L812.5 365.68 666.868 216.272 811.06 49.744c7.84-9.056 9.745-21.536 4.865-32.512S800.26-.463 788.405-.463h-8.69c-89.12 0-242.976 7.664-311.663 77.343l-13.857 13.76c-73.28 74.768-86.288 197.376-47.68 290.576L37.236 758.112c-49.791 50.48-49.791 132.32 0 182.816l45.073 45.697c24.895 25.232 57.535 37.856 90.175 37.856 32.624 0 65.263-12.624 90.143-37.856l374.72-377.728c35.44 19.152 84 31.664 124.784 31.664 65.376 0 127.344-26.369 174.527-74.256l13.664-13.84c74.609-75.648 73.456-237.297 73.792-308.417.033-12.096-6.927-23.088-17.743-28.112zM905.666 509.008l-11.873 13.871c-35.744 36.273-82.496 53.648-131.664 53.648-24.32 0-57.088-4.576-79.216-13.792-20-8.303-38.576-20.288-55.2-35.423L217.537 940.928c-12.032 12.223-28.032 18.943-45.057 18.943s-33.04-6.72-45.088-18.943l-45.055-45.68c-24.865-25.216-24.865-66.224-.017-91.44l400.784-408.863c-13.44-19.569-22.593-40.897-28.049-62.977h-.015c-15.424-62.384-6.432-148.607 42.016-198.048L510.848 120c41.552-42.16 149.456-54.624 209.2-58.304l-117.36 135.536c-10.496 12.128-9.967 30.4 1.216 41.872L789.44 429.44c11.248 11.584 29.44 12.256 41.553 1.52L961.6 313.328c-3.888 63.36-16.192 155.376-55.935 195.68z" />
			</svg>
		</div>
	);
}

function PresenceLogo({ presence }) {
	console.log("Presence: ", presence);
	const getSvgByPresence = (P) => {
		switch (P[dataFetching.presence]) {
			case dataFetching.offline:
				break;
			case dataFetching.online:
				return <OnlineLogo />;
			case dataFetching.in_game:
				return <IngameLogo />;
			case dataFetching.in_studio:
				return <InstudioLogo />;
			case dataFetching.invisible:
				return null;
			default:
				break;
		}
	};
	if (presence[dataFetching.presence] === dataFetching.offline) {
		return null;
	}
	let svg_wrapper_class_name = "better-carousel-avatar-status-online";
	switch (presence[dataFetching.presence]) {
		case dataFetching.in_studio:
			svg_wrapper_class_name =
				"better-carousel-avatar-status-instudio";
			break;
		case dataFetching.in_game:
			svg_wrapper_class_name =
				"better-carousel-avatar-status-ingame";
			break;
		case dataFetching.invisible:
			svg_wrapper_class_name =
				"better-carousel-avatar-status-invisible";
			break;
	}
	return (
		<div className="better-carousel-avatar-status">
			<div className={svg_wrapper_class_name}>
				{getSvgByPresence(presence)}
			</div>
		</div>
	);
}

const default_user_id = 156; // builderman roblox id

function FriendTile({ id, ref, edit_max_tiles, presence }) {
	const [info, set_info] = useState({});
	const friendDataContextVal = useContext(FriendDataContext);
	useEffect(() => {
		const fetchdata = async () => {
			const cache = friendDataContextVal.friend_cache.current;
			const update_cache =
				friendDataContextVal.update_friend_cache;
			console.log(`cache before fetchdata on ${id}: `, cache);
			if (Object.hasOwn(cache, id)) {
				set_info(cache[id]);
				return;
			}
			const fetched_user_info = await getUserInfo(id);
			if (fetched_user_info.isBanned) {
				set_info(null);
				update_cache(id, null);
				return;
			}
			const headshot = await getUserAvatarHeadshot(id);
			console.log("fetched_user_info: ", fetched_user_info);
			console.log("Headshot: ", headshot);
			const entry = {
				...fetched_user_info,
				headshot: headshot,
			};
			set_info(entry);
			update_cache(id, entry);
			console.log(`cache after fetchdata on ${id}: `, cache);
			if (id === default_user_id) {
				// need to rerender parent the first time.
				edit_max_tiles();
			}
		};
		console.log("Fetch data for id ", id);
		fetchdata();
	}, [id]);
	let headshot_src = "";
	let username = "";
	let display_name = "";
	if (info !== undefined) {
		headshot_src = info.headshot;
		username = info.name;
		display_name = info.displayName;
	}
	console.assert(info !== null, "info === null implies a banned user");

	const [hover, set_hover] = useState(false);
	const mouse_enter_handler = (e) => {
		set_hover(true);
		console.log("Entered friend tile " + id);
	};
	const mouse_leave_handler = (e) => {
		set_hover(false);
		console.log("Left friend tile " + id);
	};
	let tile_class_name = "better-carousel-friend-tile";
	if (hover) {
		tile_class_name += " " + "better-carousel-focused-background";
	}
	const redirecting_link = `https://www.roblox.com/users/${id}/profile`;
	const avatar_card_class_name = "better-carousel-avatar-card";
	if (ref !== undefined) {
		console.log(" ref not undefined ");
		console.log(" id: ", id);
		return (
			<div
				className="better-carousel-friend-tile"
				ref={ref}
				style={{
					visibility: "hidden",
					position: "fixed",
				}}
			>
				<div className={avatar_card_class_name}>
					<span className="better-carousel-image-box">
						<img src={headshot_src} />
					</span>
				</div>
			</div>
		);
	}
	return (
		<a href={redirecting_link}>
			<div
				className={tile_class_name}
				onMouseEnter={mouse_enter_handler}
				onMouseLeave={mouse_leave_handler}
			>
				<div className={avatar_card_class_name}>
					<span className="better-carousel-image-box">
						<img src={headshot_src} />
					</span>
					<PresenceLogo presence={presence} />
				</div>
				<div className="better-carousel-text-content better-carousel-bold-title">
					{display_name}
				</div>
				<div className="better-carousel-text-content">
					{username}
				</div>
			</div>
		</a>
	);
}
function CarouselContent({ friends, presences }) {
	const containerRef = useRef(null);
	const tileRef = useRef(null);
	const [max_tiles_per_row, set_max_tiles_per_row] = useState(0);
	const [hover, set_hover] = useState(false);
	const mouse_enter_handler = (e) => {
		set_hover(true);
		console.log("mouse entered friend carousel");
	};
	const mouse_leave_handler = (e) => {
		set_hover(false);
		console.log("mouse left friend carousel");
	};
	console.log("Container ref: ", containerRef);
	// calculate tile fit
	const calculateFit = () => {
		console.log("Container ref: ", containerRef);
		console.log("Tile ref: ", tileRef);
		if (!containerRef.current) return 0;
		console.log("Tile ref: ", tileRef);
		if (!tileRef.current) return 0;
		const container_width = getElementTotalWidth(
			containerRef.current
		);
		const tile_width = getElementTotalWidth(tileRef.current);
		const horizontal_fit = Math.floor(container_width / tile_width);
		const total_fit = horizontal_fit;
		return total_fit;
	};
	const editMaxTiles = () => {
		const fit = calculateFit();
		set_max_tiles_per_row(fit);
	};
	useLayoutEffect(() => {
		const total_fit = calculateFit();
		set_max_tiles_per_row(total_fit);
		console.log("Tile fit: ", total_fit);
		window.addEventListener("resize", editMaxTiles);
		return () => window.removeEventListener("resize", editMaxTiles);
	}, []);
	const num_rows_context_val = useContext(NumRowsContext);
	const num_rows = num_rows_context_val.num_rows;
	const [left, set_left] = useState(0);
	const max_left = Math.max(
		0,
		friends.length - max_tiles_per_row * num_rows
	);
	if (left > max_left) {
		// needs a rerender in this case
		set_left(max_left);
	}
	const sliced_friends = friends.slice(left, left + max_tiles_per_row);
	let left_ptr = left;
	const carousel_rows = [];
	for (
		let i = 0;
		i < num_rows;
		++i, left_ptr = left_ptr + max_tiles_per_row
	) {
		if (left_ptr >= friends.length) {
			break;
		}
		const sliced_friends_row = friends.slice(
			left_ptr,
			left_ptr + max_tiles_per_row
		);
		console.log(
			"Left ptr: ",
			left_ptr,
			" right: ",
			left_ptr + max_tiles_per_row
		);
		console.log(`row ${i} sliced friends: `, sliced_friends_row);
		carousel_rows.push(sliced_friends_row);
	}
	console.log("Carousel Rows", carousel_rows);
	console.log("Num rows: ", num_rows);
	console.log("page rerendering");
	console.log("Max tiles per row: ", max_tiles_per_row);
	const container_class_name = "better-carousel-content";
	const click_handler = (e) => {
		console.log("e.target ", e.target);
		console.log("e.target.idd ", e.target.id);
		const left_closest = e.target.closest(`#${left_arrow_id}`);
		const right_closest = e.target.closest(`#${right_arrow_id}`);
		if (left_closest === null && right_closest === null) {
			return;
		}
		let closest_id = left_arrow_id;
		if (right_closest) {
			closest_id = right_arrow_id;
		}
		console.log("Arrow: ", closest_id);

		const min_left = 0;
		let old_left = left;
		if (closest_id === left_arrow_id) {
			old_left -= max_tiles_per_row * num_rows;
			old_left = Math.max(old_left, min_left);
		} else {
			old_left += max_tiles_per_row * num_rows;
			old_left = Math.min(old_left, max_left);
		}
		set_left(old_left);
	};
	console.log("sliced friends: ", sliced_friends);
	const generate_friend_row = (row_ids) => {
		const friend_row_class_name = "better-carousel-friend-row";
		return (
			<div className={friend_row_class_name}>
				{
					<FriendTile
						id={default_user_id}
						key={default_user_id}
						ref={tileRef}
						edit_max_tiles={editMaxTiles}
					/>
				}
				{row_ids.map((friend) => (
					<FriendTile
						id={friend}
						key={friend}
						presence={presences[friend]}
					/>
				))}
			</div>
		);
	};
	const left_arrow_clickable = left != 0;
	const right_arrow_clickable = left < max_left;
	return (
		<div
			className={container_class_name}
			ref={containerRef}
			onMouseEnter={mouse_enter_handler}
			onMouseLeave={mouse_leave_handler}
			onClick={click_handler}
		>
			{hover && (
				<LeftArrow clickable={left_arrow_clickable} />
			)}
			{carousel_rows.map((row) => generate_friend_row(row))}
			{hover && (
				<RightArrow clickable={right_arrow_clickable} />
			)}
		</div>
	);
}

export default CarouselContent;
