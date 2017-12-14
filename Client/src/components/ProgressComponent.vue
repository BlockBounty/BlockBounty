<template>
    <div>
        <div class="card border-radius" :class="{hidden: isHidden}">
            <div class="progress-metric flex">
                <div class="label">Steps Contributed</div>
                <div class="value">{{totalSteps}}</div>
            </div>
            <div class="divider"></div>
            <div class="progress-metric flex">
                <div class="label">Controllers</div>
                <div class="value">{{totalControllers}}</div>
            </div>
        </div>
        <div class="waiting" v-if="isHidden">
            Waiting for the bounty to begin...
        </div>
    </div>
</template>

<script>
import ComputeService from '../services/ComputeService';

ComputeService.listenForProgress((results) => {
    model.isHidden = false;
    model.totalControllers++;
    model.totalSteps += results.steps;
});

let model = {
    isHidden: true,
    totalSteps: 0,
    totalControllers: 0,
};

export default {
    name: 'ProgressComponent',
    data: () => {
        return model;
    }
}
</script>

<style scoped>
.card {
    display: flex;
    position: absolute;
    left: 10vw;
    top: calc(50vh - 3.5rem);
    background: rgba(63, 79, 128, .8);
    color: #e3e5eb;
    overflow: hidden;
    padding: 1rem;
    margin: auto;
    width: 80vw;
    height: 7rem;
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

.waiting {
    position: absolute;
    width: 100vw;
    text-align: center;
    top: 50vh;
    font-size: 3rem;
}
</style>