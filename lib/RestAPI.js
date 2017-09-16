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
    constructor(base_url, routes, params){
        this.base_url = base_url;
        this.request_params = params;

        this.methods = {};

        let addRoute = (route)=>{
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
            let url = `${this.base_url}${route.url}${data.urlEnding}?`;

            /*
            // Then, add the default params concatenated to the route's params returned in getData()
            url += [...Object.entries(this.request_params), ...Object.entries(data.params)]
                .map((entry)=>`${entry[0]}=${encodeURIComponent((typeof entry[1] == 'string') ? entry[1] : JSON.stringify(entry[1]))}`)
                .join('&');
            */

            // Make options if the stuff exists
            let options = {
                qs: Object.assign(this.request_params, data.params)
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