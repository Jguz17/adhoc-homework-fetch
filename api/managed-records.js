import fetch from "../util/fetch-fill.js";
import URI from "urijs";

// /records endpoint
// window.path = "http://localhost:3000/records";

const API = 'http://localhost:3000/records'

// Your retrieve function plus any additional functions go here ...
const retrieve = (options) => {
    if (!options) {
        fetch(`${URI(API).addSearch('limit', '10')}`)
        .then((res) => {
            if (res.status !== 200) {
                console.log('Error')
            } else {
                res.json()
                .then((data) => console.log(data))
            }
        })
    }
}

retrieve()

export default retrieve;