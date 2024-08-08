function isMobile() {
	return 'ontouchstart' in window || navigator.maxTouchPoints;
}

// 다운 판별
export function validateMouseDown(e) {
	if (e.type==='mousedown') {
		return (!isMobile())&&e.button===0;
	} else if (e.type==='touchstart') {
		return e.touches.length===1;
	}
	return false;
}

// 업 판별
export function validateMouseUp(e) {
	if (e.type==='mouseup') {
		return (!isMobile())&&e.button===0;
	} else if (e.type==='touchend') {
		return e.touches.length===0
	}
	return false;
}

// 업 판별(인박스)
export function validateMouseUpInBox(e) {
	if (e.type==='mouseup') {
		return (!isMobile())&&e.button===0;
	} else if (e.type==='touchend') {
		let touch = e.changedTouches[0];
		let target = e.target;
		let rect = target.getBoundingClientRect();
		return e.touches.length===0
			&&!(
				touch.clientX < rect.left ||
				touch.clientX > rect.right ||
				touch.clientY < rect.top ||
				touch.clientY > rect.bottom
			)
	}
	return false;
}

// 리브 판별
export function validateMouseLeave(e) {
	if (e.type==='mouseleave') {
		return true;
	} else if (e.type==='touchmove') {
		let touch = e.touches[0];
		let target = e.target;
		let rect = target.getBoundingClientRect();
		return (
			touch.clientX < rect.left ||
			touch.clientX > rect.right ||
			touch.clientY < rect.top ||
			touch.clientY > rect.bottom
		)
	}
}

// 엔터 판별
export function validateMouseEnter(e) {
	if (e.type==='mouseenter') {
		return true;
	} else if (e.type==='touchmove') {
		let touch = e.touches[0];
		let target = e.target;
		let rect = target.getBoundingClientRect();
		return (
			touch.clientX >= rect.left &&
			touch.clientX <= rect.right &&
			touch.clientY >= rect.top &&
			touch.clientY <= rect.bottom
		)
	}
}