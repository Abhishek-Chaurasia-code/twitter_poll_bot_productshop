//let request = require("request");
let fs = require("fs");
let puppeteer = require("puppeteer");
//let fs = require("fs");
let links = ["https://www.amazon.in", "https://www.flipkart.com", "https://paytmmall.com/"];
let pName = process.argv[2];
let path=require("path");
let raw="raw";
//let userproduct="userproduct";
let pathOfFile= path.join(__dirname,raw+"userproduct.JSON");
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
       let AmazonArr= await getListingFromAmazon(links[0], browserInstance,pName);
       for(let i=0;i<AmazonArr.length;i++){
           linkarr[i]=AmazonArr[i].productlink;
       }
       fs.writeFileSync(pathOfFile,JSON.stringify(AmazonArr));
       //await pollonTwitter(loginlink,browserInstance);

       let newTwitterTab=await browserInstance.newPage();
       await newTwitterTab.goto(loginlink);
       await waitAndClick("[name='session[username_or_email]']",newTwitterTab);
       await newTwitterTab.type("[name='session[username_or_email]']","Abhi20167671",{ delay:200});
       await newTwitterTab.type("[name='session[password]']","Abhiopi89@",{delay:200});
       await newTwitterTab.click("[data-testid='LoginForm_Login_Button']");
       //let url = newTwitterTab.url();
       // console.log(linkarr);
       for(let i=0;i<linkarr.length;i++){
        await pollonTwitter1(linkarr[i],browserInstance); 
       }
      // for(let i=0;i<2;i++){
       // await pollonTwitter(linkarr[0],newTwitterTab,Url);     
       // await pollonTwitter1(linkarr[0],browserInstance); 
       // await pollonTwitter1(linkarr[1],browserInstance); 
       //  }
       //  await pollonTwitter(linkarr[1],newTwitterTab,Url);
      // let flipkartArr= await getListingFromFlipkart(links[1], browserInstance,pName);
      // let paytmMallArr= await getListingFromPaytMall(links[2], browserInstance,pName);
       
        console.table(AmazonArr);
       //console.table(flipkartArr);
       //console.table(paytmMallArr);
     
      //  await getListingFromFlipkart(links[1], browserInstance,pName);
    } catch (err) {
        console.log(err);
    }
})();

//  product Name,url of amazon home page
// output-> top 5 matching product -> price Name print 
async function getListingFromAmazon(link, browserInstance, pName) {
    let newTab=await browserInstance.newPage();
    await newTab.goto(link);
    await newTab.type("#twotabsearchtextbox",pName,{delay:200});
    await newTab.click("#nav-search-submit-button");
    //await newTab.waitForSelector(".a-price-whole", { visible: true});
    await newTab.waitForSelector(".a-size-medium.a-color-base.a-text-normal", { visible: true});
    await newTab.waitForSelector(".a-price-whole", { visible: true});
    await newTab.waitForSelector("h2 .a-link-normal.a-text-normal",{ visible: true})
    function browserconsolerunfn(priceSelector,pNameSelector,pLinkSelector){
       
        let priceArr=document.querySelectorAll(priceSelector);
        let PName=document.querySelectorAll(pNameSelector);
        let Plink=document.querySelectorAll(pLinkSelector);
        let details=[];
       // let priceArr=[];
        for(let i=0;i<5;i++){
            let price =priceArr[i].innerText;
            let Name=PName[i].innerText;
            let productlink=Plink[i].href;
           // linkarr.push(productlink);
           details.push({
               price,Name,productlink
           });
        }
       // fs.writeFileSync(pathOfFile,JSON.stringify(details));
       return details;
    }

    return newTab.evaluate(browserconsolerunfn,".a-price-whole",".a-size-medium.a-color-base.a-text-normal","h2 .a-link-normal.a-text-normal");
    //console.log(detailsArr);
}

