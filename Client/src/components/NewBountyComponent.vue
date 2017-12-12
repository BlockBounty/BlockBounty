<template>
    <div class="card border-radius" v-if="jobId == null">
        <div>
            <div>Number of works to purchase:</div>
            <input style="display: block" type="number" />
        </div>
        <div>
            <div>Total purchase amount (this is the pool of money that workers work for):</div>
            <input style="display: block" type="number" />
        </div>
        <div>
            <div>WASM code to run:</div>
            <input type=file accept=".wasm" />
        </div>
        <div>
            <button class="submit-bounty border-radius" @click="submitBounty">Submit bounty</button>
        </div>
    </div>
    <div class="card border-radius created-job" v-else>
        You created job with the id:
        <span>{{jobId}}</span>
    </div>
</template>

<script>
let model = {
    submitBounty: () => {
        fetch('http://localhost:8089/api/jobs', { method: 'POST' })
            .then(res => res.json())
            .then(json => model.jobId = json.jobId);
    },
    jobId: null,
};

export default {
    name: 'NewBountyComponent',
    data: () => {
        return model;
    }
}
</script>

<style scoped>
div {
    margin: 1rem;
}

.card {
    position: absolute;
    left: 10vw;
    top: calc(50vh - 3.5rem);
    background: rgba(63, 79, 128, .8);
    color: #e3e5eb;
    overflow: hidden;
    padding: 1rem;
    margin: auto;
    width: 80vw;
    box-shadow: 2px 2px 1.5rem 1px rgba(0, 0, 0, .23);
    transform: translate3d(0, 0, 0);
    transition: .5s ease;
}

.card.hidden {
    transform: translate3d(-100vw, 0, 0);
}

.divider {
    width: 2px;
    background: #222f54;
}

.label {
    font-weight: 800;
    text-transform: uppercase;
    text-align: center;
}

.value {
    font-size: 3rem;
    text-align: center;
}

.submit-bounty {
    height: 3.75rem;
    background: #222F54;
    color: #d8d8e4;
    text-align: center;
    border: none;
    font-size: 2rem;
    padding: .65rem;
    box-shadow: 2px 2px 1.5rem 1px rgba(0, 0, 0, .23);
    cursor: pointer;
}

.created-job {
    font-size: 2rem;
    text-align: center;
}
</style>
