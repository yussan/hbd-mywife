const btnStart = document.getElementById('btnStart');
const eggSection = document.getElementById('secJellyfish');
const scrollSections = document.querySelectorAll('#secButterfly, #secBlossom');

btnStart.addEventListener('click', () => {
    btnStartHandler();
});

let isStarted = false;

// handle click btn start
const btnStartHandler = (event) => {
    if (isStarted) return; // Prevent multiple clicks spawning overlapping heavy timelines
    isStarted = true;

    // btnStart add class .spinning-element
    btnStart.innerText = "HBD";
    btnStart.classList.add('spinning-element');
    btnStart.style.pointerEvents = 'none'; // visually and functionally disable

    setTimeout(() => {
        btnStart.style.left = "10px"
        btnStart.style.bottom = "10px"
        btnStart.style.width = "150px"
        btnStart.style.height = "150px"
    }, 1500);

    const audio = new Audio('assets/hbd-tuyu.mp3');
    // audio.loop = true; //full inifinite
    audio.play();

    // start blossom animation
    const master = new TimelineMax();
    master
        .add(mainSetUp)
        .add(branchMaster);

    // after 6 seconds, scroll out the butterfly/blossom frame and reveal egg section
    setTimeout(() => {
        // Play transition sound effectively ~130-150% louder by overlapping audio instances
        const transitionSound1 = new Audio('assets/spongebob-bubble-transition.mp3');
        const transitionSound2 = new Audio('assets/spongebob-bubble-transition.mp3');
        transitionSound1.play().catch(e => console.log(e));
        transitionSound2.play().catch(e => console.log(e));

        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Use GSAP for buttery smooth animations instead of raw CSS properties
        // hide '#secButterfly, #secBlossom' by moving them top outside the frame
        TweenMax.to(['#secButterfly', '#secBlossom'], 2, { 
            y: "-100vh", 
            ease: Power2.easeInOut 
        });

        const jellyfishes = document.getElementsByClassName('element');
        // Hide and move off-screen left BEFORE secJellyfish scrolls up
        TweenMax.set(jellyfishes, { opacity: 0, x: -window.innerWidth - 200 });

        // show #secJellyfish to screen
        TweenMax.to('#secJellyfish', 2, { 
            bottom: "auto", 
            top: "0", 
            ease: Power2.easeInOut,
            onComplete: () => {
                // Animate them flying in from the left
                TweenMax.staggerTo(jellyfishes, 2.5, 
                    { x: 0, opacity: 1, ease: Back.easeOut.config(1), onCompleteAll: () => {
                        window.jellyfishReady = true; // enable mouse movement
                    } }, 0.05);
            }
        });
    }, 6000); 
}


// blossom section
const branchesRandomOrder = $('[id^=BranchGroup]').toArray().sort(function () { return 0.5 - Math.random() });
const branchesRandomOrderLeft = $('[id^=BranchGroup-left]').toArray().sort(function () { return 0.5 - Math.random() });
const branchesRandomOrderRight = $('[id^=BranchGroup-right]').toArray().sort(function () { return 0.5 - Math.random() });
const branchesRandomOrderBottom = $('[id^=BranchGroup-bottom]').toArray().sort(function () { return 0.5 - Math.random() });

function mainSetUp() {
    const tl = new TimelineMax();
    tl
        .set('[id^=petal-]', { fill: "#fff" })
        .set(['[id^=flower-]', '[id^=bud-]', '[id^=bloom-]'], { scale: 0, transformOrigin: 'center center' })
        .set(branchesRandomOrderLeft, { transformOrigin: 'bottom left' })
        .set(branchesRandomOrderRight, { transformOrigin: 'bottom right' })
        .set(branchesRandomOrderBottom, { transformOrigin: 'bottom center' })
        .set('#BranchGroup-left-1', { transformOrigin: '0% 20%' })
        .set('#BranchGroup-right-16', { transformOrigin: '100% 20%' })
        .set(branchesRandomOrder, { scale: 0 })
        .set(".container", { autoAlpha: 1 });

    return tl;
}

function branchMaster() {
    const tl = new TimelineMax();
    tl
        .add(wholeBranchGrowIn)
        .add(smallBranchesSway);

    return tl;
}

function wholeBranchGrowIn() {
    const tl = new TimelineMax();
    tl.staggerTo(branchesRandomOrder, 3, { scale: 1, ease: Power1.easeOut, force3D: true, onStart: flowersBloom, onComplete: currentBranchSwaying }, 0.25);

    return tl;
}

function flowersBloom() {
    const tl = new TimelineMax({ delay: 1.5 });
    const currentBranch = $(this.target);
    const flowers = currentBranch.find('[id^=flower-]');
    const buds = currentBranch.find('[id^=bud-]');
    const blooms = currentBranch.find('[id^=bloom-]');

    tl
        .staggerTo([flowers, buds, blooms], 2, { scale: 1, ease: Back.easeOut.config(2), force3D: true }, 0.5, 0)
        .to(flowers, 3, { rotation: 45, ease: Sine.easeOut, force3D: true }, 0)

    return tl;
}

function currentBranchSwaying() {
    const tl = new TimelineMax({ yoyo: true, repeat: -1 });
    const currentBranch = $(this.target);
    var currentBranchRotation = (currentBranch.data('position') === "left") ? -10 :
        (currentBranch.data('position') === "right") ? 5 : 10;

    tl.staggerTo(currentBranch, 2 + Math.random(), { rotation: currentBranchRotation, ease: Sine.easeInOut, force3D: true }, Math.random() / 1.2);

    return tl;
}


function smallBranchesSway() {
    const smallBranches = $('[id^=smallbranch-group]').toArray();
    const tl = new TimelineMax({ yoyo: true, repeat: -1 });

    tl
        .staggerTo(smallBranches, 2 + Math.random(), { rotation: 5, ease: Sine.easeInOut, force3D: true }, Math.random() / 1.2, 'smallBranchSway')
        .to('#smallbranch-group-3-B, #smallbranch-group-8-A', 1 + Math.random(), { rotation: -5, transformOrigin: '100% 50%', force3D: true }, 'smallBranchSway')
        .to('#smallbranch-group-5-A', 2 + Math.random(), { rotation: -5, transformOrigin: '50% 100%', force3D: true }, 'smallBranchSway')
        .to('#smallbranch-group-2-C, #smallbranch-group-A, #smallbranch-group-12-A', 2 + Math.random(), { rotation: -5, transformOrigin: '100% 100%', force3D: true }, 'smallBranchSway');

    return tl;
}

// end of blossom section