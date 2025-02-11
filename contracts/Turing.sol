// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract TuringToken is ERC20 {
	//https://docs.soliditylang.org/en/latest/contracts.html#events
	event TokenIssued (
		address indexed from,
		address indexed to,
		uint256 value
	);

	event Voted (
		address indexed from,
		address indexed to,
		uint256 value
	);

	bool voting = true;

	//why address payable instead of address:
	//https://docs.soliditylang.org/en/latest/types.html#address
	address payable private teacher = payable(0x502542668aF09fa7aea52174b9965A7799343Df7);
	address private owner;

	//https://docs.soliditylang.org/en/latest/types.html#mapping-types
	mapping(string => address payable) private balances;
	uint8 balances_count = 0;
	mapping(address => mapping (address => bool)) private canVote;

	constructor() ERC20("TuringToken", "TGK"){
		owner = msg.sender;

		console.log("Owner: %s", msg.sender);

		balances["nome1"] =  payable(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
		balances["nome2"] =  payable(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
		balances["nome3"] =  payable(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC);
		balances["nome4"] =  payable(0x90F79bf6EB2c4f870365E785982E1f101E93b906);
		balances["nome5"] =  payable(0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65);
		balances["nome6"] =  payable(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc);
		balances["nome7"] =  payable(0x976EA74026E726554dB657fA54763abd0C3a0aa9);
		balances["nome8"] =  payable(0x14dC79964da2C08b23698B3D3cc7Ca32193d9955);
		balances["nome9"] =  payable(0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f);
		balances["nome10"] = payable(0xa0Ee7A142d267C1f36714E4a8F75612F20a79720);
		balances["nome11"] = payable(0xBcd4042DE499D14e55001CcbB24a551F3b954096);
		balances["nome12"] = payable(0x71bE63f3384f5fb98995898A86B02Fb2426c5788);
		balances["nome13"] = payable(0xFABB0ac9d68B0B445fB7357272Ff202C5651694a);
		balances["nome14"] = payable(0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec);
		balances["nome15"] = payable(0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097);
		balances["nome16"] = payable(0xcd3B766CCDd6AE721141F452C550Ca635964ce71);
		balances["nome17"] = payable(0x2546BcD3c84621e976D8185a91A922aE77ECEc30);
		balances["nome18"] = payable(0xbDA5747bFD65F08deb54cb465eB87D40e51B197E);
		balances["nome19"] = payable(0xdD2FD4581271e230360230F9337D5c0430Bf44C0);
		balances_count = 19;

		string memory sender;
		string memory receiver;
		for(uint256 i=1; i<=balances_count; i++){
			for(uint256 j=1; j<=balances_count; j++){
				//https://stackoverflow.com/questions/47129173/how-to-convert-uint-to-string-in-solidity
				sender = string.concat("nome", Strings.toString(i));
				receiver = string.concat("nome", Strings.toString(j));
				canVote[balances[sender]][balances[receiver]] = i == j ? false : true;
			}
		}
	}

	//https://docs.alchemy.com/docs/solidity-payable-functions
	function issueToken(string calldata codename, uint256 amount) public payable senderIsOwnerOrTeacher {
		//require((msg.sender == owner) || (msg.sender == teacher), "Only the owner/teacher can run this method");
		address receiver = balances[codename];

		console.log("%s receives %s", receiver, amount);

		_mint(receiver, amount);

		emit TokenIssued(msg.sender, receiver, amount);
	}

	//https://docs.alchemy.com/docs/solidity-payable-functions
	function vote(string calldata codename, uint256 amount) public payable votingOpen {
		address receiver = balances[codename];

		//reference: https://solidity-by-example.org/ether-units/
		require(msg.sender != receiver, "You cannot vote yourself");
		require(canVote[msg.sender][receiver], "You cannot vote twice for a user");
		require(amount < 2_000_000_000_000_000_000, "You cannot vote with more than 2*10**18");

		//the caller will only be able to vote once for 'codename'
		canVote[msg.sender][receiver] = false;

		_mint(receiver, amount);

		//according to https://docs.soliditylang.org/en/latest/types.html#rational-and-integer-literals,
		//we can write something like 1_000_000 to improve readability
		_mint(msg.sender, 200_000_000_000_000_000);

		emit Voted(msg.sender, receiver, amount);
	}

	function votingOn() public senderIsOwnerOrTeacher {
		voting = true;
	}

	function votingOff() public senderIsOwnerOrTeacher {
		voting = false;
	}

	function getAccountAddress(string calldata codename) external view returns (address){
		return balances[codename];
	}


	//https://docs.soliditylang.org/en/latest/contracts.html#function-modifiers
	modifier votingOpen() {
		require(voting, "Voting is off");
		_;
	}

	//modifier senderDiffersReceiver(receiver) {
	//	require(msg.sender != receiver, "You cannot vote yourself");
	//	_;
	//}

	//modifier firstVote(receiver) {
	//	require(canVote[msg.sender][receiver], "You cannot vote twice for a user");
	//	_;
	//}

	//modifier maxAmount(amount) {
	//	require(amount < 2*ether, "You cannot vote with more than 2*10**18");
	//	_;
	//}

	modifier senderIsOwnerOrTeacher() {
		require((msg.sender == owner) || (msg.sender == teacher), "Only the owner/teacher can run this method");
		_;
	}
}
