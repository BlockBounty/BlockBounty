let worker, progressListener;
let start = (config) => {
    worker.onmessage = (e) => {
        if (progressListener) {
            progressListener(e.data);
        }
    };
    worker.postMessage(['START', config]);
}

let init = () => {
    worker = new Worker('static/ComputeWorker.js');
}

let listenForProgress = (listener => {
    progressListener = listener;
});

export default {
    start,
    init,
    listenForProgress
};
