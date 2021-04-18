var nodemailer = require('nodemailer');
let  passfnobj=require("./passwordEmail");
let passwordemail= passfnobj.passemailfn();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ashu241998@gmail.com',
    pass: passwordemail
  }
});

var mailOptions = {
  from: 'ashu241998@gmail.com',
  to: 'abhishekchaurasia_2k17ee08@dtu.ac.in',
  subject: 'Product Price and Link File ',
  text: `Dear Customer,
                  The excel file containing the product name,price and link has been attached here.`,
  attachments: [{
      filename:"user_product_data.xlsx",
      path:"D:/project_10_04/raw/user_product_data.xlsx"
  }]
//    raw\data.xlsx
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});