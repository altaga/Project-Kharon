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
    let result = await service.postAllDocs({
        db: 'kharonproducts',
        includeDocs: true,
      })
    return {
        statusCode: 200,
        body: result.result.rows.map(row => row.doc)
    };
}

exports.main = main;
