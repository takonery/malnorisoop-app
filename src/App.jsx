import React, { useState, useEffect } from 'react';

// 전체 퀴즈 문제 리스트 (6개로 확장)
const fullQuizList = [
  { word: "멍멍", img: "https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_1280.jpg" },
  { word: "야옹", img: "https://cdn.pixabay.com/photo/2016/02/10/16/37/cat-1192026_1280.jpg" },
  { word: "꿀꿀", img: "https://cdn.pixabay.com/photo/2016/04/01/09/09/piglet-1292195_1280.png" },
  { word: "음메", img: "https://cdn.pixabay.com/photo/2015/09/02/13/24/cow-918349_1280.jpg" },
  { word: "히잉", img: "https://cdn.pixabay.com/photo/2017/07/09/18/50/horse-2489090_1280.jpg" },
  { word: "짹짹", img: "https://cdn.pixabay.com/photo/2018/02/26/13/47/bird-3186080_1280.jpg" }
];

// 랜덤 섞기 함수
const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function App() {
  const [quizList, setQuizList] = useState([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState("");
  const [feedback, setFeedback] = useState("");
  const [listening, setListening] = useState(false);
  const [finished, setFinished] = useState(false);

  // 처음에만 퀴즈 리스트 랜덤으로 섞기
  useEffect(() => {
    setQuizList(shuffle(fullQuizList));
  }, []);

  const target = quizList[step];

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setFeedback("");
    };
    recognition.onend = () => setListening(false);

    recognition.onresult = (e) => {
      const said = e.results[0][0].transcript;
      setResult(said);

      if (said.trim() === target.word) {
        setFeedback("✅ 정답이에요! 잘했어요 🎉");
        setScore(score + 1);
        setTimeout(() => {
          if (step + 1 < quizList.length) {
            setStep(step + 1);
            setResult("");
            setFeedback("");
          } else {
            setFinished(true);
          }
        }, 2000);
      } else {
        setFeedback("❌ 다시 말해볼까요?");
      }
    };

    recognition.start();
  };

  const resetQuiz = () => {
    setQuizList(shuffle(fullQuizList));
    setStep(0);
    setScore(0);
    setResult("");
    setFeedback("");
    setFinished(false);
  };

  if (quizList.length === 0) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>🐾 동물 소리 말놀이</h1>

      {finished ? (
        <>
          <h2>🎉 퀴즈 완료!</h2>
          <p style={{ fontSize: "1.2rem" }}>
            총 {quizList.length}문제 중 <strong>{score}문제</strong>를 맞혔어요!
          </p>
          <button onClick={resetQuiz} style={{ fontSize: "1.2rem", padding: "10px 20px", marginTop: "20px" }}>
            🔁 다시 시작하기
          </button>
        </>
      ) : (
        <>
          <h2>문제 {step + 1} / {quizList.length}</h2>
          <img src={target.img} alt="동물" style={{ width: "300px", borderRadius: "10px" }} />
          <p style={{ fontSize: "1.5rem" }}>👉 이 소리를 따라해보세요: <strong>{target.word}</strong></p>

          <button onClick={startListening} disabled={listening} style={{ fontSize: "1.2rem", padding: "10px 20px" }}>
            🎤 {listening ? "듣는 중..." : "말하기 시작"}
          </button>

          <p style={{ fontSize: "1.2rem" }}>🗣️ 말한 것: <strong>{result}</strong></p>
          <p style={{ fontSize: "1.2rem" }}>{feedback}</p>
        </>
      )}
    </div>
  );
}

export default App;
