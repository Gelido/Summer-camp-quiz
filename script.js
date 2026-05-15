// INCOLLA QUI IL LINK DEL PASSO 1
const CSV_URL = "INCOLLA_QUI_IL_TUO_LINK_CSV_PUBBLICO";

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

document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('restart-btn').addEventListener('click', startQuiz);

function startQuiz() {
    setupScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    score = 0;
    currentQuestionIndex = 0;

    // Scarichiamo le domande dal tuo Google Sheet ad ogni partita
    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        complete: function(results) {
            // Filtra eventuali righe vuote
            let allQuestions = results.data.filter(q => q.Domanda);
            
            // 1. Mischia tutte le 100+ domande in modo casuale
            allQuestions.sort(() => Math.random() - 0.5);
            
            // 2. Prendi solo le prime 10 per questa partita
            questions = allQuestions.slice(0, 10);
            
            // 3. Ordinale per difficoltà: dai punti più bassi ai più alti
            questions.sort((a, b) => parseInt(a.Punti) - parseInt(b.Punti));

            showQuestion();
        }
    });
}

function showQuestion() {
    btnA.className = "btn option-btn";
    btnB.className = "btn option-btn";
    btnC.className = "btn option-btn";

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

    btnA.onclick = () => checkAnswer('A', btnA);
    btnB.onclick = () => checkAnswer('B', btnB);
    btnC.onclick = () => checkAnswer('C', btnC);
}

function checkAnswer(selectedOption, clickedBtn) {
    const currentQ = questions[currentQuestionIndex];
    const correctOption = currentQ.Risposta_Corretta.trim();
    
    btnA.onclick = null; btnB.onclick = null; btnC.onclick = null;

    if (selectedOption === correctOption) {
        clickedBtn.classList.add('correct');
        score += parseInt(currentQ.Punti);
    } else {
        clickedBtn.classList.add('wrong');
        if (correctOption === 'A') btnA.classList.add('correct');
        if (correctOption === 'B') btnB.classList.add('correct');
        if (correctOption === 'C') btnC.classList.add('correct');
    }

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