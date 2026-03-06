import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const UI_ROOT_ID = 'my-custom-carousel-root';

function injectReact() {
	const targetDiv = document.querySelector('.friend-carousel-container'); 

	if (targetDiv) {
		if (document.getElementById(UI_ROOT_ID)) return;
		targetDiv.innerHTML = ''; 
		const container = document.createElement('div');
		container.id = UI_ROOT_ID;
		targetDiv.appendChild(container);
		const root = createRoot(container);
		root.render(<App />);
		console.log("Better Carousel: React Injected successfully.");
	}
}

const observer = new MutationObserver((mutations, obs) => {
	const target = document.querySelector('.friend-carousel-container');
	if (target) {
		injectReact();
		obs.disconnect(); 
	}
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});
