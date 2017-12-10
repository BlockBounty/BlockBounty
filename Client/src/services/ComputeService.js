let worker;
let start = (address, options) => {
    worker.postMessage(['START', { address }]);
}

let init = () => {
    worker = new Worker('static/ComputeWorker.js');
}

export default {
    start,
    init,
};
