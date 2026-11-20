// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {TuringToken} from "./Turing.sol";
import "hardhat/console.sol";

string constant P1_NAME = "nome1";
address constant P1_ADDR = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
string constant P2_NAME = "nome2";
address constant P2_ADDR = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
string constant P3_NAME = "nome3";
address constant P3_ADDR = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
string constant P4_NAME = "nome4";
address constant P4_ADDR = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
string constant P19_NAME = "nome19";
address constant P19_ADDR = 0xdD2FD4581271e230360230F9337D5c0430Bf44C0;
uint256 constant VALUE_DEF = 1_000_000_000;
uint256 constant VOTE_REWARD = 200_000_000_000_000_000;

// TODO: test modifiers
// TODO: fix failing tests
contract TuringTest is Test {
	TuringToken turing;
	address private OWNER;

	function setUp() public {
		turing = new TuringToken();
		OWNER = msg.sender;
	}

	function test_addParticipant() public {
		turing.addParticipant(P2_NAME, P2_ADDR);

		require(turing.participant_name_to_address_count() == 1,
			"Expected number of participants to be 1");
	}

	function test_getAccountAddress() public {
		turing.addParticipant(P2_NAME, P2_ADDR);

		require(turing.getAccountAddress(P2_NAME) == P2_ADDR,
			"Wrong expected address");
	}

	function test_votingSwitch() public {
		require(turing.voting() == true, "Expected voting to be initially open");

		turing.votingOff();
		require(turing.voting() == false, "Expected voting to be closed after requested by admin");

		turing.votingOn();
		require(turing.voting() == true, "Expected voting to be reopened after requested by admin");
	}

	function test_vote() public {
		turing.addParticipant(P2_NAME, P2_ADDR);
		turing.addParticipant(P3_NAME, P3_ADDR);

		vm.expectEmit();
		emit TuringToken.Voted(P2_ADDR, P3_ADDR, VALUE_DEF);

		// set msg.sender to the addr of P2_NAME
		vm.startPrank(P2_ADDR);
		turing.vote(P3_NAME, VALUE_DEF);

		require(P2_ADDR.balance == VOTE_REWARD, "Wrong expected balance for P2");
		require(P3_ADDR.balance == VALUE_DEF, "Wrong expected balance for P3");

		// rollback msg.sender to the default
		vm.stopPrank();
	}

	function test_issueToken() public {
		turing.addParticipant(P3_NAME, P3_ADDR);

		vm.expectEmit();
		emit TuringToken.TokenIssued(OWNER, P3_ADDR, VALUE_DEF);

		turing.issueToken(P3_NAME, VALUE_DEF);
		require(P3_ADDR.balance == VALUE_DEF, "Wrong expected balance for P3");
	}

	function test_canVote() public {
		turing.addParticipant(P3_NAME, P3_ADDR);
		turing.addParticipant(P2_NAME, P2_ADDR);
		require(turing.canVote(P2_NAME, P3_NAME) == true,
			"Expected participants to be able to vote for each other");
		require(turing.canVote(P3_NAME, P2_NAME) == true,
			"Expected participants to be able to vote for each other");
		require(turing.canVote(P2_NAME, P4_NAME) == false,
			"Expected not to be able to vote a participant which does not exist");
	}

	function test_addLocalParticipants() public {
		turing.addLocalParticipants();

		require(turing.participant_name_to_address_count() == 19,
			"Expected number of local participants to be 19");

		require(turing.getAccountAddress(P1_NAME) == P1_ADDR,
			"Wrong expected address for the first participant");

		require(turing.getAccountAddress(P19_NAME) == P19_ADDR,
			"Wrong expected address for the last participant");

		string[19] memory names = [
			"nome1", "nome2", "nome3", "nome4", "nome5", "nome6", "nome7", "nome8", "nome9", "nome10",
			"nome11", "nome12", "nome13", "nome14", "nome15", "nome16", "nome17", "nome18", "nome19"
		];

		for (uint256 i = 0; i < names.length; i++) {
			for (uint256 j = 0; j < names.length; j++) {
				if (i != j) {
					require(turing.canVote(names[i], names[j]),
						"All local participants should be able to vote each other");
				} else {
					require(!turing.canVote(names[i], names[j]),
						"A local participant shouldn't be able to vote in himself");
				}
			}
		}
	}
}

// https://hardhat.org/docs/tutorial/writing-and-testing
// https://hardhat.org/docs/tutorial/assertions-library

// how to use the special vm variable (the so called 'cheatcode')
// https://www.getfoundry.sh/reference/cheatcodes/overview
