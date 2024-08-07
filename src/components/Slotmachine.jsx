import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import './slotmachine.css';
import { SlotmachineDisplayContainer } from "./SlotmachineDisplay";
import { GenericButton } from "./GenericButton";

function Slotmachine() {
	const [loading,setLoading] = useState(true);
	const [items,setItems] = useState([]);
	const [shuffle,setShuffle] = useState([]);
	const [trigger,setTrigger] = useState(null);
	const initialDisplayIndex = useMemo(()=>{
		if (items) {
			return items.map((item)=>{
				return Math.floor(Math.random()*item.length);
			});
		} else {
			return null;
		}
	},[items,shuffle]);
	const [displayCount,setDisplayCount] = useState(3);
	const handleDisplayCount = {
		increase:()=>{
			if (displayCount<4) {
				setDisplayCount(displayCount+1);
			}
		},
		decrease:()=>{
			if (displayCount>1) {
				setDisplayCount(displayCount-1);
			}
		}
	}
	//완성문자열
	const [displayMode,setDisplayMode] = useState([true]);
	const [displayString,setDisplayString] = useState(['']);
	const handleDisplayMode = (val,index)=>{
		setDisplayMode(prev => {
            let newArr = [...prev].slice(0,displayCount);
            newArr[index] = val;
            return newArr;
        });
	}
	const handleDisplayString = (val,index)=>{
		setDisplayString(prev => {
            let newArr = [...prev].slice(0,displayCount);
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
				setItems(Defaults.items.slice(0,displayCount));
			} catch {
				// 아이템 불러오기 실패
			}
		}
		fetchItems();
	},[displayCount]);
	//디스플레이스트링&디스플레이모드 초기화
	useEffect(()=>{
		setDisplayMode(()=>{
			return items.map(()=>{
				return true;
			})
		})
	},[initialDisplayIndex,items])
	return <div className="slotmachine">
		{/* 헤더 */}
		<div className={'slotmachineTitle fontTitle'}>
			다용도 룰렛
		</div>
		{/* 중앙영역 */}
		<div className={'slotmachineMiddle'}>
			{items.length>0
				?<SlotmachineDisplayContainer 
				handleDisplayString={handleDisplayString} 
				items={items} 
				initialDisplayIndex={initialDisplayIndex}
				trigger={trigger}
				/>
				:<></>
			}
			<div className={'slotmachineResult'}>
				<div className={'slotmachineResultString fontMedium'+(displayMode.includes(false)?'':' active')}>{displayString.join(' ')}</div>
				<div className={'slotmachineResultCopy'}/>
			</div>
		</div>
		{/* 하단버튼영역 */}
		<div className={'slotmachineBottom'}>
			<div className={'first'}>
				<GenericButton className={'edit'} onClick={()=>{
					
				}}/>
				<GenericButton className={'add'} onClick={
					handleDisplayCount.increase
				}/>
				<GenericButton className={'remove'} onClick={
					handleDisplayCount.decrease
				}/>
			</div>
			<div className={'second'}>
				<GenericButton className={'quick'} onClick={()=>{
					setShuffle([]);
				}}/>
				<GenericButton className={'run'} onClick={()=>{
					setTrigger(['roll']);
					// setTrigger(null);
				}}/>
			</div>
		</div>
	</div>
}

export {
	Slotmachine
}