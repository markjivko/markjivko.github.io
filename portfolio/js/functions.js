/**
 * Portfolio
 * 
 * @title      Portfolio
 * @desc       Portfolio functionality
 * @copyright  (c) 2021, Mark Jivko
 * @author     Mark Jivko <stephino.team@gmail.com>
 * @package    markjivko.com
 * @license    GPL v3+, https://gnu.org/licenses/gpl-3.0.txt
 */                
$(document).ready(() => {
    const options = {
        authorEmail: 'stephino.team@gmail.com',
        authorName: 'Jivko',
        startYear: 2008,
        githubUrl: 'https://github.com/Stephino/',
        themes: ['blue', 'orange', 'red', 'green', 'black'],
        areas: {
            'php': 'PHP', 
            'back-end': 'Back-end', 
            'js': 'JS', 
            'front-end': 'Front-end', 
            'java': 'Java', 
            'android': 'Android', 
            'desktop': 'Desktop'
        },
        soundSprite: {
            'php': [0, 100],
            'java': [220, 100],
            'js': [420, 200],
            'front-end': [520, 200],
            'back-end': [900, 200],
            'android': [1400, 300],
            'desktop': [2000, 150],
            'all': [0, 15000]
        },
        frameHeight: 450, // vh
        itemWidth: 200, // px
        itemsInCell: 3
    };
    
    var global = {
        data: {
            ready: false,
            scrollOk: false
        },
        
        // jQuery objects
        objects : {
            howler: null,
            howlerAllId: null,
            howlerButton: null,
            howlerVolume: 1,
            frameHero: $('[data-frame="hero"]'),
            frame1: $('[data-frame="1"]'),
            frame2: $('[data-frame="2"]'),
            frame3: $('[data-frame="3"]'),
            frame4: $('[data-frame="4"]'),
            frame5: $('[data-frame="5"]'),
            frame6: $('[data-frame="6"]'),
            frame7: $('[data-frame="7"]'),
            frame8: $('[data-frame="8"]'),
            frame9: $('[data-frame="9"]'),
            frameN: $('[data-frame="final"]'),
            banner: $('[data-effect="banner"]'),
            loading: $('[data-role="loading"]'),
            scrollDown: $('[data-role="scroll-down"]'),
            years: $('[data-effect="years"]'),
            projectsTotal: 0,
            projects: {},
            projectProgress: {},
            projectTools: {},
            projectYears: {},
            projectManHours: {},
            projectToolCount: {},
            projectToolLastId: {},
            levelUp: null,
            levelUpCache: {
                cells: {},
                coords: {}
            },
            techStack: $('[data-effect="tech-stack"]'),
            techStackList: null,
            smallDevice: Math.min($(window).width(), $(window).height()) <= 360
        },
        
        // Timers (integers, created with window.setTimeout)
        timers: {
            years: null,
            techStack: null,
            sprite: null
        },
        
        // Common methods
        methods: {
            loadSprite: () => {
                if (!global.data.ready) {
                    window.setTimeout(() => {
                        $('<img>').on('load', () => {
                            // Mark the document as ready
                            global.data.ready = true;
                            $('body').addClass('ready');

                            // Enter the first frame
                            global.methods.setActive(global.objects.frameHero);
                            window.setTimeout(() => {
                                global.objects.loading.remove();
                            }, 800);
                            window.setTimeout(() => {
                               global.methods.yearsStart(); 
                            }, 1500);
                            window.setTimeout(() => {
                               global.methods.hideScroll();
                            }, 7500);
                        }).attr('src', './portfolio/img/profile.png');
                    }, 500);
                }
            },
            initHtml: () => {
                // Loading
                global.objects.loading.append(
                    '<div><div></div><div></div></div>'
                    + '<svg preserveAspectRatio="none" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">'
                        + '<path d="m-10,501.5l519,-62.5l-520,-37l516,-53l-513,-43l515,-39l-514,-48l514,-45l-513,-48l514,-36l-518,-60l518,-32" fill="none"/>'
                    + '</svg>'
                );
                
                // Totals
                global.objects.projectsTotal = document.querySelectorAll('[data-role="project"]').length;
                $('[data-total="projects"]').html(global.objects.projectsTotal);
                $('[data-total="hours"]').html(
                    Array.from(document.querySelectorAll('[data-role="project"]')).reduce(
                        (result, item) => result + parseInt(item.getAttribute('data-man-hours'), 10), 
                        0
                    )
                );
                
                // Set the theme from storage
                $('body').attr('data-theme', options.themes["undefined" === typeof localStorage.themeId ? 0 : localStorage.themeId]);
            
                // Signature
                $('[data-effect="sign"]').html(
                    `<svg viewport="0 0 200 75" height="75" xmlns="http://www.w3.org/2000/svg">
                        ${[
                            '23.55471,35.93202c21.9748,0.25001 22.09326,-1.06573 22.60838,-1.27272',
                            '54.40906,32.33779l-3.70922,8.50193c-1.35053,-0.08675 5.03268,-8.15608 8.99374,-9.60339c3.96106,-1.44731 -0.14073,8.51012 -1.87728,9.94172c-1.73655,1.4316 5.13081,-10.47494 9.34236,-11.00816c4.21155,-0.53322 -2.67638,5.34248 -2.90491,12.04582',
                            '80.7616,29.22868c-2.28523,-1.44731 -8.53152,1.21879 -11.12145,9.44561c-2.58993,8.22682 4.11341,0.76174 8.37917,-4.49428c4.26576,-5.25603 -3.80871,6.24629 -2.28523,9.36944',
                            '86.01763,28.23842c-3.04697,5.94159 -8.59667,20.71941 -5.56072,12.64493c3.03595,-8.07448 7.9983,-10.28353 10.43588,-12.49258c2.43758,-2.20905 -2.28523,0.68557 -2.13288,8.37917',
                            '91.65453,43.24475c1.67583,-9.29326 5.71307,-22.77611 12.72111,-31.84086c7.00804,-9.06474 3.96106,3.27549 2.9708,5.17985c-0.99027,1.90436 -3.35167,6.01777 -6.94871,8.85847',
                            '91.7307,42.86388c1.82818,-4.18959 2.43758,-9.21709 9.21709,-13.0258c6.77951,-3.80871 0,5.94159 -1.44731,7.31273c-1.44731,1.37114 -0.45705,0.60939 0.45705,8.68387',
                            '109.40314,28.54311c-5.48455,19.57679 -14.16842,39.68681 -17.67244,37.09688c-3.50402,-2.58993 3.04697,-14.39694 8.37917,-20.11001',
                            '115.64943,28.31459c-0.99027,2.6661 -2.05671,6.93186 -5.0275,15.61573',
                            '119.91519,29.15251c0,0 -2.74227,6.39864 -2.6661,12.26406c0.07617,5.86542 10.6644,-11.42614 9.67414,-12.26406c-0.99027,-0.83792 -0.76174,0.76174 -2.14973,-0.1301',
                            '134.00743,26.18171c-2.43758,2.28523 -5.56072,6.32247 -6.32247,13.6352c-0.76174,7.31273 -0.86377,-7.38891 8.45535,-9.36944c9.31912,-1.98053 -0.83792,6.77951 -1.75201,6.85569c-0.91409,0.07617 -0.76174,6.93186 1.44731,4.26576',
                            '145.86684,29.92399c-1.10503,-0.0325 -5.13212,2.90884 -5.51299,7.86017c-0.38087,4.95133 3.57588,3.94573 5.56072,2.3614c1.98484,-1.58432 5.3322,-8.15065 3.42784,-9.59796c-1.90436,-1.44731 0.68557,3.58019 -2.43758,4.34193c-3.12315,0.76174 2.1735,2.05772 4.63648,1.20254',
                            '157.18906,35.121c3.72843,-1.28951 14.37571,0.98044 22.76353,-0.1276'
                        ].map(path => `<path stroke-linecap="round" stroke="#000" fill="none" d="m${path}"/>`).join('')}
                    </svg>`
                );
        
                // Ribbons
                $('[data-effect="ribbon"]').append(
                    '<svg preserveAspectRatio="none" height="0" viewBox="0 0 800 100" xmlns="http://www.w3.org/2000/svg">'
                        + '<path fill="#ffffff" d="m-19,36.93885c55,-6.32141 61,-29.0785 97,-28.44636c36,0.63214 51,24.02137 115,25.9178c64,1.89642 77,-5.68927 132,-4.42499c55,1.26428 91,22.12495 127,32.87135c36,10.7464 96,-5.05713 120,-12.01069c24,-6.95356 76,-6.32141 107,3.16071c31,9.48212 75,20.86067 115,16.43568c40,-4.42499 80,26.54994 81,56.26059c1,29.71065 -1,32.87135 -52,34.76778c-51,1.89642 -88,-29.71065 -156,-1.26428c-68,28.44636 -171,8.84998 -230,1.89642c-59,-6.95356 -58,-5.68927 -139,-6.32141c-81,-0.63214 -155,17.06782 -199,1.89642c-44,-15.17139 -46,-15.80354 -85,-19.59638c-39,-3.79285 -102,11.37855 -74,-27.18208c28,-38.56063 30,-15.80354 11,-36.6642c-19,-20.86067 -25,-30.97493 30,-37.29634z" />'
                    + '</svg>'
                );
        
                // Title
                $('[data-role="title"]').html(
                    `<span>
                        ${$('[data-role="title"]').text()}
                        <svg preserveAspectRatio="none" viewBox="0 0 200 20" width="200" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke="none" fill="none" d="m6.12937,4.69886c103.61297,0.75814 159.01219,14.38714 188.03333,4.79669"/>
                            <path stroke-linecap="round" stroke="none" fill="none" d="m194.16074,9.24381c-100.83996,-6.06612 -115.40888,5.05625 -174.93517,4.54886"/>
                        </svg>
                    </span>`
                );
        
                // Banner
                global.objects.banner.html(
                    $(
                        `<div>
                            ${global.objects.banner.text()}
                            <a class="button" href="mailto:${options.authorEmail}?subject=Hello, ${options.authorName}!">Let's talk</a>
                        </div>`
                    ).click(() => {
                        // Get the theme ID from storage
                        var themeId = parseInt(localStorage.themeId, 10);
                        themeId = isNaN(themeId) ? 1 : themeId + 1;

                        // Save the new ID
                        localStorage.themeId = themeId >= options.themes.length ? 0 : themeId;

                        // Update the theme
                        $('body').attr('data-theme', options.themes[localStorage.themeId]);
                    })
                );
                global.objects.banner.find('a').click((e) => {e.stopPropagation();});
                
                // Background box
                $('[data-effect="bkg-box"]').html('<div></div>'.repeat(4));
                
                // Tech stack
                global.objects.techStackList = $(
                    `<div>
                        ${Object.keys(options.areas).map(
                            skill => `<span data-skill="${skill}">${options.areas[skill]}</span> `
                        ).join('').repeat(3)}
                    </div>`
                );
                global.objects.techStack.append(global.objects.techStackList);
                
                // Level-up
                $('[data-role="level-up"]').html(
                    `<div style="height:${$('[data-frame].project').length * options.frameHeight + 100}vh;"><span></span></div>`
                );
                global.objects.levelUp = $('[data-role="level-up"]').find('span');
                global.objects.howlerButton = $(`<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                    <path d="m71.22399,76.84964l0,1.641a1.75,1.75 0 0 1 -3.5,0l0,-1.641a1.75,1.75 0 0 1 3.5,0zm0,-47.649l0,34.958a1.75,1.75 0 0 1 -3.5,0l0,-34.958a1.451,1.451 0 0 0 -2.359,-1.133c-0.027,0.021 -0.054,0.042 -0.082,0.061l-22.451,15.909l0,40.242l22.451,15.909c0.028,0.019 0.055,0.04 0.082,0.061a1.451,1.451 0 0 0 2.359,-1.133l0,-8.113a1.75,1.75 0 0 1 3.5,0l0,8.113a4.945,4.945 0 0 1 -8,3.9l-22.7,-16.083l-18.211,0a4.756,4.756 0 0 1 -4.75,-4.75l0,-36.051a4.756,4.756 0 0 1 4.75,-4.75l18.212,0l22.7,-16.083a4.952,4.952 0 0 1 8,3.9l-0.001,0.001zm-48.911,54.234l17.019,0l0,-38.552l-17.019,0a1.251,1.251 0 0 0 -1.25,1.25l0,36.052a1.251,1.251 0 0 0 1.25,1.25z"/>
                    <path d="m73.08348,78.19048zm10.396,-35.063a1.749,1.749 0 0 0 0,2.475a25.85,25.85 0 0 1 0,36.512a1.75,1.75 0 1 0 2.474,2.475a29.351,29.351 0 0 0 0,-41.462a1.748,1.748 0 0 0 -2.474,0zm15.471,-13a1.75,1.75 0 1 0 -2.478,2.477a44.2,44.2 0 0 1 0,62.508a1.75,1.75 0 1 0 2.474,2.475a47.7,47.7 0 0 0 0,-67.458l0.004,-0.002z"/>
                </svg>`).click(() => {
                    var muted = global.objects.levelUp.hasClass('muted');
                    global.objects.levelUp.toggleClass('muted')
                    global.objects.howlerVolume = muted ? 1 : 0;
                    null !== global.objects.howler && global.objects.howler.volume(muted ? 1 : 0);
                    localStorage.setItem('muted', muted ? '' : '1');
                });
                global.objects.levelUp.append('<i></i>'.repeat(7)).append(global.objects.howlerButton);
                '1' === localStorage.getItem('muted') && global.objects.howlerButton.click();
                
                // Copyright years
                if (new Date().getFullYear() > 2021) {
                    $('[data-role="year"]').html(`2021 - ${new Date().getFullYear()}`);
                }
                
                // Up
                $('[data-role="go-up"]').click(() => {
                    global.objects.frameHero[0].scrollIntoView({behavior: "smooth", block: "start"});
                });
                
                // Legend
                $('[data-role="colors"]').html(
                    `<span>Legend</span>
                    <div>
                        ${Object.keys(options.areas).map(
                            skill => `<span data-skill="${skill}">${options.areas[skill]}</span> `
                        ).join('')}
                    </div>`
                );
            },
            setActive: (frame, active, howlerStop) => {
                if ("undefined" === typeof active) {
                    active = true;
                }
                if ("undefined" === typeof howlerStop) {
                    howlerStop = true;
                }
                
                if (active) {
                    if (howlerStop && null !== global.objects.howlerAllId) {
                        global.objects.howler.stop(global.objects.howlerAllId);
                        global.objects.howlerAllId = null;
                    }
                    
                    !$(frame).hasClass('active') && $(frame).addClass('active');
                } else {
                    $(frame).hasClass('active') && $(frame).removeClass('active');
                }
            },
            hideScroll: () => {
                if (!global.data.scrollOk) {
                    global.data.scrollOk = true;
                    global.objects.scrollDown.addClass('ok');
                    window.setTimeout(() => global.objects.scrollDown.remove(), 1000);
                }
            },
            yearsStart: () => {
                var startYear = parseInt(global.objects.years.attr('data-start'), 10);
                var stateMachine = {
                    end: (new Date()).getFullYear() - (isNaN(startYear) ? options.startYear : startYear),
                    current: 1,
                    next: () => {
                        // Show the letter
                        window.setTimeout(() => {
                            global.objects.years.html(`<span>${stateMachine.current}</span>`);
                            
                            // Register the next tick
                            stateMachine.current++;
                            if (stateMachine.current <= stateMachine.end) {
                                global.timers.years = window.setTimeout(stateMachine.next, 100);
                            } else {
                                global.methods.yearsStop();
                            }
                        }, 50);
                    }
                };
                
                global.objects.years.addClass('active');
                stateMachine.next();
            },
            yearsStop: () => {
                if (null !== global.timers.years) {
                    var startYear = parseInt(global.objects.years.attr('data-start'), 10);
                    window.clearTimeout(global.timers.years);
                    global.timers.years = null;
                    
                    global.objects.years.hasClass('active') && global.objects.years.removeClass('active');
                    global.objects.years.html(`<span>${(new Date()).getFullYear() - (isNaN(startYear) ? options.startYear : startYear)}</span>`);
                }
            },
            levelUp: (area, append) => {
                if ("undefined" !== typeof options.areas[area]) {
                    append = "undefined" === typeof append ? true : !!append;
                    
                    // Get the x,y coordinates, clustered around the center
                    var getCoord = {
                        x: () => {
                            var m, n, seed = Math.round(1.5 * Math.floor(Math.random() * 80) + 10);
                            (seed > 90) && (seed = 90);

                            if (Math.random() >= 0.5) {
                                m = 80/3;
                                n = -50/3;
                            } else {
                                m = -20;
                                n = 170;
                            }

                            return Math.round((seed - n) / m);
                        },
                        y: () => {
                            var m, n, seed = Math.round(1.5 * Math.floor(Math.random() * 80) + 10);
                            (seed > 90) && (seed = 90);

                            if (Math.random() >= 0.5) {
                                m = 80/7;
                                n = -10/7;
                            } else {
                                m = -10;
                                n = 170;
                            }

                            return Math.round((seed - n) / m);
                        }
                    };
                        
                    // Intialize the cells cache
                    if ("undefined" === typeof global.objects.levelUpCache.cells[area]) {
                        global.objects.levelUpCache.cells[area] = [];
                    }
                    
                    if (append) {
                        var tries = 0;
                        do {
                            var coordKey = `${getCoord.y()}/${getCoord.x()}`;
                            if ("undefined" === typeof global.objects.levelUpCache.coords[coordKey]) {
                                global.objects.levelUpCache.coords[coordKey] = {
                                    area: area,
                                    count: 0
                                };
                            }
                            
                            // Don't overlap other areas; maximum N items per grid cell
                            if (area === global.objects.levelUpCache.coords[coordKey].area
                                && global.objects.levelUpCache.coords[coordKey].count < options.itemsInCell) {
                                var cellObject = $(`<div data-area="${area}" data-coord="${coordKey}"><i></i></div>`).css({
                                    'grid-area': `${coordKey}/auto/auto`
                                });
                                global.objects.levelUpCache.cells[area].push(cellObject);
                                global.objects.levelUp.append(cellObject);
                                global.objects.levelUpCache.coords[coordKey].count++;
                                break;
                            }
                            
                            // Prevent infinite loops
                            if (++tries >= 128) {
                                break;
                            }
                        } while(true);
                    } else {
                        // Remove the object from the DOM and memory
                        if (global.objects.levelUpCache.cells[area].length > 0) {
                            var cellObject = global.objects.levelUpCache.cells[area].pop();
                            var coordKey = cellObject.attr('data-coord');
                            cellObject.remove();
                            
                            if (global.objects.levelUpCache.coords[coordKey].count > 0) {
                                // Update the count
                                global.objects.levelUpCache.coords[coordKey].count--;

                                // Reset the area
                                if (global.objects.levelUpCache.coords[coordKey].count <= 0) {
                                    delete global.objects.levelUpCache.coords[coordKey];
                                }
                            }
                        }
                        
                    }
                }
            },
            play: (sprite) => {
                if ("undefined" !== typeof options.soundSprite[sprite]) {
                    global.objects.howler.play(sprite);
                    
                    if ('all' !== sprite) {
                        if (null !== global.timers.sprite) {
                            window.clearTimeout(global.timers.sprite);
                        }

                        global.timers.sprite = window.setTimeout(() => {
                            global.objects.howler.stop();
                            global.timers.sprite = null;
                        }, options.soundSprite[sprite][1]);
                    }
                }
            },
            levelUpReset: () => {
                global.objects.levelUp.children('div').remove();
                global.objects.levelUpCache = {
                    cells: {},
                    coords: {}
                };
            },
            levelUpToggle: (on, className) => {
                on = "undefined" === typeof on ? true : !!on;
                className = "string" !== typeof className ? 'active' : className;
                
                if (on) {
                    'active' === className && global.objects.banner.find('a').attr('disabled', 'disabled');
                    !global.objects.levelUp.hasClass(className) && global.objects.levelUp.addClass(className);
                } else {
                    'active' === className && global.objects.banner.find('a').removeAttr('disabled');
                    global.objects.levelUp.hasClass(className) && global.objects.levelUp.removeClass(className);
                }
            },
            projectPrepare: (frame) => {
                var projectKey = frame.attr('data-frame');
                
                // Cache miss
                if ("undefined" === typeof global.objects.projects[projectKey]) {
                    // Initialize the sound on the first audio frame
                    if ("1" === projectKey) {
                        global.objects.howler = new Howl({
                            src: ['./portfolio/audio/sound.webm', './portfolio/audio/sound.mp3'],
                            sprite: options.soundSprite,
                            volume: global.objects.howlerVolume
                        });
                    }
                    
                    // Prepare the update points
                    global.objects.projectProgress[projectKey] = {
                        manHours: 0
                    };
                    
                    // Store the project object
                    global.objects.projects[projectKey] = frame.find('[data-role="project"]');
                    
                    // Get the project data
                    var projectData = {
                        year: global.objects.projects[projectKey].attr('data-year'),
                        title: global.objects.projects[projectKey].attr('data-title'),
                        urlSource: global.objects.projects[projectKey].attr('data-url-source'),
                        urlDemo: global.objects.projects[projectKey].attr('data-url-demo'),
                        labelSource: global.objects.projects[projectKey].attr('data-label-source'),
                        labelDemo: global.objects.projects[projectKey].attr('data-label-demo'),
                        manHours: global.objects.projects[projectKey].attr('data-man-hours')
                    };
                    
                    // Nullish coallescing operator (??) not there yet
                    "string" !== typeof projectData.year && (projectData.year = `${options.startYear}`);
                    "string" !== typeof projectData.title && (projectData.title = 'Unknown');
                    "string" !== typeof projectData.urlSource && (projectData.urlSource = options.githubUrl);
                    "string" !== typeof projectData.urlDemo && (projectData.urlDemo = '/');
                    "string" !== typeof projectData.labelSource && (projectData.labelSource = 'Repository');
                    "string" !== typeof projectData.labelDemo && (projectData.labelDemo = 'Demo');
                    "string" !== typeof projectData.manHours && (projectData.manHours = 1000);
                    
                    // Store the description
                    var projectParagraph = global.objects.projects[projectKey].find('p');
                    global.objects.projects[projectKey].data(
                        'desc', 
                        projectParagraph.length 
                            ? projectParagraph.html()
                            : '...'
                    );
                    projectParagraph.length && projectParagraph.remove();
                    
                    // Year
                    global.objects.projectYears[projectKey] = $(`<div data-role="p-year"><div>${projectData.year}</div></div>`);
                    global.objects.projects[projectKey].parents('section').append(
                        global.objects.projectYears[projectKey]
                    );
            
                    // Title
                    global.objects.projects[projectKey].append(
                        `<div data-role="p-title">
                            <i>${Object.keys(global.objects.projects).length}/${global.objects.projectsTotal}</i>
                            ${projectData.title}
                            <span>- ${projectData.year} -</span>
                        </div>`
                    );
            
                    // Description
                    global.objects.projects[projectKey].append(
                        $('<div data-role="p-desc"></div>').html(global.objects.projects[projectKey].data('desc'))
                    );
            
                    // Buttons
                    global.objects.projects[projectKey].append(
                        '<div data-role="p-action">'
                            + (
                                projectData.urlSource.length 
                                    ? `<a rel="noreferrer" target="_blank" href="${projectData.urlSource}">${projectData.labelSource}</a>` 
                                    : ''
                            )
                            + (
                                projectData.urlDemo.length 
                                    ? `<a rel="noreferrer" target="_blank" href="${projectData.urlDemo}">${projectData.labelDemo}</a>` 
                                    : ''
                            )
                        + '</div>'
                    );
                    
                    // Tools
                    global.objects.projectTools[projectKey] = global.objects.projects[projectKey].find('[data-role="tools"]');
                    global.objects.projectToolCount[projectKey] = global.objects.projectTools[projectKey].children().length;
                    $.each(global.objects.projectTools[projectKey].children(), function(key, item) {
                        var itemObject = $(item);
                        var itemText = itemObject.html();
                        var itemTitleMatch = itemText.match(/^(.*?)\:/s);
                        
                        if (null !== itemTitleMatch) {
                            var itemDescription = itemText.replace(/^.*?\:/s, '').trim();
                            itemObject.data('desc', itemDescription).html(itemTitleMatch[1]);
                        }
                    });
                    
                    // Man-hours
                    var manHours = $(
                        `<div data-role="p-man-hours">
                            ${'<div></div>'.repeat(global.objects.projectTools[projectKey].children().length)}
                            <i><b></b></i>
                            <p>
                                ~<span>${projectData.manHours}</span> man-hours
                            </p>
                        </div>`
                    );
                    global.objects.projectManHours[projectKey] = {
                        progress: manHours.find('b'),
                        label: manHours.find('span'),
                        value: parseInt(projectData.manHours, 10)
                    };
                    global.objects.projects[projectKey].append(manHours);
                }
            },
            projectShowInfo: (frame, item) => {
                var projectKey = frame.attr('data-frame');
                var projectYear = global.objects.projects[projectKey].attr('data-year');
                "string" !== typeof projectYear && (projectYear = `${options.startYear}`);
                
                var itemArea = "undefined" !== typeof item ? item.attr('data-area') : '';
                global.objects.projects[projectKey].find('[data-role="p-title"] > span')
                    .html(
                        "undefined" === typeof item
                            ? `- ${projectYear} -`
                            : (`<i>${item.text()} ${("undefined" !== typeof options.areas[itemArea] ? ` (${options.areas[itemArea]})</i>` : '')}`)
                    );
                global.objects.projects[projectKey].find('[data-role="p-desc"]')
                    .html(
                        "undefined" === typeof item
                            ? global.objects.projects[projectKey].data('desc')
                            : item.data('desc')
                    );
                global.objects.projects[projectKey].attr('data-p-area', "undefined" === typeof item ? '' : itemArea);
            },
            projectRun: (frame, coords) => {
                var projectKey = frame.attr('data-frame');
                
                // Cache hit
                if ("undefined" !== typeof global.objects.projects[projectKey]) {
                    if (coords.frameTop <= 0) {
                        if (!global.objects.smallDevice) {
                            global.objects.projectTools[projectKey].css({
                                transform: `translateX(${coords.frameTop}px)`
                            });
                            global.objects.projectYears[projectKey].css({
                                transform: `translateX(${Math.round(coords.frameTop/2)}px)`
                            });
                        }
                        
                        // Man-hours
                        var manHoursProgress = Math.round(-1.5 * coords.frameTop / coords.frameHeight * 100);
                        manHoursProgress >= 100 && (manHoursProgress = 100);

                        // Update the man-hours in 1% steps
                        if (manHoursProgress !== global.objects.projectProgress[projectKey].manHours) {
                            global.objects.projectProgress[projectKey].manHours = manHoursProgress;
                            global.objects.projectManHours[projectKey].progress.css({
                                transform: `translateX(${manHoursProgress}%)`
                            });

                            // Fewer updates for small devices
                            if (!global.objects.smallDevice) {
                                global.objects.projectManHours[projectKey].label.html(
                                    Math.round(global.objects.projectManHours[projectKey].value * manHoursProgress / 100)
                                );
                            }
                        }
                        
                        // Calculate space width between items
                        var space = ((coords.frameHeight * 3 / 4) - global.objects.projectToolCount[projectKey] * options.itemWidth) / (global.objects.projectToolCount[projectKey] + 1);
                        
                        // Get the currently active item ID
                        var itemId = Math.abs(-Math.floor((coords.frameTop + space) / (space + options.itemWidth)));

                        // Valid ID
                        if (itemId >= 0 && itemId <= global.objects.projectToolCount[projectKey]) {
                            if ("undefined" === typeof global.objects.projectToolLastId[projectKey]
                                || itemId !== global.objects.projectToolLastId[projectKey]) {
                                global.objects.projectToolLastId[projectKey] = itemId;
                                
                                if (0 === itemId) {
                                    global.methods.projectShowInfo(frame);
                                }
                                
                                $.each(global.objects.projectTools[projectKey].children(), (key, item) => {
                                    var itemObject = $(item);
                                    
                                    if (key < itemId) {
                                        if (!itemObject.hasClass('active')) {
                                            itemObject.addClass('active');
                                            
                                            // Random between 2 and 4
                                            var repeats = Math.round(Math.random()) + 2;
                                            itemObject.data('repeats', repeats);
                                            global.methods.play(itemObject.attr('data-area'));
                                            
                                            while (repeats --> 0) {
                                                global.methods.levelUp(itemObject.attr('data-area'));
                                            }
                                        }
                                        if (key === itemId - 1) {
                                            global.methods.projectShowInfo(frame, itemObject);
                                        }
                                    } else {
                                        if (itemObject.hasClass('active')) {
                                            itemObject.removeClass('active');
                                            var repeats = itemObject.data('repeats');

                                            while (repeats --> 0) {
                                                global.methods.levelUp(itemObject.attr('data-area'), false);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    };
    
    // Initialize the StoryLine
    $.storyline({
        frames: {
            '[data-frame="hero"]': {
                onEnter: () => {
                    if (global.data.ready) {
                        global.methods.setActive(global.objects.frameHero);
                        global.methods.yearsStart();
                        global.methods.levelUpReset();
                    }
                    global.methods.levelUpToggle(false);
                },
                onLeave: () => {
                    global.methods.yearsStop();
                    global.methods.levelUpToggle();
                }
            },
            '[data-frame="1"]': {
                onEnter: () => {
                    global.methods.hideScroll();
                    global.methods.setActive(global.objects.frame1);
                    global.methods.projectPrepare(global.objects.frame1);
                },
                onLeave: () => {
                    global.methods.setActive(global.objects.frame1, false);
                },
                onActive: (coords) => {
                    global.methods.projectRun(global.objects.frame1, coords);
                }
            },
            '[data-frame="2"]': {
                onEnter: () => {
                    global.methods.setActive(global.objects.frame2);
                    global.methods.projectPrepare(global.objects.frame2);
                },
                onLeave: () => {
                    global.methods.setActive(global.objects.frame2, false);
                },
                onActive: (coords) => {
                    global.methods.projectRun(global.objects.frame2, coords);
                }
            },
            '[data-frame="3"]': {
                onEnter: () => {
                    global.methods.setActive(global.objects.frame3);
                    global.methods.projectPrepare(global.objects.frame3);
                },
                onLeave: () => {
                    global.methods.setActive(global.objects.frame3, false);
                },
                onActive: (coords) => {
                    global.methods.projectRun(global.objects.frame3, coords);
                }
            },
            '[data-frame="4"]': {
                onEnter: () => {
                    global.methods.setActive(global.objects.frame4);
                    global.methods.projectPrepare(global.objects.frame4);
                },
                onLeave: () => {
                    global.methods.setActive(global.objects.frame4, false);
                },
                onActive: (coords) => {
                    global.methods.projectRun(global.objects.frame4, coords);
                }
            },
            '[data-frame="5"]': {
                onEnter: () => {
                    global.methods.setActive(global.objects.frame5);
                    global.methods.projectPrepare(global.objects.frame5);
                },
                onLeave: () => {
                    global.methods.setActive(global.objects.frame5, false);
                },
                onActive: (coords) => {
                    global.methods.projectRun(global.objects.frame5, coords);
                }
            },
            '[data-frame="6"]': {
                onEnter: () => {
                    global.methods.setActive(global.objects.frame6);
                    global.methods.projectPrepare(global.objects.frame6);
                },
                onLeave: () => {
                    global.methods.setActive(global.objects.frame6, false);
                },
                onActive: (coords) => {
                    global.methods.projectRun(global.objects.frame6, coords);
                }
            },
            '[data-frame="7"]': {
                onEnter: () => {
                    global.methods.setActive(global.objects.frame7);
                    global.methods.projectPrepare(global.objects.frame7);
                },
                onLeave: () => {
                    global.methods.setActive(global.objects.frame7, false);
                },
                onActive: (coords) => {
                    global.methods.projectRun(global.objects.frame7, coords);
                }
            },
            '[data-frame="8"]': {
                onEnter: () => {
                    global.methods.setActive(global.objects.frame8);
                    global.methods.projectPrepare(global.objects.frame8);
                },
                onLeave: () => {
                    global.methods.setActive(global.objects.frame8, false);
                },
                onActive: (coords) => {
                    global.methods.projectRun(global.objects.frame8, coords);
                }
            },
            '[data-frame="9"]': {
                onEnter: () => {
                    global.methods.setActive(global.objects.frame9, true, false);
                    global.methods.projectPrepare(global.objects.frame9);
                },
                onLeave: () => {
                    global.methods.setActive(global.objects.frame9, false);
                },
                onActive: (coords) => {
                    global.methods.projectRun(global.objects.frame9, coords);
                }
            },
            '[data-frame="final"]': {
                onEnter: () => {
                    global.methods.setActive(global.objects.frameN);
                    
                    global.methods.levelUpToggle(true, 'final');
                    if (null === global.objects.howlerAllId) {
                        global.objects.howlerAllId = global.methods.play('all');
                    }
                },
                onLeave: () => {
                    global.methods.setActive(global.objects.frameN, false);
                    
                    global.methods.levelUpToggle(false, 'final');
                    if (null !== global.objects.howlerAllId) {
                        global.objects.howler.stop(global.objects.howlerAllId);
                        global.objects.howlerAllId = null;
                    }
                }
            }
        },
        logLevel: 'error'
    });
    
    // Initialize the HTML structure
    global.methods.initHtml();
    global.methods.loadSprite();
});

/*EOF*/