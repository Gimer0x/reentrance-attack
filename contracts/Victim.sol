//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract Victim {
    mapping(address => uint) public balances;

    constructor() payable {}

    function deposit()
        external
        payable
    {
        balances[msg.sender] += msg.value;
    }

    function getContractBalance() public view returns(uint) {
        return address(this).balance;
    }

    function balanceOf(address _user) external view returns (uint) {
        return balances[_user];
    }
    
    function withdrawAll()
        external
        
    {
        uint256 amount = balances[msg.sender];
        require( amount > 0, "contributions equals zero!");

        (bool status, ) = msg.sender.call{value: amount}("");
        require(status, "failed to send ether!");

        balances[msg.sender] = 0;
    }
}