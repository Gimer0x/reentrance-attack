# Sample - Reentrancy Attack

This project demonstrates a basic reentrancy attack. We have the contract Victim.sol which is vulnerable to reentrancy attacks. The contract Attacker.sol is able to launch a reentrancy attack. 

To show how to perpetrate the attack we developed the test: Reentrancy.js

To show an example of how to prevent this attack, we also developed the contracts VictimCEI.sol and VictimReentrancyGuard.sol. 

The contract VictimCEI implements the "Check - Effect - Interact" pattern to prevent reentrancy attacks. 

The contract VictimReentrancyGuard implements the OpenZeppeling's library ReentrancyGuard and the modifier nonReentrant to prevent this attack.


To execute the attack run: npx hardhat test. 

