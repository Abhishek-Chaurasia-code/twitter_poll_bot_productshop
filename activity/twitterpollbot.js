// ipl match poll bot

let fs = require("fs");
let puppeteer = require("puppeteer");

let path=require("path");
let  passfnobj=require("./passwordEmail");
let passwordTwitter= passfnobj.passtwitterfn();

let loginlink="https://twitter.com/LOGIN";
let optionFirst=["RCB","KINGS X1 punjab","Rajasthan Royals","Delhi Captials"];
let optionSecond=["CSK","Sunrisers Hyderabad","Mumbai Indians","Kolkata Knight Riders"];
let optionThird="Match will be Tied";
let optionFourth="Match will be cancelled";

console.log("Poll bot code has started");
(async function () {
    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        
       
       let newTwitterTab=await browserInstance.newPage();
       await newTwitterTab.goto(loginlink);
       await waitAndClick("[name='session[username_or_email]']",newTwitterTab);
       await newTwitterTab.type("[name='session[username_or_email]']","Abhi20167671",{ delay:200});
       await newTwitterTab.type("[name='session[password]']",passwordTwitter,{delay:200});
       await newTwitterTab.click("[data-testid='LoginForm_Login_Button']");  
       
        
         for(let i=0;i<optionFirst.length;i++){
        await pollonTwitter(optionFirst[i],optionSecond[i],optionThird,optionFourth,browserInstance); 
       }  
        await pollInfoonTwitter(browserInstance);
        console.log("The task has been completed.");
       
      
    } catch (err) {
        console.log(err);
    }
})();

async function waitAndClick(selector,newTab){

    await newTab.waitForSelector(selector, { visible: true});
    
    let selectorClickPromise=newTab.click(selector);
    return selectorClickPromise;
}


async function pollonTwitter(option1,option2,option3,option4,browserInstance){
    let newTab=await browserInstance.newPage();
    await newTab.goto("https://twitter.com/home");

    await newTab.waitForSelector(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr", { visible: true});
    
    await waitAndClick(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr",newTab);
    
    await newTab.type(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr","Who will win the match? ");
    await waitAndClick("[aria-label='Add poll']",newTab);
    await waitAndClick("[name='Choice1']",newTab);
    await newTab.type("[name='Choice1']",option1);
    await waitAndClick("[name='Choice2']",newTab);
    await newTab.type("[name='Choice2']",option2);
    await waitAndClick("[aria-label='Add a choice']",newTab);
    await waitAndClick("[name='Choice3']",newTab);
    await newTab.type("[name='Choice3']",option3,{delay:200});
    if(option4!=""){
         await waitAndClick("[aria-label='Add a choice']",newTab);
         await waitAndClick("[name='Choice4']",newTab);
         await newTab.type("[name='Choice4']",option4);
    }
    await waitAndClick("[data-testid='tweetButtonInline']",newTab);
    return newTab.waitForSelector("[data-testid='tweet']",{ visible: true});
   
}

let infodata= `Polls regarding upcoming IPL matches has been created.
Users are requested to predict the outcome of the match.`;

async function pollInfoonTwitter(browserInstance){
   let newTab=await browserInstance.newPage();
   await newTab.goto("https://twitter.com/home");
   await waitAndClick(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr",newTab);
   await newTab.type(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr",infodata,{delay: 100});
   await waitAndClick("[data-testid='tweetButtonInline']",newTab);
   return newTab.waitForSelector("[data-testid='tweet']",{ visible: true});

}

//console.log("The task has been completed.");

