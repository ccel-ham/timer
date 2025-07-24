
let intervalID;
let isPaused = false;
let elapsed = 0;

function toggleMenu() {
    document.getElementById("menu").classList.toggle("open");
    document.querySelector(".hamburger").classList.toggle("open");
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

function parseTimeString(timeStr) {
    const parts = timeStr.split(":").map(Number);
    if (parts.length !== 2 || parts.some(isNaN)) return 0;
    return parts[0] * 60 + parts[1];
}

function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
}

document.getElementById("start-button").addEventListener("click", () => {
    clearInterval(intervalID);

    const timerText = document.getElementById("timer").textContent.trim();
    elapsed = parseTimeString(timerText);
    isPaused = false;

    document.getElementById("timer").textContent = formatTime(elapsed);
    document.getElementById("pause-button").textContent = "一時停止";
    document.getElementById("pause-button").disabled = false;
    document.getElementById("reset-button").disabled = false;

    intervalID = setInterval(() => {
        if (!isPaused) {
            elapsed++;
            document.getElementById("timer").textContent = formatTime(elapsed);
        }
    }, 1000);
});

document.getElementById("pause-button").addEventListener("click", () => {
    isPaused = !isPaused;
    document.getElementById("pause-button").textContent = isPaused ? "再開" : "一時停止";
});

document.getElementById("reset-button").addEventListener("click", () => {
    clearInterval(intervalID);
    elapsed = 0; // 経過時間を0にリセット
    document.getElementById("timer").textContent = formatTime(elapsed); // 0秒を"00:00"にフォーマットして表示
    document.getElementById("pause-button").disabled = true;
    document.getElementById("reset-button").disabled = true;
});

// ==== フォントサイズ調整機能の共通化 ====
let isResizing = false;
let startX = 0;
let startY = 0;
let startFontSize = 0;
let targetElement = null; // 現在サイズ変更中の要素

// すべてのリサイザー要素を取得
document.querySelectorAll('.resizer').forEach(resizerEl => {
    resizerEl.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;

        // data-target属性から対象要素のIDを取得し、要素を設定
        const targetId = resizerEl.dataset.target;
        targetElement = document.getElementById(targetId);

        if (targetElement) {
            const fontSizeStr = window.getComputedStyle(targetElement).fontSize;
            startFontSize = parseFloat(fontSizeStr);
        }
        e.preventDefault(); // ドラッグ中のテキスト選択などを防ぐ
    });
});

document.addEventListener("mousemove", (e) => {
    if (!isResizing || !targetElement) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const delta = (deltaX + deltaY) / 2;

    const newSize = Math.max(12, startFontSize + delta); // 最小フォントサイズを設定
    targetElement.style.fontSize = newSize + "px";
});

document.addEventListener("mouseup", () => {
    isResizing = false;
    targetElement = null; // リサイズ終了時にターゲットをクリア
});

// タイマー要素がフォーカスを失ったときに、内容が正しいフォーマットか確認する
document.getElementById("timer").addEventListener("blur", () => {
    let currentText = document.getElementById("timer").textContent.trim();
    let parsedSeconds = parseTimeString(currentText);
    document.getElementById("timer").textContent = formatTime(parsedSeconds);
});

// 新しい入力要素がフォーカスを失ったときに、内容をトリムする（必要であれば追加の整形も）
document.getElementById("input1").addEventListener("blur", () => {
    document.getElementById("input1").textContent = document.getElementById("input1").textContent.trim();
});
document.getElementById("input2").addEventListener("blur", () => {
    document.getElementById("input2").textContent = document.getElementById("input2").textContent.trim();
});