# **Onboarding with ethers**

### **Procedure**

---

#### **1.** Check the **availability of the name**

```shell
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
```

#### **2.** Get current **Eth price**

```shell
const ethPrice = await contract.getEthPrice();
```

#### **3.** Get required **amount to pay in USD**

```shell
let amtToPayIn_USD = await contract.getAmountToPay(name, years);
```

#### **4.** Calculate **amount to pay in Eth**

```shell
let amtToPayIn_ETH =
ethers.utils.formatEther(amtToPayIn_USD.toString()) /
ethers.utils.formatEther(ethPrice.toString());
```

#### **5.** Invoke crypto wallet client to **confirm payment by user**

```shell
const res = await contract.pay(name, years, partnerAddress, {
  value: BigNumber.from(
    ethers.utils.parseEther(amtToPayIn_ETH.toFixed(18).toString())
  ),
  gasLimit: 3000000,
});
await listenForTransactionMine(res, provider);
}
```
