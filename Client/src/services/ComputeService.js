let worker;
let start = (config) => {
    worker.postMessage(['START', config]);
}

let init = () => {
    worker = new Worker('static/ComputeWorker.js');
}

export default {
    start,
    init,
};
