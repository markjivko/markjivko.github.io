const inputPadding = 20;
const inputLeft = 110;
const inputTop = 400;
const startStretch = 500;

document.addEventListener("DOMContentLoaded", function () {
    let fontSize = 60;
    let lineHeight = 70;

    const input = document.querySelector('[data-role="input"] textarea');
    const canvas = document.querySelector('[data-role="output"]');
    input.style.fontSize = `${fontSize}px`;
    input.style.lineHeight = `${lineHeight}px`;

    document.querySelector("body").addEventListener("keyup", (e) => {
        if (e.altKey) {
            switch (e.code) {
                case "ArrowUp":
                    fontSize += 5;
                    lineHeight += 5;
                    break;

                case "ArrowDown":
                    fontSize -= 5;
                    lineHeight -= 5;
                    if (fontSize <= 10) {
                        fontSize = 10;
                    }
                    if (lineHeight <= 20) {
                        lineHeight = 20;
                    }
                    break;
            }

            input.dispatchEvent(new KeyboardEvent("keyup", { key: "" }));
            input.style.fontSize = `${fontSize}px`;
            input.style.lineHeight = `${lineHeight}px`;
        }
    });

    const canvasHeight = canvas.height;
    const inputHeight = input.offsetHeight;

    const loadImage = (url) =>
        new Promise((r) => {
            const img = new Image();
            img.onload = () => r(img);
            img.src = url;
        });

    const getPath = (relativePath) => {
        if ("string" !== typeof relativePath) {
            relativePath = "";
        }
        return window.location.origin + "/post/" + (relativePath ? relativePath : "");
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
                                theme_color: "#000000",
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

    // Prepare the writable area
    const inputWidth = input.offsetWidth - 2 * inputPadding - 18;

    // Context ready
    if (canvas.getContext) {
        let ctx = canvas.getContext("2d");
        ctx.font = `${fontSize}px Oswald`;

        (async () => {
            const banner = await loadImage("./banner.png");
            const footer = await loadImage("./footer.png");
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
                        if (segmentLength.width >= inputWidth) {
                            lines.push(segmentText);
                            j = i + 1;
                        }
                    }
                    lines.push(line.substring(j));
                });

                const newInputHeight = inputHeight + (lines.length - 1) * lineHeight;
                const newCanvasHeight = canvasHeight + (newInputHeight > startStretch ? newInputHeight - startStretch : 0);
                const marginTop = inputTop + lineHeight - 8;

                canvas.style.height = `${newCanvasHeight}px`;
                input.style.height = `${newInputHeight}px`;

                ctx.canvas.height = newCanvasHeight;
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, newCanvasHeight);
                ctx.drawImage(background, -610, -610);
                ctx.drawImage(banner, 0, 50);
                ctx.drawImage(footer, 0, newCanvasHeight - 200);

                ctx.fillStyle = "#000";
                ctx.font = `${fontSize}px Oswald`;
                lines.map((line, index) => {
                    ctx.fillText(line, inputLeft, marginTop + index * lineHeight);
                });
            });

            input.focus();
            input.dispatchEvent(new KeyboardEvent("keyup", { key: "" }));
        })();
    }
});
