if(!Object.hasOwnProperty('setPropertyOfPath')){
    Object.setPropertyOfPath = function(obj, path, value, initial = {}){
        let route = path.split('.');

        let pos = obj;
        let i = 0;

        for(i; i < route.length - 1; i++){
            if(!pos.hasOwnProperty(route[i])){
                pos[route[i]] = initial;
            }

            pos = pos[route[i]];
        }

        pos[route[i]] = value;

        return obj;
    };
}

if(!Object.hasOwnProperty('entries')){
    Object.entries = function (obj) {
        let entries = [];

        for(let prop in obj){
            if(obj.hasOwnProperty(prop)){
                entries.push([prop, obj[prop]]);
            }
        }

        return entries;
    }
}