// INCOLLA QUI IL LINK DEL PASSO 1
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRi929-CE5a4t5QkZPXp-usmRedm7rQPwljEMhU0HU_XkKzCsszxNEa2-7x5MVkT5T8wEyuwSzHKJGQ/pub?output=csv";

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Elementi della pagina
const setupScreen = document.getElementById('setup-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const btnA = document.getElementById('btn-A');
const btnB = document.getElementById('btn-B');
const btnC = document.getElementById('btn-C');
const pointsValue = document.getElementById('points-value');
const questionCounter = document.getElementById('question-counter');
const finalScore = document.getElementById('final-score');

// Caricamento dei dati all'avvio
document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('restart-btn').addEventListener('click', startQuiz);

function startQuiz() {
    setupScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    score = 0;
    currentQuestionIndex = 0;

    // Se non abbiamo ancora le domande, le scarichiamo
    if (questions.length === 0) {
        Papa.parse(CSV_URL, {
            download: true,
            header: true,
            complete: function(results) {
                // Filtra eventuali righe vuote
                questions = results.data.filter(q => q.Domanda);
                // Mescola l'ordine delle domande
                questions.sort(() => Math.random() - 0.5);
                showQuestion();
            }
        });
    } else {
        questions.sort(() => Math.random() - 0.5);
        showQuestion();
    }
}

function showQuestion() {
    // Reimposta il colore dei bottoni
    btnA.className = "btn option-btn";
    btnB.className = "btn option-btn";
    btnC.className = "btn option-btn";

    // Mostra la domanda attuale (facciamo 10 domande a partita)
    if (currentQuestionIndex >= 10 || currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const currentQ = questions[currentQuestionIndex];
    questionCounter.innerText = `Domanda: ${currentQuestionIndex + 1} / 10`;
    pointsValue.innerText = currentQ.Punti;
    questionText.innerText = currentQ.Domanda;
    
    btnA.innerText = currentQ.Opzione_A;
    btnB.innerText = currentQ.Opzione_B;
    btnC.innerText = currentQ.Opzione_C;

    // Assegna gli eventi di controllo risposta
    btnA.onclick = () => checkAnswer('A', btnA);
    btnB.onclick = () => checkAnswer('B', btnB);
    btnC.onclick = () => checkAnswer('C', btnC);
}

function checkAnswer(selectedOption, clickedBtn) {
    const currentQ = questions[currentQuestionIndex];
    const correctOption = currentQ.Risposta_Corretta.trim();
    
    // Disabilita i pulsanti temporaneamente
    btnA.onclick = null; btnB.onclick = null; btnC.onclick = null;

    if (selectedOption === correctOption) {
        clickedBtn.classList.add('correct');
        score += parseInt(currentQ.Punti);
    } else {
        clickedBtn.classList.add('wrong');
        // Mostra qual era quella giusta
        if (correctOption === 'A') btnA.classList.add('correct');
        if (correctOption === 'B') btnB.classList.add('correct');
        if (correctOption === 'C') btnC.classList.add('correct');
    }

    // Passa alla prossima domanda dopo 1.5 secondi
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

function endQuiz() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalScore.innerText = score;
}