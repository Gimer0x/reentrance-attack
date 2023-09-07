# Sample - Reentrancy Attack

This project demonstrates a basic reentrancy attack. We have the contract Victim.sol which is vulnerable to reentrancy attacks. The contract Attacker.sol is able to launch a reentrancy attack. 

To show how to perpetrate the attack we developed the test: Reentrancy.js

We also developed the contract VictimCEI.sol. This contract implements the "Check - Effect - Interact" pattern to prevent reentrancy attacks. 

To execute the attack run: npx hardhat test. 

