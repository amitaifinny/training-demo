// Switch between the three app areas without reloading the page.
const tabButtons = document.querySelectorAll('.tab-button');
const panels = document.querySelectorAll('.tab-panel');
const lessonView = document.querySelector('#lesson');

function showTab(tabName) {
    lessonView.hidden = true;
    panels.forEach((panel) => {
        panel.hidden = panel.id !== tabName;
        panel.classList.toggle('is-active', panel.id === tabName);
    });
    tabButtons.forEach((button) => {
        const isActive = button.dataset.tab === tabName;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
    window.scrollTo(0, 0);
}

tabButtons.forEach((button) => {
    button.addEventListener('click', () => showTab(button.dataset.tab));
});

// Keep the module action label in sync with the current submodule.
const submodules = [
    { name: 'Reading labels', status: 'done' },
    { name: 'Protective equipment', status: 'done' },
    { name: 'Storage', status: 'done' },
    { name: 'Mixing dangers', status: 'current' },
    { name: 'Spill response', status: 'not-started' },
];
const currentSubmodule = submodules.find((submodule) => submodule.status === 'current');
document.querySelector('.module-action').textContent = `Continue: ${currentSubmodule.name}`;

// Lesson progress unlocks one step at a time and resets on back.
let lessonStep = 1;
const lessonSteps = document.querySelectorAll('.lesson-step');
const lessonPanels = document.querySelectorAll('[data-lesson-panel]');

function renderLesson() {
    lessonSteps.forEach((step) => {
        const stepNumber = Number(step.dataset.step);
        step.classList.toggle('is-current', stepNumber === lessonStep);
        step.classList.toggle('is-complete', stepNumber < lessonStep);
        step.setAttribute('aria-current', stepNumber === lessonStep ? 'step' : 'false');
        step.querySelector('.step-marker').textContent = stepNumber < lessonStep ? '✓' : String(stepNumber);
    });
    lessonPanels.forEach((panel) => {
        panel.hidden = Number(panel.dataset.lessonPanel) !== lessonStep;
    });
}

function showLesson() {
    panels.forEach((panel) => {
        panel.hidden = true;
        panel.classList.toggle('is-active', panel.id === 'modules');
    });
    tabButtons.forEach((button) => {
        const isActive = button.dataset.tab === 'modules';
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
    lessonView.hidden = false;
    window.scrollTo(0, 0);
    renderLesson();
}

document.querySelector('.module-action').addEventListener('click', showLesson);
document.querySelector('.lesson-back').addEventListener('click', (event) => {
    event.preventDefault();
    lessonStep = 1;
    renderLesson();
    showTab('modules');
});
document.querySelectorAll('[data-lesson-next]').forEach((button) => {
    button.addEventListener('click', () => {
        lessonStep = Number(button.dataset.lessonNext);
        renderLesson();
    });
});
document.querySelector('[data-tab-target="quiz"]').addEventListener('click', () => showTab('quiz'));

// Quiz feedback keeps the demo state simple and predictable.
const quizForm = document.querySelector('#quiz-form');
const feedback = document.querySelector('#quiz-feedback');
const nextModule = document.querySelector('#next-module');
const retakeQuiz = document.querySelector('#retake-quiz');

quizForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const answer = quizForm.querySelector('input[name="answer"]:checked');
    feedback.hidden = false;
    nextModule.hidden = false;

    if (answer && answer.value === 'correct') {
        feedback.className = 'banner success';
        feedback.textContent = "✓ That's right! You're ready for the next module.";
        nextModule.disabled = false;
        retakeQuiz.hidden = true;
    } else {
        feedback.className = 'banner error';
        feedback.textContent = '✕ Not quite. You need 100% to continue. Review and try again.';
        nextModule.disabled = true;
        retakeQuiz.hidden = false;
    }
});

retakeQuiz.addEventListener('click', () => {
    quizForm.reset();
    feedback.hidden = true;
    retakeQuiz.hidden = true;
    nextModule.disabled = true;
    nextModule.hidden = true;
});
