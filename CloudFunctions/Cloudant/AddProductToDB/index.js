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
    const productDoc = {
        _id: "pub:" + params.time,
        pubkey: params.pubkey,
        data: params.data,
        etherscan: params.etherscan,
        contract: params.contract,
        url: params.url,
        appeui: params.appeui,
        deveui: params.deveui,
        time: params.time,
    };

    let res = await service.postDocument({
        db: 'kharonproducts',
        document: productDoc
    })

    return {
        statusCode: 200,
        body: res.result
    };
}

exports.main = main;