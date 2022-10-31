"use strict";

import { BigNumber, ethers } from "./ethers-5.6.esm.min.js";
import { abi, CONTRACT_ADDRESS } from "./constants.js";

const btnBuyName = document.getElementById("btnBuyName");
const btnConnect = document.getElementById("btnConnect");
const inputName = document.getElementById("inputText");
const selectYear = document.getElementById("selectYear");

btnBuyName.onclick = buyName;
btnConnect.onclick = connect;

let contract, address, provider, years, selectedIndex;

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

///// METMASK CONNECTION///////
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

    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  } else {
    console.log("No Metamask!");
    btnConnect.innerHTML = "Connect";
  }
}

///// NAME BUYING FUNCTION///////
async function buyName() {
  const name = inputName.value;
  years = selectYear.options[selectYear.selectedIndex].text;
  const partnerAddress = "0x220CBAa432d0dC976517cbC0313CF54477dAa66C";

  if ((await nameExists(name)) == true) {
  } else {
    buy(name, years, partnerAddress);
  }
}

///// CHECKS IF NAME HAS BEEN BOUGHT///////
async function nameExists(name) {
  let exists = await contract.nameExists(name);
  if (exists == true) {
    const isExpired = await contract.isExpired(name);
    if (isExpired == true) {
      exists = false;
    } else {
      alert("name not available");
    }
  }
  return exists;
}

async function buy(name, years, partnerAddress) {
  // GETS CURRENT ETH PRICE
  const ethPrice = await contract.getEthPrice();

  // GETS AMOUNT TO PAY IN USD
  let amtToPayIn_USD = await contract.getAmountToPay(name, years);

  // GETS AMOUNT TO PAY IN ETH
  let amtToPayIn_ETH =
    ethers.utils.formatEther(amtToPayIn_USD.toString()) /
    ethers.utils.formatEther(ethPrice.toString());

  // Slippage Tolerance
  const slippage =
    ethers.utils.formatEther((0.001 * 10 ** 18).toString()) /
    ethers.utils.formatEther(ethPrice.toString());

  amtToPayIn_ETH += slippage;

  console.log(`Name: ${name}`);
  console.log(`No. Of Years: ${years}`);
  console.log(`Price: ${amtToPayIn_USD / 10 ** 18} USD`);
  console.log(`Amount to pay in ETH: ${amtToPayIn_ETH}`);
  console.log(
    `Wei Conversion: ${ethers.utils.parseEther(
      amtToPayIn_ETH.toFixed(18).toString()
    )}`
  );

  const res = await contract.pay(name, years, partnerAddress, {
    value: BigNumber.from(
      ethers.utils.parseEther(amtToPayIn_ETH.toFixed(18).toString())
    ),
    gasLimit: 3000000,
  });
  await listenForTransactionMine(res, provider);
}
