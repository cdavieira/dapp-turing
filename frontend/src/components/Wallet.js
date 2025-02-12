import { FormText, FormSelectAndText } from '../components/Forms'
import { ToggleButton } from '../components/Buttons'
import './Wallet.css'

function Wallet({ contract, accounts }){
  return (
    <>
      <ToggleButton
	label={'Voting'}
	className={'voting-switch'}
	initialState={true}
	handlerRight={() => contract.votingOn()}
	handlerLeft={() => contract.votingOff()}
      />
      <FormSelectAndText
	name={'issueToken'}
	options={accounts}
	labelMsg={'Issue tokens to address: '}
	buttonMsg={'RUN'}
	textPlaceholderMsg={'amount'}
	submitHandler={(addr, amount) => contract.issueToken(addr, amount)}
      />
      <FormSelectAndText
	name={'vote'}
	options={accounts}
	labelMsg={'Vote for address: '}
	buttonMsg={'RUN'}
	textPlaceholderMsg={'amount'}
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

export default Wallet;
