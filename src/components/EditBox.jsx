import { useRef, useState } from "react"
import './editbox.css';
import { GenericButton } from "./GenericButton";

export function EditBox({handleDisplayEdit}) {
	const [index,setIndex] = useState(0);
	const backdropRef = useRef(null);
	const clickOutter = (e)=>{
		if (!backdropRef.current) {return;}
		if (e.target===backdropRef.current) {
			// handleDisplayEdit.close();
		}
	}
	return <div className="modalBackdrop" ref={backdropRef} onClick={clickOutter}>
		{/* 모달박스 */}
		<div className="editBox borderBox fontBitBit">
			{/* 00헤더 */}
			<div className="title fontMedium borderBox">
				내용바꾸기
			</div>
			{/* 01라디오와 인포 */}
			<div className="radioAndInfo">
				<div className="radio">
					{[0,1,2,3].map((item)=>{
						return <GenericButton 
							key={item} 
							className={'run fontMain'+(item===index?' active':'')} 
							onClick={()=>{
								setIndex(item);					
							}
						}>
							{item+1}
						</GenericButton>
					})}
				</div>
				<div className="info fontMain">
					쉼표(,)를 이용하여 여러 항목 입력 가능,<br/>
					공백은 무시됩니다.
				</div>
			</div>
			{/* 02텍스트에리어 */}
			<textarea className="textarea borderBox">

			</textarea>
			{/* 03버튼들 */}
			<div className="buttons">
				<GenericButton className={'add fontMain'}>
					저장
				</GenericButton>
				<GenericButton className={'remove fontMain'} onClick={handleDisplayEdit.close}>
					닫기
				</GenericButton>
			</div>
		</div>
	</div>
}