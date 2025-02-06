<p align="center">
    <a href="https://markjivko.com/storyline/">
        <img src="https://repository-images.githubusercontent.com/387865658/8abb374b-b1b6-40f3-9358-73c77143fef3"/>
    </a>
</p>

Storyline
=========

Build *beautiful* landing pages that change as the user scrolls up or down.

Project created in 2013 and ported to GitHub in 2021.

Demo
----
Just [visit this page](https://markjivko.com/storyline) for a short demo of the plugin and included console/debugger.

Getting started
---------------
Include the Storyline library
```HTML
<script defer src="https://markjivko.com/storyline/js/storyline.min.js"></script>
```

Define your frames
```JavaScript
$(document).ready(function(){
    $.storyline({
        frames: {
            'frameSelector': {
                onEnter: function(c,e){},
                onActive: function(c,e){},
                onLeave: function(c,e){},
                scrollIntoView: false
            }
        },
        // @see Options
    });
})
```

*  *'frameSelector'* - String; a selector for the target storyline frame.
*  *onEnter* - Function; called when the frame becomes visible.
*  *onActive* - Function; called while the frame is visible, on each scroll event.
*  *onLeave* - Function; called when the frame becomes invisible to the user.
*  *scrollIntoView* - Boolean; overrides the option with the same name; triggered 250ms after *onEnter* to perform a scrollIntoView action

You can add as many frame selectors as you wish. Each selector can point to 
either 1 HTML element (for instance, an *#id* selector) or to many HTML elements
(a *.class* selector etc.).

Action parameters
-----------------
Each action defined for the frame selectors (onEnter, onActive, onLeave) gets 
2 extra parameters on each call.

*  __c__ - Object; frame coordinates:

```JavaScript
{
    frameTop: 66, // Integer - distance from the frame to the top of the page (@see Options - frameTop)
    frameLeft: 8, // Integer - distance from the frame to the left side of the page
    frameBottom: 240, // Integer - distance from the frame to the bottom of the page
    frameRight: 8, // Integer - distance from the frame to the left side of the page
    frameWidth: 1247, // Integer - frame width in pixels
    frameHeight: 400, // Integer - frame height in pixels
    screenWidth: 1263, // Integer - screen width in pixels
    screenHeight: 706, // Integer - screen height in pixels
    screenScrollTop: 342, // Integer - how much the page was scrolled
    frameMiddleDistance: -77, // Integer - distance from the frame middle to the center of the screen
    percent: {
       screenPlayed=20.00, // Float - How much the page was scrolled; percent
       frameVisible=100.00, // Float - How much of the frame is visible; percent
       frameUnCentered=-21.81 // Float - How much is the frame off center; percent, -100 to +100
    }
}
```
* __e__ - Object; scroll event.

You can use both of these objects to fully control the behavior of frame elements such as positions, 
colors, backgrounds etc. in a predictible, linear fashion.

Frame reference
---------------
Each action also gets a reference of the selector via the ```$(this)``` operator.
Furthermore, the frame itself has an object atached:
```JavaScript
$(this).data("frameInfo")
// Returns
{
    framePosition: 2, // Integer - frame index (1 to number of frames)
    frameSelector: '.frame2', // String - frame selector
    frameName: 'contact' // String - frame name (@see Options - buildMenu)
}
```

Options
-------
You can further customize your storyline with the following options:
```JavaScript
// Available options and their defaults
{
    frameTop: 0, // Distance from the focused frame to the window top
    guide: false, // Boolean - Show the storyline guide 
    buildMenu: false, // Boolean|Array - List of names for each frame
    menuSpeed: 1500, // Integer - Scroll duration for menu clicks
    tolerance: 20, // Integer - frame tolerance
    logLevel: 'debug', // String - log level,
    scrollIntoView: false, // Boolean - Default value for scroll into view
    ignoreWarnings: true // Boolean - If set to false, the storyline will fail on each error
}
```

### Options - frameTop
This is used to set the distance from the *focused* frame to the top of the screen; useful for when a floating 
menu bar is fixed at the top of the screen.

### Options - guide
Wether to show or hide the Storyline guide.
If set to *true*, you will get a visual representation of each frame, its parameters, position, state etc.
You will also get the __Storyline Log__ showing you information such as debugging data, script information, errors etc.

### Options - buildMenu
If you set this option to a valid array of strings, each one will be interpreted as the name of a frame, in the order 
passed to the __frames__ key above. Plus, a menu will be constructed with the provided list of frame names; each time a 
user clicks on a menu item, the page will scroll to the correspondent frame.

### Options - menuSpeed
If a menu was constructed an an user clicks on a menu item, this option sets the interval (in milliseconds) in which the 
page will scroll to the correspondent frame.

### Options - tolerance
This is used to trigger the *onEnter* and *onLeave* actions more loosely. Test using the *guide* option set to *true*.

### Options - scrollIntoView
This is triggered 250ms after *onEnter* and performs a scrollIntoView action. The homonymous parameter in frames overrides this global option.

### Options - ignoreWarnings
If another option is set incorrectly and ignoreWarnings is set to True, the script will halt at the first encountered 
error.

Architecture
------------
The plugin is very well commented.
All strings are stored in a *message* variable.
```JavaScript
{
    error:{}, // Error messages
    status:{}, // Status messages
    const:{} // Constants
}
```

The plugin also uses an error logging mechanism with log level filtering.
```JavaScript
// Available log levels
logLevel = {
    debug:'debug',
    info:'info',
    error:'error'
}
// How to use
log(message.status.x, logLevel.debug); // Log a debugging message at index "x"
log(message.status.y, logLevel.info); // Log an information message at index "y"
log(message.error.z, logLevel.error); // Log an error message at index "z"
```
You can also set the log level by changing the *logLevel* option.

You can view the log either in the *browser console* or in the *Storyline Log* when the *guide* option 
is set to *true*.

Examples of sites using the Storyline plugin
--------------------------------------------
* [Mark Jivko | Portfolio](https://markjivko.com)
* [APK Factory](https://stephino.eu/)
