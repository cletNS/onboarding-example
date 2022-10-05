"use strict";

import { BigNumber, ethers } from "./ethers-5.6.esm.min.js";
import { abi, CONTRACT_ADDRESS } from "./constants.js";

const btnBuyName = document.getElementById("btnBuyName");
const btnConnect = document.getElementById("btnConnect");
const inputName = document.getElementById("inputText");

btnBuyName.onclick = buyName;
btnConnect.onclick = connect;

let contract, address, provider;

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(transactionResponse);
      console.log(transactionReceipt);
      console.log("_______________________");
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      );
      resolve();
    });
  });
}

async function connect() {
  if (typeof window.ethereum != "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    address = await signer.getAddress();
    console.log(`Connected to ${address}`);
    btnConnect.innerHTML = `Connected to ${address.slice(
      0,
      6
    )}...${address.slice(address.length - 7, address.length)}`;

    // console.log(signer);
    // console.log(!signer._isSigner);
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  } else {
    console.log("No Metamask!");
    btnConnect.innerHTML = "Connect";
  }
}

async function buyName() {
  const name = inputName.value;
  const years = 1;
  const address = "0x220CBAa432d0dC976517cbC0313CF54477dAa66C";

  if ((await nameExists(name)) == true) {
    // console.log();
    console.log(`${name} not available`);
    // return;
    if ((await listedName(name)) == true) {
      alert(`The name "${name}" has been listed for sale.`);
      console.log("Name is listed");

      await acquireListedName(name);

      return;
    }
  } else {
    const ethPrice = await contract.getEthPrice();

    let amtToPay = await contract.getAmountToPay(name, years);
    console.log(amtToPay);
    // let amt = amtToPay.totalPrice;
    // console.log(amt);
    const PRICE_USD = amtToPay / 10 ** 18;

    amtToPay =
      ethers.utils.formatEther(amtToPay.toString()) /
      ethers.utils.formatEther(ethPrice.toString());

    amtToPay += 0.001;

    console.log(`Name: ${name}`);
    console.log(`No. Of Years: ${years}`);
    console.log(`Price: ${PRICE_USD} USD`);
    console.log(`Amount to pay in ETH: ${amtToPay}`);
    console.log(
      `Wei Conversion: ${ethers.utils.parseEther(
        amtToPay.toFixed(18).toString()
      )}`
    );

    const res = await contract.pay(name, years, address, {
      value: BigNumber.from(
        ethers.utils.parseEther(amtToPay.toFixed(18).toString())
      ),
      gasLimit: 3000000,
    });
    await listenForTransactionMine(res, provider);
  }
}
async function nameExists(name) {
  const res = await contract.nameExists(name);
  return res;
}

async function listedName(name) {
  const res = await contract.nameForSale(name);
  console.log(res);
  return res;
}
// async function delistName() {
//   selectedDelistNames =
//     selectDelistNames.options[selectDelistNames.selectedIndex].text;
//   const res = await contract.delistName(selectedDelistNames);
//   console.log(`unlisted Name${selectedDelistNames}`);
// }

//BUY LISTED NAME
async function acquireListedName() {
  // const res = await contract.acquireListed(name);

  const name = inputName.value;

  const ethPrice = await contract.getEthPrice();

  let amt = await contract.name_ToPrice(name);
  const PRICE_USD = amt / 10 ** 18;
  amt =
    ethers.utils.formatEther(amt.toString()) /
    ethers.utils.formatEther(ethPrice.toString());

  amt += 0.001;

  console.log(`Name: ${name}`);
  //   console.log(`No. Of Years: ${years}`);
  console.log(`Price: ${PRICE_USD} USD`);
  console.log(`Amount to pay in ETH: ${amt}`);
  console.log(
    `Wei Conversion: ${ethers.utils.parseEther(amt.toFixed(18).toString())}`
  );
  // return res;

  const res = await contract.buyListedName(name, {
    value: BigNumber.from(ethers.utils.parseEther(amt.toFixed(18).toString())),
    gasLimit: 3000000,
  });

  await listenForTransactionMine(res, provider);
}