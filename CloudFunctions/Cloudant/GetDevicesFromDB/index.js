const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

const authenticator = new IamAuthenticator({
    apikey: 'XXXXXXXXXXXXXXXXXXXXXXXXx'
});

const service = new CloudantV1({
    authenticator: authenticator
});

service.setServiceUrl('https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx-bluemix.cloudantnosqldb.appdomain.cloud');

async function main(params) {
    let result = await service.getDocument({
        db: 'kharondevices',
        docId: 'pub:'+params.pubkey
    });
    return {
        statusCode: 200,
        body: result.result
    };
}

exports.main = main;

/*
main({
    pubkey: '123',
    appeui: "123",
    deveui: "123"
}).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});
*/