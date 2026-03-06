import {useState, useEffect} from 'react'

function CarouselHeader({num_friends}) {


	const friends_api = "https://friends.roblox.com"
	const users_api = "https://users.roblox.com"

	return (
		<div className="better-carousel-header-wrapper">
			<div className="better-carousel-header-main">
				<h2>
					Friends ({num_friends})
				</h2>
			</div>
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
		</div>
	)

}

export default CarouselHeader;
