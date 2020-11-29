import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
// ** changed to global bc of errors **
global.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
const records = {
    ids: null,
    open: null,
    closedPrimaryCount: null,
    previousPage: null,
    nextPage: null
}

const retrieve = (options) => {
    if (!options) options = {};
    if (!options.page) options.page = 1;
    if (!options.colors) options.colors = [];

    const myPromise = new Promise(resolve => {
        const api = URI(path).addSearch('limit', 10);

        if (options.page !== 1) api.addSearch({ offset: 10 * (options.page-1) });

        if (options.colors.length > 0) api.addSearch({ 'color[]': options.colors });
        
        fetch(api)
        .then((res) => {
            if (!res.ok) {
                resolve(console.log('resolved'))
            }
            return res.json()
        })
        .then((data) => {
            const records = transform(data);

            if (options.page !== 1) {
                records.previousPage = options.page-1; 
            }

            if (data.length === 10) {
                api.removeSearch('offset').addSearch({ offset: 10 * (options.page) })

                fetch(api)
                .then((res) => res.json())
                .then((obj) => {
                    if (obj.length !== 0) {
                        records.nextPage = options.page+1;
                    }
                    resolve(records);
                })
            } else {
                resolve(records);
            }
        });
    });
    return myPromise
}

const checkPrimary = (obj) => {
	return obj.color === 'red' || obj.color === 'blue' || obj.color === 'yellow';
}

const transform = (arrayOfObjects) => {
    return {
        ...records,
        ids: arrayOfObjects.map(obj => {
            return obj.id;
        }),
        open: arrayOfObjects.filter((obj) => {
            if (obj.disposition === 'open') {
                obj.isPrimary = checkPrimary(obj);
                return true;
            }
        }),
        closedPrimaryCount: arrayOfObjects.filter((obj) => {
            if (obj.disposition === 'closed' && checkPrimary(obj)) {
                return true
            }
        }).length,
    }
}

export default retrieve;