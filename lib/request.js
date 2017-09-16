const SuperPromise = require('super-promise');
const request = require('request');

module.exports = function (options, callback) {
    return SuperPromise.create((resolve, reject)=>{
        request(options, (err, res, body)=>{
            if (err) {
                reject(err);
            }

            // 2xx statusCode
            if (res.statusCode.toString()[0] !== '2') {
                if(body && body.error){
                    reject(body.error);
                }else{
                    reject(res.statusCode);
                }
                return;
            }

            // 2xx statusCode, but body
            // has an error (bad API, but
            // whatever).
            if (body.error) {
                reject(body.error);
            }

            resolve(body, res);
        });
    }, callback)
};