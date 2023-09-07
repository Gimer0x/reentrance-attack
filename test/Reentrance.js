const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Reentrance", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  const ZERO = 0n;
  const ONE_ETHER = ethers.parseEther('1');
  const FIVE_ETHER = ethers.parseEther('5');
  const TEN_ETHER = ethers.parseEther('10');
  const TWENTY_ETHER = ethers.parseEther('20');

  async function initFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user1, user2, hacker] = await ethers.getSigners();

    // Deploy victim's contract
    const Victim = await ethers.getContractFactory("Victim");
    const victim = await Victim.deploy({ value: TEN_ETHER});

    // Deploy victim's contract
    const VictimCEI = await ethers.getContractFactory("VictimCEI");
    const victimCEI = await VictimCEI.deploy({ value: TEN_ETHER});

    // Deploy attacker's contract
    const Attacker = await ethers.getContractFactory("Attacker");
    const attacker = await Attacker.connect(hacker).deploy(victim, { value: ONE_ETHER});

     // Check balance before the attack
    expect(await attacker.getContractBalance()).to.be.equal(ONE_ETHER);

    await victimCEI.connect(user1).deposit({value: FIVE_ETHER});
    await victimCEI.connect(user2).deposit({value: FIVE_ETHER});

    expect(await victim.getContractBalance()).to.be.equal(TEN_ETHER);

    await victim.connect(user1).deposit({value: FIVE_ETHER});
    await victim.connect(user2).deposit({value: FIVE_ETHER});

    return { victim, attacker, victimCEI, owner, user1, user2, hacker };
  }

  describe("Launch attack", function () {
    it("Should launch a reentrance attack", async function () {
      const { victim, attacker, owner, user1, user2, hacker } = await loadFixture(initFixture);
     
      // Verify victim's contract balance
      expect(await victim.getContractBalance()).to.be.equal(TWENTY_ETHER);

      // Verify user's balance
      expect(await victim.balances(user1)).to.be.equal(FIVE_ETHER);
      expect(await victim.balances(user2)).to.be.equal(FIVE_ETHER);
      
      // Launch the attack and validate the attacker's balance in Ether.
      expect(
          await attacker.connect(hacker).attack(ONE_ETHER)
      ).to.changeEtherBalance(hacker, ethers.parseEther('21'));
     
      expect(await victim.getContractBalance()).to.be.equal(ZERO);
    });

    it("should not be allowed to attack (Check - Effect - Interact)", async () => {
      const { victimCEI, owner, user1, user2, hacker } = await loadFixture(initFixture);

      const Attacker = await ethers.getContractFactory("Attacker");
      const attacker = await Attacker.connect(hacker).deploy(victimCEI, { value: ONE_ETHER});

      expect(await victimCEI.getContractBalance()).to.be.equal(TWENTY_ETHER);

      // Verify user's balance
      expect(await victimCEI.balances(user1)).to.be.equal(FIVE_ETHER);
      expect(await victimCEI.balances(user2)).to.be.equal(FIVE_ETHER);
 
      // Launch the attack but it fails.
      await expect(attacker.connect(hacker).attack(ONE_ETHER))
        .to.be.revertedWith("failed to send ether!");
     
      expect(await victimCEI.getContractBalance()).to.be.equal(TWENTY_ETHER);
      expect(await attacker.getContractBalance()).to.be.equal(ONE_ETHER);

    });
  });

});
