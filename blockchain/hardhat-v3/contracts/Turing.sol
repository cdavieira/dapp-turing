// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract TuringToken is ERC20 {
	// Errors

	// Events
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

	// Variables
	//   Private
	address immutable private owner;
	address payable constant private teacher = payable(0x502542668aF09fa7aea52174b9965A7799343Df7);
	mapping(string => address payable) private participant_name_to_address;
	mapping(uint256 => string) private participant_index_to_name;
	mapping(address => mapping (address => bool)) private participant_address_to_vote_status;

	//   Public
	bool voting = true;
	uint8 participant_name_to_address_count = 0;

	// Constructor
	constructor() ERC20("TuringToken", "TGK"){
		owner = msg.sender;
		// console.log("Owner: %s", msg.sender);
		this.addLocalParticipants();
	}

	// Public API
	function addParticipant(string calldata name, address addr) public {
		uint256 participant_idx = participant_name_to_address_count;

		participant_index_to_name[participant_idx] = name;
		participant_name_to_address[name] = payable(addr);

		address sender;
		for(uint256 i=0; i<participant_name_to_address_count; i++){
			sender = participant_name_to_address[participant_index_to_name[i]];
			participant_address_to_vote_status[sender][addr] = true;
			participant_address_to_vote_status[addr][sender] = true;
		}
		participant_address_to_vote_status[addr][addr] = false;

		participant_name_to_address_count += 1;
	}

	function addLocalParticipants() public {
		this.addParticipant("nome1",0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
		this.addParticipant("nome2",0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
		this.addParticipant("nome3",0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC);
		this.addParticipant("nome4",0x90F79bf6EB2c4f870365E785982E1f101E93b906);
		this.addParticipant("nome5",0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65);
		this.addParticipant("nome6",0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc);
		this.addParticipant("nome7",0x976EA74026E726554dB657fA54763abd0C3a0aa9);
		this.addParticipant("nome8",0x14dC79964da2C08b23698B3D3cc7Ca32193d9955);
		this.addParticipant("nome9",0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f);
		this.addParticipant("nome10",0xa0Ee7A142d267C1f36714E4a8F75612F20a79720);
		this.addParticipant("nome11",0xBcd4042DE499D14e55001CcbB24a551F3b954096);
		this.addParticipant("nome12",0x71bE63f3384f5fb98995898A86B02Fb2426c5788);
		this.addParticipant("nome13",0xFABB0ac9d68B0B445fB7357272Ff202C5651694a);
		this.addParticipant("nome14",0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec);
		this.addParticipant("nome15",0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097);
		this.addParticipant("nome16",0xcd3B766CCDd6AE721141F452C550Ca635964ce71);
		this.addParticipant("nome17",0x2546BcD3c84621e976D8185a91A922aE77ECEc30);
		this.addParticipant("nome18",0xbDA5747bFD65F08deb54cb465eB87D40e51B197E);
		this.addParticipant("nome19",0xdD2FD4581271e230360230F9337D5c0430Bf44C0);
	}

	function issueToken(string calldata codename, uint256 amount) public payable senderIsOwnerOrTeacher {
		require(participant_name_to_address[codename] != address(0x0), "issueToken failed because the requested codename does not exist in this contract");

		address receiver = participant_name_to_address[codename];

		console.log("%s receives %s", receiver, amount);

		_mint(receiver, amount);

		emit TokenIssued(msg.sender, receiver, amount);
	}

	function vote(string calldata codename, uint256 amount) public payable votingOpen {
		require(participant_name_to_address[codename] != address(0x0), "vote failed because the requested codename does not exist in this contract");

		address receiver = participant_name_to_address[codename];

		require(msg.sender != receiver, "You cannot vote yourself");
		require(participant_address_to_vote_status[msg.sender][receiver], "You cannot vote twice for a user");
		require(amount < 2_000_000_000_000_000_000, "You cannot vote with more than 2*10**18");
		require(msg.sender != owner, "The owner cannot vote");
		require(msg.sender != teacher, "The teacher cannot vote");

		//the caller will only be able to vote once for 'codename'
		participant_address_to_vote_status[msg.sender][receiver] = false;

		_mint(receiver, amount);

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
		return participant_name_to_address[codename];
	}

	// Private API

	// Modifiers
	modifier votingOpen() {
		require(voting, "Voting is off");
		_;
	}

	modifier senderDiffersReceiver(receiver) {
		require(msg.sender != receiver, "You cannot vote yourself");
		_;
	}

	modifier firstVote(receiver) {
		require(participant_address_to_vote_status[msg.sender][receiver], "You cannot vote twice for a user");
		_;
	}

	// modifier maxAmount(amount) {
	// 	require(amount < 2*ether, "You cannot vote with more than 2*10**18");
	// 	_;
	// }

	modifier senderIsOwnerOrTeacher() {
		require((msg.sender == owner) || (msg.sender == teacher), "Only the owner/teacher can run this method");
		_;
	}

	// Other
	function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
		return interfaceID == type(IERC20).interfaceId; // If your token is ERC-20
	}

	function decimals() override public pure returns (uint8) {
		return 18;
	}

	fallback() external payable {
		console.log("----- fallback:", msg.value);
	}

	receive() external payable {
		console.log("----- receive:", msg.value);
	}
}

// About payable addresses
// https://docs.soliditylang.org/en/latest/types.html#address

// About immutable/constant variables
// https://docs.soliditylang.org/en/v0.8.38/contracts.html#constant-and-immutable-state-variables

// About events
// https://docs.soliditylang.org/en/latest/contracts.html#events

// About mapping types
// https://docs.soliditylang.org/en/latest/types.html#mapping-types

// About function modifiers
// https://docs.soliditylang.org/en/latest/contracts.html#function-modifiers

// Ether units
// https://solidity-by-example.org/ether-units/

// About using _ to write numbers that are easier to read
// https://docs.soliditylang.org/en/latest/types.html#rational-and-integer-literals

// About payable functions
// https://docs.soliditylang.org/en/v0.8.38/contracts.html#constant-and-immutable-state-variables
// How to convert uint to string in solidity
// https://stackoverflow.com/questions/47129173/how-to-convert-uint-to-string-in-solidity
