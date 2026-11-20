import { ProviderSelector, AccountSelector, ContractSelector } from './components/Selector'
import { providers, setupProvider, getProvider, fillAccounts } from './utils/provider'
import { TuringContractProxy } from './utils/contracts'
import Wallet from './components/Wallet'
import { AccountTracker } from './components/AccountTracker'

import { useState, useRef } from 'react';

import './App.css';

export default function App() {
  //State 1: get provider
  const [providerName, setProviderName] = useState(null);
  const [provider, setProvider] = useState(null);
  const [accounts, setAccounts] = useState([]); //list of {}

  //State 2: get 1 account out of all available ones and its associated signer
  const [signer, setSigner] = useState(null);
  const [accountAddr, setAccountAddr] = useState(null); //this state is not necessary, but its convenient

  //State 3: get 1 contract on the blockchain associated with the provider
  const [contract, setContract] = useState(null);
  const [contractAddr, setContractAddr] = useState(null); //this state is not necessary, but its convenient

  async function connectProvider(providerName){
    const provider = getProvider(providerName);

    // setupProvider(provider);
    // switch(providerName){
    //   case 'Metamask':
	// try{
	  // const metamaskAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
	  // const selectedAccount = metamaskAccounts[0];
	  // const account = await provider.getSigner(selectedAccount);
	  // // const network  = await provider.getNetwork();
	  // setProvider(provider);
	  // setProviderName(providerName);
	  // setAccountAddr(selectedAccount);
	  // setSigner(account);
	// }
	// catch(err){
	  // if (err.code === 4001) {
	    // console.log("Please connect to MetaMask.")
	  // } else {
	    // console.error(err)
	  // }
	// }
	// return ;
    //   default:
	// break;
    // }
    setProvider(provider);
    fillAccounts(provider, setAccounts);
    setProviderName(providerName);
  }

  function changeProvider(){
    changeAccount();
    setProvider(null);
    setProviderName(null); 
    setAccounts([]); 
  }

  async function connectAccount(addr){
    const account = await provider.getSigner(addr);
    // const network  = await provider.getNetwork();
    // const signerAddr = await signer.getAddress(); // signerAddr === addr
    setAccountAddr(addr);
    setSigner(account);
  }

  function changeAccount(){
    changeContract();
    setAccountAddr(null);
    setSigner(null);
  }

  function sortAccountsByAmount(accounts){
    accounts.sort((acc1, acc2) => (parseFloat(acc2.amount) - parseFloat(acc1.amount)));
  }

  function sortAccountsByName(accounts){
    accounts.sort((acc1, acc2) => acc1.name.localeCompare(acc2.name));
  }

  function sortAccountsByAccountNumber(accounts){
    accounts.sort((acc1, acc2) => (acc1.accountNumber - acc2.accountNumber));
  }

  async function connectContract(addr){
    const contract = new TuringContractProxy(addr, signer, accounts, setAccounts);
    await contract.poll();
    const updatedAccounts = contract.commit();
    sortAccountsByAmount(updatedAccounts);
    setAccounts(updatedAccounts);
    setContract(contract);
    setContractAddr(await contract.getContractAddress());
  }

  async function changeContract(){
    if(contract !== null){
      await contract.removeListeners();
    }
    setContract(null);
    setContractAddr(null);
  }

  function feedWalletSelection(accounts){
    const shallowCopy = accounts.slice();
    sortAccountsByAccountNumber(shallowCopy);
    return shallowCopy.map((acc) => { return {id: acc.addr, value: acc.name}; })
  }

  function feedAccountTracker(accounts){
    const shallowCopy = accounts.slice();
    sortAccountsByAmount(shallowCopy);
    return shallowCopy;
  }

  return (
    <>
      <p id="dapp-title"> Turing dapp </p>
      <div className="info-section">
	<div className="info-item">
	  <p>
	    Provider: {providerName}
	    { provider !== null && 
	      <button onClick={changeProvider}>
		Change Provider
	      </button>
	    }
	  </p>
	</div>
	<div className="info-item">
	  <p>
	    Account: {accountAddr}
	    { accountAddr !== null &&
	      <button onClick={changeAccount}>
		Change Account
	      </button>
	    }
	  </p>
	</div>
	<div className="info-item">
	  <p>
	    Contract: {contractAddr}
	    { contractAddr !== null &&
	      <button onClick={changeContract}>
		Change Contract
	      </button>
	    }
	  </p>
	</div>
      </div>
      { provider === null &&
	<ProviderSelector
	  providers={providers}
	  connectProvider={connectProvider}
	/>
      }
      { provider !== null && signer === null && accounts.length > 0 &&
	<AccountSelector
	  accounts={accounts.map((acc) => {return {id: acc.addr, value: acc.addr}})}
	  connectAccount={connectAccount}
	/>
      }
      { signer !== null && contract === null &&
	<ContractSelector
	  signer={signer}
	  connectContract={connectContract}
	/>
      } { contract !== null &&
	<>
	  <Wallet
	    contract={contract}
	    accounts={feedWalletSelection(accounts)}
	  />
	  <p id="account-rank">Account rank</p>
	  <AccountTracker
	    accounts={feedAccountTracker(accounts)}
	  />
	</>
      }
    </>
  )
}
