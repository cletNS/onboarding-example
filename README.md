# **Functions**

- [_buyName()_](#1-after-user-clicks-buy-name-it-calls-on-buyname-it-then-checks-if-the-name-is-available-to-be-bought)
- [_nameExists()_](#3-after-the-name-has-been-checked-and-does-not-exist-it-proceeds-to-call-on-buy-to-first-check-the-amount-to-pay-for-the-name)

### **Procedure**

---

#### **1.** After user clicks **'buy name'** it calls on **_buyName()_**. It then [checks](#name-checking) if the name is available to be bought

```shell
async function buyName() {
  const name = inputName.value;
  years = selectYear.options[selectYear.selectedIndex].text;

  //Replace with your valid partner address
  const partnerAddress = "0x220CBAa432d0dC976517cbC0313CF54477dAa66C";

  if ((await nameExists(name)) == true) {
    console.log(`${name} not available`);
  } else {
    buy(name, years, partnerAddress);
  }
}
```

#### **2.** Check the availability of the name

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

#### 3. If the name is available it proceeds to call **_buy()_**

```shell
async function buy(name, years, partnerAddress)
```

- ##### ...

  Get current **Eth price**

  ```shell
  const ethPrice = await contract.getEthPrice();
  ```

  Get required **amount to pay in USD**

  ```shell
  let amtToPayIn_USD = await contract.getAmountToPay(name, years);
  ```

  Calculate **amount to pay in Eth**

  ```shell
  let amtToPayIn_ETH =
  ethers.utils.formatEther(amtToPayIn_USD.toString()) /
  ethers.utils.formatEther(ethPrice.toString());
  ```

  Invoke crypto wallet client to confirm payment

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
