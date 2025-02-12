import { ethers } from 'ethers';

const providers = [
  'Metamask',
  'Local',
  'Ethers',
];

//https://docs.metamask.io/wallet/reference/json-rpc-methods/wallet_addethereumchain/?AddEthereumChainParameter%5BrpcUrls%5D%5B0%5D=http://127.0.0.1:8545&AddEthereumChainParameter%5BchainId%5D=0x539&AddEthereumChainParameter%5BchainName%5D=Hardhat&AddEthereumChainParameter%5BnativeCurrency%5D%5Bname%5D=testEth&AddEthereumChainParameter%5BnativeCurrency%5D%5Bsymbol%5D=testEth&AddEthereumChainParameter%5BnativeCurrency%5D%5Bdecimals%5D=18
async function metamaskAddLocalNetwork(){
  try{
    //https://docs.metamask.io/wallet/how-to/run-devnet/
    //1337 = 0x539
    //31337 = 0x7A69
    let chainId = "0x7A69";
    let url = "http://localhost:8545";
    await window.ethereum.request({
     "method": "wallet_addEthereumChain",
     "params": [{
	chainId: chainId,
	chainName: `Local network (${url})`,
	rpcUrls: [
	  url
	],
	nativeCurrency: {
	  name: "TGK",
	  symbol: "TGK",
	  decimals: 18
	},
      }],
    });
  }
  catch(err){
    console.log(err);
  }
}

const metamaskChainChangedHandler = (chainId) => console.log("New chain detected:", chainId);
const metamaskAccountsChangedHandler = (accounts) => console.log("Accounts changed:", accounts);
const metamaskConnectHandler = (info) => console.log("The provider has connected to a chain:", info);
const metamaskDisconnectHandler = (err) => console.log("The provider is no longer connected to the chain:", err);
const metamaskMessageHandler = (msg) => console.log("New message received:", msg);

//https://docs.metamask.io/wallet/reference/provider-api/#accountschanged
function metamaskAddListeners(){
  window.ethereum.on("chainChanged", metamaskChainChangedHandler);
  window.ethereum.on("accountsChanged", metamaskAccountsChangedHandler);
  window.ethereum.on("connect", metamaskConnectHandler);
  window.ethereum.on("disconnect", metamaskDisconnectHandler);
  window.ethereum.on("message", metamaskMessageHandler);
}

//https://docs.metamask.io/wallet/reference/provider-api/#remove-event-listeners
function metamaskRemoveListeners(){
  window.ethereum.removeListener("chainChanged", metamaskChainChangedHandler);
  window.ethereum.removeListener("accountsChanged", metamaskAccountsChangedHandler);
  window.ethereum.removeListener("connect", metamaskConnectHandler);
  window.ethereum.removeListener("disconnect", metamaskDisconnectHandler);
  window.ethereum.removeListener("message", metamaskMessageHandler);
}

function setupProvider(name){
  if(window.ethereum !== undefined){
    // console.log(window.ethereum);
    // console.log('Has provider');

    //https://docs.metamask.io/wallet/reference/provider-api/
    if(window.ethereum.isMetaMask){
      // console.log('Provider is metamask');

      metamaskAddListeners();
      //metamaskAddLocalNetwork();

      if(window.ethereum.isConnected()){
	// console.log("Metamask is connected to chain")
      }
    }
  }
}

/* NOTE: this function can actually return different types of providers... */
function getProvider(name){
    switch(name){
      case 'Metamask':
	return new ethers.BrowserProvider(window.ethereum);
      case 'Local':
	return new ethers.JsonRpcProvider('http://localhost:8545');
      case 'Ethers':
	// return ethers.getDefaultProvider();
      default:
	console.log('Unexpected provider:', name);
    }
    return null;
}

/* NOTE: https://github.com/ethers-io/ethers.js/blob/main/src.ts/providers/provider-browser.ts#L128
 * TODO: maybe not all providers have the 'send' method? */
async function getAccounts(provider){
  const accountsAddrs = await provider.send("eth_accounts", [ ]);
  const accounts = accountsAddrs.map((addr, idx) => {
    return {
      name: `nome${idx+1}`,
      amount: '',
      addr: addr,
      last_update: new Date(),
      transaction_ongoing: false,
      accountNumber: idx+1,
    }
  });
  return accounts;
};

async function fillAccounts(provider, setAccounts){
  const accounts = await getAccounts(provider);
  setAccounts(accounts);
}

export {
  providers,
  setupProvider,
  getProvider,
  fillAccounts,
};
