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

  // 自動スコア計算
  const calculateScore = () => {
    let total = 0;

    // 食事
    if (!junkMorning) total += 30;
    if (!junkLunch) total += 30;
    if (!junkDinner) total += 30;

    // トレーニング
    if (training) total += 40;

    // 酒
    if (alcohol) total -= 30;

    // ジャンク減点
    if (junkMorning) total -= 30;
    if (junkLunch) total -= 30;
    if (junkDinner) total -= 30;

    // 上限・下限
    if (total > 100) total = 100;
    if (total < 0) total = 0;

    return total;
  };

  // 保存
  const handleSave = () => {
    const score = calculateScore();

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

  // 連続記録日数
  const streak = (() => {
    if (logs.length === 0) return 0;

    const sorted = [...logs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let count = 0;
    let current = new Date();

    for (let log of sorted) {
      const logDate = new Date(log.date);

      if (logDate.toDateString() === current.toDateString()) {
        count++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    return count;
  })();

  // 継続称号
  let badge = "🔰";
  if (streak >= 30) badge = "👑";
  else if (streak >= 14) badge = "🥇";
  else if (streak >= 7) badge = "🥈";
  else if (streak >= 3) badge = "🥉";

  return (
    <main style={{ padding: "40px" }}>
      <h1>相棒OS v4（自動採点）</h1>

      <p style={{ fontSize: "20px", fontWeight: "bold" }}>
        🔥 連続記録：{streak}日目 {badge}
      </p>

      <p>今日の日付：{today}</p>

      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        🎯 今日のスコア：{calculateScore()} 点
      </p>

      <p>朝食：</p>
      <input value={morning} onChange={(e) => setMorning(e.target.value)} style={{ width: "100%" }} />

      <p>昼食：</p>
      <input value={lunch} onChange={(e) => setLunch(e.target.value)} style={{ width: "100%" }} />

      <p>夕食：</p>
      <input value={dinner} onChange={(e) => setDinner(e.target.value)} style={{ width: "100%" }} />

      <p>
        <label>
          <input type="checkbox" checked={training} onChange={(e) => setTraining(e.target.checked)} />
          筋トレ
        </label>
      </p>

      {training && (
        <input
          value={trainingNote}
          onChange={(e) => setTrainingNote(e.target.value)}
          placeholder="例：腕立て20回×3"
          style={{ width: "100%" }}
        />
      )}

      <p>
        <label>
          <input type="checkbox" checked={alcohol} onChange={(e) => setAlcohol(e.target.checked)} />
          酒（夜）
        </label>
      </p>

      <p>ジャンク：</p>
      <label>
        <input type="checkbox" checked={junkMorning} onChange={(e) => setJunkMorning(e.target.checked)} />
        朝
      </label>
      <label>
        <input type="checkbox" checked={junkLunch} onChange={(e) => setJunkLunch(e.target.checked)} />
        昼
      </label>
      <label>
        <input type="checkbox" checked={junkDinner} onChange={(e) => setJunkDinner(e.target.checked)} />
        夜
      </label>

      <br /><br />
      <button onClick={handleSave}>保存</button>

      <hr />

      <div>
        <div>平均点：{average} 点</div>
        <div>酒あり平均：{alcoholAvg} 点</div>
        <div>ジャンクあり平均：{junkAvg} 点</div>
      </div>

      <h2>1週間ログ</h2>

      {last7Logs.map((log, index) => (
        <div key={index}>
          {log.date}｜
          <span style={{ display: "inline-block", width: "50px", textAlign: "right" }}>
            {log.score}点
          </span>
          ｜{log.training ? "💪" : "🧟‍♂️"} {log.trainingNote}｜
          {log.alcohol ? "🍺" : "⭐"}｜
          {log.junkMorning ? "🍔" : "👍"}｜
          {log.junkLunch ? "🍜" : "👍"}｜
          {log.junkDinner ? "🍗" : "👍"}
        </div>
      ))}
    </main>
  );
}
