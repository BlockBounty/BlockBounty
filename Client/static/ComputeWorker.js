let wasmExports, currentJobId;

let getWasmExports = (jobId, apiUrl) => {
    if (jobId == currentJobId && wasmExports) {
        return Promise.resolve(wasmExports);
    }

    currentJobId = jobId;

    return fetch(`${apiUrl}/api/wasm/${jobId}`)
        .then(response => {
            if (response.ok) {
                return response.arrayBuffer();
            } else {
                throw new Error('Failed to get a job');
            }
        })
        .then(wasmModule => WebAssembly.instantiate(wasmModule, {
            memory: new WebAssembly.Memory({ initial: 3 })
        }))
        .then(results => {
            wasmExports = results.instance.exports;
            return wasmExports;
        });
};

let getNextJob = (config) => {
    const getJobRequest = new Request(`${config.apiUrl}/api/controllers/${config.jobId}`);
    getJobRequest.headers.append('X-Ether-Address', config.address);
    return fetch(getJobRequest).then(res => res.json());
};

let pushController = (controller, wasmExports) => {
    controller.split(' ').forEach(c => {
        if (!isNaN(c)) {
            wasmExports.pushFloat(Number(c));
        } else {
            wasmExports.pushByte(c.charCodeAt(0));
        }
    });

    wasmExports.pushByte('='.charCodeAt(0));
};

let postJobResults = (address, results, apiUrl) => {
    let headers = new Headers();
    headers.append('X-Ether-Address', address);
    headers.append('Content-Type', 'application/json');
    const postInit = {
        method: 'POST',
        headers,
        mode: 'cors',
        body: JSON.stringify({
            fitness: results.fitness,
            steps: results.steps,
            seed: results.seed,
            jobId: results.jobId,
        }),
    };
    const postResultsRequest = new Request(`${apiUrl}/api/fitness/${results.controllerId}`, postInit);
    return fetch(postResultsRequest);
}

let start = (config) => {
    getNextJob(config)
        .then((res) => Promise.all([
            getWasmExports(res.jobId, config.apiUrl),
            Promise.resolve({ controller: res.controller, seed: res.seed, controllerId: res.id, jobId: res.jobId })
        ])).then(([wasmExports, jobInfo]) => {
            pushController(jobInfo.controller, wasmExports);
            wasmExports.init(jobInfo.seed);
            return Promise.resolve({
                fitness: wasmExports.getFitness(),
                steps: wasmExports.getSteps(),
                seed: jobInfo.seed,
                jobId: jobInfo.jobId,
                controllerId: jobInfo.controllerId
            });
        }).then(results => {
            postMessage(results);
            postJobResults(config.address, results, config.apiUrl);
        }).then(() => {
            start(config);
        }).catch(err => console.log(err));
}

onmessage = function (e) {
    if (e.data[0] == 'START') {
        start(e.data[1]);
    }
};
