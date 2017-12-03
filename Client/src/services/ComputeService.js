// Steps
// 1.   Get a job (controller,seed and jobid), passing in address with the request
// 2.   If a new jobid fetch the wasm as bytes
// 2.a  - Compile wasm if necessary
// 3.   Push controller to wasm using pushFloat and pushByte
// 4.   Push random seed using setSeed
// 5.   Calc Fitness using getFitness
// 6.a  - Also get steps using getSteps
// 7    Post results including fitness, steps, and seed
// 7.a  - Although unconventional, the return of the POST will include the next job
// 8    Continue from step 2
import WasmService from './WasmService';

let apiUrl;
let runs = 0;
let start = (address, options) => {
    if (runs++ > 30) {
        return;
    }
    apiUrl = (options && options.apiUrl) || 'http://localhost:8089';

    getNextJob(address)
        .then((res) => Promise.all([
            WasmService.getWasmExports(res.jobId),
            Promise.resolve({ controller: res.controller, seed: res.seed })
        ])).then(([wasmExports, jobInfo]) => {
            pushController(jobInfo.controller, wasmExports);
            wasmExports.init(jobInfo.seed);
            console.log(wasmExports.next());
            console.log(wasmExports.next());
            console.log(wasmExports.next());
            // return Promise.resolve({
            //     fitness: wasmExports.getFitness(),
            //     steps: wasmExports.getSteps(),
            //     seed: jobInfo.seed
            // });
        }).then(results => {
            postJobResults(address, results);
        }).then(() => start(address));
}

let getNextJob = (address) => {
    const getJobRequest = new Request(`${apiUrl}/api/jobs`);
    getJobRequest.headers.append('X-Ether-Address', address);
    return fetch(getJobRequest).then(res => res.json());
};

let pushController = (controller, wasmExports) => {
    // controller.split(' ').forEach(c => {
    //     if (!isNaN(c)) {
    //         wasmExports.pushFloat(Number(c));
    //     } else {
    //         wasmExports.pushByte(c.charCodeAt(0));
    //     }
    // });
};

let postJobResults = (address, results) => {
    let headers = new Headers();
    headers.append('X-Ether-Address', address);
    const postInit = {
        method: 'POST',
        headers,
        mode: 'cors',
    };
    const postResultsRequest = new Request(`${apiUrl}/api/results`, postInit);
    // return fetch(postResultsRequest);
}

export default {
    start
};
