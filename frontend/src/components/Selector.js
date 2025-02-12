import { FormRadio, FormSelect, FormText } from '../components/Forms'

function ProviderSelector({ providers, connectProvider }){
  if(window.ethereum === undefined){
    return <p>No provider detected! Try to install Metamask before proceeding.</p>;
  }

  return (
    // <FormRadio
    //   name={'provider'}
    //   options={providers}
    //   buttonMsg={'Select provider'}
    //   submitHandler={connectProvider}
    // />
    <FormSelect
      name={'signer'}
      options={providers}
      selectText={'Select provider:'}
      submitHandler={connectProvider}
    />
  )
}

function AccountSelector( { accounts, connectAccount } ){
  //NOTE: if accounts.length === 0 and the code gets here, then the form will be empty
  return (
    <FormSelect
      name={'signer'}
      options={accounts}
      selectText={'Select an account:'}
      submitHandler={connectAccount}
    />
  )
}

function ContractSelector( {connectContract} ){
  return (
    <FormText
      name={'contract'}
      buttonMsg={'submit contract'}
      labelMsg={'Contract address'}
      submitHandler={connectContract}
    />
  )
}

export {
  ProviderSelector,
  AccountSelector,
  ContractSelector,
};
