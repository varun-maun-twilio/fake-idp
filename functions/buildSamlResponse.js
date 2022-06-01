var samlp = require('@vmaun/patched-samlp');
const zlib = require("zlib");
var convert = require('xml-js');
let ejs = require('ejs');
exports.handler = async function (context, event, callback) {

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader("Content-Type", "application/json");


  const { sourceId, destination, emailId, fullName ,roles= 'supervisor,wfo.full_access,custom_agent_role'} = event;
  const { FLEX_SSO_ISSUER } = context;

  const certText = Runtime.getAssets()["/idp-public-cert.pem"].open();
  const keyText = Runtime.getAssets()["/idp-private-key.pem"].open();

  var options = {
    signResponse: true, signAssertion: true,
    cert: certText,
    key: keyText,
    issuer: FLEX_SSO_ISSUER,
    lifetimeInSeconds: 600,
    nameIdentifier: emailId,
    nameIdentifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    inResponseTo: sourceId,
    recipient: destination,
    authnContextClassRef: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
  };

  const userInfo = {
    id: emailId,
    emails: [emailId],
    displayName: fullName,
    name: { givenName: '', familyName: '' },
    'full_name': fullName,
    'roles':roles ,
    'email': emailId,
    'custom_claim_1':'sampleText',
    'custom_claim_2.stringarray':'arr1,arr2,arr3',
    'routing.json':'{"skills":["test1"],"levels":{"test1":1}}'
  }

  samlp.getSamlResponse(options, userInfo, (err, samlpResponse) => {
    if (err) {
      console.error(err);
      response.setBody({ status: 500 });
      return callback(null, response);
    }
    else {

      const encodedToken = Buffer.from(samlpResponse, 'ascii').toString('base64');


      response.setBody({ tokenContent: encodedToken });
      return callback(null, response);

    }
  })





};