const SuperPromise = require('super-promise');
const request = require('request');

module.exports = function (options, callback) {
    return SuperPromise.create((resolve, reject)=>{
        request(options, (err, res, body)=>{
            if(err){
                reject(err);
            }

            if(!res){
                reject('Response is not defined.');
                return;
            }

            // 2xx statusCode
            if(res.statusCode.toString()[0] !== '2'){
                if(body && body.error){
                    reject(body.error);
                }else{
                    reject(res.statusCode);
                }
                return;
            }

            resolve(body, res);
        });
    }, callback)
};