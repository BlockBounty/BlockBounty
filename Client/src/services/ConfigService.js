let config;
// Listeners take no args, returns a promise to value of dialog i.e. address
let listeners = [];

let getConfig = () => {
    if (config) {
        return Promise.resolve(config);
    }

    return promptForConfig().then(receivedConfig => {
        config = receivedConfig;
        return config;
    });
}

let promptForConfig = () => {
    return listeners[0]();
}

let listenForPrompt = (listener) => {
    listeners.push(listener);
}

export default {
    getConfig,
    listenForPrompt
}