import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DISPLAY_HEIGHT = 64;
const Y_POSITION = [0.,0.,0.,0.,0.];
const REPOSITION_VELOCITY = 1.4;

const TIMERMODE_STOP = 0;
const TIMERMODE_HOLDING = 1;
const TIMERMODE_FLOW = 2;
const TIMERMODE_REPOSITION = 3;
const MACHAL = 0.03;
const VELOCITY_FACTOR = 0.25;

//y값 히스토리
function recordYPosition(event,force) {
	let val = 0.
	if (event.type==='mousemove') {
		val = event.clientY;
	} else if (event.type==='touchmove') {
		val = event.touches[0].clientY;
	}
	if (force) {
		Y_POSITION.fill(0.);
		Y_POSITION[0] = val;
	} else {
		Y_POSITION.unshift(val);
		Y_POSITION.pop();
	}
}

//관성
function getYVectorAverage() {
	let newVal = 0.;
	let i = 0;
	while((i<(Y_POSITION.length-1))&&Y_POSITION[i+1]>0.) {
		newVal += Y_POSITION[i] - Y_POSITION[i+1]; 
		i++;
	}
	if (i > 0) {
		return newVal / i;
	} else {
		return 0.;
	}
}

function getYVector() {
	if(Y_POSITION[1] > 0.) {
		return Y_POSITION[0] - Y_POSITION[1];
	} else {
		return 0.
	}
}

//유효값으로 클램프
function clamp(yVal,arraySize) {
	if (arraySize<0) {
		return 0;
	}
	let newVal = yVal;
	while(newVal>DISPLAY_HEIGHT) {
		newVal -= arraySize*DISPLAY_HEIGHT;
	}
	while(newVal<=(-1*DISPLAY_HEIGHT*(arraySize-1))) {
		newVal += arraySize*DISPLAY_HEIGHT;
	}
	return newVal;
}

//표시인덱스 구하기
function carculateIndex(yVal,arraySize) {
	return Math.floor(clamp(yVal,arraySize)/DISPLAY_HEIGHT);
}

//터치기기판별
function isMobile() {
	return 'ontouchstart' in window || navigator.maxTouchPoints;
}

//클릭판벌
function isCursorDown(event,targetElement) {
	return (event.target===targetElement||targetElement.contains(event.target)) &&
		((event.button === 0/*좌클릭*/) ||
		(event.touches && event.touches.length===1))
}

//릴리즈판별
function isCursorRelease(event) {
	return (event.button === 0/*좌클릭*/) ||
		(event.touches && event.touches.length===0)
}

