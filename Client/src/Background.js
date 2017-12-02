let app = document.querySelector("body");
let particles = [];
const particleSize = 30;

let createParticle = () => {
    let part = document.createElement('div');
    part.classList.add('particle');
    part.style.top = "-50px";
    let partObj = { isReady: true, element: part };
    particles.push(partObj);
    resetParticle(partObj);
    app.appendChild(part);
};

let addParticle = () => {
    let particle = particles.find(p => p.isReady);
    resetParticle(particle);
    let horzPos = Math.floor(Math.random() * window.innerWidth * .35);
    let topOrBottom = Math.floor(Math.random() * 2) == 0 ? "top" : "bottom";
    let leftOrRight = topOrBottom == "top" ? "right" : "left";
    particle.element.style[leftOrRight] = horzPos + "px";
    particle.element.style[topOrBottom] = `-${particleSize}px`;
    particle.element.style.transform = `translate3d(0, ${topOrBottom == "top" ? "" : "-"}${(Math.random() * window.innerHeight * .15) + particleSize}px, 0)`;
    particle.element.classList.add("fadeUp");
    particle.element.style.display = "block";
    particle.isReady = false;
    setTimeout(() => resetParticle(particle), 15000);
}

let resetParticle = (particle) => {
    particle.element.style.left = null;
    particle.element.style.right = null;
    particle.element.style.bottom = null;
    particle.element.style.top = null;
    particle.element.style.transform = null;
    particle.element.style.display = "none";
    particle.element.classList.remove("fadeUp");
    particle.isReady = true;
}

for (let i = 0; i < 50; i++) {
    createParticle();
}

let interval;
export default {
    start: () => {
        addParticle();

        interval = setInterval(() => {
            let numParticles = Math.floor((Math.random() * 10 * .45));
            for (let i = 0; i < numParticles; i++) {
                addParticle();
            }
        }, 750);
    },
    stop: () => {
        clearInterval(interval);
    }
};
