let ejs = require('ejs');
exports.handler = async function(context, event, callback) {

const response = new Twilio.Response();
response.appendHeader('Access-Control-Allow-Origin', '*');
response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
response.appendHeader("Content-Type", "text/html");

const {emailId='dummy@twilio.com',fullName='dummy user'} = event;
//TODO: Validate the request params
const {FLEX_SSO_URL} = context;

const landingTemplate = Runtime.getAssets()["/landing.html"].open();

let htmlContent = ejs.render(landingTemplate, {redirectUrl:FLEX_SSO_URL,emailId,fullName});

response.setBody(htmlContent);
return callback(null, response);

  


 



};