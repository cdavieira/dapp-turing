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

  //Stage 4: get information associated with all accounts and with that contract
  let clearIntervalRef = useRef(null);

  async function connectProvider(providerName){
    const provider = getProvider(providerName);
    // setupProvider(provider);
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

  function updateAccounts(contract){
    const updatedAccounts = contract.commit();
    updatedAccounts.sort((acc1, acc2) => (parseFloat(acc2.amount) - parseFloat(acc1.amount)));
    setAccounts(updatedAccounts);
  }

  async function connectContract(addr){
    const contract = new TuringContractProxy(addr, signer, accounts);
    await contract.poll();
    updateAccounts(contract);
    setContract(contract);
    setContractAddr(await contract.getContractAddress());
  }

  async function changeContract(){
    if(clearIntervalRef !== null){
      clearInterval(clearIntervalRef);
      clearIntervalRef = null;
    }
    if(contract !== null){
      await contract.removeListeners();
    }
    setContract(null);
    setContractAddr(null);
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
      {
	signer !== null && contract === null &&
	<ContractSelector
	  signer={signer}
	  connectContract={connectContract}
	/>
      } { contract !== null &&
	<>
	  <Wallet contract={contract} />
	  <p id="account-rank"> Account rank</p>
	  <AccountTracker
	    accounts={accounts}
	    setRefreshCallback={() => {
	      //https://stackoverflow.com/questions/60458193/how-can-you-trigger-a-rerender-of-a-react-js-component-every-minute
	      console.log("Refreshing account rank");
	      clearIntervalRef = setInterval(() => {updateAccounts(contract); }, 15*1000);
	    }}
	  />
	</>
      }
    </>
  )
}
