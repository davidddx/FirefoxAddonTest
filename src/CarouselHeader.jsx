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

function RowModifiers({}) {

}

function CarouselHeader({num_friends, on_header_press, loading_finished}) {
	const num_rows_context = useContext(NumRowsContext)
	const ellipsis = "ellipsis"
	const add_one = "add-one"
	const add_five = "add-five"
	const add_ten = "add-ten"
	const remove_one = "remove-one"
	const remove_five = "remove-five"
	const remove_ten = "remove-ten"
	const selectbox_change_handler = (e) => {
		console.log("select box change found")
		console.log("select box change event target: ", e.target)
		console.log("select box change event target value: ", e.target.value)
		let offset = 0
		switch (e.target.value) {
			case add_one:
				offset = 1
				break;
			case add_five:
				offset = 5
				break;
			case add_ten:
				offset = 10
				break;
			case remove_one:
				offset = -1
				break;
			case remove_five:
				offset = -5
				break;
			case remove_ten: 
				offset = -10
				break;
		}
		if(offset === 0) {
			return
		}
		num_rows_context.update_num_rows(num_rows_context.num_rows + offset)
	}
	return (
		<div className="better-carousel-header-wrapper" onClick={on_header_press}>
			<div className="better-carousel-header-leftside-wrapper">
				<div className="better-carousel-header-main">
					<h2>
						Friends ({num_friends})
					</h2>
				</div>
				<RefreshButton loading_finished={loading_finished}/>
			</div>
			<div className="better-carousel-header-rightside-wrapper">
				<div className="better-carousel-rightside-labels">
					<label for="row-operations">
						Modify Rows: 
					</label>
					<select id="row-operations" onChange={selectbox_change_handler}>
						<option value={ellipsis}>...</option>
						<option value={add_one}>Add 1 Row</option>
						<option value={add_five}>Add 5 Rows</option>
						<option value={add_ten}>Add 10 Rows</option>
						<option value={remove_one}>Remove 1 Row</option>
						<option value={remove_five}>Remove 5 Rows</option>
						<option value={remove_ten}>Remove 10 Rows</option>
					</select>
				</div>
			</div>
		</div>
	)

}

export default CarouselHeader;
