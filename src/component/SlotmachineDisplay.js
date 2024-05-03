import useInterval from './useInterval';

import { useRef, useEffect, useState } from 'react';

const DISPLAY_HEIGHT = 64;
const VELOCITY_CONSTANT = 10;
const VELOCITY_ATTENUATION = 0.99;
const VELOCITY_FRICTION = 50;
const REPOSITION_SPEED = 64;
let TOUCH_PREVIOUS_Y = NaN;
let TOUCH_VECTOR = [];

function isMobile() {
	return 'ontouchstart' in window || navigator.maxTouchPoints;
}

function getYVector(event) {
	if (event.type==='mousemove') {
		// console.log(event.movementY);
		return event.movementY;
	} else if (event.type==='touchmove') {
		if (isNaN(TOUCH_PREVIOUS_Y)) {
			TOUCH_PREVIOUS_Y = event.touches[0].clientY;
			return 0.
		} else {
			let rVal = -1*(TOUCH_PREVIOUS_Y - event.touches[0].clientY);
			TOUCH_PREVIOUS_Y = event.touches[0].clientY;
			// console.log(parseInt(rVal));
			return parseInt(rVal);
		}
	}
	return 0;
}

export default function SlotmachineDisplay({items,buttonId,modifyRunningSlots,setDisplayTextRef}) {
	const refresh = useState([])[1];
	const position = useRef(0.);
	const reposition = useRef(NaN);
	const timerRunning = useRef(false);
	const runningFlag = useRef(false);
	const selected = useRef(false);
	const velocity = useRef(0.0);
	useInterval(()=>{
		if(timerRunning.current) {
			if (isNaN(reposition.current)) {
				//관성제어
				progress(velocity.current*0.025);
				velocity.current = velocity.current * VELOCITY_ATTENUATION;
				let prev = velocity.current;
				velocity.current -= VELOCITY_FRICTION * 0.025 * Math.sign(velocity.current);
				if (Math.sign(prev)!==Math.sign(velocity.current)) {
					velocity.current = 0.
				}
				if (velocity.current === 0.) {
					reposition.current = getReposition();
				}
			} else {
				//제자리로 가기
				if (Math.abs(reposition.current-position.current)<REPOSITION_SPEED*0.025) {
					//일정거리가 되면 정지
					position.current = reposition.current;
					stop();
				} else {
					let val = REPOSITION_SPEED*0.025*Math.sign(reposition.current-position.current);
					progress(val);
				}
			}
		}
	},25);
	//currentString
	const getCurrentString = ()=>{
		if (items.length<=0) {
			return ''
		} else {
			let positionTemp = position.current*-1;
			while(positionTemp<0) {
				positionTemp += items.length * DISPLAY_HEIGHT;
			}
			return items[Math.floor(positionTemp/DISPLAY_HEIGHT)];
		}
	}
	//reposition
	const getReposition = ()=>{
		return Math.floor(position.current/DISPLAY_HEIGHT)*DISPLAY_HEIGHT;
	}
	//vector
	const getVelocity = ()=>{
		if (TOUCH_VECTOR.length<1) {
			return 0.
		}
		return (TOUCH_VECTOR.reduce((a, b) => a + b, 0) 
			/ TOUCH_VECTOR.length) * VELOCITY_CONSTANT;
	}
	//position
	const carculatePosition = (index)=>{
		if (items.length<=1) {
			return 0;
		} else {
			if (index===items.length-1&&position.current>0) {
				//살짝 내려가있을 때 마지막 요소 위치조정
				return (index-items.length)*DISPLAY_HEIGHT+(position.current);
			} else if (index===0&&position.current<=(-(items.length-1)*DISPLAY_HEIGHT)) {
				//올라가있을 때 첫번째 요소 위치조정
				return (index+items.length)*DISPLAY_HEIGHT+(position.current);
			} else {
				return index*DISPLAY_HEIGHT+(position.current);
			}
		}
	}
	const clampPosition = ()=>{
		if (items.length<=1) {
			position.current = 0.;
			return;
		}
		while(position.current>DISPLAY_HEIGHT) {
			position.current -= items.length*DISPLAY_HEIGHT;
		}
		while(position.current<= -items.length*DISPLAY_HEIGHT) {
			position.current += items.length*DISPLAY_HEIGHT;
		}
	}
	const progress = (val)=>{
		position.current+=val;
		clampPosition();
		carculatePosition();
		refresh([]);
	}
	const run = (val)=>{
		if(!runningFlag.current) {
			modifyRunningSlots.plus();
			runningFlag.current = true;
		}
		timerRunning.current = true;
		velocity.current = val;
		reposition.current = NaN;
		selected.current = false;
	}
	const stop = ()=>{
		if(runningFlag.current) {
			setDisplayTextRef(buttonId,getCurrentString());
			modifyRunningSlots.minus();
			runningFlag.current = false;
		}
		timerRunning.current = false;
		velocity.current = 0.;
		refresh([]);
	}
	//button
	const mouseDownCallback = (event)=>{
		if((event.type!=='mousedown'&&event.touches.length<2&&isMobile())||(!isMobile())) {
			if (event.type==='touchstart') {
				TOUCH_PREVIOUS_Y = NaN;
			} else if (event.button!==0) {
				return;
			}
			TOUCH_VECTOR = [];
			selected.current = true;
			timerRunning.current = false;
		}
	};
	//무브,릴리즈리스너
	useEffect(()=>{
		
		const mouseUpCallback = (event)=>{
			if(!selected.current){return;}
			if((event.type!=='mouseup'&&isMobile())||(!isMobile())) {
				run(getVelocity());
			}
		};

		const mouseMoveCallback = (event)=>{
			if(!selected.current){return;}
			if((event.type!=='mousemove'&&isMobile())||(!isMobile())) {
				let val = getYVector(event)
				progress(val);
				if (TOUCH_VECTOR.length>=5) {
					TOUCH_VECTOR.shift();
				}
				TOUCH_VECTOR.push(val);
			}
		};

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
	});
	//최초 시작시 상위 컴포넌트에 현재 문자열 전달
	useEffect(()=>{
		setDisplayTextRef(buttonId,getCurrentString());

		return ()=>{}
	// eslint-disable-next-line
	},[])
	console.log(items);
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