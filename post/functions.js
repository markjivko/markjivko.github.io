document.addEventListener("DOMContentLoaded", function () {
  const fontSize = 60;
  const lineHeight = 70;

  const input = document.querySelector('[data-role="input"] textarea');
  const canvas = document.querySelector('[data-role="output"]');

  const canvasHeight = canvas.height;
  const inputHeight = input.offsetHeight;

  const loadImage = (url) =>
    new Promise((r) => {
      let i = new Image();
      i.onload = () => r(i);
      i.src = url;
    });

  // Context ready
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvasHeight);
    ctx.font = `${fontSize}px Oswald`;

    (async () => {
      const banner = await loadImage("./banner.png");
      const background = await loadImage("./background.svg");

      input.addEventListener("keyup", () => {
        const lines = input.value.split("\n");
        const newInputHeight = inputHeight + (lines.length - 1) * lineHeight;
        const newCanvasHeight = canvasHeight + newInputHeight - inputHeight;

        const marginTop = newCanvasHeight - newInputHeight + 55;

        canvas.style.height = `${newCanvasHeight}px`;
        input.style.height = `${newInputHeight}px`;

        ctx.fillStyle = "black";
        ctx.canvas.height = newCanvasHeight;
        ctx.fillRect(0, 0, canvas.width, newCanvasHeight);
        ctx.drawImage(background, -610, -610);
        ctx.drawImage(banner, 0, 50);

        ctx.font = `${fontSize}px Oswald`;
        ctx.fillStyle = "#ffffff";
        lines.map((line, index) => {
          ctx.fillText(line, 50, marginTop + index * lineHeight);
        });
      });

      input.focus();
      input.dispatchEvent(new KeyboardEvent("keyup", { key: " " }));
    })();
  }
});
