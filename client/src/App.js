import React, {useEffect, useState} from 'react';
import {getWeb3, getWallet} from './utils.js'
import Header from './header.js'
import NewTransfer from './newTransfer.js'
import TransferList from './TransferList.js'

function App() {

  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransers] = useState([]);

  useEffect(() => {
    const init = async () =>{

      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);
      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();
      const transfers = await wallet.methods.getTransfers().call();
      setTransers(transfers);
      setWeb3(web3);
      setWallet(wallet);
      setAccounts(accounts);
      setApprovers(approvers);
      setQuorum(quorum);         
    };
    init();

  }, []);
  
  // console.log('Account 0 : ', accounts);
  if(typeof web3 == undefined 
    || typeof wallet == undefined 
    || typeof accounts == undefined 
    || typeof approvers == undefined 
    || typeof quorum == undefined)
  {
    return(
      <div>Loading...</div>
    );
  }
  const createTransfer = transfer => {
    wallet.methods
    .createTransfer(transfer.amount, transfer.to)
    .send({from: accounts[0]});
  };
  const approveTransfer = transferID => {
    wallet.methods
    .approveTransfer(transferID)
    .send({from: accounts[0]});
  };

  return (
    <div className="App">
      Multi Sig Wallet
      <Header approvers = {approvers} quorum = {quorum} />
      <NewTransfer createTransfer = {createTransfer} />
      <TransferList transfers = {transfers} approveTransfer = {approveTransfer}/>
    </div>
  );
}

export default App;
