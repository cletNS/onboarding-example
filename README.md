# **OnBoarding Procedure**

## **Functions**

---

- [_buyName()_](#1-after-user-clicks-buy-name-it-checks-if-the-name-already-exists-if-returned-value-is-false-jump-to-step-3)
- [_isExpiry()_](#2-it-checks-if-the-entered-name-is-expired-or-not)
- [_nameExists()_](#3-after-the-name-has-been-checked-and-does-not-exist-it-fetches-the-current-eth-price-and-amount-to-pay)

### **STEPS**

---

#### **1.** After user clicks **'buy name'** it calls on **_buyName()_**. It then [checks](#name-checking) if the name is available to be bought

```shell
async function buyName() {
  const name = inputName.value;
  years = selectYear.options[selectYear.selectedIndex].text;
  const partnerAddress = "0x220CBAa432d0dC976517cbC0313CF54477dAa66C";

  if ((await nameExists(name)) == true) {
    console.log(`${name} not available`);
  } else {
    buy(name, years, partnerAddress);
  }
}
```

#### **2.** It checks if the entered name is **_expired or not_**

by calling on **\*nameExists()** and **isExpiry()\***

```shell
async function nameExists(name) {
  let exists = await contract.nameExists(name);
  if (exists == true) {
    const isExpired = await cletPayContract.isExpired(name);
    if (isExpired == true) {
      exists = false;
    }
  }
  return exists;
}
```

#### 3. After the name has been checked and does not exist. It proceeds to call on **_buy()_** to first check the amount to pay for the name

```shell
async function buy(name, years, partnerAddress)
```

- ##### **PRICE CHECKING**
  It gets current **eth price**
  ```shell
  const ethPrice = await contract.getEthPrice();
  ```
  and next gets the **amount to pay in USD**
  ```shell
  let amtToPayIn_USD = await contract.getAmountToPay(name, years);
  ```
  then lastly gets the **amount to pay in eth**
  ```shell
  let amtToPayIn_ETH =
  ethers.utils.formatEther(amtToPayIn_USD.toString()) /
  ethers.utils.formatEther(ethPrice.toString());
  ```

#### 4. The **_pay()_** function is called to acquire the name.

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

---
