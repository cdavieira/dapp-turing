// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";

contract TuringTest is Test {
  TuringToken turing;

  function setUp() public {
    turing = new TuringToken();
  }

  // function test_InitialValue() public view {
  //   require(counter.x() == 0, "Initial value should be 0");
  // }

  // function testFuzz_Inc(uint8 x) public {
  //   for (uint8 i = 0; i < x; i++) {
  //     counter.inc();
  //   }
  //   require(counter.x() == x, "Value after calling inc x times should be x");
  // }

  // function test_IncByZero() public {
  //   vm.expectRevert();
  //   counter.incBy(0);
  // }
}
