<template>
    <div class="card border-radius" v-if="jobId == null">
        <!-- <div>
            <div>Number of works to purchase:</div>
            <input style="display: block" type="number" />
        </div>
        <div>
            <div>Total purchase amount (this is the pool of money that workers work for):</div>
            <input style="display: block" type="number" />
        </div> -->
        <div>
            <div>WASM code to run:</div>
            <input id="wasm" type=file accept=".wasm" />
        </div>
        <div>
            <button class="submit-bounty border-radius" @click="submitBounty">Submit bounty</button>
        </div>
    </div>
    <div class="card border-radius created-job" v-else>
        You created job with the id:
        <span>{{jobId}}</span>
        <div class="fitness-table">
            <input v-model="jobId" type="number" />
            <button @click="getTopFitness">Get top fitness</button>
            <div>
                {{topFitness}}
            </div>
        </div>
    </div>
</template>

<script>

let getTopFitness = () => {
    fetch(`${process.env.API_URL}/api/jobs/${model.jobId}/progress`).then(res => {
        return res.json();
    }).then(json => {
        model.topFitness = json;
    })
};

let model = {
    submitBounty: () => {
        fetch(`${process.env.API_URL}/api/jobs`, { 
            method: 'POST', 
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: document.getElementById('wasm').files[0],
        })
        .then(res => res.json())
        .then(json => model.jobId = json.jobId);
    },
    jobId: null,
    getTopFitness,
    topFitness: ""
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
    background: rgb(63, 79, 128);
    color: #e3e5eb;
    overflow: hidden;
    padding: 1rem;
    margin: auto;
    width: 80vw;
    box-shadow: 2px 2px 1.5rem 1px rgba(0, 0, 0, .23);
    transform: translate3d(0, 0, 0);
    transition: .5s ease;
    z-index: 5
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
    max-height: 50vh;
    overflow-y: auto;
}

.fitness-table {
    font-size: 1rem;
}
</style>
