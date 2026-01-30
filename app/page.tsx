"use client";

import { useState, useEffect } from "react";

type Log = {
  date: string;
  morning: string;
  lunch: string;
  dinner: string;
  score: number;
  training: boolean;
  trainingNote: string;
  alcohol: boolean;
  junkMorning: boolean;
  junkLunch: boolean;
  junkDinner: boolean;
};

export default function Home() {
  const today = new Date().toLocaleDateString("ja-JP");

  const [morning, setMorning] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const [score, setScore] = useState(50);

  const [training, setTraining] = useState(false);
  const [trainingNote, setTrainingNote] = useState("");

  const [alcohol, setAlcohol] = useState(false);
  const [junkMorning, setJunkMorning] = useState(false);
  const [junkLunch, setJunkLunch] = useState(false);
  const [junkDinner, setJunkDinner] = useState(false);

  const [logs, setLogs] = useState<Log[]>([]);

  // 起動時に履歴読み込み
  useEffect(() => {
    const data = localStorage.getItem("aibo-logs");
    if (data) {
      setLogs(JSON.parse(data));
    }
  }, []);

  // 保存
  const handleSave = () => {
    const newLog: Log = {
      date: today,
      morning,
      lunch,
      dinner,
      score,
      training,
      trainingNote, 
      alcohol,
      junkMorning,
      junkLunch,
      junkDinner,
    };

    const newLogs = [...logs, newLog];
    setLogs(newLogs);
    localStorage.setItem("aibo-logs", JSON.stringify(newLogs));
  };

  // 直近7件
  const last7Logs = logs.slice(-7);

  // 全体平均
  const average =
    last7Logs.length === 0
      ? 0
      : Math.round(
          last7Logs.reduce((sum, log) => sum + log.score, 0) /
            last7Logs.length
        );

  // 酒あり平均
  const alcoholLogs = last7Logs.filter((log) => log.alcohol);
  const alcoholAvg =
    alcoholLogs.length === 0
      ? 0
      : Math.round(
          alcoholLogs.reduce((sum, log) => sum + log.score, 0) /
            alcoholLogs.length
        );

  // ジャンクあり平均
  const junkLogs = last7Logs.filter(
    (log) => log.junkMorning || log.junkLunch || log.junkDinner
  );
  const junkAvg =
    junkLogs.length === 0
      ? 0
      : Math.round(
          junkLogs.reduce((sum, log) => sum + log.score, 0) /
            junkLogs.length
        );

  return (
    <main style={{ padding: "40px" }}>
      <h1>相棒OS  v3(人生初アプリ）</h1>
      <p>今日の日付：{today}</p>

      <p>朝食：</p>
      <input
      value={morning}
      onChange={(e) => setMorning(e.target.value)}
      style={{ width: "100%" }}
/>

      <p>昼食：</p>
      <input
      value={lunch}
      onChange={(e) => setLunch(e.target.value)}
      style={{ width: "100%" }}
/>

      <p>夕食：</p>
      <input
      value={dinner}
      onChange={(e) => setDinner(e.target.value)}
      style={{ width: "100%" }}
/>

<p>自己評価：{score} 点</p>
<input
  type="range"
  min="0"
  max="100"
  value={score}
  onChange={(e) => setScore(Number(e.target.value))}
  style={{ width: "100%" }}
/>


      <p>
        <label>
          <input
            type="checkbox"
            checked={training}
            onChange={(e) => setTraining(e.target.checked)}
          />
          筋トレ
{training && (
  <div>
    内容：
    <input
      value={trainingNote}
      onChange={(e) => setTrainingNote(e.target.value)}
      placeholder="例：腕立て20回×3"
    />
  </div>
)}

        </label>
      </p>

      <p>
        <label>
          <input
            type="checkbox"
            checked={alcohol}
            onChange={(e) => setAlcohol(e.target.checked)}
          />
          酒（夜）
        </label>
      </p>

      <p>ジャンク：</p>
      <label>
        <input
          type="checkbox"
          checked={junkMorning}
          onChange={(e) => setJunkMorning(e.target.checked)}
        />
        朝
      </label>

      <label>
        <input
          type="checkbox"
          checked={junkLunch}
          onChange={(e) => setJunkLunch(e.target.checked)}
        />
        昼
      </label>

      <label>
        <input
          type="checkbox"
          checked={junkDinner}
          onChange={(e) => setJunkDinner(e.target.checked)}
        />
        夜
      </label>

      <br /><br />
      <button onClick={handleSave}>保存</button>

      <hr />

      {/* 平均エリア */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 80px",
          rowGap: "4px",
          marginBottom: "16px",
        }}
      >
        <div>平均点（直近7日）</div>
        <div>{average} 点</div>

        <div>酒あり日の平均</div>
        <div>{alcoholAvg} 点</div>

        <div>ジャンクあり日の平均</div>
        <div>{junkAvg} 点</div>
      </div>

      <h2>1週間ログ</h2>

      <div
        style={{
          fontWeight: "bold",
          display: "grid",
          gridTemplateColumns: "120px 60px 60px 40px 40px 40px 40px",
        }}
      >
        <div>日付</div>
        <div>点数</div>
        <div>筋</div>
        <div>酒</div>
        <div>朝</div>
        <div>昼</div>
        <div>夜</div>
      </div>

      {last7Logs.map((log, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gridTemplateColumns: "120px 60px 60px 40px 40px 40px 40px",
            alignItems: "center",
          }}
        >
          <div>{log.date}</div>
          <div>{log.score}点</div>
          <div>
            {log.training ? "💪" : "🧟‍♂️"} {log.trainingNote}
          </div>
          <div>{log.alcohol ? "🍺" : "⭐"}</div>
          <div>{log.junkMorning ? "🍔" : "👍"}</div>
          <div>{log.junkLunch ? "🍜" : "👍"}</div>
          <div>{log.junkDinner ? "🍗" : "👍"}</div>
        </div>
      ))}
    </main>
  );
}
