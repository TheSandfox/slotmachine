import slotItemDefault from 'json/default.json';

import { useEffect, useState } from "react"

import SlotmachineDisplay from './SlotmachineDisplay';

function SlotmachineResultDisplay({val}) {
	return <div className='slotmachineResultDisplay active'>
		{val}
	</div>
}

export default function Slotmachine() {
	const slotItemsTemp = [];
	const [displayCount,setDisplayCount] = useState(localStorage.getItem('slotmachine-display-count')||3);
	for(let i = 0;i<displayCount;i++) {
		localStorage.getItem('slotmachine-content'+i)?
		slotItemsTemp.push(localStorage.getItem('slotmachine-content'+i)):
		slotItemsTemp.push(slotItemDefault[i]||['-'])
	}
	const [slotItems,setSlotItems] = useState(slotItemsTemp);
	const [runningSlots,setRunningSlots] = useState(0);
	const [displayText,setDisplayText] = useState('');
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
	useEffect(()=>{
		if (runningSlots<=0) {
			setDisplayText('ssss');
		} else {
			setDisplayText('');
		}
	},[runningSlots])
	return <div className='slotmachine fontBitBit'>
		<h1>다용도 룰렛</h1>
		<div className='slotmachineDisplayContainer'>
			{slotItems.map((displayItem,index)=>{
				return <div key={'sd'+index} className='slotmachineDisplayWrapper dotbox'>
					<SlotmachineDisplay items={displayItem} buttonId={index} modifyRunningSlots={modifyRunningSlots}/>
				</div>
			})}
		</div>
		<SlotmachineResultDisplay val={displayText}/>
	</div>
}