const {expectRevert} = require('@openzeppelin/test-helpers');
const Wallet = artifacts.require('Wallet');

contract('Wallet',(accounts)=>{
    let wallet;
    beforeEach(async () => {
        wallet = await Wallet.new([accounts[0],accounts[1],accounts[2]],2);
        web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value:1000});
    });

    it('should have correct approvers and quorum', async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();
        assert(approvers.length === 3);
        assert(quorum.toNumber() === 2);
        assert(approvers[0] === accounts[0]);
        assert(approvers[1] === accounts[1]);
        assert(approvers[2] === accounts[2]);
    });

    it('should create transfer', async() =>{
        await wallet.createTransfer(1000,accounts[4],{from:accounts[0]});
        await wallet.createTransfer(1000,accounts[5],{from:accounts[1]});
        const transfers = await wallet.getTransfers();
        assert(transfers[0].id === '0');
        assert(transfers[0].amount=== '1000');
        assert(transfers[0].to === accounts[4]);
        assert(transfers[0].approvals === '0');
        assert(transfers[0].sent === false);
    });

    it('should not create transfer', async() =>{
        await expectRevert(
        wallet.createTransfer(1000,accounts[4],{from:accounts[3]}),
        'Sender is not a approver'
        )
    });
    
    it('should approve transfer', async() =>{
        
        await wallet.createTransfer(1000,accounts[4],{from:accounts[0]});
        await wallet.approveTransfer(0,{from:accounts[0]});
        await wallet.approveTransfer(0,{from:accounts[2]});
        const transfers = await wallet.getTransfers();
        assert(transfers[0].approvals === '2');
        // console.log("sent: "+transfers[0].sent);
        // console.log("approvals: "+transfers[0].approvals);

    });
    
    it('should not approve transfer', async() =>{
        await wallet.createTransfer(1000,accounts[4],{from:accounts[0]});
        await wallet.approveTransfer(0,{from:accounts[1]});
        await expectRevert(
        wallet.approveTransfer(0,{from:accounts[1]}),
        'already approved this transfer'
        )
    });
    
});