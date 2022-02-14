var samlp = require('@vmaun/patched-samlp');
const zlib = require("zlib");
var convert = require('xml-js');
let ejs = require('ejs');

function extractSamlRequest(samlRequest){
  const inflatedXML = zlib.inflateRawSync(Buffer.from(samlRequest, 'base64')).toString('ascii');
  var jsonString = convert.xml2json(inflatedXML, {compact: true, spaces: 4});
  const jsonObj = JSON.parse(jsonString);
  const sourceId = jsonObj["samlp:AuthnRequest"]["_attributes"]["ID"];
  const destination = jsonObj["samlp:AuthnRequest"]["_attributes"]["AssertionConsumerServiceURL"];
  return {
    sourceId,destination
  }
}


exports.handler = async function(context, event, callback) {

const response = new Twilio.Response();
response.appendHeader('Access-Control-Allow-Origin', '*');
response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
response.appendHeader("Content-Type", "text/html");


const {SERVERLESS_RUNTIME_DOMAIN} = context;
const {SAMLRequest,RelayState} = event;
const {sourceId,destination} = extractSamlRequest(SAMLRequest);

const htmlTemplate = Runtime.getAssets()["/autologin.html"].open();
let htmlContent = ejs.render(htmlTemplate, {destination,sourceId,relayState:RelayState,domain:SERVERLESS_RUNTIME_DOMAIN});


response.setBody(htmlContent);
return callback(null, response);

 



};