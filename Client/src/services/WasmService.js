let wasmExports, currentJobId;
const getJobWasm = new Request(`http://localhost:8080/static/job.wasm`);

let getWasmExports = (jobId) => {
    if (jobId == currentJobId && wasmExports) {
        return Promise.resolve(wasmExports);
    }

    currentJobId = jobId;

    return fetch(getJobWasm)
        .then(response => {
            if (response.ok) {
                return response.arrayBuffer();
            } else {
                throw new Error('Failed to get a job');
            }
        })
        .then(buffer => {
            return WebAssembly.compile(buffer);
        })
        .then(wasmModule => {
            return WebAssembly.instantiate(wasmModule, {
                memory: new WebAssembly.Memory({ initial: 3 })
            });
        })
        .then(wasmInstance => {
            wasmExports = wasmInstance.exports;
            return wasmExports;
        });
}

export default {
    getWasmExports
}