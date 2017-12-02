let address;
// Listeners take no args, returns a promise to value of dialog i.e. address
let listeners = [];

let getAddress = () => {
    if (address) {
        return Promise.resolve(address);
    }

    return promptForAddress().then(receivedAddress => {
        address = receivedAddress;
        return address;
    });
}

let promptForAddress = () => {
    return listeners[0]();
}

let listenForPrompt = (listener) => {
    listeners.push(listener);
}

export default {
    getAddress,
    listenForPrompt
}