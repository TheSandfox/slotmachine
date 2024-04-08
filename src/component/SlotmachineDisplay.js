import useInterval from './useInterval';

import { useRef, useEffect } from 'react';

const DISPLAY_HEIGHT = 64;
let TOUCH_PREVIOUS_Y = NaN;
let TOUCH_VECTOR = [];

function isMobile() {
	return 'ontouchstart' in window || navigator.maxTouchPoints;
}

function getYVector(event) {
	if (event.type==='mousemove') {
		return event.movementY;
	} else if (event.type==='touchmove') {
		if (isNaN(TOUCH_PREVIOUS_Y)) {
			TOUCH_PREVIOUS_Y = event.touches[0].clientY;
			return 0.
		} else {
			let rVal = -1*(TOUCH_PREVIOUS_Y - event.touches[0].clientY);
			TOUCH_PREVIOUS_Y = event.touches[0].clientY;
			return parseInt(rVal);
		}
	}
	return 0;
}

export default function SlotmachineDisplay({items,buttonId,state}) {
	const position = useRef(false);
	const timerRunning = useRef(false);
	const selected = useRef(false);
	const setSelected = (val)=>{selected.current = val;}
	useInterval(()=>{
		if(timerRunning.current) {
			
		}
	},25);
	//position
	const carculatePosition = (index)=>{
		if (items.length<=1) {
			return 0;
		} else {
			return index*DISPLAY_HEIGHT-(position.current);
		}
	}
	const clampPosition = ()=>{
		if (items.length<=1) {
			position.current = 0.;
		} else {

		}
	}
	//button
	const mouseDownCallback = (event)=>{
		if((event.type!=='mousedown'&&event.touches.length<2&&isMobile())||(!isMobile())) {
			// console.log(`${buttonId}번버튼누름`);
			TOUCH_VECTOR = [];
			if (event.type==='touchstart') {
				TOUCH_PREVIOUS_Y = NaN;
			}
			setSelected(true);
		}
	}
	//window
	const mouseUpCallback = (event)=>{
		if(!selected.current){return;}
		if((event.type!=='mouseup'&&isMobile())||(!isMobile())) {
			// console.log(`${buttonId}번버튼뗐음`);
			setSelected(false);
		}
	}
	const mouseMoveCallback = (event)=>{
		if(!selected.current){return;}
		if((event.type!=='mousemove'&&isMobile())||(!isMobile())) {
			let val = getYVector(event)
			position.current += val;
			clampPosition();
			carculatePosition();
			if (TOUCH_VECTOR.length>=5) {
				TOUCH_VECTOR.shift();
			}
			TOUCH_VECTOR.push(val);
			// console.log(TOUCH_VECTOR);
		}
	}
	//무브,릴리즈리스너 
	useEffect(()=>{

		if (selected.current) {

		} else {
			TOUCH_PREVIOUS_Y = NaN;
		}

		window.addEventListener('mousemove',mouseMoveCallback);
		window.addEventListener('touchmove',mouseMoveCallback);
		window.addEventListener('mouseup',mouseUpCallback);
		window.addEventListener('touchend',mouseUpCallback);

		return ()=>{
			window.removeEventListener('mousemove',mouseMoveCallback);
			window.removeEventListener('touchmove',mouseMoveCallback);
			window.removeEventListener('mouseup',mouseUpCallback);
			window.removeEventListener('touchend',mouseUpCallback);
		};

	},[]);
	return <>
		<div className='slotmachineDisplay' 
			onMouseDown={(event)=>{mouseDownCallback(event)}}
			onTouchStart={(event)=>{mouseDownCallback(event)}}
		>
			<div className='slotContainer'>
				{items.map((item,index)=>{
					return <div className='slot' key={'slot'+index}
						style={{
							top:`${carculatePosition(index)}px`
						}}
					>
						{item}
					</div>
				})}
			</div>
		</div>
	</>
}