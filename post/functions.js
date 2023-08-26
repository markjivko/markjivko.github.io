document.addEventListener("DOMContentLoaded", function () {
    const holder = document.querySelector(".holder");
    const download = document.querySelector("button");
    const strechCheckbox = document.querySelector("input[name='stretch']");
    const canvas = document.querySelector('[data-role="output"]');
    const textarea = document.querySelector('[data-role="input"] textarea');
    const textareaHeight = textarea.offsetHeight;
    let canvasBkg = null;
    let canvasColor = null;
    let canvasHeight = null;
    let canvasWidth = null;
    let fontSize = null;
    let lineHeight = null;
    let textareaLeft = null;
    let textareaTop = null;
    let textareaPadding = null;
    let textareaStretch = strechCheckbox.checked;

    /**
     * Recalculate style
     */
    const recalculateStyle = () => {
        // Canvas dimensions
        const canvasStyle = window.getComputedStyle(canvas);
        canvasBkg = canvasStyle.backgroundColor;
        canvasColor = canvasStyle.color;
        canvasWidth = parseFloat(canvasStyle.width);
        canvasHeight = parseFloat(canvasStyle.height);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Textarea dimensions and style
        const textareaStyle = window.getComputedStyle(textarea);
        fontSize = parseFloat(textareaStyle.fontSize);
        lineHeight = parseFloat(textareaStyle.lineHeight);
        textareaLeft = parseFloat(textareaStyle.left);
        textareaTop = parseFloat(textareaStyle.top);
        textareaPadding = parseFloat(textareaStyle.paddingLeft);
    };
    recalculateStyle();

    // Change font size
    document.querySelector("body").addEventListener("keyup", e => {
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

            textarea.dispatchEvent(new KeyboardEvent("keyup", { key: "" }));
            textarea.style.fontSize = `${fontSize}px`;
            textarea.style.lineHeight = `${lineHeight}px`;
        }
    });

    /**
     * Load image
     *
     * @param {string} url URL
     * @return {Promise}
     */
    const loadImage = url =>
        new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = url;
        });

    /**
     * Get path
     *
     * @param {string} relativePath
     * @return {string}
     */
    const getPath = relativePath => {
        if ("string" !== typeof relativePath) {
            relativePath = "";
        }
        return window.location.origin + "/post/" + (relativePath ? relativePath : "");
    };

    // Register service worker
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register(getPath("pwa.js"), {
                scope: getPath(),
                useCache: true
            })
            .then(() => {})
            .catch(() => {});
    }

    // Add the manifest
    (() => {
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
                                        purpose: "maskable any"
                                    },
                                    {
                                        src: getPath("192.png"),
                                        sizes: "192x192",
                                        type: "image/png",
                                        purpose: "maskable any"
                                    },
                                    {
                                        src: getPath("512.png"),
                                        sizes: "512x512",
                                        type: "image/png",
                                        purpose: "maskable any"
                                    }
                                ],
                                display: "fullscreen",
                                orientation: "landscape"
                            })
                        ],
                        {
                            type: "application/json"
                        }
                    )
                )
            );
    })();

    // Download
    download.addEventListener("click", e => {
        const anchor = document.createElement("a");
        const selectedFormat = document.querySelector("[name='format']:checked");
        anchor.href = canvas.toDataURL("image/png");
        anchor.download = selectedFormat.getAttribute("title");
        anchor.click();
        anchor.remove();
    });

    // Draw on keyup
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.font = `${fontSize}px Oswald`;

        (async () => {
            const banner = await loadImage("./banner.png");
            const footer = await loadImage("./footer.png");
            const background = await loadImage("./background.svg");

            textarea.addEventListener("keyup", () => {
                ctx.font = `${fontSize}px Oswald`;
                const lines = [];
                const paragraphs = textarea.value.split("\n");
                const textareaWidth = textarea.offsetWidth - 2 * textareaPadding - 18;

                paragraphs.forEach(line => {
                    let j = 0;
                    for (let i = 0; i < line.length - 1; i++) {
                        const segmentText = line.substring(j, i + 1);
                        const segmentLength = ctx.measureText(segmentText);
                        if (segmentLength.width >= textareaWidth) {
                            lines.push(segmentText);
                            j = i + 1;
                        }
                    }
                    lines.push(line.substring(j));
                });

                const newTextareaHeight = textareaHeight + (lines.length - 1) * lineHeight;
                const newCanvasHeight = canvasHeight + (textareaStretch ? newTextareaHeight - 2 * lineHeight : 0);
                const marginTop = textareaTop + lineHeight - 8;

                canvas.height = newCanvasHeight;
                if (canvas.height != canvasHeight) {
                    canvas.style.height = `${newCanvasHeight}px`;
                } else {
                    canvas.style.height = null;
                }
                textarea.style.height = `${newTextareaHeight}px`;

                ctx.canvas.height = newCanvasHeight;
                ctx.fillStyle = canvasBkg;
                ctx.fillRect(0, 0, canvasWidth, newCanvasHeight);
                ctx.drawImage(background, -560, -560);
                ctx.drawImage(banner, 0, 50);
                ctx.drawImage(footer, canvasWidth - 960, newCanvasHeight - 200);

                ctx.fillStyle = canvasColor;
                ctx.strokeStyle = canvasBkg;
                ctx.lineWidth = 6;
                ctx.font = `${fontSize}px Oswald`;
                lines.map((line, index) => {
                    ctx.strokeText(line, textareaLeft, marginTop + index * lineHeight);
                    ctx.fillText(line, textareaLeft, marginTop + index * lineHeight);
                });
            });

            textarea.focus();
            textarea.dispatchEvent(new KeyboardEvent("keyup", { key: "" }));
        })();
    }

    /**
     * Re-calculate style and update canvas
     */
    const reRender = () => {
        canvas.style.height = null;
        window.setTimeout(() => {
            recalculateStyle();
            textarea.focus();
            textarea.dispatchEvent(new KeyboardEvent("keyup", { key: "" }));
        }, 50);
    };

    // Format change
    for (const radioElement of [...document.querySelectorAll(".formats input")]) {
        radioElement.addEventListener("change", e => {
            holder.setAttribute("data-format", e.target.value);
            window.setTimeout(reRender, 100);
        });
    }
    strechCheckbox.addEventListener("change", e => {
        textareaStretch = e.target.checked;
        window.setTimeout(reRender, 100);
    });
});