//슬롯머신 디스플레이(한개)
function SlotmachineDisplay({item,index,handleSelectedSlot,selectedSlot,handleDisplayString,initialDisplayIndex}) {
	const containerRef = useRef(null);
	const [timerMode,setTimerMode] = useState(TIMERMODE_STOP);
	const [offsetY,setOffsetY] = useState(()=>{
		return clamp(initialDisplayIndex*-DISPLAY_HEIGHT);
	});
	const [velocity,setVelocity] = useState(0.);
	const [repositionDirection,setRepositionDirection] = useState(1);
	//디스플레이 인덱스 계산
	const displayIndex = useMemo(()=>{
		if (item.length<=0) {return 0;}
		let val = 0.5 + (offsetY * -1) / DISPLAY_HEIGHT;
		while(val>=item.length) {
			val-=item.length;
		}
		while(val<0) {
			val+=item.length;
		}
		return Math.floor(val);
	},[offsetY,item]);
	const handleOffsetY = {
		add:(val)=>{
			let newVal = clamp(offsetY+val,item.length);
			setOffsetY(newVal);
		},
		set:(val)=>{
			setOffsetY(clamp(offsetY,item.length));
		}
	}
	const handleVelocity = {
		reduce:()=>{
			let approx = velocity - (MACHAL)*Math.sign(velocity);
			if (Math.sign(velocity)!==Math.sign(approx)) {
				setVelocity(0.);
			} else {
				setRepositionDirection(velocity<=0);
				setVelocity(approx);
			}
		}
	}
	//완전정지 콜백
	useEffect(()=>{
		if (timerMode===TIMERMODE_STOP) {
			handleDisplayString(item[displayIndex],index);
		}
	},[timerMode,index,displayIndex,item]);
	//타이머콜백
	const timerAction = useCallback(()=>{
		switch(timerMode) {
		case TIMERMODE_FLOW:
			// 관성에맡기기
			handleOffsetY.add(velocity);
			if (velocity===0.) {
				setTimerMode(TIMERMODE_REPOSITION);
			} else {
				handleVelocity.reduce();
			}
			break;
		case TIMERMODE_REPOSITION:
			// 제자리찾아가기
			let val = repositionDirection?REPOSITION_VELOCITY:-REPOSITION_VELOCITY;
			let floor = Math.floor(offsetY/DISPLAY_HEIGHT)*DISPLAY_HEIGHT;
			if (Math.abs(floor-offsetY)<=REPOSITION_VELOCITY) {
				handleOffsetY.set(floor);
				setTimerMode(TIMERMODE_STOP);
			} else {
				handleOffsetY.add(val);
			}
			break;
		}
	},[offsetY,index,selectedSlot,timerMode,velocity,repositionDirection,item]);
	//타이머 생성&클린업
	useEffect(()=>{
		const timer = timerMode>TIMERMODE_HOLDING
			?setInterval(()=>{
				timerAction();
			},10)
			:null;

		return ()=>{
			if (timer) {
				clearInterval(timer);
			}
		}
	},[timerAction,timerMode,item]);
	//마우스응답
	useEffect(()=>{
		const moveCallback = (e)=>{
			// 무브콜백
			if (selectedSlot!==index) {return;}
			recordYPosition(e,false);
			handleOffsetY.add(getYVector());
		}
		const downCallback = (e)=>{
			// 다운
			if(!isCursorDown(e,containerRef.current)) {return;}
			handleSelectedSlot(index);
			recordYPosition(e,true);
			setTimerMode(TIMERMODE_HOLDING);
			handleDisplayString('',index);
		}
		const releaseCallback = (e)=>{
			// 릴리즈
			if (selectedSlot!==index) {return;}
			if(!isCursorRelease(e)) {return;}
			handleSelectedSlot(null);
			setTimerMode(TIMERMODE_FLOW);
			setVelocity(getYVectorAverage()*VELOCITY_FACTOR);
		}
		//다운
		window.addEventListener('mousedown',downCallback);
		window.addEventListener('touchstart',downCallback);
		//무브
		window.addEventListener('mousemove',moveCallback);
		window.addEventListener('touchmove',moveCallback);
		//릴리즈
		window.addEventListener('mouseup',releaseCallback);
		window.addEventListener('touchend',releaseCallback);
		//클린업
		return ()=>{
			//다운
			window.removeEventListener('mousedown',downCallback);
			window.removeEventListener('touchstart',downCallback);
			//무브
			window.removeEventListener('mousemove',moveCallback);
			window.removeEventListener('touchmove',moveCallback);
			//릴리즈
			window.removeEventListener('mouseup',releaseCallback);
			window.removeEventListener('touchend',releaseCallback);
		}
	},[selectedSlot,index,offsetY,item]);
	//return JSX
	return <>
		<div ref={containerRef} className="slotmachineDisplay" style={{height:`${DISPLAY_HEIGHT}px`}}>
			<div className="slotmachineDisplayItemContainer" style={{top:`${offsetY-DISPLAY_HEIGHT}px`}}>
				{/* 표시문자열(클론) */}
				{item
					?<div key={-1} className="slotmachineDisplayItem" style={{height:`${DISPLAY_HEIGHT}px`}}>
						{item[item.length-1]}
					</div>
					:null
				}
				{/* 표시문자열 */}
				{item.map((val,index)=>{
					return <div key={index} className="slotmachineDisplayItem" style={{height:`${DISPLAY_HEIGHT}px`}}>
						{val}
					</div>
				})}
			</div>
		</div>
	</>
}

//슬롯머신 디스플레이 컨테이너
function SlotmachineDisplayContainer({items,handleDisplayString,initialDisplayIndex}) {
	const [selectedSlot,setSelectedSlot] = useState(null);
	const handleSelectedSlot = useCallback((val)=>{
		setSelectedSlot(val);
	},[]);
	return <>
		<div className="slotmachineDisplayContainer">
			{items.map((item,index)=>{
				return <SlotmachineDisplay 
					item={item} 
					key={index} 
					index={index} 
					handleDisplayString={handleDisplayString}
					selectedSlot={selectedSlot}
					handleSelectedSlot={handleSelectedSlot}
					initialDisplayIndex={initialDisplayIndex[index]}
				/>
			})}
		</div>
	</>
}

export {
	SlotmachineDisplayContainer
}