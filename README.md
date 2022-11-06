Eyram
#4918

Eyram — 04/11/2022
okay
balfazaar — 04/11/2022
Logo updated, Discord in footer updated, Details Bulleted, "use the details..." not underlined
Image
should I push?
Eyram — 04/11/2022
hold on
Eyram — 04/11/2022
You can push now
thank you
balfazaar — 04/11/2022
Alright anytime
Eyram — 04/11/2022
check if the dark mode affects the logo
balfazaar — 04/11/2022
Yeah it does so I turned off that button
So it comes in light mode only
Eyram — 04/11/2022
great
thanks
balfazaar — 04/11/2022
Anytime
Eyram — 04/11/2022
https://youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA
YouTube
Complete MongoDB Tutorial
Image
balfazaar — 04/11/2022
Thanks
Eyram — 04/11/2022
You're welcome
Eyram — Yesterday at 16:14
Hello Alfred
balfazaar — Yesterday at 18:18
Hello Eyram
Sorry for the late reply I was asleep
Eyram — Yesterday at 18:26
no worries Bro
i've pushed some changes...just wanted to inform you so you update your your branch before you make any change
balfazaar — Yesterday at 18:28
alright i'll get on that right away
Eyram — Yesterday at 18:28
git checkout main

git pull

git checkout alfosei

git merge main
balfazaar — Yesterday at 18:30
this is how i'll update mine?
Eyram — Yesterday at 18:30
yeah
balfazaar — Yesterday at 18:30
alright
Eyram — Yesterday at 18:32
if you get any error let me know
balfazaar — Yesterday at 18:32
alright
Image
No errors, do I push now?
Eyram — Yesterday at 18:36
yes
balfazaar — Yesterday at 18:36
alright
done
Eyram — Yesterday at 18:40
and can you work on the onboarding as well

the buyname() fn comes first and then you outline the steps as recommended in the previous meeting
balfazaar — Yesterday at 18:43
for point 3?
Image
This is the last update I did with Franz
Eyram
started a call that lasted a minute.
— Yesterday at 18:44
You missed a call from
balfazaar
that lasted a minute.
— Yesterday at 18:45
Eyram — Yesterday at 18:46
let's text instead yh...network is messing up
balfazaar — Yesterday at 18:46
Alright
Eyram — Yesterday at 18:47
i mean number one will should no longer be numbered

and 2 should now be number one and the rest follow in that order
Eyram
started a call that lasted a few seconds.
— Yesterday at 18:47
balfazaar — Yesterday at 18:48
Oh okay
updated

# **Functions**

- _buyName()_
  Expand
  READMEonboarding.md
  2 KB
  Eyram — Yesterday at 18:54
  change the 3 to 2
  balfazaar — Yesterday at 18:54
  yeah I've changed it
  Eyram — Yesterday at 18:55
  yeah it's okay now
  thanks
  balfazaar — Yesterday at 19:04
  anytime



# **Functions**

- _buyName()_
- _nameExists()_

### **Procedure**

---

After user clicks **'buy name'** it calls on **_buyName()_**. It then [checks](#name-checking) if the name is available to be bought

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

#### **1.** Check the availability of the name

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

#### **2.** If the name is available it proceeds to call **_buy()_**

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
