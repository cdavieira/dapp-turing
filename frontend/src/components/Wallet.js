import { FormText, FormText2 } from '../components/Forms'
import { SimpleButton, ToggleButton } from '../components/Buttons'
import './Wallet.css'

function Wallet({ contract }){
  return (
    <>
      <ToggleButton
	label={'Voting'}
	className={'voting-switch'}
	initialState={true}
	handlerRight={() => {console.log('turning on voting');contract.votingOn();}}
	handlerLeft={() => {console.log('turning off voting');contract.votingOff();}}
      />
      <FormText2
	name={'issueTokenButton'}
	buttonMsg={'RUN'}
	labelMsg={'Issue tokens to address: '}
	placeholder1Msg={'codename'}
	placeholder2Msg={'amount'}
	submitHandler={(addr, amount) => contract.issueToken(addr, amount)}
      />
      <FormText2
	name={'voteButton'}
	buttonMsg={'RUN'}
	labelMsg={'Vote for address: '}
	placeholder1Msg={'codename'}
	placeholder2Msg={'amount'}
	submitHandler={(addr, amount) => contract.vote(addr, amount)}
      />
      <FormText
	name={'balanceOfButton'}
	buttonMsg={'RUN'}
	labelMsg={'Get balance of address: '}
	placeholderMsg={'address'}
	submitHandler={addr => contract.balanceOf(addr)}
      />
    </>
  )
}
      // <div className='voting-section'>
	// <SimpleButton
	  // className={'voting-item'}
	  // labelMsg={'Voting: '}
	  // btnMsg={'turn on'}
	  // clickHandler={() => contract.votingOn()}
	// />
	// <SimpleButton
	  // className={'voting-item'}
	  // labelMsg={'Voting: '}
	  // btnMsg={'turn off'}
	  // clickHandler={() => contract.votingOff()}
	// />
      // </div>

export default Wallet;
