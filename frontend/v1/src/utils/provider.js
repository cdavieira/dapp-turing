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
  //const accountsAddrs = await provider.send("eth_accounts", [ ]);
  const accountsAddrs = [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
    '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
    '0x71bE63f3384f5fb98995898A86B02Fb2426c5788',
    '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a',
    '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
    '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
    '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
    '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
  ];
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
