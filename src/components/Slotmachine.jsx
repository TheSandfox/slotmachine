import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import './slotmachine.css';
import { SlotmachineDisplayContainer } from "./SlotmachineDisplay";
import { GenericButton } from "./GenericButton";
// 아이콘
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaBolt, FaCopy } from "react-icons/fa6";
import { EditBox } from "./EditBox";


function Slotmachine() {
	const [loading,setLoading] = useState(true);
	const [items,setItems] = useState([]);
	const [shuffle,setShuffle] = useState([]);
	const [trigger,setTrigger] = useState(null);
	const [displayEdit,setDisplayEdit] = useState(false);
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
	const handleDisplayEdit = {
		close:()=>{
			setDisplayEdit(false);
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
	const copyDisplayString = useCallback(()=>{
		let newString = displayString.map((stringItem)=>{
			return stringItem.replaceAll(' ','')
		})
		.filter((stringItem)=>{
			return stringItem.length > 0;
		}).join(' ');
		navigator.clipboard.writeText(newString).then(() => {
			alert(`"${newString}"\n클립보드에 복사되었습니다.`);
		});
	},[displayString]);
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
	//표시갯수 가감시 트리거정상화
	useEffect(()=>{
		// setTrigger(['quick']);
		setTrigger(null);
	},[displayCount])
	return <>
		<div className="slotmachine">
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
				<div className={'slotmachineResult'+(displayMode.includes(false)?'':' active')}>
					{/* 완성문자열 */}
					<div className={'slotmachineResultString fontMedium'}>{displayString.join(' ')}</div>
					{/* 복사버튼 */}
					<FaCopy className={'slotmachineResultCopy'+(displayMode?' active':'')} onClick={copyDisplayString}>
					</FaCopy>
				</div>
			</div>
			{/* 하단버튼영역 */}
			<div className={'slotmachineBottom'}>
				<div className={'first'}>
					<GenericButton className={'edit'} onClick={()=>{
						setDisplayEdit(!displayEdit);
					}}>
						<FaEdit/>
					</GenericButton>
					<GenericButton className={'add'} onClick={
						handleDisplayCount.increase
					}>
						<FaPlus/>
					</GenericButton>
					<GenericButton className={'remove'} onClick={
						handleDisplayCount.decrease
					}>
						<FaMinus/>
					</GenericButton>
				</div>
				<div className={'second'}>
					<GenericButton className={'quick'} onClick={()=>{
						setTrigger(['quick']);
					}}>
						<FaBolt/>
					</GenericButton>
					<GenericButton className={'run'} onClick={()=>{
						setTrigger(['roll']);
						// setTrigger(null);
					}}>
						GO!
					</GenericButton>
				</div>
			</div>
		</div>
		{displayEdit
			?<EditBox handleDisplayEdit={handleDisplayEdit}/>
			:<></>
		}
	</>
}

export {
	Slotmachine
}