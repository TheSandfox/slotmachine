function SlotmachineDisplay({item}) {
	
}

function SlotmachineDisplayContainer({items,handleDisplayString}) {
	return <>
		{items.map((item,index)=>{
			return <SlotmachineDisplay item={item} key={index} handleDisplayString={handleDisplayString}/>
		})}
	</>
}

export {
	SlotmachineDisplayContainer
}