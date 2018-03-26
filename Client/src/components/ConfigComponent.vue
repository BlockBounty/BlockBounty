<template>
    <div class="card border-radius" :class="{hidden: isHidden, advanced: isAdvanced}">
        <div class="advanced-button border-radius" @click="toggleAdvanced"></div>
        <div class="header">Enter your Ethereum address</div>
        <input class="border-radius" type="text" @keyup.enter="onSubmit" v-model="address" />
        <div class="header">Enter JobId you want to contribute to</div>
        <input class="border-radius" type="text" @keyup.enter="onSubmit" v-model="jobId" />
    </div>
</template>

<script>
import ConfigService from '../services/ConfigService';
let promptResolver;
let isAddressValid = (address) => {
    return true;
}

let onSubmit = () => {
    if (promptResolver && isAddressValid(model.address)) {
        promptResolver({
            address: model.address,
            jobId: model.jobId,
            apiUrl: process.env.API_URL,
        });
        promptResolver = null;
        model.isHidden = true;
    }
}

let toggleAdvanced = () => {
    model.isAdvanced = !model.isAdvanced;
}

// #Single...ton
let model = {
    isHidden: true,
    isAdvanced: false,
    address: '',
    jobId: 1,
    onSubmit,
    toggleAdvanced
};

ConfigService.listenForPrompt(() => new Promise((res, rej) => {
    promptResolver = res;
    model.isHidden = false;
}));


export default {
    name: 'ConfigComponent',
    data: () => {
        return model;
    }
}
</script>

<style scoped>
.advanced-button {
    position: absolute;
    right: 1rem;
    top: 1rem;
    height: 2rem;
    width: 2rem;
    background: #222f54;
}

.card {
    position: relative;
    background: rgb(63, 79, 128);
    color: #e3e5eb;
    overflow: hidden;
    padding: 1rem;
    margin: auto;
    width: 80vw;
    height: 7rem;
    box-shadow: 2px 2px 1.5rem 1px rgba(0, 0, 0, .23);
    transition: .5s ease;
    z-index: 5;
}

.card.hidden {
    transform: translate3d(0, 75vh, 0);
    transition: .5s ease;
}

.card.advanced {
    height: 14rem;
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
    margin-bottom: 1rem;
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
