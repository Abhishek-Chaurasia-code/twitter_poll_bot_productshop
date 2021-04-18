// https://www.myntra.com
// [placeholder="Search for products, brands and more"]


let fs = require("fs");
let puppeteer = require("puppeteer");
var json2xls = require("json2xls");
let  passfnobj=require("./passwordEmail");
let passwordTwitter= passfnobj.passtwitterfn();


let links = ["https://www.myntra.com", "https://www.flipkart.com", "https://paytmmall.com/"];
let pName = process.argv[2];
let path=require("path");
let raw="raw";

let pathOfFile= path.join(__dirname,raw+"_Myntra_userproduct.JSON");
let loginlink="https://twitter.com/LOGIN";
//var linkarr=[];
let Url="";

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
       // await getListingFromMyntra(links[0], browserInstance,pName);
       let MyntraArr= await getListingFromMyntra(links[0], browserInstance,pName);
       for(let i=0;i<MyntraArr.length;i++){
         linkarr[i]=MyntraArr[i].productlink;
         productName[i]=MyntraArr[i].Name;
         productPrice[i]=MyntraArr[i].price;
      }
       // creating json file
       fs.writeFileSync(pathOfFile,JSON.stringify(MyntraArr));
      // var json2xls = require('json2xls');
       var xls = json2xls(MyntraArr);
       // creating excel file
       fs.writeFileSync('user_product_data.xlsx', xls, 'binary');
       //await pollonTwitter(loginlink,browserInstance);

        let newTwitterTab=await browserInstance.newPage();
       await newTwitterTab.goto(loginlink);
       await waitAndClick("[name='session[username_or_email]']",newTwitterTab);
       await newTwitterTab.type("[name='session[username_or_email]']","Abhi20167671",{ delay:200});
       await newTwitterTab.type("[name='session[password]']",passwordTwitter,{delay:200});
       await newTwitterTab.click("[data-testid='LoginForm_Login_Button']");  
       
        console.log(linkarr);
         for(let i=0;i<5;i++){
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

// .product-product   -> product name
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
   // let priceArr=[];
    for(let i=0;i<15;i++){
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
    // .r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-t60dpp.r-1dz5y72.r-fdjqy7.r-13qz1uu 
    //await newTab.type("[name='session[username_or_email]']","Abhi20167671",{ delay:200});
    //await newTab.type("[name='session[password]']","Abhiopi89@",{delay:200});
    // await newTab.click("[data-testid='LoginForm_Login_Button']");
   //  await newTab.goto(url);
     await newTab.waitForSelector(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr", { visible: true});
     //Url = await newTab.url();
     //await newTab.goto(Url);
     await waitAndClick(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr",newTab);
     // Url = newTab.url();
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
    // await  newTab.waitForSelector(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr", { visible: true});
     //return waitAndClick(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr",newTab);
    // return  newTab.waitForSelector(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr", { visible: true});
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