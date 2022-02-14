# fake-idp
Serverless IDP for twilio flex


Steps:
1. Generate key set
```
openssl req -x509 -new -newkey rsa:2048 -nodes -subj '/C=US/ST=California/L=San Francisco/O=JankyCo/CN=Test Identity Provider' -keyout idp-private-key.pem -out idp-public-cert.pem -days 7300
```

2. Deploy serverless to twilio
```
twilio serverless:deploy
```

3. Configure Flex SSO as follows:
* FRIENDLY NAME: Choose any name
* X.509 CERTIFICATE: Public Certificate Content
* IDENTITY PROVIDER ISSUER : https://fake-idp-xxxx-dev.twil.io/entityId
* SINGLE SIGN-ON URL : https://fake-idp-xxxx-dev.twil.io/entityId

