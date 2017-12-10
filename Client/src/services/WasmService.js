let wasmExports, currentJobId;

let getWasmExports = (jobId) => {
    if (jobId == currentJobId && wasmExports) {
        return Promise.resolve(wasmExports);
    }

    currentJobId = jobId;

    return fetch(`http://localhost:8089/api/wasm/${jobId}`)
        .then(response => {
            if (response.ok) {
                return response.arrayBuffer();
            } else {
                throw new Error('Failed to get a job');
            }
            // })
            // .then(buffer => {
            //     return WebAssembly.compile(buffer);
        })
        .then(wasmModule => {
            return WebAssembly.instantiate(wasmModule, {
                memory: new WebAssembly.Memory({ initial: 3 })
            });
        })
        .then(results => {
            wasmExports = results.instance.exports;
            return wasmExports;
        });
}

export default {
    getWasmExports
}
