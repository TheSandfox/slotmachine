import slotItemDefault from 'json/default.json';

import { useEffect, useState, useRef } from "react"

import SlotmachineDisplay from './SlotmachineDisplay';

function SlotmachineButton() {
	return <></>
}

function SlotmachineResultDisplay({val,active}) {
	return <div className={'slotmachineResultDisplay'+(active?' active':'')}>
		{val}
	</div>
}

export default function Slotmachine() {
	const slotItemsTemp = useRef([]);
	const [displayCount,setDisplayCount] = useState(localStorage.getItem('slotmachine-display-count')||3);
	const [slotItems,setSlotItems] = useState(slotItemsTemp.current);
	const [runningSlots,setRunningSlots] = useState(0);
	const [displayText,setDisplayText] = useState('');
	const [displayActive,setDisplayActive] = useState(false);
	const displayTextRef = useRef(['','','']);
	const setDisplayTextRef = (index,content)=>{
		displayTextRef.current[index] = content;
		console.log(displayTextRef.current[index]);
	}
	const modifySlotItems = new class{
		modify(newItem){
			setSlotItems(newItem);
		}
		import(rawString){
			let newArr = rawString.split(',');
			for(let i = 0;i<newArr.length;i++) {
				newArr[i] = newArr[i].trim();
			}
			setSlotItems();
		}
	}();
	const modifyRunningSlots = {
		plus:()=>{
			setRunningSlots(runningSlots+1);
		},
		minus:()=>{
			setRunningSlots(runningSlots-1);
		}
	};
	//슬롯 정지 시 결과
	useEffect(()=>{
		if (runningSlots<=0) {
			// console.log(displayTextRef.current);
			setDisplayText(displayTextRef.current.join(' '));
			setDisplayActive(true);
		} else {
			setDisplayActive(false);
		}
	},[runningSlots])
	useEffect(()=>{

		for(let i = 0;i<displayCount;i++) {
			localStorage.getItem('slotmachine-content'+i)?
			slotItemsTemp.current.push(localStorage.getItem('slotmachine-content'+i)):
			slotItemsTemp.current.push(slotItemDefault[i]||['-'])
		}

		return ()=>{
			slotItemsTemp.current = [];
		}

	},[displayCount])
	console.log(slotItemDefault);
	return <div className='slotmachine fontBitBit'>
		<h1>다용도 룰렛</h1>
		<div className='slotmachineDisplayContainer'>
			{slotItems.map((displayItem,index)=>{
				return <div key={'sd'+index} className='slotmachineDisplayWrapper dotbox'>
					<SlotmachineDisplay 
						items={displayItem} 
						buttonId={index} 
						modifyRunningSlots={modifyRunningSlots}
						setDisplayTextRef={setDisplayTextRef}
					/>
				</div>
			})}
		</div>
		<div classname='slotmachineButtonContainer'>
			<SlotmachineButton />
		</div>
		<SlotmachineResultDisplay val={displayText} active={displayActive}/>
	</div>
}