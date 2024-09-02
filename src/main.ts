import { keyToNote } from "./constants";
import { playNote } from "./sound";

const whiteKeys = ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", `'`];
const blackKeys = ["W", "E", "", "T", "Y", "U", "", "O", "P", ""];

const scaleTarget = 0.8;
const keys = [...whiteKeys, ...blackKeys].map((val) => ({
  key: val.toLowerCase(),
  scale: scaleTarget,
}));

document.onkeydown = (e) => {
  const note = keyToNote[e.key];
  const key = keys.find((key) => key.key === e.key);
  if (key) key.scale = 1;
  if (note) playNote(note, 0.5);
};

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("no canvas context");
(function update() {
  ctx.font = "20px sans-serif";

  // UPDATE
  keys.forEach((key) => {
    key.scale += (scaleTarget - key.scale) * 0.1;
  });

  // DRAW
  {
    const dpi = window.devicePixelRatio;
    canvas.width = window.innerWidth * dpi;
    canvas.height = window.innerHeight * dpi;
    ctx.reset();
    ctx.scale(dpi, dpi);
  }
  const rect = canvas.getBoundingClientRect();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, rect.width, rect.height);

  // render keys
  const keyWidth = 50;
  const keyHeight = 50;

  // draw row of white keys centered
  const whiteKeyRowWidth = whiteKeys.length * keyWidth;
  const whiteKeyRowX = (rect.width - whiteKeyRowWidth) / 2;
  const whiteKeyHeight = keyHeight;
  const whiteKeyY = rect.height / 2;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "20px sans-serif";

  whiteKeys.forEach((key, i) => {
    ctx.save();
    ctx.translate(
      whiteKeyRowX + i * keyWidth + keyWidth * 0.5,
      whiteKeyY + keyHeight * 0.5,
    );
    ctx.scale(keys[i].scale, keys[i].scale);
    ctx.translate(
      -(whiteKeyRowX + i * keyWidth + keyWidth * 0.5),
      -(whiteKeyY + keyHeight * 0.5),
    );

    ctx.fillStyle = "white";
    ctx.fillRect(
      whiteKeyRowX + i * keyWidth,
      whiteKeyY,
      keyWidth,
      whiteKeyHeight,
    );
    ctx.fillStyle = "black";
    ctx.fillText(
      key,
      whiteKeyRowX + i * keyWidth + keyWidth / 2,
      whiteKeyY + keyHeight / 2,
    );
    ctx.restore();
  });

  ctx.translate(0, -keyHeight);
  blackKeys.forEach((key, i) => {
    if (!key) return;
    ctx.save();
    ctx.translate(
      whiteKeyRowX + i * keyWidth + keyWidth,
      whiteKeyY + keyHeight * 0.5,
    );
    ctx.scale(
      keys[i + whiteKeys.length].scale,
      keys[i + whiteKeys.length].scale,
    );
    ctx.translate(
      -(whiteKeyRowX + i * keyWidth + keyWidth),
      -(whiteKeyY + keyHeight * 0.5),
    );
    ctx.fillStyle = "gray";
    ctx.fillRect(
      whiteKeyRowX + i * keyWidth + keyWidth * 0.5,
      whiteKeyY,
      keyWidth,
      whiteKeyHeight,
    );
    ctx.fillStyle = "white";
    ctx.fillText(
      key,
      whiteKeyRowX + i * keyWidth + keyWidth,
      whiteKeyY + whiteKeyHeight / 2,
    );
    ctx.restore();
  });

  requestAnimationFrame(update);
})();
