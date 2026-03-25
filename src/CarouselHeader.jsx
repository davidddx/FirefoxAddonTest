import {useState, useEffect, useContext} from 'react'
import { NumRowsContext } from './AppContext.jsx'

function RefreshButton({loading_finished}) {
	if(!loading_finished) {
		return (null)
	}
	return (
		<div className="better-carousel-header-refresh-button">
			<h2>
				<svg className="better-carousel-refresh-button-svg" width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M19.146 4.854l-1.489 1.489A8 8 0 1 0 12 20a8.094 8.094 0 0 0 7.371-4.886 1 1 0 1 0-1.842-.779A6.071 6.071 0 0 1 12 18a6 6 0 1 1 4.243-10.243l-1.39 1.39a.5.5 0 0 0 .354.854H19.5A.5.5 0 0 0 20 9.5V5.207a.5.5 0 0 0-.854-.353z" style={{ 
					fill: 'var(--extension-refresh-button-color)',
					pointerEvents: 'auto' // Ensures you can still click it if something is overlapping
				    }} />
				</svg>
			</h2>
		</div>
	)

}

function HeaderRightSide({}) {
	const add_text = "Add"
	const remove_text = "Remove"
	const rows_text = "Row(s)"
	const [input_val, set_input_val] = useState(1)
	const on_change = (e) => {
		console.log("Changed input.")
		console.log("Target: ", e.target)
	}
	const default_input_val = "1"
	const wrapper_classname = "better-carousel-header-rightside-wrapper"
	const add_n_rows_classname = "better-carousel-add-n-rows"
	const add_n_rows_input_classname = "better-carousel-add-n-rows-input"
	const remove_n_rows_classname = "better-carousel-remove-n-rows"
	const remove_n_rows_input_classname = "better-carousel-remove-n-rows-input"
	const num_rows_ctx = useContext(NumRowsContext)
	const add_n_rows = () => {
		const new_rows = input_val + num_rows_ctx.num_rows 
		num_rows_ctx.update_num_rows(new_rows)
	}
	const remove_n_rows = () => {
		const new_rows = num_rows_ctx.num_rows - input_val 
		num_rows_ctx.update_num_rows(new_rows)
	}
	const on_click = (e) => {
		if(e.target.className === wrapper_classname) {
			return
		}
		if(e.target.className === remove_n_rows_input_classname || 
			e.target.className === add_n_rows_input_classname) {
			return
		}
		console.log("Clicked ", e.target)
		if(e.target.className === add_n_rows_classname) {
			add_n_rows()
			return
		}
		if (e.target.className === remove_n_rows_classname) {
			remove_n_rows()
			return
		}
		const closest_addn_rows = e.target.closest(`.${add_n_rows_classname}`)
		const closest_removen_rows = e.target.closest(`.${remove_n_rows_classname}`)
		if(closest_addn_rows === null &&
			closest_removen_rows === null) {
			return
		}
		if (closest_addn_rows) {
			add_n_rows()
		}
		if (closest_removen_rows) {
			remove_n_rows()
		}
	}
	
	return (
		<div className={wrapper_classname} onClick={on_click}>
			<div className={add_n_rows_classname}>
				<div className="better-carousel-add-text">
					{add_text}
				</div>
				<input className={add_n_rows_input_classname} value={default_input_val}/>
				<div className="better-carousel-rows-text">
					{rows_text}
				</div>
			</div>
			<div className={remove_n_rows_classname}>
				<div className="better-carousel-remove-text">
				{remove_text}
				</div>
				<input className={remove_n_rows_input_classname} value={default_input_val}/>
				<div className="better-carousel-rows-text">
					{rows_text}
				</div>
			</div>
		</div>
	)
}

function HeaderLeftSide({num_friends, loading_finished}) {
	return (
		<div className="better-carousel-header-leftside-wrapper">
			<div className="better-carousel-header-main">
				<h2>Friends ({num_friends})</h2>
			</div>
			<RefreshButton loading_finished={loading_finished} />
		</div>
	);
}

function CarouselHeader({num_friends, on_header_press, loading_finished}) {
	return (
		<div className="better-carousel-header-wrapper" onClick={on_header_press}>
			<HeaderLeftSide num_friends={num_friends} loading_finished={loading_finished}/>
			<HeaderRightSide/>
		</div>
	)

}

export default CarouselHeader;
