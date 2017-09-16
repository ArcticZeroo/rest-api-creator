require('./defs');

const request = require('./request');

const RequestMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
};

class RequestData{
    constructor(options){
        Object.assign(this, Object.assign({
            params: {},
            urlEnding: '',
            payload: null,
            form: null
        }, options));
    }
}

class Route{
    constructor(path, url, getData = ()=> new RequestData(), method = RequestMethod.GET){
        this.path = path;
        this.url = url;
        this.getData = getData;
        this.method = method;
    }
}

class RestAPI{
    constructor(baseUrl, routes, params){
        this.baseUrl = baseUrl;
        this.params = params;

        this.methods = {};

        // Arrow to bind to self
        const addRoute = (route)=>{
            Object.setPropertyOfPath(this.methods, route.path, this.getEndpointMethod(route));
        };

        routes.forEach(addRoute);
    }

    getEndpointMethod (route){
        function getOptions(url, extra = {}) {
            return Object.assign({
                url: url,
                json: true,
                method: route.method,
                headers: {
                    'content-type': 'application/json'
                }
            }, extra);
        }

        return (...args)=>{
            const data = route.getData(...args);

            // Start off with the base url + the route url + the urlEnding (which defaults to an empty string)
            const url = `${this.baseUrl}${route.url}${data.urlEnding}?`;

            // Make options if the stuff exists
            const options = {
                qs: Object.assign(this.params, data.params)
            };

            if(data.form){
                options.form = data.form;
            }

            if(data.payload){
                options.body = data.payload;
            }

            // Finally, make the request
            return this.makeRequest(getOptions(url, options));
        }
    }

    makeRequest (options, callback){
        return request(options, callback)
    }
}

module.exports = { RestAPI, Route, RequestData, RequestMethod };