import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
// ** changed to global bc of errors **
global.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
function retrieve(options) {
    if (!options) options = {};
    if (!options.page) options.page = 1;
    if (!options.colors) options.colors = [];

    var myPromise = new Promise(resolve => {
        var api = URI(path).addSearch('limit', 10);

        if (options.page !== 1) api.addSearch({ offset: 10 * (options.page-1) });

        if (options.colors.length > 0) api.addSearch({ 'color[]': options.colors });
        
        fetch(api)
        .then(function(res) {
            if (!res.ok) {
                resolve(console.log('resolved'))
            }
            return res.json()
        })
        .then(function(data) {
            const records = transform(data);

            if (options.page !== 1) {
                records.previousPage = options.page-1; 
            }

            if (data.length === 10) {
                api.removeSearch('offset').addSearch({ offset: 10 * (options.page) })

                fetch(api)
                .then((res) => res.json())
                .then(function(obj) {
                    if (obj.length !== 0) {
                        records.nextPage = options.page+1;
                    }
                    resolve(records);
                })
            } else {
                resolve(records);
            }
        })
    })
    return myPromise
}

function checkPrimary(obj) {
	return obj.color === 'red' || obj.color === 'blue' || obj.color === 'yellow';
}

function transform(arrayOfObjects) {
    var records = {
        ids: arrayOfObjects.map(obj => {
            return obj.id;
        }),
        open: arrayOfObjects.filter(function(obj) {
            if (obj.disposition === 'open') {
                obj.isPrimary = checkPrimary(obj);
                return true;
            }
        }),
        closedPrimaryCount: arrayOfObjects.filter(function(obj) {
            if (obj.disposition === 'closed' && checkPrimary(obj)) {
                return true
            }}
        ).length,
        previousPage: null,
		nextPage: null
    }
    return records
}

export default retrieve;