const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

const authenticator = new IamAuthenticator({
    apikey: 'XXXXXXXXXXXXXXXXXXXXXXXXx'
});

const service = new CloudantV1({
    authenticator: authenticator
});

service.setServiceUrl('https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx-bluemix.cloudantnosqldb.appdomain.cloud');

function checkExist(array, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].appeui === value) {
            return true;
        }
    }
    return false;
}

async function main(params) {
    let result = null;
    try{
        result = await service.getDocument({
            db: 'kharondevices',
            docId: 'pub:'+params.pubkey
        });
        result = result.result;
        if (checkExist(result.devices, params.appeui)) {
            return {
                statusCode: 201,
                body: result
            };
        }
        await service.deleteDocument({
            db: 'kharondevices',
            docId: 'pub:'+params.pubkey,
            rev: result._rev
        });
        let deviceDoc = {
            _id: "pub:" + params.pubkey,
            "devices": result.devices
        };
        deviceDoc.devices.push({
            appeui: params.appeui,
            deveui: params.deveui,
        })
        result = await service.postDocument({
            db: 'kharondevices',
            document: deviceDoc
        })
        return {
            statusCode: 200,
            body: result.result
        };
    }
    catch(err){
        let deviceDoc = {
            _id: "pub:" + params.pubkey,
            "devices": []
        };
        deviceDoc.devices.push({
            appeui: params.appeui,
            deveui: params.deveui,
        })
        result = await service.postDocument({
            db: 'kharondevices',
            document: deviceDoc
        })
        return {
            statusCode: 200,
            body: result.result
        };
    }
}

exports.main = main;
