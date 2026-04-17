import _React from 'react'
import PopupHeader from './PopupHeader.jsx'
import PopupBody from './PopupBody.jsx'
function Popup() {
	console.log("Popup was imported");

	return (
		<div className="popup-container">
			<PopupHeader/>
			<PopupBody/>
		</div>
	)
}
export default Popup
