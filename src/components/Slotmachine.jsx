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
	//완성문자열
	const [displayMode,setDisplayMode] = useState([true]);
	const [displayString,setDisplayString] = useState(['']);
	const handleDisplayMode = (val,index)=>{
		setDisplayMode(prev => {
            let newArr = [...prev];
            newArr[index] = val;
            return newArr;
        });
	}
	const handleDisplayString = (val,index)=>{
		setDisplayString(prev => {
            let newArr = [...prev];
            if (val !== '') {
                newArr[index] = val;
                handleDisplayMode(true, index);
            } else {
               handleDisplayMode(false, index);
            }
            return newArr;
        });
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
	//디스플레이스트링&디스플레이모드 초기화
	useEffect(()=>{
		setDisplayString(()=>{
			return items.map((item,index)=>{
				return item[initialDisplayIndex[index]];
			})
		})
		setDisplayMode(()=>{
			return items.map(()=>{
				return true
			})
		})
	},[initialDisplayIndex,items])
	return <div className="slotmachine">
		<div className={'slotmachineDisplayString'+(displayMode.includes(false)?'':' active')}>{displayString.join(' ')}</div>
		{items.length>0
			?<SlotmachineDisplayContainer 
				handleDisplayString={handleDisplayString} 
				items={items} 
				initialDisplayIndex={initialDisplayIndex}
			/>
			:<></>
		}
	</div>
}

export {
	Slotmachine
}