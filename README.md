# Project- Myntra Product Twitter poll bot

->This project basically uses automation through puppeteer and fetches Product Name, Price and Link to buy that product from Myntra website. Product category is entered by user eg- trousers for men, jackets for men etc. This code basically provides an easy way to create polls of products sold by company and to know whether users are interested in purchasing it or not. This also helps allows company to send an automated email to the user containing excel file of all types of products for the category which user has mentioned.

### Working of code
->Main code is present in **activity** folder in **mainmyntraProductPoll.js file** It uses async await to fetch links of products through Myntra.com and these links are send to the function 'pollonTwitter' which bsically tells the user about product name,price and also gives product link. It asks user does he/she want to buy the product and choices are Yes,No and Maybe. This file also creates json while which contain product name,price and link to buy it. This JSON file is then converted into user_product_data.xlsx .

->**mainsendEmailtoUser.js**-: This file basically **send an automated email** to user containg the xlsx file of product searched by user.

->**twitterpollbot.js**-: This file **generates random twitter polls** depending upon user requirements. Here I had used it for creating polls of IPL matches between two teams with two teams as choices and third choice being that match will be tied.

->activity_Myntra_userproduct.JSON and user_product_data.xlsx are created by scrip/code itself.
               
