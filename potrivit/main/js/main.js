/**
 * @copyright (c) 2024, Potrivit
 * @author    Mark Jivko (//markjivko.com)
 * @package   potrivit-ssg
 * @version   0.1.6
 * @license   //gnu.org/licenses/gpl-3.0.txt
 */
(() => {
    var pwa = () => {
        var getPath = relativePath => {
            if ("string" !== typeof relativePath) {
                relativePath = "";
            }
            return window.location.origin + "/potrivit" + (relativePath ? "/" + relativePath : "/");
        };
        var workers = () => {
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker
                    .register(getPath("pwa.js"), { scope: getPath(), useCache: true })
                    .then(() => {})
                    .catch(() => {});
            }
        };
        var manifest = () => {
            var linkObject = document.getElementById("pwa_manifest");
            if (null === linkObject) {
                return;
            }
            if (null !== linkObject.getAttribute("href")) {
                return;
            }
            var myDynamicManifest = {
                description: "WordPress Code Review | Potrivit v.0.1.6",
                short_name: "Potrivit",
                name: "Potrivit",
                theme_color: "#13d213",
                background_color: "#ffffff",
                dir: "ltr",
                lang: "en-US",
                start_url: getPath(),
                scope: getPath(),
                icons: [
                    { src: getPath("main/img/64.png"), sizes: "64x64", type: "image/png", purpose: "maskable any" },
                    { src: getPath("main/img/192.png"), sizes: "192x192", type: "image/png", purpose: "maskable any" },
                    { src: getPath("main/img/512.png"), sizes: "512x512", type: "image/png", purpose: "maskable any" }
                ],
                display: "fullscreen",
                orientation: "landscape"
            };
            var manifestURL = URL.createObjectURL(new Blob([JSON.stringify(myDynamicManifest)], { type: "application/json" }));
            linkObject.setAttribute("href", manifestURL);
        };
        workers();
        manifest();
    };
    var layout = () => {
        var copyToClipboard = textToCopy => {
            if (navigator.clipboard && window.isSecureContext) {
                return navigator.clipboard.writeText(textToCopy);
            }
            let textArea = document.createElement("textarea");
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                document.execCommand("copy") ? res() : rej();
                textArea.remove();
            });
        };
        document.querySelectorAll('[data-role="comp"]').forEach(item => {
            var percent = parseFloat(item.getAttribute("data-comp"));
            var text = item.innerHTML;
            item.removeAttribute("data-comp");
            isNaN(percent) && (percent = 99);
            percent = percent < 0 ? 0 : percent > 100 ? 100 : percent;
            item.innerHTML = `<span style="width:${100 - (percent > 80 ? 80 : percent)}%">${percent}%</span><div>${text}</div>`;
        });
        document.querySelectorAll('[data-role="search"]').forEach(item => {
            item.innerHTML =
                '<input type="text" autocomplete="off" id="search" placeholder="WordPress plugin slug name"/>' +
                '<label for="search"></label>' +
                '<div class="results"></div>';
            var objectInput = item.querySelector("input");
            var objectResults = item.querySelector(".results");
            var cache = {};
            var search = {
                perform: (data, string) => {
                    var results = {};
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].match(new RegExp(`.*?${string}.*`, "i"))) {
                            results[data[i]] = data[i].replace(new RegExp(`(${string})`, "i"), "<b>$1</b>");
                        }
                        if (Object.keys(results).length >= 5) {
                            break;
                        }
                    }
                    if (0 === Object.keys(results).length) {
                        return search.clear();
                    }
                    var resultString = "";
                    for (var pluginSlug in results) {
                        resultString += `<a rel="nofollow" href="/potrivit/plugin/${pluginSlug}">${results[pluginSlug]}</a>`;
                    }
                    objectResults.innerHTML = resultString;
                    if (!objectResults.classList.contains("active")) {
                        objectResults.classList.add("active");
                    }
                },
                clear: () => {
                    objectResults.innerHTML = "";
                    if (objectResults.classList.contains("active")) {
                        objectResults.classList.remove("active");
                    }
                }
            };
            item.addEventListener("keyup", function (e) {
                var string = objectInput.value.replace(/(?:[^\w\-]+|^\-)/g, "").toLowerCase();
                if (string.length >= 1) {
                    if ("undefined" !== typeof cache[string[0]]) {
                        search.perform(cache[string[0]], string);
                    } else {
                        fetch(`/potrivit/main/json/${string[0]}.json`)
                            .then(res => {
                                if (res.ok) {
                                    return res.json();
                                }
                                cache[string[0]] = [];
                            })
                            .then(json => {
                                if (Array.isArray(json)) {
                                    cache[string[0]] = json;
                                    search.perform(json, string);
                                }
                            })
                            .catch(err => {});
                    }
                } else {
                    search.clear();
                }
            });
        });
        document.querySelectorAll('[data-role="commits"]').forEach(item => {
            try {
                var stringSvg = `<svg width="778" height="128" viewBox="7 0 778 128" class="commits-svg"><g transform="translate(-8, 20)">`;
                var itemData = JSON.parse(
                    `${item.getAttribute("data-commits")}`.replace(/^\[(\d+)/g, '["$1"').replace(/\b(\d+):/g, '"$1":')
                );
                item.removeAttribute("data-commits");
                var timeStored = parseInt(
                    new Date(
                        `${itemData[0].replace(/\d{4}$/g, "")}-${itemData[0].replace(/^\d{4}|\d{2}$/g, "")}-${itemData[0].replace(
                            /^\d{6}/g,
                            ""
                        )}`
                    ).getTime() / 1000,
                    10
                );
                var timeStart = parseInt(new Date().getTime() / 1000, 10) - 364 * 86400;
                var dayIndex = parseInt((timeStart - timeStored) / 86400, 10) - (timeStart <= timeStored ? 1 : 0);
                var monthTexts = {};
                for (var week = 1; week <= 52; week++) {
                    stringSvg += `<g transform="translate(${(week - 1) * 16},0)">`;
                    for (var day = 1; day <= 7; day++) {
                        var dayCommits = 0;
                        var dayClass = "";
                        var dayDate = new Date(1000 * (timeStart + (day - 1 + 7 * (week - 1)) * 86400));
                        if (1 === dayDate.getDate() && week <= 48) {
                            monthTexts[new Intl.DateTimeFormat("en-US", { month: "short" }).format(dayDate)] = week * 15;
                        }
                        if ("undefined" !== typeof itemData[1][dayIndex]) {
                            dayCommits = itemData[1][dayIndex];
                            switch (true) {
                                case dayCommits > 4:
                                    dayClass = "a4";
                                    break;
                                case dayCommits > 2:
                                    dayClass = "a3";
                                    break;
                                case dayCommits > 1:
                                    dayClass = "a2";
                                    break;
                                case dayCommits > 0:
                                    dayClass = "a1";
                                    break;
                            }
                        }
                        stringSvg += `<rect width="11" height="11" x="${17 - week}" y="${15 * (day - 1)}" rx="2" ry="2"${
                            dayClass.length ? ' class="' + dayClass + '"' : ""
                        } data-count="${dayCommits}" data-date="${new Intl.DateTimeFormat("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }).format(dayDate)}"></rect>`;
                        dayIndex++;
                    }
                    stringSvg += "</g>";
                }
                for (var month in monthTexts) {
                    stringSvg += `<text x="${monthTexts[month]}" y="-8">${month}</text>`;
                }
                var stringInfo = "";
                for (var i = 0; i <= 4; i++) {
                    stringInfo += `<i class="a${i}"></i>`;
                }
                stringSvg += `</g></svg><div class="title-svg"></div><div class="info-svg">Less ${stringInfo} More</div>`;
                item.innerHTML = stringSvg;
                var svgTitle = item.querySelector(".title-svg");
                var listeners = {
                    mouseover: (item, e) => {
                        svgTitle.innerHTML = `<b>${item.getAttribute("data-count")} ${
                            1 === parseInt(item.getAttribute("data-count"), 10) ? "commit" : "commits"
                        }</b> on ${item.getAttribute("data-date")}`;
                        svgTitle.style.top = `${parseInt(e.offsetY / 16, 10) * 16}px`;
                        svgTitle.style.left = `${parseInt(e.offsetX / 16, 10) * 16}px`;
                        !svgTitle.classList.contains("active") && svgTitle.classList.add("active");
                    },
                    mouseout: e => {
                        svgTitle.classList.contains("active") && svgTitle.classList.remove("active");
                    }
                };
                item.querySelectorAll("rect").forEach(item => {
                    item.addEventListener("mouseover", e => {
                        listeners.mouseover(item, e);
                    });
                });
                item.addEventListener("mouseout", listeners.mouseout);
            } catch (e) {}
        });
        document.querySelectorAll('[data-role="radial"]').forEach(item => {
            var itemValue = item.getAttribute("data-radial-value");
            var itemMax = item.getAttribute("data-radial-max");
            var itemText = item.getAttribute("data-radial-text");
            var itemHue = item.getAttribute("data-radial-hue");
            itemValue = null === itemValue ? 0 : Math.abs(parseFloat(itemValue));
            itemMax = null === itemMax ? 10 : Math.abs(parseFloat(itemMax));
            if (0 === parseInt(itemMax, 10)) {
                itemMax = 1;
            }
            if (itemValue > itemMax) {
                itemValue = itemMax;
            }
            itemHue = null === itemHue ? 0 : parseInt(itemHue, 10);
            var svg = `<div><svg viewBox="25 25 50 50" width="0" style="filter:hue-rotate(${itemHue}deg)"><circle cx="50" cy="50" r="20" fill="#fff" stroke="#e0e0e0" stroke-width="1" /><circle class="svg-stroke" cx="50" cy="50" r="20" fill="none" stroke="#13d213" stroke-width="2" /></svg><span>${itemText}</span></div>`;
            item.innerHTML = `${svg}<span>${item.innerHTML}</span>`;
            window.setTimeout(() => {
                item.querySelector(".svg-stroke").setAttribute(
                    "style",
                    `stroke-dashoffset:${Math.round(125 * (1 - itemValue / itemMax))}`
                );
            }, 500);
        });
        document.querySelectorAll("[data-grade] h4").forEach(item => {
            item.addEventListener("click", function (e) {
                if (item.parentNode.classList.contains("coll")) {
                    item.parentNode.classList.remove("coll");
                } else {
                    item.parentNode.classList.add("coll");
                }
            });
        });
        document.querySelectorAll("h1").forEach(item => {
            item.setAttribute("title", item.innerText);
        });
        document.querySelectorAll('a[rel~="author"]').forEach(item => {
            var authorText = item.innerText;
            item.setAttribute("title", authorText);
            item.innerHTML =
                '<svg viewport="0 0 200 75" height="75" xmlns="http://www.w3.org/2000/svg">' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m23.55471,35.93202c21.9748,0.25001 22.09326,-1.06573 22.60838,-1.27272"></path>' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m54.40906,32.33779l-3.70922,8.50193c-1.35053,-0.08675 5.03268,-8.15608 8.99374,-9.60339c3.96106,-1.44731 -0.14073,8.51012 -1.87728,9.94172c-1.73655,1.4316 5.13081,-10.47494 9.34236,-11.00816c4.21155,-0.53322 -2.67638,5.34248 -2.90491,12.04582"></path>' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m80.7616,29.22868c-2.28523,-1.44731 -8.53152,1.21879 -11.12145,9.44561c-2.58993,8.22682 4.11341,0.76174 8.37917,-4.49428c4.26576,-5.25603 -3.80871,6.24629 -2.28523,9.36944"></path>' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m86.01763,28.23842c-3.04697,5.94159 -8.59667,20.71941 -5.56072,12.64493c3.03595,-8.07448 7.9983,-10.28353 10.43588,-12.49258c2.43758,-2.20905 -2.28523,0.68557 -2.13288,8.37917"></path>' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m91.65453,43.24475c1.67583,-9.29326 5.71307,-22.77611 12.72111,-31.84086c7.00804,-9.06474 3.96106,3.27549 2.9708,5.17985c-0.99027,1.90436 -3.35167,6.01777 -6.94871,8.85847"></path>' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m91.7307,42.86388c1.82818,-4.18959 2.43758,-9.21709 9.21709,-13.0258c6.77951,-3.80871 0,5.94159 -1.44731,7.31273c-1.44731,1.37114 -0.45705,0.60939 0.45705,8.68387"></path>' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m109.40314,28.54311c-5.48455,19.57679 -14.16842,39.68681 -17.67244,37.09688c-3.50402,-2.58993 3.04697,-14.39694 8.37917,-20.11001"></path>' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m115.64943,28.31459c-0.99027,2.6661 -2.05671,6.93186 -5.0275,15.61573"></path>' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m119.91519,29.15251c0,0 -2.74227,6.39864 -2.6661,12.26406c0.07617,5.86542 10.6644,-11.42614 9.67414,-12.26406c-0.99027,-0.83792 -0.76174,0.76174 -2.14973,-0.1301"></path>' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m134.00743,26.18171c-2.43758,2.28523 -5.56072,6.32247 -6.32247,13.6352c-0.76174,7.31273 -0.86377,-7.38891 8.45535,-9.36944c9.31912,-1.98053 -0.83792,6.77951 -1.75201,6.85569c-0.91409,0.07617 -0.76174,6.93186 1.44731,4.26576"></path>' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m145.86684,29.92399c-1.10503,-0.0325 -5.13212,2.90884 -5.51299,7.86017c-0.38087,4.95133 3.57588,3.94573 5.56072,2.3614c1.98484,-1.58432 5.3322,-8.15065 3.42784,-9.59796c-1.90436,-1.44731 0.68557,3.58019 -2.43758,4.34193c-3.12315,0.76174 2.1735,2.05772 4.63648,1.20254"></path>' +
                '<path stroke-linecap="round" stroke="#fff" fill="none" d="m157.18906,35.121c3.72843,-1.28951 14.37571,0.98044 22.76353,-0.1276"></path>' +
                "</svg>";
            item.querySelector("svg").setAttribute("alt", authorText);
        });
        document.querySelectorAll("aside").forEach(aside => {
            aside.innerHTML =
                '<div class="card badge">' +
                "<span>Get HTML Badge</span>" +
                '<img width="228" height="25" alt="Code review badge" src="./badge.svg"/>' +
                "<i>copy</i>" +
                "</div>" +
                aside.innerHTML;
            var badge = aside.querySelector(".card.badge");
            badge.addEventListener("click", function (e) {
                var url = document.head.querySelector("link[rel='canonical']").getAttribute("href");
                var title = badge.querySelector("span");
                if (null === title.getAttribute("title")) {
                    title.setAttribute("title", title.innerText);
                }
                if (title.innerText === title.getAttribute("title")) {
                    copyToClipboard(
                        `<a href="${url}">\n\t<img alt="Code Review" src="${url.replace(/\/+$/g, "")}/badge.svg"/>\n</a>`
                    );
                    title.innerText = "Copied to clipboard!";
                    window.setTimeout(() => {
                        title.innerText = title.getAttribute("title");
                    }, 2500);
                }
            });
        });
    };
    var prefetch = () => {
        var cache = [];
        var supports = feature => {
            var link = document.createElement("link");
            return (link.relList || {}).supports && link.relList.supports(feature);
        };
        var supportedPrefetchStrategy = supports("prefetch")
            ? url => {
                  return new Promise((resolve, reject) => {
                      var link = document.createElement("link");
                      link.rel = "prefetch";
                      link.href = url;
                      link.onload = resolve;
                      link.onerror = reject;
                      document.head.appendChild(link);
                  });
              }
            : url => {
                  return new Promise((resolve, reject) => {
                      const req = new XMLHttpRequest();
                      req.open("GET", url, (req.withCredentials = true));
                      req.onload = () => {
                          req.status === 200 ? resolve() : reject();
                      };
                      req.send();
                  });
              };
        var prefetcher = url => {
            var objUrl = new URL(url, window.location.href);
            var objConn = navigator.connection;
            if (window.location.host === objUrl.host) {
                if (!objConn || (!objConn.effectiveType.includes("2g") && !objConn.saveData)) {
                    cache.push(objUrl.href);
                    return supportedPrefetchStrategy(objUrl).then(
                        () => {
                            console && console.log("%cpotrivit", "color:purple", `# ${objUrl} prefetched`);
                        },
                        () => {
                            console && console.log("%cpotrivit", "color:purple", `# ${objUrl} not prefetched`);
                        }
                    );
                }
            }
        };
        var observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!cache.includes(entry.target.href) && entry.isIntersecting) {
                    prefetcher(entry.target.href);
                }
            });
        });
        window.setTimeout(
            () => {
                requestIdleCallback(
                    () => {
                        console && console.log("%cpotrivit", "color:purple", `# Initializing link prefetch observer...`);
                        Array.from(document.querySelectorAll("a"), link => {
                            observer.observe(link);
                        });
                    },
                    { timeout: 23 }
                );
            },
            "/" !== window.location.pathname ? 2000 : 5000
        );
    };
    pwa();
    layout();
    prefetch();
})();
