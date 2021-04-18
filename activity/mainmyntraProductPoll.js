
// npm install json2xls -> for converting json to xlsx
// https://www.myntra.com
// [placeholder="Search for products, brands and more"] -> selector for search of product in myntra

let fs = require("fs");
let puppeteer = require("puppeteer");
var json2xls = require("json2xls");
let path=require("path");
let  passfnobj=require("./passwordEmail");
let passwordTwitter= passfnobj.passtwitterfn();

let links = ["https://www.myntra.com"];
let pName = process.argv[2];
let activity="activity";

let pathOfFile= path.join(__dirname,activity+"_Myntra_userproduct.JSON");
let loginlink="https://twitter.com/LOGIN";


console.log("Before");
(async function () {
    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        let linkarr=[];
        let productName=[];
        let productPrice=[];
    
       let MyntraArr= await getListingFromMyntra(links[0], browserInstance,pName);
       for(let i=0;i<MyntraArr.length;i++){
         linkarr[i]=MyntraArr[i].productlink;
         productName[i]=MyntraArr[i].Name;
         productPrice[i]=MyntraArr[i].price;
      }
       // creating json file
       fs.writeFileSync(pathOfFile,JSON.stringify(MyntraArr));
      
       var xls = json2xls(MyntraArr);

       // creating excel file
       fs.writeFileSync('user_product_data.xlsx', xls, 'binary');
       
       let newTwitterTab=await browserInstance.newPage();
       await newTwitterTab.goto(loginlink);
       await waitAndClick("[name='session[username_or_email]']",newTwitterTab);
       await newTwitterTab.type("[name='session[username_or_email]']","Abhi20167671",{ delay:200});
       await newTwitterTab.type("[name='session[password]']",passwordTwitter,{delay:200});
       await newTwitterTab.click("[data-testid='LoginForm_Login_Button']");  
       
        console.log(linkarr);
         for(let i=0;i<6;i++){
        await pollonTwitter(linkarr[i],productName[i],productPrice[i],browserInstance); 
       }  
        await pollInfoonTwitter(browserInstance);
        //console.table(MyntraArr);
      
    } catch (err) {
        console.log(err);
    }
})();

async function waitAndClick(selector,newTab){

    await newTab.waitForSelector(selector, { visible: true});
    
    let selectorClickPromise=newTab.click(selector);
    return selectorClickPromise;
    

}

//  selectors
//  .product-product   -> product name
//  .product-base a   -> product link
//  .product-discountedPrice  -> product price

async function getListingFromMyntra(link, browserInstance, pName){
    let newTab=await browserInstance.newPage();
    await newTab.goto(link);
    await waitAndClick("[placeholder='Search for products, brands and more']",newTab);
    await newTab.type("[placeholder='Search for products, brands and more']",pName,{ delay: 200 });
    await newTab.keyboard.press("Enter",{ delay: 200 });
    await newTab.keyboard.press("Enter");
    

    await newTab.waitForSelector(".product-product", { visible: true});
    await newTab.waitForSelector(".product-base a", { visible: true});
    await newTab.waitForSelector(".product-discountedPrice", { visible: true});

   function browserconsolerunfn(priceSelector,pNameSelector,pLinkSelector){
       
    let priceArr=document.querySelectorAll(priceSelector);
    let PName=document.querySelectorAll(pNameSelector);
    let Plink=document.querySelectorAll(pLinkSelector);
    let details=[];
   
    for(let i=0;i<20;i++){
        let price =priceArr[i].innerText;
        let Name=PName[i].innerText;
        let productlink=Plink[i].href
        //productlink="https://www.myntra.com"+""+productlink;
       details.push({
           Name,price,productlink
       });
    }
   return details;
  }
   
  return newTab.evaluate(browserconsolerunfn,".product-discountedPrice",".product-product",".product-base a");
 
}


async function pollonTwitter(link,productName,productPrice,browserInstance){
     let newTab=await browserInstance.newPage();
     await newTab.goto("https://twitter.com/home");

     await newTab.waitForSelector(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr", { visible: true});
     
     await waitAndClick(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr",newTab);
     
     await newTab.type(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr","Want to buy this product? "+productName+ " at price "+ productPrice+" link-> " +link);
     await waitAndClick("[aria-label='Add poll']",newTab);
     await waitAndClick("[name='Choice1']",newTab);
     await newTab.type("[name='Choice1']","Yes");
     await waitAndClick("[name='Choice2']",newTab);
     await newTab.type("[name='Choice2']","No");
     await waitAndClick("[aria-label='Add a choice']",newTab);
     await waitAndClick("[name='Choice3']",newTab);
     await newTab.type("[name='Choice3']","Maybe",{delay:200});
     await waitAndClick("[data-testid='tweetButtonInline']",newTab);
     return newTab.waitForSelector("[data-testid='tweet']",{ visible: true});
    
}

let infodata= `Various polls regarding our product - ${pName} has been created.
 Users are requested to vote so that we could know about our customer needs.`;

async function pollInfoonTwitter(browserInstance){
    let newTab=await browserInstance.newPage();
    await newTab.goto("https://twitter.com/home");
    await waitAndClick(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr",newTab);
    await newTab.type(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr",infodata,{delay: 200});
    await waitAndClick("[data-testid='tweetButtonInline']",newTab);
    return newTab.waitForSelector("[data-testid='tweet']",{ visible: true});

}