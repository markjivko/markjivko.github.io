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

  const getPath = (relativePath) => {
    if ("string" !== typeof relativePath) {
      relativePath = "";
    }
    return (
      window.location.origin +
      "/post" +
      (relativePath ? "/" + relativePath : "")
    );
  };

  if ("serviceWorker" in navigator) {
    // Register service worker
    navigator.serviceWorker
      .register(getPath("pwa.js"), {
        scope: getPath(),
        useCache: true,
      })
      .then(() => {})
      .catch(() => {});
  }

  (() => {
    // Add the manifest
    const linkObject = document.getElementById("pwa_manifest");
    null !== linkObject &&
      null === linkObject.getAttribute("href") &&
      linkObject.setAttribute(
        "href",
        URL.createObjectURL(
          new Blob(
            [
              JSON.stringify({
                description: "Social media quote maker",
                short_name: "Quote Maker",
                name: "Quote Maker",
                theme_color: "#dff308",
                background_color: "#222222",
                dir: "ltr",
                lang: "en-US",
                start_url: getPath(),
                scope: getPath(),
                icons: [
                  {
                    src: getPath("64.png"),
                    sizes: "64x64",
                    type: "image/png",
                    purpose: "maskable any",
                  },
                  {
                    src: getPath("192.png"),
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "maskable any",
                  },
                  {
                    src: getPath("512.png"),
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "maskable any",
                  },
                ],
                display: "fullscreen",
                orientation: "landscape",
              }),
            ],
            {
              type: "application/json",
            }
          )
        )
      );
  })();

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
        ctx.font = `${fontSize}px Oswald`;
        const lines = [];
        const paragraphs = input.value.split("\n");

        paragraphs.forEach((line) => {
          let j = 0;
          for (let i = 0; i < line.length - 1; i++) {
            const segmentText = line.substring(j, i + 1);
            const segmentLength = ctx.measureText(segmentText);
            if (segmentLength.width >= 670) {
              lines.push(segmentText);
              j = i + 1;
            }
          }
          lines.push(line.substring(j));
        });

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

        ctx.fillStyle = "#ffffff";
        ctx.font = `${fontSize}px Oswald`;
        lines.map((line, index) => {
          ctx.fillText(line, 50, marginTop + index * lineHeight);
        });
      });

      input.focus();
      input.dispatchEvent(new KeyboardEvent("keyup", { key: "" }));
    })();
  }
});
