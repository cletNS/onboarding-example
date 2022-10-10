# **BUY PROCESS**

## **Functions**
___
- [*buyName()*](#1-after-user-clicks-buy-name-it-checks-if-the-name-already-exists-if-returned-value-is-false-jump-to-step-3)
- [*nameExpiryCheck()*](#2-it-checks-if-the-entered-name-is-expired-or-not)
- [*nameExists()*](#3-after-the-name-has-been-checked-and-does-not-exist-it-fetches-the-current-eth-price-and-amount-to-pay)

### **STEPS**
___

#### **1.** After user clicks **'buy name'** it calls on ***buyName()***. It then [checks](#name-checking) the name 
```shell
async function buyName() {
  const name = inputName.value;
  years = selectYear.options[selectYear.selectedIndex].text;
  const partnerAddress = "0x220CBAa432d0dC976517cbC0313CF54477dAa66C";
```
- ##### **NAME CHECKING**

    If the name ***exists*** it checks if ***expired or not*** <<< [**MOVE TO STEP 2**](#2-it-checks-if-the-entered-name-is-expired-or-not)

    If the name ***does not exist*** <<< [**MOVE TO STEP 3**](#3-after-the-name-has-been-checked-and-does-not-exist-it-fetches-the-current-eth-price-and-amount-to-pay)


#### **2.** It checks if the entered name is ***expired or not***
by calling on ***nameExpiryCheck()***
```shell
async function nameExpiryCheck(name) {
  const res = await contract.isExpired(name);
  return res;
}
```
#### 3. After the name has been checked and does not exist. It proceeds to call on ***buy()***
```shell
async function buy(name, years, partnerAddress) {
  // GETS CURRENT ETH PRICE
  const ethPrice = await contract.getEthPrice();

  // GETS AMOUNT TO PAY IN USD
  let amtToPayIn_USD = await contract.getAmountToPay(name, years);

  // GETS AMOUNT TO PAY IN ETH
  let amtToPayIn_ETH =
    ethers.utils.formatEther(amtToPayIn_USD.toString()) 
    ethers.utils.formatEther(ethPrice.toString());
```

#### 4. The ***pay()*** function is called to acquire the name.
___
    