async function waitAndClick(selector,newTab){

    await newTab.waitForSelector(selector, { visible: true});
    
    let selectorClickPromise=newTab.click(selector);
    return selectorClickPromise;
    

}
//
async function pollonTwitter(link, newTab,Url){
    //let newTab=await browserInstance.newPage();
    //await newTab.goto(loginlink);
    // .r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-t60dpp.r-1dz5y72.r-fdjqy7.r-13qz1uu 
    //await newTab.type("[name='session[username_or_email]']","Abhi20167671",{ delay:200});
    //await newTab.type("[name='session[password]']","Abhiopi89@",{delay:200});
    // await newTab.click("[data-testid='LoginForm_Login_Button']");
   //  await newTab.goto(url);
     await newTab.waitForSelector(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr", { visible: true});
     Url = await newTab.url();
     await newTab.goto(Url);
     await waitAndClick(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr",newTab);
     // Url = newTab.url();
     await newTab.type(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr","Want to buy this product? "+ link,);
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

// https://twitter.com/home

async function pollonTwitter1(link,browserInstance){
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
     await newTab.type(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr","Want to buy this product? "+ link);
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


async function getListingFromFlipkart(link, browserInstance, pName){
    let newTab=await browserInstance.newPage();
    await newTab.goto(link);
    await newTab.click("._2KpZ6l._2doB4z")
    await newTab.type("._3704LK",pName);
    //await newTab.waitForSelector(".L0Z3Pu", { visible: true});

    //await newTab.click("button[type='submit']");
    await newTab.click("button[type='submit']");
    await newTab.waitForSelector("._30jeq3._1_WHN1", { visible: true});
    await newTab.waitForSelector("._4rR01T", { visible: true});

   function browserconsolerunfn(priceSelector,pNameSelector){
       
    let priceArr=document.querySelectorAll(priceSelector);
    let PName=document.querySelectorAll(pNameSelector);
    let details=[];
   // let priceArr=[];
    for(let i=0;i<5;i++){
        let price =priceArr[i].innerText;
        let Name=PName[i].innerText;
       details.push({
           price,Name
       });
    }
   return details;
  }
   
  return newTab.evaluate(browserconsolerunfn,"._30jeq3._1_WHN1","._4rR01T");


   //_4rR01T
   //_30jeq3 _1_WHN1

}

async function getListingFromPaytMall(link, browserInstance, pName){
    let newTab=await browserInstance.newPage();
    await newTab.goto(link);
    await newTab.type("#searchInput",pName,{ delay: 200 });
    await newTab.keyboard.press("Enter",{ delay: 200 });
    await newTab.keyboard.press("Enter");
    

    await newTab.waitForSelector(".UGUy", { visible: true});
    await newTab.waitForSelector("._1kMS", { visible: true});

   function browserconsolerunfn(priceSelector,pNameSelector){
       
    let priceArr=document.querySelectorAll(priceSelector);
    let PName=document.querySelectorAll(pNameSelector);
    let details=[];
   // let priceArr=[];
    for(let i=0;i<5;i++){
        let price =priceArr[i].innerText;
        let Name=PName[i].innerText;
       details.push({
           price,Name
       });
    }
   return details;
  }
   
  return newTab.evaluate(browserconsolerunfn,"._1kMS",".UGUy");


  
}

function creatorFile(playerName,teamName,venue,date,runs,balls,fours,sixes,sr,result,opponent){
    let pathOfFile= path.join(__dirname,teamName,playerName +".JSON");

    if(fs.existsSync(pathOfFile)==true){
        let content= fs.readFileSync(pathOfFile);
        let json=JSON.parse(content);
        json.push({

            "Runs": runs,
            "Balls": balls,
            "Fours": fours,
            "Sixes": sixes,
            "SR":sr,
            "Date":date,
            "Venue":venue,
            "Result" : result,
            "Opponent Team": opponent

        });
        fs.writeFileSync(pathOfFile,JSON.stringify(json));
    }
  else if(fs.existsSync(pathOfFile)==false){
       
       writeFile(pathOfFile,venue,date,runs,balls,fours,sixes,sr,result,opponent);
      
     }
   
    
}


function writeFile(pathOfFile,venue,date,runs,balls,fours,sixes,sr,result,opponent){
    let arr=[];
    arr.push({
        "Runs": runs,
        "Balls": balls,
        "Fours": fours,
        "Sixes": sixes,
        "SR":sr,
        "Date":date,
        "Venue":venue,
        "Result" : result,
        "Opponent Team": opponent
    })

     fs.writeFileSync(pathOfFile,JSON.stringify(arr));

}