import { useEffect, useMemo, useState } from "react";
import './slotmachine.css';
import { SlotmachineDisplayContainer } from "./SlotmachineDisplay";

function Slotmachine() {
	const [loading,setLoading] = useState(true);
	const [items,setItems] = useState([]);
	const initialDisplayIndex = useMemo(()=>{
		if (items) {
			return items.map((item)=>{
				return Math.floor(Math.random()*item.length);
			});
		} else {
			return null;
		}
	},[items]);
	const [displayString,setDisplayString] = useState(['']);
	const handleDisplayString = (val,index)=>{
		let arr = [...displayString];
		arr[index] = val;
		setDisplayString(arr);
	};
	//문자열불러오기
	useEffect(()=>{
		const fetchItems = async()=>{
			try {
				const Defaults = await import('/src/datas/Defaults');
				setItems(Defaults.items);
			} catch {
				// 아이템 불러오기 실패
			}
		}
		fetchItems();
	},[]);
	//
	useEffect(()=>{
		setDisplayString(()=>{
			return items.map((item,index)=>{
				return item[initialDisplayIndex[index]];
			})
		})
	},[initialDisplayIndex,items])
	return <>
		<div>{displayString.join(' ')}</div>
		<SlotmachineDisplayContainer 
			handleDisplayString={handleDisplayString} 
			items={items} 
			initialDisplayIndex={initialDisplayIndex}
		/>
	</>
}

export {
	Slotmachine
}