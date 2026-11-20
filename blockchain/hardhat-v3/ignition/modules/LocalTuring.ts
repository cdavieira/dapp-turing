import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("LocalTuringModule", (m) => {
  const turing = m.contract("TuringToken");

  //[] is the list of arguments to be supplied to the method that was called
  m.call(turing, "addLocalParticipants", []);

  return { turing };
});
