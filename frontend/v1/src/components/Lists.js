import './Lists.css';

function OrderedList({ items, itemTextHandler }){
  const itemList = items.map((item, idx) => {
    let val = item;
    let key = idx;
    if(item instanceof Object){
      val = item.value;
      key = 'id' in item ? item.id : idx;
    }
    let text = itemTextHandler(val);
    return (
      <li key={key}>
	{text}
      </li>
    )
  });
  return (
    <ol>
      {itemList}
    </ol>
  )
}

export {  OrderedList };
