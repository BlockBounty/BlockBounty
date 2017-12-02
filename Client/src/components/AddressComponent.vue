<template>
    <div class="card border-radius" :class="{hidden: isHidden}">
        <div class="header">Enter your Ethereum address</div>
        <input class="border-radius" type="text" @keyup.enter="onSubmit" v-model="address" />
    </div>
</template>

<script>
import AddressService from '../services/AddressService';
let promptResolver;
let isAddressValid = (address) => {
    return true;
}

let onSubmit = () => {
    if (promptResolver && isAddressValid(model.address)) {
        promptResolver(model.address);
        promptResolver = null;
        model.isHidden = true;
    }
}

let model = {
    isHidden: true,
    address: '',
    onSubmit
};

AddressService.listenForPrompt(() => new Promise((res, rej) => {
    promptResolver = res;
    model.isHidden = false;
}));


export default {
    name: 'AddressComponent',
    data: () => {
        return model;
    }
}
</script>

<style scoped>
.card {
    background: rgba(63, 79, 128, .8);
    color: #e3e5eb;
    padding: 1rem;
    margin: auto;
    width: 80vw;
    box-shadow: 2px 2px 1.5rem 1px rgba(0, 0, 0, .23);
    transition: .5s ease;
}

.card.hidden {
    transform: translate3d(0, 75vh, 0);
    transition: .5s ease;
}

.header {
    font-size: 1.5rem;
    font-weight: 100;
    margin-bottom: 1rem;
}

input {
    position: relative;
    background: #222f54;
    width: 100%;
    font-size: 1rem;
    padding: .5rem;
    color: #ddd;
    border: none;
}

input:active,
input:focus {
    border: none;
    outline: none;
}

input:after {
    content: '';
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: cyan;
}
</style>
