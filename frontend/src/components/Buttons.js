import { useState } from 'react';
import './Buttons.css'

function SimpleButton( { labelMsg, btnMsg, clickHandler, className } ){
  return (
    <div className={className}>
      {labelMsg}
      <button onClick={clickHandler}>
	{btnMsg}
      </button>
    </div>
  )
}

function ToggleButton( { label, handlerLeft, handlerRight, initialState, className } ){
  const [isChecked, setIsChecked] = useState(initialState);
  function handleChange(event){
    // event.preventDefault();
    const checked = event.target.checked;
    if(checked === true){
      handlerRight();
    }
    else{
      handlerLeft();
    }
    setIsChecked(checked);
  }
  return (
    <div className={className}>
      <p>{label}</p>
      <label className="switch">
	<input
	  checked={isChecked}
	  type="checkbox"
  	  onChange={handleChange}
	/>
	<span className="slider round"></span>
      </label>
    </div>
  );
}

export {
  SimpleButton,
  ToggleButton,
};
