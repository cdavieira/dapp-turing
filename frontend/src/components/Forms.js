import { useState } from 'react';
import './Forms.css'

function FormText( { name, buttonMsg, labelMsg, placeholderMsg, submitHandler} ){
  const [text, setText] = useState("");
  return (
    <FormTextStateless
      name={name}
      buttonMsg={buttonMsg}
      labelMsg={labelMsg}
      placeholderMsg={placeholderMsg}
      submitHandler={submitHandler}
      text={text}
      setText={setText}
    />
  )
}

function FormTextStateless( { name, buttonMsg, labelMsg, placeholderMsg, submitHandler, text, setText} ){
  let formsId = `${name}FormText`;
  let inputId = `${name}FormTextInput`;

  //'e.preventDefault' disallows page refreshes for this event!
  function submitHandlerWrapper(e){
    e.preventDefault();
    submitHandler(text);
  }

  return (
    <form className="form-section" onSubmit={submitHandlerWrapper}>
      <label htmlFor={formsId}> {labelMsg} </label>
      <input
	id={inputId}
	name={formsId}
	type="text"
	value={text}
	onChange={(event) => setText(event.target.value)}
	placeholder={placeholderMsg}
      />
      <button type="submit">{buttonMsg}</button>
    </form>
  )
}

function FormText2( { name, buttonMsg, labelMsg, placeholder1Msg, placeholder2Msg, submitHandler} ){
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  return (
    <FormText2Stateless
      name={name}
      buttonMsg={buttonMsg}
      labelMsg={labelMsg}
      submitHandler={submitHandler}
      text1={text1}
      placeholder1Msg={placeholder1Msg}
      setText1={setText1}
      text2={text2}
      placeholder2Msg={placeholder2Msg}
      setText2={setText2}
    />
  )
}

function FormText2Stateless( { name, buttonMsg, labelMsg, submitHandler, placeholder1Msg, text1, setText1, placeholder2Msg, text2, setText2} ){
  let formsId = `${name}FormText`;
  let inputId1 = `${name}FormTextInput1`;
  let inputId2 = `${name}FormTextInput2`;

  //'e.preventDefault' disallows page refreshes for this event!
  function submitHandlerWrapper(e){
    e.preventDefault();
    submitHandler(text1, text2);
  }

  return (
    <form className="form-section" onSubmit={submitHandlerWrapper}>
      <label htmlFor={formsId}> {labelMsg} </label>
      <input
	id={inputId1}
	name={formsId}
	type="text"
	value={text1}
	placeholder={placeholder1Msg}
	onChange={(event) => setText1(event.target.value)}
      />
      <input
	id={inputId2}
	name={formsId}
	type="text"
	value={text2}
	placeholder={placeholder2Msg}
	onChange={(event) => setText2(event.target.value)}
      />
      <button type="submit">{buttonMsg}</button>
    </form>
  )
}







// https://stackoverflow.com/questions/5419459/how-to-allow-only-one-radio-button-to-be-checked
// we need 'name' to be equal across all different options, because this
// field gets used by the browser to group all options that belong to the
// same 'input' HTML element. This is important for when this data gets
// submitted.

function FormRadioOpt({ formName, optName, currentOption, changeHandler }){
  let formId = `${formName}FormRadio`;
  let optionId = `${optName}FormRadioOption`;
  return (
    <>
      <input
	type="radio"
	name={formId}
	id={optionId}
	value={optName}
	checked={currentOption === `${optName}`}
	onChange={(e) => changeHandler(e.target.value)}
      />
      <label htmlFor={optionId}>{optName}</label><br/>
    </>
  )
}

//'options' should be an immutable list
function FormRadio( {name, options, buttonMsg, submitHandler} ){
  const [currentOption, setCurrentOption] = useState(null);
  return (
    <FormRadioStateless
      name={name}
      options={options}
      buttonMsg={buttonMsg}
      submitHandler={submitHandler}
      currentOption={currentOption}
      setCurrentOption={setCurrentOption}
    />
  )
}

function FormRadioStateless( {name, options, buttonMsg, submitHandler, currentOption, setCurrentOption} ){
  const radioOptions = options.map(
    (opt, i) => 
      <FormRadioOpt
	formName={name}
	optName={opt}
	currentOption={currentOption}
	changeHandler={(opt) => setCurrentOption(opt)}
	key={i}
      />
  );
  function submitHandlerWrapper(event){
    if(event !== undefined){
      event.preventDefault();
    }
    submitHandler(currentOption);
  }
  return (
    <form className="form-section" onSubmit={submitHandlerWrapper}>
      {radioOptions}
      <button type="submit">{buttonMsg}</button>
    </form>
  )
}






function FormSelect({
  name,
  options,
  selectText,
  submitHandler
})
{
  const [value, setValue] = useState('');
  return (
    <FormSelectStateless
      name = {name}
      options = {options}
      selectText = {selectText}
      submitHandler = { (v) => {submitHandler(v); setValue(''); }}
      value = {value}
      setValue = {setValue}
    />
  )
}

function FormSelectStateless({
  name,
  options,
  selectText,
  submitHandler,
  value,
  setValue
})
{
  const formId = `${name}FormSelect`
  const selectId = `${name}FormSelectId`;
  const selectOptions = options.map((opt, idx) => {
    let val = opt;
    let key = idx;
    if(opt instanceof Object){
      val = opt.value;
      key = 'id' in opt ? opt.id : idx;
    }
    return (
      <option value={val} key={key}>
	{val}
      </option>
    )
  }
  );

  function submitHandlerWrapper(e){
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const value = formData.get(formId);
    submitHandler(value);
  }

  return (
    <form className="form-section" onSubmit={submitHandlerWrapper}>
      <label htmlFor={selectId}>{selectText}</label>
      <select
	id={selectId}
	name={formId}
	value={value}
	onChange={(e) => setValue(e.target.value)}>
	{selectOptions}
      </select>
      <button type="submit"> Select </button>
    </form>
  )
}






export {
  FormText,
  FormTextStateless,
  FormText2,
  FormText2Stateless,
  FormRadio,
  FormRadioStateless,
  FormSelect,
  FormSelectStateless,
};
