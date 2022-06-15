const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

const authenticator = new IamAuthenticator({
    apikey: 'XXXXXXXXXXXXXXXXXXXXXXXXx'
});

const service = new CloudantV1({
    authenticator: authenticator
});

service.setServiceUrl('https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx-bluemix.cloudantnosqldb.appdomain.cloud');

function filter(array, key, value) {
    return array.filter(item => item[key] === value);
}

async function main(params) {
    let result = await service.postAllDocs({
        db: 'kharonproducts',
        includeDocs: true,
    })
    result = result.result.rows.map(row => row.doc)
    result = filter(result, 'pubkey', params.pubkey)
    return {
        statusCode: 200,
        body: result
    };
}

exports.main = main;
