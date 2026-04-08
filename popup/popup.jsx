import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup.jsx';
const TARGET_ID = 'better-carousel-popup-entry'
function init() {
	const targetDiv = document.getElementById(TARGET_ID);

	if (targetDiv) {
		// Simple check to prevent double-injection
		if (targetDiv.dataset.rendered === 'true') return;
		targetDiv.dataset.rendered = 'true';

		const root = createRoot(targetDiv);
		root.render(<Popup />);
		console.log("(POPUP) React mounted successfully.");
	} else {
		console.error("(POPUP) Target div not found!");
	}
}

// Wait for the DOM to be fully stable before running React
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
