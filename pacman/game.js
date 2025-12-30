// Pac-Man Game - Bundled for Mobile WebView
// Original source: Classic Pacman Game using JavaScript

(function() {
    "use strict";

    // ============== Utils ==============
    const Utils = {
        rand(from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        },
        clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        },
        formatNumber(number, separator) {
            let result = "", count = 0, char;
            number = String(number);
            for (let i = number.length - 1; i >= 0; i -= 1) {
                char = number.charAt(i);
                count += 1;
                result = char + result;
                if (count === 3 && i > 0) {
                    result = separator + result;
                    count = 0;
                }
            }
            return result;
        },
        getTarget(event) {
            let element = event.target;
            while (element.parentElement && !element.dataset.action) {
                element = element.parentElement;
            }
            return element;
        }
    };

    // ============== Storage ==============
    class Storage {
        constructor(name, single) {
            this.name = name;
            this.single = single || false;
            this.supports = this.supportsStorage();
        }
        supportsStorage() {
            try {
                return window.localStorage !== undefined && window.localStorage !== null;
            } catch(e) {
                return false;
            }
        }
        get(name) {
            let content = null;
            if (this.supports && window.localStorage[this.getName(name)]) {
                content = window.localStorage[this.getName(name)];
                if (content === "true" || content === "false") {
                    content = content === "true";
                } else if (this.isInteger(content)) {
                    content = parseInt(content, 10);
                } else {
                    try { content = JSON.parse(content); } catch(e) {}
                }
            }
            return content;
        }
        set(name, value) {
            if (this.supports) {
                if (this.single) { value = name; name = ""; }
                window.localStorage[this.getName(name)] = JSON.stringify(value);
            }
        }
        remove(name) {
            if (this.supports) {
                window.localStorage.removeItem(this.getName(name));
            }
        }
        getName(name) {
            return this.name + (name ? "." + name : "");
        }
        isInteger(string) {
            const validChars = "0123456789-";
            for (let i = 0; i < string.length; i++) {
                if (validChars.indexOf(string.charAt(i)) === -1) return false;
            }
            return true;
        }
    }

    // ============== Sounds ==============
    class Sounds {
        constructor(soundFiles, storageName) {
            this.data = new Storage(storageName, true);
            this.format = this.getFormat();
            this.mute = true; // Start muted for mobile
            this.sounds = {};
            if (this.format) {
                soundFiles.forEach(sound => {
                    this.sounds[sound] = () => {
                        if (!this.mute) {
                            const audio = new Audio("audio/" + sound + this.format);
                            audio.play().catch(() => {});
                        }
                    };
                    this[sound] = this.sounds[sound];
                });
            }
        }
        getFormat() {
            const a = document.createElement("audio");
            if (a.canPlayType && a.canPlayType("audio/ogg; codecs='vorbis'").replace(/no/, "")) return ".ogg";
            if (a.canPlayType && a.canPlayType("audio/mpeg;").replace(/no/, "")) return ".mp3";
            return null;
        }
        toggle(mute) {
            this.mute = mute !== undefined ? mute : !this.mute;
        }
    }


    // ============== Data ==============
    const Data = (function() {
        const levelsData = [
            { ghostSpeed: 0.75, tunnelSpeed: 0.4, pmSpeed: 0.8, eatingSpeed: 0.71, ghostFrightSpeed: 0.5, pmFrightSpeed: 0.9, eatingFrightSpeed: 0.79, elroyDotsLeft1: 20, elroySpeed1: 0.8, elroyDotsLeft2: 10, elroySpeed2: 0.85, fruitType: 1, fruitScore: 100, frightTime: 6, frightBlinks: 5, switchTimes: [7,20,7,20,5,20,5,1], penForceTime: 4, penLeavingLimit: [0,0,30,60] },
            { ghostSpeed: 0.85, tunnelSpeed: 0.45, pmSpeed: 0.9, eatingSpeed: 0.79, ghostFrightSpeed: 0.55, pmFrightSpeed: 0.95, eatingFrightSpeed: 0.83, elroyDotsLeft1: 30, elroySpeed1: 0.9, elroyDotsLeft2: 15, elroySpeed2: 0.95, fruitType: 2, fruitScore: 300, frightTime: 5, frightBlinks: 5, switchTimes: [7,20,7,20,5,1033,1/60,1], penForceTime: 4, penLeavingLimit: [0,0,0,50] },
            { ghostSpeed: 0.85, tunnelSpeed: 0.45, pmSpeed: 0.9, eatingSpeed: 0.79, ghostFrightSpeed: 0.55, pmFrightSpeed: 0.95, eatingFrightSpeed: 0.83, elroyDotsLeft1: 40, elroySpeed1: 0.9, elroyDotsLeft2: 20, elroySpeed2: 0.95, fruitType: 3, fruitScore: 500, frightTime: 4, frightBlinks: 5, switchTimes: [7,20,7,20,5,1033,1/60,1], penForceTime: 4, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.85, tunnelSpeed: 0.45, pmSpeed: 0.9, eatingSpeed: 0.79, ghostFrightSpeed: 0.55, pmFrightSpeed: 0.95, eatingFrightSpeed: 0.83, elroyDotsLeft1: 40, elroySpeed1: 0.9, elroyDotsLeft2: 20, elroySpeed2: 0.95, fruitType: 3, fruitScore: 500, frightTime: 3, frightBlinks: 5, switchTimes: [7,20,7,20,5,1033,1/60,1], penForceTime: 4, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 40, elroySpeed1: 1, elroyDotsLeft2: 20, elroySpeed2: 1.05, fruitType: 4, fruitScore: 700, frightTime: 2, frightBlinks: 5, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 50, elroySpeed1: 1, elroyDotsLeft2: 25, elroySpeed2: 1.05, fruitType: 4, fruitScore: 700, frightTime: 5, frightBlinks: 5, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 50, elroySpeed1: 1, elroyDotsLeft2: 25, elroySpeed2: 1.05, fruitType: 5, fruitScore: 1000, frightTime: 2, frightBlinks: 5, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 50, elroySpeed1: 1, elroyDotsLeft2: 25, elroySpeed2: 1.05, fruitType: 5, fruitScore: 1000, frightTime: 2, frightBlinks: 5, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 60, elroySpeed1: 1, elroyDotsLeft2: 30, elroySpeed2: 1.05, fruitType: 6, fruitScore: 2000, frightTime: 1, frightBlinks: 3, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 60, elroySpeed1: 1, elroyDotsLeft2: 30, elroySpeed2: 1.05, fruitType: 6, fruitScore: 2000, frightTime: 5, frightBlinks: 5, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 60, elroySpeed1: 1, elroyDotsLeft2: 30, elroySpeed2: 1.05, fruitType: 7, fruitScore: 3000, frightTime: 2, frightBlinks: 5, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 80, elroySpeed1: 1, elroyDotsLeft2: 40, elroySpeed2: 1.05, fruitType: 7, fruitScore: 3000, frightTime: 1, frightBlinks: 3, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 80, elroySpeed1: 1, elroyDotsLeft2: 40, elroySpeed2: 1.05, fruitType: 8, fruitScore: 5000, frightTime: 1, frightBlinks: 3, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 80, elroySpeed1: 1, elroyDotsLeft2: 40, elroySpeed2: 1.05, fruitType: 8, fruitScore: 5000, frightTime: 3, frightBlinks: 5, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 100, elroySpeed1: 1, elroyDotsLeft2: 50, elroySpeed2: 1.05, fruitType: 8, fruitScore: 5000, frightTime: 1, frightBlinks: 3, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 100, elroySpeed1: 1, elroyDotsLeft2: 50, elroySpeed2: 1.05, fruitType: 8, fruitScore: 5000, frightTime: 1, frightBlinks: 3, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 100, elroySpeed1: 1, elroyDotsLeft2: 50, elroySpeed2: 1.05, fruitType: 8, fruitScore: 5000, frightTime: 0, frightBlinks: 0, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 100, elroySpeed1: 1, elroyDotsLeft2: 50, elroySpeed2: 1.05, fruitType: 8, fruitScore: 5000, frightTime: 1, frightBlinks: 3, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 120, elroySpeed1: 1, elroyDotsLeft2: 60, elroySpeed2: 1.05, fruitType: 8, fruitScore: 5000, frightTime: 0, frightBlinks: 0, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 1, eatingSpeed: 0.87, ghostFrightSpeed: 0.6, pmFrightSpeed: 1, eatingFrightSpeed: 0.87, elroyDotsLeft1: 120, elroySpeed1: 1, elroyDotsLeft2: 60, elroySpeed2: 1.05, fruitType: 8, fruitScore: 5000, frightTime: 0, frightBlinks: 0, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] },
            { ghostSpeed: 0.95, tunnelSpeed: 0.5, pmSpeed: 0.9, eatingSpeed: 0.79, ghostFrightSpeed: 0.75, pmFrightSpeed: 0.9, eatingFrightSpeed: 0.79, elroyDotsLeft1: 120, elroySpeed1: 1, elroyDotsLeft2: 60, elroySpeed2: 1.05, fruitType: 8, fruitScore: 5000, frightTime: 0, frightBlinks: 0, switchTimes: [5,20,5,20,5,1037,1/60,1], penForceTime: 3, penLeavingLimit: [0,0,0,0] }
        ];

        const fruitNames = ["Cherries", "Strawberry", "Peach", "Apple", "Grapes", "Galaxian", "Bell", "Key"];
        const fruitDots1 = 174, fruitDots2 = 74, energizerValue = 5, pillValue = 1;
        const extraLife = 10000, pillMult = 10, eyesBonus = 12000, totalSwitchs = 7, blinksTimer = 200;
        const penDotsCount = [0, 7, 17, 32], inPenSpeed = 0.6, eyesSpeed = 2, exitPenSpeed = 0.4;
        const pathSpeeds = { inPen: inPenSpeed, exitPen: exitPenSpeed, enterPen: eyesSpeed };

        let gameLevel = 1;

        return {
            set level(level) { gameLevel = level; },
            get fruitTime() { return Math.round(Math.random() * 1000) + 9000; },
            get fruitDots1() { return fruitDots1; },
            get fruitDots2() { return fruitDots2; },
            get energizerValue() { return energizerValue; },
            get pillValue() { return pillValue; },
            get extraLife() { return extraLife; },
            get pillMult() { return pillMult; },
            get eyesBonus() { return eyesBonus; },
            get totalSwitchs() { return totalSwitchs; },
            get blinksTimer() { return blinksTimer; },
            get eyesSpeed() { return eyesSpeed; },
            getLevelData(variable) {
                const level = Math.min(gameLevel - 1, levelsData.length - 1);
                const data = levelsData[level];
                const value = data[variable];
                if (Array.isArray(value)) return Object.create(value);
                return value;
            },
            getFruitName() { return fruitNames[Data.getLevelData("fruitType") - 1]; },
            getPenForceTime() { return Data.getLevelData("penForceTime") * 1000; },
            getSwitchTime(mode) { return Data.getLevelData("switchTimes")[mode] * 1000; },
            getFrightTime() { return Data.getLevelData("frightTime") * 1000; },
            getBlinks() { return Data.getLevelData("frightBlinks") * 2; },
            getGhostSpeed(inPen) { return inPen ? inPenSpeed : Data.getLevelData("ghostSpeed"); },
            getPathSpeed(path) { return pathSpeeds[path]; },
            getGhostScore(amount) { return Math.pow(2, amount) * 100; },
            getPenDotsCount(ghost) { return penDotsCount[ghost]; },
            isFrighten(mode) { return mode === "blue" || mode === "white"; }
        };
    })();


    // ============== Board ==============
    const Board = (function() {
        const wallValue = 0, pillPathValue = 2, interValue = 3, interPillValue = 4, tunnelValue = 5;
        const boardMatrix = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,4,2,2,2,2,4,2,2,2,2,2,4,0,0,4,2,2,2,2,2,4,2,2,2,2,4,0],
            [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
            [0,1,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,1,0],
            [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
            [0,4,2,2,2,2,4,2,2,4,2,2,4,2,2,4,2,2,4,2,2,4,2,2,2,2,4,0],
            [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
            [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
            [0,4,2,2,2,2,4,0,0,4,2,2,4,0,0,4,2,2,4,0,0,4,2,2,2,2,4,0],
            [0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,3,1,1,3,1,1,3,1,1,3,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
            [5,5,5,5,5,5,4,1,1,3,0,0,0,0,0,0,0,0,3,1,1,4,5,5,5,5,5,5],
            [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,3,1,1,1,1,1,1,1,1,3,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
            [0,4,2,2,2,2,4,2,2,4,2,2,4,0,0,4,2,2,4,2,2,4,2,2,2,2,4,0],
            [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
            [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
            [0,3,2,4,0,0,4,2,2,4,2,2,4,1,1,4,2,2,4,2,2,4,0,0,4,2,3,0],
            [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
            [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
            [0,4,2,4,2,2,4,0,0,4,2,2,4,0,0,4,2,2,4,0,0,4,2,2,4,2,4,0],
            [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
            [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
            [0,4,2,2,2,2,2,2,2,2,2,2,4,2,2,4,2,2,2,2,2,2,2,2,2,2,4,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ];

        const boardTurns = {
            x1y1:[2,3],x6y1:[1,2,3],x12y1:[1,2],x15y1:[2,3],x21y1:[1,2,3],x26y1:[1,2],
            x1y5:[0,2,3],x6y5:[0,1,2,3],x9y5:[1,2,3],x12y5:[0,1,3],x15y5:[0,1,3],x18y5:[1,2,3],x21y5:[0,1,2,3],x26y5:[0,1,2],
            x1y8:[0,3],x6y8:[0,1,2],x9y8:[0,3],x12y8:[1,2],x15y8:[2,3],x18y8:[0,1],x21y8:[0,2,3],x26y8:[0,1],
            x9y11:[2,3],x12y11:[1,3],x15y11:[1,3],x18y11:[1,2],
            x6y14:[0,1,2,3],x9y14:[0,1,2],x18y14:[0,2,3],x21y14:[0,1,2,3],
            x9y17:[0,2,3],x18y17:[0,1,2],
            x1y20:[2,3],x6y20:[0,1,2,3],x9y20:[0,1,3],x12y20:[1,2],x15y20:[2,3],x18y20:[0,1,3],x21y20:[0,1,2,3],x26y20:[1,2],
            x1y23:[0,3],x3y23:[1,2],x6y23:[0,2,3],x9y23:[1,2,3],x12y23:[1,3],x15y23:[1,3],x18y23:[1,2,3],x21y23:[0,1,2],x24y23:[2,3],x26y23:[0,1],
            x1y26:[2,3],x3y26:[0,1,3],x6y26:[0,1],x9y26:[0,3],x12y26:[1,2],x15y26:[2,3],x18y26:[0,1],x21y26:[0,3],x24y26:[0,1,3],x26y26:[1,2],
            x1y29:[0,3],x12y29:[0,1,3],x15y29:[0,1,3],x26y29:[0,1]
        };

        const energizers = [{x:1,y:3},{x:26,y:3},{x:1,y:23},{x:26,y:23}];
        const pillAmount = 244, fruitTile = {x:13.25,y:16.8333}, fruitSize = 20;
        const tileSize = 12, lineWidth = 2, halfLine = lineWidth/2;
        const bigRadius = tileSize/2, smallRadius = tileSize/4, eraseSize = tileSize*2;
        const boardCols = boardMatrix[0].length, boardRows = boardMatrix.length;
        const canvasWidth = tileSize * boardCols, canvasHeight = tileSize * boardRows;
        const scoreHeight = tileSize * 2, totalHeight = canvasHeight + scoreHeight;
        const tunnelStart = -tileSize/2, tunnelEnd = tileSize * boardCols + tunnelStart;
        const ghostSize = tileSize * 1.5, blobRadius = Math.round(tileSize / 1.5);
        const pillSize = Math.round(tileSize * 0.16666), energizerSize = Math.round(tileSize * 0.41666);
        const boardColor = "rgb(0, 51, 255)";
        const startingPos = {x:14,y:23}, startingDir = {x:-1,y:0}, eyesTarget = {x:13,y:11};

        let boardCanvas, screenCanvas, gameCanvas;

        function getTileCenter(tile) { return Math.round((tile + 0.5) * tileSize); }
        function tileToPos(tile) { return {x: tile.x * tileSize, y: tile.y * tileSize}; }

        return {
            create() {
                boardCanvas = new BoardCanvas();
                screenCanvas = new Canvas().init("screen");
                gameCanvas = new GameCanvas();
            },
            get boardCanvas() { return boardCanvas; },
            get screenCanvas() { return screenCanvas; },
            get gameCanvas() { return gameCanvas; },
            clearGame() { gameCanvas.clearSavedRects(); },
            drawBoard(newLevel) { boardCanvas.drawBoard(newLevel); },
            clearAll() { boardCanvas.clear(); gameCanvas.clear(); screenCanvas.clear(); },
            get width() { return canvasWidth; },
            get height() { return totalHeight; },
            get cols() { return boardCols; },
            get rows() { return boardRows; },
            get tileSize() { return tileSize; },
            get lineWidth() { return lineWidth; },
            get halfLine() { return halfLine; },
            get bigRadius() { return bigRadius; },
            get smallRadius() { return smallRadius; },
            get eraseSize() { return eraseSize; },
            get boardColor() { return boardColor; },
            get energizers() { return energizers; },
            get pillAmount() { return pillAmount; },
            get fruitTile() { return fruitTile; },
            get fruitPos() { return tileToPos(fruitTile); },
            get fruitSize() { return fruitSize; },
            get pillSize() { return pillSize; },
            get energizerSize() { return energizerSize; },
            get ghostSize() { return ghostSize; },
            get blobRadius() { return blobRadius; },
            get startingPos() { return {x:startingPos.x, y:startingPos.y}; },
            get startingDir() { return {x:startingDir.x, y:startingDir.y}; },
            get eyesTarget() { return eyesTarget; },
            getGhostStartTile(inPen) { return inPen ? {x:13,y:14} : {x:13,y:11}; },
            getGhostStartTurn(inPen) { return inPen ? {x:-1,y:0} : null; },
            getTileXYCenter(tile) { return {x:getTileCenter(tile.x), y:getTileCenter(tile.y)}; },
            getTileCorner(tile) { return Math.round(tile * tileSize); },
            getTilePos(x, y) { return {x:Math.floor(x/tileSize), y:Math.floor(y/tileSize)}; },
            sumTiles(...tiles) { return tiles.reduce((last, current) => ({x:last.x+current.x, y:last.y+current.y}), {x:0,y:0}); },
            equalTiles(tile1, tile2) { return tile1.x === tile2.x && tile1.y === tile2.y; },
            getPillRect(x, y) { return {x:Board.getTileCenter(x)-Board.pillSize/2, y:Board.getTileCenter(y)-Board.pillSize/2, size:Board.pillSize}; },
            getFruitRect() { const pos = Board.fruitPos, size = Board.fruitSize/3; return {left:pos.x-size, right:pos.x+size, top:pos.y-size, bottom:pos.y+size}; },
            tunnelEnds(x) { if(x<tunnelStart) return tunnelEnd; if(x>tunnelEnd) return tunnelStart; return x; },
            inBoard(col, row) { return row>=0 && col>=0 && row<boardRows && col<boardCols; },
            isWall(col, row) { return boardMatrix[row][col] === wallValue; },
            isIntersection(col, row) { return boardMatrix[row][col] === interValue || boardMatrix[row][col] === interPillValue; },
            isTunnel(col, row) { return boardMatrix[row][col] === tunnelValue; },
            hasPill(col, row) { return boardMatrix[row][col] === pillPathValue || boardMatrix[row][col] === interPillValue; },
            getTurns(pos) { return boardTurns[pos] || null; },
            tileToString(tile) { return "x" + String(tile.x) + "y" + String(tile.y); },
            numberToDir(value) { switch(value) { case 0: return {x:0,y:-1}; case 1: return {x:-1,y:0}; case 2: return {x:0,y:1}; case 3: return {x:1,y:0}; } },
            dirToNumber(dir) { switch(this.tileToString(dir)) { case "x0y-1": return 0; case "x-1y0": return 1; case "x0y1": return 2; case "x1y0": return 3; } },
            getTileCenter,
            tileToPos
        };
    })();


    // ============== Canvas Classes ==============
    class Canvas {
        init(name) {
            let canvas = document.querySelector("." + name);
            canvas.width = Board.width;
            canvas.height = Board.height;
            this.ctx = canvas.getContext("2d");
            this.ctx.font = "2em 'Whimsy TT'";
            this.ctx.fillStyle = "white";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.rects = [];
            return this;
        }
        get context() { return this.ctx; }
        fill(alpha, x, y, width, height) {
            this.ctx.save();
            this.ctx.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
            this.ctx.fillRect(x || 0, y || 0, width || Board.width, height || Board.height);
            this.ctx.restore();
        }
        clear() { this.ctx.clearRect(0, 0, Board.width, Board.height); this.rects = []; }
        clearSavedRects() {
            this.rects.forEach((rect) => {
                this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
                if (rect.alpha) this.fill(rect.alpha, rect.x, rect.y, rect.width, rect.height);
            });
            this.rects = [];
        }
        savePos(x, y) { this.rects.push({x:x-Board.eraseSize/2, y:y-Board.eraseSize/2, width:Board.eraseSize, height:Board.eraseSize}); }
        saveRect(data) { this.rects.push(data); }
        drawText(data) {
            let mult = 0.5;
            this.ctx.save();
            if (data.size) this.ctx.font = data.size + "em 'Whimsy TT'";
            if (data.align) { this.ctx.textAlign = data.align; mult = data.align === "left" ? 1 : 0; }
            this.ctx.fillStyle = data.color;
            this.ctx.fillText(data.text, data.pos.x * Board.tileSize, data.pos.y * Board.tileSize);
            this.ctx.restore();
            const metrics = this.ctx.measureText(data.text);
            const width = metrics.width + Board.tileSize;
            const height = data.size ? (data.size + 0.5) * Board.tileSize : 2.5 * Board.tileSize;
            this.saveRect({x:data.pos.x*Board.tileSize-mult*width, y:data.pos.y*Board.tileSize-height/2, width:width, height:height, alpha:data.alpha||0});
        }
    }

    class BoardCanvas extends Canvas {
        constructor() {
            super();
            this.init("board");
            this.ctx.lineWidth = Board.lineWidth;
            this.ctx.strokeStyle = Board.boardColor;
            this.radians = {"top-left":{from:1,to:1.5},"top-right":{from:1.5,to:2},"bottom-right":{from:0,to:0.5},"bottom-left":{from:0.5,to:1}};
            this.corners = {"top-left":{x:1,y:1},"top-right":{x:-1,y:1},"bottom-right":{x:-1,y:-1},"bottom-left":{x:1,y:-1}};
        }
        drawBoard(newLevel) {
            this.drawGhostsPen();
            this.ctx.save();
            this.ctx.strokeStyle = newLevel ? "white" : Board.boardColor;
            this.drawOuterBorder();
            this.drawInnerBorder();
            this.drawRectangle(2,2,4,3); this.drawRectangle(7,2,5,3); this.drawRectangle(16,2,5,3); this.drawRectangle(22,2,4,3);
            this.drawRectangle(2,6,4,2); this.drawTShape(7,6,4,4,"right"); this.drawTShape(10,6,4,4,"down"); this.drawTShape(16,6,4,4,"left"); this.drawRectangle(22,6,4,2);
            this.drawRectangle(7,15,2,5); this.drawTShape(10,18,4,4,"down"); this.drawRectangle(19,15,2,5);
            this.drawLShape(2,21,false); this.drawRectangle(7,21,5,2); this.drawRectangle(16,21,5,2); this.drawLShape(22,21,true);
            this.drawTShape(2,24,4,6,"up"); this.drawTShape(10,24,4,4,"down"); this.drawTShape(16,24,6,4,"up");
            this.ctx.restore();
        }
        drawGhostsPen() {
            this.ctx.strokeRect(10.5*Board.tileSize, 12.5*Board.tileSize, 7*Board.tileSize, 4*Board.tileSize);
            this.ctx.strokeRect(11*Board.tileSize-Board.halfLine, 13*Board.tileSize-Board.halfLine, 6*Board.tileSize+Board.lineWidth, 3*Board.tileSize+Board.lineWidth);
            this.ctx.strokeRect(13*Board.tileSize-Board.halfLine, 12.5*Board.tileSize, 2*Board.tileSize+Board.lineWidth, Board.tileSize/2-Board.halfLine);
            this.ctx.clearRect(13*Board.tileSize, 12.5*Board.tileSize-Board.halfLine, 2*Board.tileSize, Board.tileSize/2+Board.halfLine);
            this.ctx.save();
            this.ctx.strokeStyle = "white";
            this.ctx.strokeRect(13*Board.tileSize+Board.halfLine, 12.5*Board.tileSize+Board.lineWidth, 2*Board.tileSize-Board.lineWidth, Board.halfLine);
            this.ctx.restore();
        }
        drawOuterBorder() {
            this.ctx.beginPath();
            this.drawOuterBigCorner(0,0,"top-left"); this.drawOuterBigCorner(27,0,"top-right");
            this.drawOuterBigCorner(27,9,"bottom-right"); this.drawOuterSmallCorner(22,9,"top-left"); this.drawOuterSmallCorner(22,13,"bottom-left");
            this.ctx.lineTo(28*Board.tileSize, 13*Board.tileSize+Board.halfLine);
            this.ctx.moveTo(28*Board.tileSize, 16*Board.tileSize-Board.halfLine);
            this.drawOuterSmallCorner(22,15,"top-left"); this.drawOuterSmallCorner(22,19,"bottom-left"); this.drawOuterBigCorner(27,19,"top-right");
            this.drawOuterBigCorner(27,30,"bottom-right"); this.drawOuterBigCorner(0,30,"bottom-left");
            this.drawOuterBigCorner(0,19,"top-left"); this.drawOuterSmallCorner(5,19,"bottom-right"); this.drawOuterSmallCorner(5,15,"top-right");
            this.ctx.lineTo(0, 16*Board.tileSize-Board.halfLine);
            this.ctx.moveTo(0, 13*Board.tileSize+Board.halfLine);
            this.drawOuterSmallCorner(5,13,"bottom-right"); this.drawOuterSmallCorner(5,9,"top-right"); this.drawOuterBigCorner(0,9,"bottom-left");
            this.ctx.lineTo(Board.halfLine, Board.bigRadius+Board.halfLine);
            this.ctx.stroke();
        }
        drawInnerBorder() {
            this.ctx.beginPath();
            this.drawInnerCorner(0,0,"top-left",false,false); this.drawInnerCorner(13,0,"top-right",false,false);
            this.drawInnerCorner(13,4,"bottom-left",true,true); this.drawInnerCorner(14,4,"bottom-right",true,true);
            this.drawInnerCorner(14,0,"top-left",false,false); this.drawInnerCorner(27,0,"top-right",false,false);
            this.drawInnerCorner(27,9,"bottom-right",false,false); this.drawInnerCorner(22,9,"top-left",true,true);
            this.drawInnerCorner(22,13,"bottom-left",true,true);
            this.ctx.lineTo(28*Board.tileSize, 13.5*Board.tileSize);
            this.ctx.moveTo(28*Board.tileSize, 15.5*Board.tileSize);
            this.drawInnerCorner(22,15,"top-left",true,true); this.drawInnerCorner(22,19,"bottom-left",true,true);
            this.drawInnerCorner(27,19,"top-right",false,false); this.drawInnerCorner(27,24,"bottom-right",false,false);
            this.drawInnerCorner(25,24,"top-left",true,true); this.drawInnerCorner(25,25,"bottom-left",true,true);
            this.drawInnerCorner(27,25,"top-right",false,false);
            this.drawInnerCorner(27,30,"bottom-right",false,false); this.drawInnerCorner(0,30,"bottom-left",false,false);
            this.drawInnerCorner(0,25,"top-left",false,false); this.drawInnerCorner(2,25,"bottom-right",true,true);
            this.drawInnerCorner(2,24,"top-right",true,true); this.drawInnerCorner(0,24,"bottom-left",false,false);
            this.drawInnerCorner(0,19,"top-left",false,false); this.drawInnerCorner(5,19,"bottom-right",true,true);
            this.drawInnerCorner(5,15,"top-right",true,true);
            this.ctx.lineTo(0, 15.5*Board.tileSize);
            this.ctx.moveTo(0, 13.5*Board.tileSize);
            this.drawInnerCorner(5,13,"bottom-right",true,true); this.drawInnerCorner(5,9,"top-right",true,true);
            this.drawInnerCorner(0,9,"bottom-left",false,false);
            this.ctx.lineTo(Board.tileSize/2, Board.tileSize/2+Board.smallRadius);
            this.ctx.stroke();
        }
        drawRectangle(x, y, width, height) {
            this.ctx.save();
            this.ctx.translate(x*Board.tileSize, y*Board.tileSize);
            this.ctx.beginPath();
            this.drawInnerCorner(0,0,"top-left",true,false);
            this.drawInnerCorner(width-1,0,"top-right",true,false);
            this.drawInnerCorner(width-1,height-1,"bottom-right",true,false);
            this.drawInnerCorner(0,height-1,"bottom-left",true,false);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
        }
        drawTShape(x, y, left, right, type) {
            const drawTShapes = {"down":{radians:0,x:0,y:0},"left":{radians:0.5,x:0,y:-5},"right":{radians:1.5,x:-1,y:0},"up":{radians:1,x:-1,y:-5}};
            const data = drawTShapes[type], width = left + right;
            this.ctx.save();
            this.ctx.translate(x*Board.tileSize, y*Board.tileSize);
            this.ctx.rotate(data.radians * Math.PI);
            this.ctx.translate(data.x*width*Board.tileSize, data.y*Board.tileSize);
            this.ctx.beginPath();
            this.drawInnerCorner(0,0,"top-left",true,false); this.drawInnerCorner(width-1,0,"top-right",true,false);
            this.drawInnerCorner(width-1,1,"bottom-right",true,false); this.drawInnerCorner(left,1,"top-left",false,true);
            this.drawInnerCorner(left,4,"bottom-right",true,false); this.drawInnerCorner(left-1,4,"bottom-left",true,false);
            this.drawInnerCorner(left-1,1,"top-right",false,true); this.drawInnerCorner(0,1,"bottom-left",true,false);
            this.ctx.stroke();
            this.ctx.restore();
        }
        drawLShape(x, y, reflect) {
            this.ctx.save();
            this.ctx.translate(x*Board.tileSize, y*Board.tileSize);
            if (reflect) { this.ctx.transform(-1,0,0,1,0,0); this.ctx.translate(-4*Board.tileSize, 0); }
            this.ctx.beginPath();
            this.drawInnerCorner(0,0,"top-left",true,false); this.drawInnerCorner(3,0,"top-right",true,false);
            this.drawInnerCorner(3,4,"bottom-right",true,false); this.drawInnerCorner(2,4,"bottom-left",true,false);
            this.drawInnerCorner(2,1,"top-right",false,true); this.drawInnerCorner(0,1,"bottom-left",true,false);
            this.ctx.stroke();
            this.ctx.restore();
        }
        drawOuterBigCorner(x, y, type) {
            const data = this.corners[type];
            const pos = {x:x*Board.tileSize+Board.bigRadius+data.x*Board.halfLine, y:y*Board.tileSize+Board.bigRadius+data.y*Board.halfLine};
            this.corner(pos, Board.bigRadius, type, false);
        }
        drawOuterSmallCorner(x, y, type) {
            const smallCorners = {"top-left":{x:{cell:1,line:-1},y:{cell:1,line:-1}},"top-right":{x:{cell:0,line:1},y:{cell:1,line:-1}},"bottom-right":{x:{cell:0,line:1},y:{cell:0,line:1}},"bottom-left":{x:{cell:1,line:-1},y:{cell:0,line:1}}};
            const radius = this.corners[type], data = smallCorners[type];
            const pos = {x:(x+data.x.cell)*Board.tileSize+radius.x*Board.smallRadius+data.x.line*Board.halfLine, y:(y+data.y.cell)*Board.tileSize+radius.y*Board.smallRadius+data.y.line*Board.halfLine};
            this.corner(pos, Board.smallRadius, type, true);
        }
        drawInnerCorner(x, y, type, isBig, anticlockwise) {
            const radius = isBig ? Board.bigRadius : Board.smallRadius;
            const data = this.corners[type];
            const pos = {x:(x+0.5)*Board.tileSize+data.x*radius, y:(y+0.5)*Board.tileSize+data.y*radius};
            this.corner(pos, radius, type, anticlockwise);
        }
        corner(pos, radius, type, anticlockwise) {
            const rad = this.radians[type];
            let result = [rad.from*Math.PI, rad.to*Math.PI];
            if (anticlockwise) result.reverse();
            this.ctx.arc(pos.x, pos.y, radius, result[0], result[1], anticlockwise);
        }
    }

    class GameCanvas extends Canvas {
        constructor() { super(); this.init("game"); }
    }


    // ============== Display ==============
    class Display {
        constructor(callback) {
            this.container = document.querySelector("#container");
            this.display = "mainScreen";
            this.callback = callback;
        }
        get() { return this.display; }
        set(display) { this.display = display; return this; }
        show() { this.container.className = this.display; this.callback(); }
        isMainScreen() { return this.display === "mainScreen"; }
        isPlaying() { return ["ready", "playing", "paused"].includes(this.display); }
        isPaused() { return this.display === "paused"; }
    }

    // ============== Food ==============
    class Food {
        constructor() {
            this.ctx = Board.boardCanvas.context;
            this.init();
            this.createMatrix();
            this.createEnergizers();
        }
        init() {
            this.total = Board.pillAmount;
            this.minRadius = Board.pillSize;
            this.maxRadius = Board.energizerSize;
            this.radius = this.maxRadius;
            this.energizers = [];
            this.matrix = [];
            this.mult = -1;
        }
        createMatrix() {
            for (let i = 0; i < Board.rows; i++) {
                this.matrix[i] = [];
                for (let j = 0; j < Board.cols; j++) {
                    this.matrix[i][j] = Board.hasPill(j, i) ? Data.pillValue : 0;
                }
            }
            Board.energizers.forEach((pos) => { this.matrix[pos.y][pos.x] = Data.energizerValue; });
        }
        createEnergizers() {
            this.energizers = [];
            Board.energizers.forEach((pos) => {
                if (this.matrix[pos.y][pos.x] === Data.energizerValue) {
                    this.energizers.push(Board.getTileXYCenter(pos));
                }
            });
        }
        wink() { this.calcRadius(); this.drawEnergizers(); }
        calcRadius() {
            this.radius += this.mult * 0.1;
            if (this.radius <= this.minRadius) this.mult = 1;
            else if (this.radius >= this.maxRadius) this.mult = -1;
        }
        draw() { this.drawPills(); this.drawEnergizers(); }
        drawPills() {
            this.ctx.save();
            this.ctx.fillStyle = "white";
            this.matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    let rect = Board.getPillRect(x, y);
                    if (value === Data.pillValue) this.ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
                });
            });
            this.ctx.restore();
        }
        clearPill(x, y) { let rect = Board.getPillRect(x, y); this.ctx.clearRect(rect.x, rect.y, rect.size, rect.size); }
        drawEnergizers() {
            this.energizers.forEach((pos) => {
                this.clearEnergizer(pos.x, pos.y);
                this.drawEnergizer(pos.x, pos.y, this.radius);
            });
        }
        drawEnergizer(x, y, radius) {
            this.ctx.save();
            this.ctx.fillStyle = "white";
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.restore();
        }
        clearEnergizer(x, y) {
            let radius = this.maxRadius;
            this.ctx.clearRect(x-radius, y-radius, radius*2, radius*2);
        }
        isAtPill(tile) { return this.matrix[tile.y][tile.x] > 0; }
        eatPill(tile) {
            let value = this.matrix[tile.y][tile.x];
            let pos = Board.getTileXYCenter(tile);
            this.clearPill(tile.x, tile.y);
            this.matrix[tile.y][tile.x] = 0;
            this.total -= 1;
            if (value === Data.energizerValue) {
                this.clearEnergizer(pos.x, pos.y);
                this.createEnergizers();
            }
            return value;
        }
        getLeftPills() { return this.total; }
    }

    // ============== Fruit ==============
    class Fruit {
        constructor() { this.ctx = Board.boardCanvas.context; this.timer = 0; }
        add(dotsLeft) {
            if (dotsLeft === Data.fruitDots1 || dotsLeft === Data.fruitDots2) {
                this.timer = Data.fruitTime;
                this.draw(Board.fruitTile);
            }
        }
        reduceTimer(time) {
            if (this.timer > 0) {
                this.timer -= time;
                if (this.timer <= 0) this.eat();
            }
        }
        eat() { this.clear(); this.timer = 0; }
        isAtPos(tile) {
            if (this.timer > 0) {
                let rect = Board.getFruitRect(), pos = Board.tileToPos(tile);
                return pos.x >= rect.left && pos.x <= rect.right && pos.y >= rect.top && pos.y <= rect.bottom;
            }
            return false;
        }
        draw(tile) {
            let pos = Board.tileToPos(tile);
            this.ctx.save();
            this.ctx.translate(pos.x, pos.y);
            this["draw" + Data.getFruitName()]();
            this.ctx.restore();
        }
        clear() {
            let pos = Board.fruitPos;
            this.ctx.clearRect(pos.x-1, pos.y-1, Board.fruitSize, Board.fruitSize);
        }
        drawCherries() {
            this.ctx.fillStyle = "rgb(255, 0, 0)";
            this.ctx.beginPath();
            this.ctx.arc(10, 14, 4, 0, 2*Math.PI);
            this.ctx.arc(4, 10, 4, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            this.ctx.beginPath();
            this.ctx.arc(8, 15.5, 1.5, 0, 2*Math.PI);
            this.ctx.arc(1.5, 11, 1.5, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.strokeStyle = "rgb(0, 153, 0)";
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(17, 1);
            this.ctx.quadraticCurveTo(9, 1, 5, 9);
            this.ctx.moveTo(17, 1);
            this.ctx.quadraticCurveTo(12, 3, 10, 12);
            this.ctx.stroke();
            this.ctx.strokeStyle = "rgb(222, 151, 81)";
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = "round";
            this.ctx.beginPath();
            this.ctx.moveTo(17, 1);
            this.ctx.lineTo(16, 2);
            this.ctx.stroke();
        }
        drawStrawberry() {
            let dots = [3,7,5,6,4,10,7,8,6,11,7,13,9,10,9,14,10,12,11,8,12,11,14,6,14,9];
            this.ctx.fillStyle = "rgb(222, 0, 0)";
            this.ctx.beginPath();
            this.ctx.moveTo(9, 3);
            this.ctx.quadraticCurveTo(17, 3, 17, 7);
            this.ctx.quadraticCurveTo(17, 14, 9, 17);
            this.ctx.quadraticCurveTo(1, 14, 1, 7);
            this.ctx.quadraticCurveTo(1, 3, 9, 3);
            this.ctx.fill();
            this.ctx.fillStyle = "rgb(0, 222, 0)";
            this.ctx.beginPath();
            this.ctx.moveTo(5, 3);
            this.ctx.lineTo(13, 3);
            this.ctx.lineTo(14, 4);
            this.ctx.lineTo(9, 7);
            this.ctx.lineTo(4, 4);
            this.ctx.fill();
            this.ctx.fillStyle = "rgb(255, 255, 255)";
            this.ctx.fillRect(8, 0, 2, 4);
            for (let i = 0; i < dots.length; i += 2) this.ctx.fillRect(dots[i], dots[i+1], 1, 1);
        }
        drawPeach() {
            this.ctx.fillStyle = "rgb(255, 181, 33)";
            this.ctx.beginPath();
            this.ctx.arc(6, 10, 5, Math.PI, 1.5*Math.PI, false);
            this.ctx.arc(12, 10, 5, 1.5*Math.PI, 2*Math.PI, false);
            this.ctx.arc(10, 11, 7, 0, 0.5*Math.PI, false);
            this.ctx.arc(8, 11, 7, 0.5*Math.PI, Math.PI, false);
            this.ctx.fill();
            this.ctx.strokeStyle = "rgb(0, 222, 0)";
            this.ctx.lineCap = "round";
            this.ctx.beginPath();
            this.ctx.moveTo(6, 5);
            this.ctx.lineTo(14, 4);
            this.ctx.moveTo(14, 0);
            this.ctx.quadraticCurveTo(11, 0, 10, 7);
            this.ctx.stroke();
        }
        drawApple() {
            this.ctx.fillStyle = "rgb(222, 0, 0)";
            this.ctx.beginPath();
            this.ctx.arc(6, 8, 5, Math.PI, 1.5*Math.PI, false);
            this.ctx.arc(12, 8, 5, 1.5*Math.PI, 2*Math.PI, false);
            this.ctx.arc(10, 11, 7, 0, 0.5*Math.PI, false);
            this.ctx.arc(13, 15, 3, 0.5*Math.PI, Math.PI, false);
            this.ctx.arc(6, 15, 3, 0, 0.5*Math.PI, false);
            this.ctx.arc(8, 11, 7, 0.5*Math.PI, Math.PI, false);
            this.ctx.fill();
            this.ctx.strokeStyle = "rgb(0, 222, 0)";
            this.ctx.lineCap = "round";
            this.ctx.beginPath();
            this.ctx.arc(3, 7, 7, 1.5*Math.PI, 2*Math.PI, false);
            this.ctx.arc(13, 4, 4, Math.PI, 1.5*Math.PI, false);
            this.ctx.stroke();
            this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            this.ctx.beginPath();
            this.ctx.arc(7, 9, 4, Math.PI, 1.5*Math.PI, false);
            this.ctx.stroke();
        }
        drawGrapes() {
            this.ctx.fillStyle = "rgb(0, 222, 0)";
            this.ctx.beginPath();
            this.ctx.arc(9, 11, 8, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.strokeStyle = "rgb(74, 74, 0)";
            this.ctx.beginPath();
            this.ctx.moveTo(9, 4); this.ctx.lineTo(2, 11); this.ctx.lineTo(7, 16);
            this.ctx.moveTo(14, 6); this.ctx.lineTo(8, 12); this.ctx.lineTo(14, 18);
            this.ctx.moveTo(9, 6); this.ctx.lineTo(15, 12); this.ctx.lineTo(10, 17);
            this.ctx.moveTo(10, 14); this.ctx.lineTo(4, 18);
            this.ctx.stroke();
            this.ctx.strokeStyle = "rgb(222, 148, 74)";
            this.ctx.beginPath();
            this.ctx.moveTo(4, 0); this.ctx.lineTo(5, 1); this.ctx.lineTo(12, 1);
            this.ctx.moveTo(9, 1); this.ctx.lineTo(9, 4);
            this.ctx.stroke();
        }
        drawGalaxian() {
            this.ctx.fillStyle = "rgb(255, 250, 55)";
            this.ctx.strokeStyle = "rgb(255, 250, 55)";
            this.ctx.beginPath();
            this.ctx.moveTo(1, 4); this.ctx.lineTo(17, 4); this.ctx.lineTo(9, 11);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.moveTo(9, 11); this.ctx.lineTo(9, 18);
            this.ctx.stroke();
            this.ctx.strokeStyle = "rgb(0, 51, 255)";
            this.ctx.beginPath();
            this.ctx.moveTo(1, 1); this.ctx.lineTo(1, 6); this.ctx.lineTo(8, 12);
            this.ctx.moveTo(17, 1); this.ctx.lineTo(17, 6); this.ctx.lineTo(10, 12);
            this.ctx.stroke();
            this.ctx.fillStyle = "rgb(255, 0, 0)";
            this.ctx.strokeStyle = "rgb(255, 0, 0)";
            this.ctx.beginPath();
            this.ctx.moveTo(3, 5); this.ctx.lineTo(9, 0); this.ctx.lineTo(15, 5);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.moveTo(9, 3); this.ctx.lineTo(9, 6);
            this.ctx.stroke();
        }
        drawBell() {
            this.ctx.fillStyle = "rgb(255, 255, 33)";
            this.ctx.beginPath();
            this.ctx.moveTo(1, 15);
            this.ctx.quadraticCurveTo(1, 1, 9, 1);
            this.ctx.quadraticCurveTo(17, 1, 17, 15);
            this.ctx.fill();
            this.ctx.fillStyle = "rgb(0, 222, 222)";
            this.ctx.fillRect(3, 14, 12, 3);
            this.ctx.fillStyle = "rgb(255, 255, 255)";
            this.ctx.fillRect(9, 14, 3, 3);
            this.ctx.strokeStyle = "rgb(255, 255, 255)";
            this.ctx.beginPath();
            this.ctx.moveTo(8, 4);
            this.ctx.quadraticCurveTo(4, 4, 4, 13);
            this.ctx.stroke();
        }
        drawKey() {
            this.ctx.fillStyle = "rgb(0, 222, 222)";
            this.ctx.beginPath();
            this.ctx.arc(6, 3, 3, Math.PI, 1.5*Math.PI, false);
            this.ctx.arc(12, 3, 3, 1.5*Math.PI, 2*Math.PI, false);
            this.ctx.arc(12, 5, 3, 0, 0.5*Math.PI, false);
            this.ctx.arc(6, 5, 3, 0.5*Math.PI, Math.PI, false);
            this.ctx.fill();
            this.ctx.clearRect(6, 2, 6, 2);
            this.ctx.strokeStyle = "rgb(255, 255, 255)";
            this.ctx.beginPath();
            this.ctx.moveTo(8, 8); this.ctx.lineTo(8, 15);
            this.ctx.arc(9.5, 13.5, 1.5, Math.PI, 0, true);
            this.ctx.lineTo(11, 8);
            this.ctx.moveTo(11, 10); this.ctx.lineTo(14, 10);
            this.ctx.moveTo(11, 13); this.ctx.lineTo(14, 13);
            this.ctx.stroke();
        }
    }


    // ============== Blob (Pac-Man) ==============
    class Blob {
        constructor() { this.init(Board.gameCanvas); }
        init(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.context;
            this.tile = Board.startingPos;
            this.tileCenter = Board.getTileXYCenter(this.tile);
            this.x = this.tileCenter.x;
            this.y = this.tileCenter.y;
            this.dir = Board.startingDir;
            this.speed = Data.getLevelData("pmSpeed");
            this.center = true;
            this.turn = null;
            this.delta = null;
            this.mouth = 5;
            this.radius = Board.blobRadius;
            this.sound = 1;
        }
        animate(speed) {
            let newTile = false;
            if (this.center && this.crashed()) this.mouth = 5;
            else if (this.delta) newTile = this.cornering(speed);
            else newTile = this.move(speed);
            this.draw();
            return newTile;
        }
        move(speed) {
            this.x += this.dir.x * this.speed * speed;
            this.y += this.dir.y * this.speed * speed;
            this.moveMouth();
            this.newTile();
            let newTile = this.atCenter();
            this.x = Board.tunnelEnds(this.x);
            return newTile;
        }
        moveMouth() { this.mouth = (this.mouth + 1) % 20; }
        newTile() {
            let tile = Board.getTilePos(this.x, this.y);
            if (!Board.equalTiles(this.tile, tile)) {
                this.tile = tile;
                this.tileCenter = Board.getTileXYCenter(tile);
                this.center = false;
                if (this.turn && this.inBoard(this.turn) && !this.isWall(this.turn)) {
                    this.delta = {x: this.dir.x || this.turn.x, y: this.dir.y || this.turn.y};
                }
            }
        }
        atCenter() {
            if (!this.center && this.passedCenter()) {
                let turn = false;
                if (this.turn && this.inBoard(this.turn) && !this.isWall(this.turn)) {
                    this.dir = this.turn;
                    this.turn = null;
                    turn = true;
                }
                if (turn || this.crashed()) {
                    this.x = this.tileCenter.x;
                    this.y = this.tileCenter.y;
                }
                this.center = true;
                return true;
            }
            return false;
        }
        cornering(speed) {
            this.x += this.delta.x * this.speed * speed;
            this.y += this.delta.y * this.speed * speed;
            if (this.passedCenter()) {
                if (this.dir.x) this.x = this.tileCenter.x;
                if (this.dir.y) this.y = this.tileCenter.y;
                this.dir = this.turn;
                this.turn = null;
                this.delta = null;
                return true;
            }
            return false;
        }
        onEat(atPill, frightenGhosts) {
            if (!atPill) this.sound = 1;
            let key;
            if (frightenGhosts) key = atPill ? "eatingFrightSpeed" : "pmFrightSpeed";
            else key = atPill ? "eatingSpeed" : "pmSpeed";
            this.speed = Data.getLevelData(key);
        }
        getSound() { this.sound = (this.sound + 1) % 2; return this.sound ? "eat2" : "eat1"; }
        makeTurn(turn) {
            if (this.delta) return;
            if (this.turnNow(turn)) { this.dir = turn; this.turn = null; this.center = false; }
            else this.turn = turn;
        }
        draw() {
            let values = [0, 0.2, 0.4, 0.2], mouth = Math.floor(this.mouth / 5), delta = values[mouth];
            this.savePos();
            this.ctx.save();
            this.ctx.fillStyle = "rgb(255, 255, 51)";
            this.ctx.translate(Math.round(this.x), Math.round(this.y));
            this.ctx.rotate(this.getAngle());
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.radius, (1 + delta) * Math.PI, (3 - delta) * Math.PI);
            this.ctx.lineTo(Math.round(this.radius / 3), 0);
            this.ctx.fill();
            this.ctx.restore();
        }
        savePos() { this.canvas.savePos(this.x, this.y); }
        drawDeath(ctx, count) {
            let delta = count / 50;
            ctx.fillStyle = "rgb(255, 255, 51)";
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, (1.5 - delta) * Math.PI, (1.5 + delta) * Math.PI, true);
            ctx.lineTo(0, 0);
            ctx.fill();
        }
        drawCircle(ctx, count) {
            let radius = Math.round(count / 2);
            ctx.strokeStyle = "rgb(159, 159, 31)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * Math.PI, true);
            ctx.stroke();
        }
        crashed() { return this.inBoard(this.dir) && this.isWall(this.dir); }
        passedCenter() {
            return (this.dir.x === 1 && this.x >= this.tileCenter.x) ||
                   (this.dir.x === -1 && this.x <= this.tileCenter.x) ||
                   (this.dir.y === 1 && this.y >= this.tileCenter.y) ||
                   (this.dir.y === -1 && this.y <= this.tileCenter.y);
        }
        turnNow(turn) {
            return (!this.dir.x && !turn.x) || (!this.dir.y && !turn.y) ||
                   (this.center && this.crashed() && this.inBoard(turn) && !this.isWall(turn));
        }
        isWall(turn) { let tile = Board.sumTiles(this.tile, turn); return Board.isWall(tile.x, tile.y); }
        inBoard(turn) { let tile = Board.sumTiles(this.tile, turn); return Board.inBoard(tile.x, tile.y); }
        getAngle() {
            if (this.dir.x === -1) return 0;
            if (this.dir.x === 1) return Math.PI;
            if (this.dir.y === -1) return 0.5 * Math.PI;
            if (this.dir.y === 1) return 1.5 * Math.PI;
        }
        getX() { return this.x; }
        getY() { return this.y; }
        getDir() { return this.dir; }
        getTile() { return this.tile; }
    }


    // ============== Ghost Base Class ==============
    class Ghost {
        init(canvas, dots) {
            this.canvas = canvas;
            this.ctx = canvas.context;
            this.mode = "scatter";
            this.tile = Board.getGhostStartTile(this.inPen);
            this.tileCenter = Board.getTileXYCenter(this.tile);
            this.turn = Board.getGhostStartTurn(this.inPen);
            this.center = false;
            this.dotsCount = dots || 0;
            this.target = this.scatter;
            this.speed = Data.getGhostSpeed(this.inPen);
            this.feet = 0;
            this.path = null;
            this.pathName = null;
            this.pathStep = 0;
        }
        switchMode(oldMode, newMode, blob) {
            if (!this.dontSwitch(oldMode)) {
                this.mode = newMode;
                this.target = this.getTarget(blob);
                this.speed = this.getSpeed();
                if (!this.dontHalfTurn(oldMode)) {
                    if (this.path === null) this.turn = {x: this.dir.x * -1, y: this.dir.y * -1};
                    else this.turn = {x: 1, y: 0};
                }
            }
        }
        move(speed, blob, switchMode) {
            let addToPen = false;
            this.x += this.dir.x * this.speed * speed;
            this.y += this.dir.y * this.speed * speed;
            if (this.path !== null) addToPen = this.pathMove(blob, switchMode);
            else this.normalMove(blob);
            this.moveFeet();
            this.draw();
            return addToPen;
        }
        pathMove(blob, switchMode) {
            let step = this.path[this.pathStep];
            if (this.passedDist()) {
                if (this.dir.x) this.x = step.distx;
                if (this.dir.y) this.y = step.disty;
                if (step.next !== null) {
                    this.pathStep = step.next;
                    this.dir = this.path[this.pathStep].dir;
                } else if (this.pathName === "exitPen") {
                    this.path = null;
                    this.dir = this.turn;
                    this.turn = null;
                    this.speed = Data.getGhostSpeed(false);
                } else if (this.pathName === "enterPen") {
                    this.mode = switchMode;
                    this.target = this.getTarget(blob);
                    this.tile = Board.getGhostStartTile(false);
                    this.tileCenter = Board.getTileXYCenter(this.tile);
                    this.turn = Board.getGhostStartTurn(true);
                    return true;
                }
            }
            return false;
        }
        normalMove(blob) {
            this.newTile(blob);
            this.x = Board.tunnelEnds(this.x);
            if (!this.center && this.passedCenter()) {
                if (this.turn) this.makeTurn();
                if (this.isNextIntersection()) this.decideTurn();
                this.speed = this.getSpeed();
                this.center = true;
            }
        }
        newTile(blob) {
            var tile = Board.getTilePos(this.x, this.y);
            if (!Board.equalTiles(this.tile, tile)) {
                this.tile = tile;
                this.tileCenter = Board.getTileXYCenter(this.tile);
                this.center = false;
                if (this.isEnteringPen()) this.setPath("enterPen");
            }
        }
        setPath(name) {
            this.pathName = name;
            this.pathStep = 0;
            this.path = this.paths[this.pathName];
            this.dir = this.path[this.pathStep].dir;
            this.speed = Data.getPathSpeed(name);
        }
        isEnteringPen() { return this.mode === "eyes" && Board.equalTiles(this.tile, Board.eyesTarget); }
        makeTurn() { this.x = this.tileCenter.x; this.y = this.tileCenter.y; this.dir = this.turn; this.turn = null; }
        decideTurn() {
            let turns = this.getTurns();
            if (turns.length === 1) this.turn = turns[0];
            else if (Data.isFrighten(this.mode)) this.turn = turns[Utils.rand(0, turns.length - 1)];
            else this.turn = this.getTargetTurn(turns);
        }
        getTurns() {
            let tile = this.getNextTile(), pos = Board.tileToString(tile), turns = Board.getTurns(pos), result = [];
            turns.forEach((turn) => { if ((turn + 2) % 4 !== Board.dirToNumber(this.dir)) result.push(Board.numberToDir(turn)); });
            return result;
        }
        getTargetTurn(turns) {
            let tile = this.getNextTile(), best = 999999, result = {};
            turns.forEach((turn) => {
                let ntile = Board.sumTiles(tile, turn);
                let distx = Math.pow(this.target.x - ntile.x, 2);
                let disty = Math.pow(this.target.y - ntile.y, 2);
                let dist = Math.sqrt(distx + disty);
                if (dist < best) { best = dist; result = turn; }
            });
            return result;
        }
        killOrDie(blobTile) {
            if (Board.equalTiles(this.tile, blobTile) && !this.path) {
                if (Data.isFrighten(this.mode)) {
                    this.mode = "eyes";
                    this.target = Board.eyesTarget;
                    this.speed = Data.eyesSpeed;
                    return "kill";
                } else if (this.mode !== "eyes") return "die";
            }
        }
        shouldChangeTarget(globalMode) { return this.mode !== "eyes" && (globalMode === "chase" || this.isElroy()); }
        dontSwitch(mode) { return (Data.isFrighten(mode) && !Data.isFrighten(this.mode)) || this.mode === "eyes"; }
        dontHalfTurn(mode) { return mode === "blue" || mode === "white"; }
        getSpeed() {
            let speed = Data.getGhostSpeed(false);
            if (this.mode === "eyes") speed = Data.eyesSpeed;
            else if (Data.isFrighten(this.mode)) speed = Data.getLevelData("ghostFrightSpeed");
            else if (Board.isTunnel(this.tile.x, this.tile.y)) speed = Data.getLevelData("tunnelSpeed");
            else if (this.isElroy()) speed = Data.getLevelData("elroySpeed" + this.elroyMode);
            return speed;
        }
        passedDist() {
            let path = this.path[this.pathStep];
            return (this.dir.x === 1 && this.x >= path.distx) || (this.dir.x === -1 && this.x <= path.distx) ||
                   (this.dir.y === 1 && this.y >= path.disty) || (this.dir.y === -1 && this.y <= path.disty);
        }
        passedCenter() {
            return (this.dir.x === 1 && this.x >= this.tileCenter.x) || (this.dir.x === -1 && this.x <= this.tileCenter.x) ||
                   (this.dir.y === 1 && this.y >= this.tileCenter.y) || (this.dir.y === -1 && this.y <= this.tileCenter.y);
        }
        getNextTile() { return Board.sumTiles(this.tile, this.dir); }
        isNextIntersection() { let tile = this.getNextTile(); return Board.isIntersection(tile.x, tile.y); }
        getTarget(blob) { if (this.mode === "chase" || this.isElroy()) return this.chase(blob); return this.scatter; }
        isElroy() { return false; }
        activateElroy() { return undefined; }
        increaseDots() { this.dotsCount += 1; }
        setChaseTarget(blob) { this.target = this.chase(blob); }
        moveFeet() { this.feet = (this.feet + 0.3) % 2; }
        draw() {
            let center = Board.ghostSize / 2;
            this.canvas.savePos(this.x, this.y);
            this.ctx.save();
            this.ctx.translate(Math.round(this.x) - center, Math.round(this.y) - center);
            this.ghostBody();
            if (Data.isFrighten(this.mode)) this.ghostFrightenFace();
            else this.ghostNormalFace();
            this.ctx.restore();
        }
        ghostBody() {
            this.ctx.fillStyle = this.getBodyColor();
            this.ctx.beginPath();
            this.ctx.arc(8, 8, 8, Math.PI, 1.5 * Math.PI, false);
            this.ctx.arc(10, 8, 8, 1.5 * Math.PI, 2 * Math.PI, false);
            if (!Math.floor(this.feet)) this.ghostFeet0();
            else this.ghostFeet1();
            this.ctx.fill();
        }
        ghostFeet0() {
            this.ctx.lineTo(18, 16); this.ctx.lineTo(16, 18); this.ctx.lineTo(15, 18);
            this.ctx.lineTo(12, 15); this.ctx.lineTo(9, 18); this.ctx.lineTo(6, 15);
            this.ctx.lineTo(3, 18); this.ctx.lineTo(2, 18); this.ctx.lineTo(0, 16); this.ctx.lineTo(0, 8);
        }
        ghostFeet1() {
            this.ctx.lineTo(18, 18); this.ctx.lineTo(15, 15); this.ctx.lineTo(12, 18);
            this.ctx.lineTo(11, 18); this.ctx.lineTo(9, 15); this.ctx.lineTo(7, 18);
            this.ctx.lineTo(6, 18); this.ctx.lineTo(3, 15); this.ctx.lineTo(0, 18); this.ctx.lineTo(0, 8);
        }
        ghostNormalFace() {
            this.ctx.fillStyle = "rgb(255, 255, 255)";
            this.ctx.beginPath();
            this.ctx.arc(6 + this.dir.x * 2, 7 + this.dir.y * 2, 3, 0, 2 * Math.PI);
            this.ctx.arc(12.5 + this.dir.x * 2, 7 + this.dir.y * 2, 3, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.fillStyle = "rgb(0, 51, 255)";
            this.ctx.beginPath();
            this.ctx.arc(6 + this.dir.x * 4, 7 + this.dir.y * 4, 1.5, 0, 2 * Math.PI);
            this.ctx.arc(12.5 + this.dir.x * 4, 7 + this.dir.y * 4, 1.5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        ghostFrightenFace() {
            this.ctx.fillStyle = this.getFaceColor();
            this.ctx.beginPath();
            this.ctx.arc(6, 7, 1.5, 0, 2 * Math.PI);
            this.ctx.arc(12.5, 7, 1.5, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.strokeStyle = this.getFaceColor();
            this.ctx.beginPath();
            this.ctx.moveTo(3, 14); this.ctx.lineTo(5, 11); this.ctx.lineTo(7, 14);
            this.ctx.lineTo(9, 11); this.ctx.lineTo(11, 14); this.ctx.lineTo(13, 11); this.ctx.lineTo(15, 14);
            this.ctx.stroke();
        }
        getBodyColor() {
            switch (this.mode) {
                case "blue": return "rgb(0, 51, 255)";
                case "white": return "rgb(255, 255, 255)";
                case "eyes": return "rgb(0, 0, 0)";
                default: return this.color;
            }
        }
        getFaceColor() { return this.mode === "blue" ? "rgb(255, 255, 255)" : "rgb(255, 0, 0)"; }
        getID() { return this.id; }
        getX() { return this.x; }
        getY() { return this.y; }
        getTile() { return this.tile; }
        getDots() { return this.dotsCount; }
        getTargetTile() { return this.target; }
    }


    // ============== Ghost Classes ==============
    class Blinky extends Ghost {
        constructor(canvas, dots) {
            super();
            this.paths = {
                exitPen: [{dir:{x:0,y:-1}, disty:138, next:null}],
                enterPen: [{dir:{x:-1,y:0}, distx:168, next:1}, {dir:{x:0,y:1}, disty:174, next:null}]
            };
            this.id = 0; this.x = 168; this.y = 138; this.dir = {x:-1,y:0};
            this.scatter = {x:25,y:-3}; this.inPen = false; this.color = "rgb(221, 0, 0)";
            this.init(canvas, dots);
            this.elroyMode = 0; this.activeElroy = dots !== null;
        }
        chase(blob) { return blob.getTile(); }
        checkElroyDots(dots) {
            if (dots === Data.getLevelData("elroyDotsLeft1") || dots === Data.getLevelData("elroyDotsLeft2")) this.elroy += 1;
        }
        isElroy() { return this.activeElroy && this.elroy > 0; }
        activateElroy() { this.activeElroy = true; }
    }

    class Pinky extends Ghost {
        constructor(canvas, dots) {
            super();
            this.paths = {
                inPen: [{dir:{x:0,y:-1}, disty:168, next:1}, {dir:{x:0,y:1}, disty:180, next:0}],
                exitPen: [{dir:{x:0,y:-1}, disty:138, next:null}],
                enterPen: [{dir:{x:-1,y:0}, distx:168, next:1}, {dir:{x:0,y:1}, disty:174, next:null}]
            };
            this.id = 1; this.x = 168; this.y = 174;
            this.scatter = {x:2,y:-3}; this.inPen = true; this.color = "rgb(255, 153, 153)";
            this.init(canvas, dots);
            this.setPath("inPen");
        }
        chase(blob) {
            let targetx = blob.getTile().x + 4 * blob.getDir().x;
            let targety = blob.getTile().y + 4 * blob.getDir().y;
            if (blob.getDir().y === -1) targetx -= 4;
            return {x: targetx, y: targety};
        }
    }

    class Inky extends Ghost {
        constructor(canvas, dots, blinky) {
            super();
            this.paths = {
                inPen: [{dir:{x:0,y:-1}, disty:168, next:1}, {dir:{x:0,y:1}, disty:180, next:0}],
                exitPen: [{dir:{x:1,y:0}, distx:168, next:1}, {dir:{x:0,y:-1}, disty:138, next:null}],
                enterPen: [{dir:{x:-1,y:0}, distx:168, next:1}, {dir:{x:0,y:1}, disty:174, next:2}, {dir:{x:-1,y:0}, distx:144, next:null}]
            };
            this.id = 2; this.x = 144; this.y = 174;
            this.scatter = {x:27,y:31}; this.inPen = true; this.color = "rgb(102, 255, 255)";
            this.blinky = blinky;
            this.init(canvas, dots);
            this.setPath("inPen");
        }
        chase(blob) {
            let offsetx = blob.getTile().x + 2 * blob.getDir().x;
            let offsety = blob.getTile().y + 2 * blob.getDir().y;
            if (blob.getDir().y === -1) offsetx -= 2;
            return {x: offsetx * 2 - this.blinky.getTile().x, y: offsety * 2 - this.blinky.getTile().y};
        }
    }

    class Clyde extends Ghost {
        constructor(canvas, dots) {
            super();
            this.paths = {
                inPen: [{dir:{x:0,y:-1}, disty:168, next:1}, {dir:{x:0,y:1}, disty:180, next:0}],
                exitPen: [{dir:{x:-1,y:0}, distx:168, next:1}, {dir:{x:0,y:-1}, disty:138, next:null}],
                enterPen: [{dir:{x:-1,y:0}, distx:168, next:1}, {dir:{x:0,y:1}, disty:174, next:2}, {dir:{x:1,y:0}, distx:192, next:null}]
            };
            this.id = 3; this.x = 192; this.y = 174;
            this.scatter = {x:0,y:31}; this.inPen = true; this.color = "rgb(255, 153, 0)";
            this.init(canvas, dots);
            this.setPath("inPen");
        }
        chase(blob) {
            let x = Math.pow(this.tile.x - blob.getTile().x, 2);
            let y = Math.pow(this.tile.y - blob.getTile().y, 2);
            if (Math.sqrt(x + y) > 8) return blob.getTile();
            return this.scatter;
        }
    }

    // ============== Ghosts Manager ==============
    class Ghosts {
        constructor(oldManager) {
            this.globalMode = "scatter";
            this.modeCounter = 0;
            this.modeTimer = Data.getSwitchTime(0);
            this.frightTimer = 0;
            this.blinksCount = 0;
            this.eyesCounter = 0;
            var canvas = Board.gameCanvas;
            this.blinky = new Blinky(canvas, oldManager ? oldManager.blinky.getDots() : null);
            this.pinky = new Pinky(canvas, oldManager ? oldManager.pinky.getDots() : null);
            this.inky = new Inky(canvas, oldManager ? oldManager.inky.getDots() : null, this.blinky);
            this.clyde = new Clyde(canvas, oldManager ? oldManager.clyde.getDots() : null);
            this.ghosts = [this.blinky, this.pinky, this.inky, this.clyde];
            this.penType = !!oldManager;
            this.penTimer = 0;
            this.globalDots = 0;
            this.inPen = [this.pinky, this.inky, this.clyde];
            if (!this.penType) this.inPen.forEach(() => this.checkDotLimit());
        }
        animate(time, speed, blob) {
            if (this.frightTimer > 0) this.frightTimer -= time;
            else if (this.modeCounter < Data.totalSwitchs && this.modeTimer > 0) this.modeTimer -= time;
            this.switchMode(blob);
            this.move(speed, blob);
            this.increasePenTimer(time);
        }
        switchMode(blob) {
            let oldMode = this.globalMode;
            if (Data.isFrighten(this.globalMode) && this.frightTimer <= 0) {
                this.blinksCount -= 1;
                if (this.blinksCount >= 0) {
                    this.frightTimer = Data.blinksTimer;
                    this.globalMode = this.globalMode === "white" ? "blue" : "white";
                } else this.globalMode = this.getSwitchMode();
                this.switchGhostsMode(oldMode, blob);
            } else if (this.modeTimer <= 0) {
                this.modeCounter += 1;
                this.globalMode = this.getSwitchMode();
                this.modeTimer = Data.getSwitchTime(this.modeCounter);
                this.switchGhostsMode(oldMode, blob);
            }
        }
        switchGhostsMode(oldMode, blob) { this.ghosts.forEach((ghost) => ghost.switchMode(oldMode, this.globalMode, blob)); }
        move(speed, blob) {
            let mode = this.getSwitchMode();
            this.ghosts.forEach((ghost) => { if (ghost.move(speed, blob, mode)) this.addGhostToPen(ghost); });
        }
        draw() { this.ghosts.forEach((ghost) => ghost.draw()); }
        setTargets(blob) { this.ghosts.forEach((ghost) => { if (ghost.shouldChangeTarget(this.globalMode)) ghost.setChaseTarget(blob, this.blinky); }); }
        checkElroyDots(dots) { this.blinky.checkElroyDots(dots); }
        frighten(blob) {
            var oldMode = this.globalMode;
            this.globalMode = "blue";
            this.frightTimer = Data.getFrightTime();
            this.blinksCount = Data.getBlinks();
            this.eyesCounter = 0;
            this.switchGhostsMode(oldMode, blob);
        }
        crash(blobTile, onKill, onDie) {
            this.ghosts.some((ghost) => {
                let result = ghost.killOrDie(blobTile);
                if (result === "kill") { this.eyesCounter += 1; onKill(this.eyesCounter, ghost.getTile()); }
                else if (result === "die") onDie();
                return !!result;
            });
        }
        getSwitchMode() { return this.modeCounter % 2 === 0 ? "scatter" : "chase"; }
        getMode() { return this.globalMode; }
        areFrighten() { return Data.isFrighten(this.globalMode); }
        incDotCounter() { if (!this.penType) this.incGhostsDots(); else this.incGlobalDots(); }
        incGhostsDots() { if (this.inPen.length > 0) { this.inPen[0].increaseDots(); this.checkDotLimit(); } }
        checkDotLimit() {
            let limits = Data.getLevelData("penLeavingLimit"), ghost = this.inPen[0];
            if (limits[ghost.getID()] <= ghost.getDots()) this.releaseGhostFromPen();
        }
        incGlobalDots() {
            this.globalDots += 1;
            this.inPen.forEach((ghost) => {
                if (this.globalDots === Data.getPenDotsCount(ghost.getID())) {
                    if (ghost.getID() <= 2) this.releaseGhostFromPen();
                    else { this.penType = false; this.globalDots = 0; }
                }
            });
        }
        increasePenTimer(time) {
            this.penTimer += time;
            if (this.inPen.length > 0 && this.penTimer >= Data.getPenForceTime()) {
                this.releaseGhostFromPen();
                this.penTimer = 0;
            }
        }
        resetPenTimer() { this.penTimer = 0; this.incDotCounter(); }
        releaseGhostFromPen() {
            let ghost = this.inPen[0];
            ghost.setPath("exitPen");
            ghost.activateElroy();
            this.inPen = this.inPen.slice(1);
        }
        addGhostToPen(ghost) {
            if (ghost.getID() === 0) ghost.setPath("exitPen");
            else {
                let i = 0;
                while (i < this.inPen.length && this.inPen[i].getID() <= ghost.getID()) i += 1;
                this.inPen.splice(i, 0, ghost);
                ghost.setPath("inPen");
                if (!this.penType) this.checkDotLimit();
            }
        }
    }


    // ============== Score ==============
    class Score {
        constructor() {
            this.canvas = Board.boardCanvas;
            this.ctx = this.canvas.context;
            this.score = 0; this.level = 1; this.lives = 2; this.bonus = 0; this.ghosts = 0;
            this.textTop = 32.5; this.scoreLeft = 3.2; this.livesLeft = 16.3;
            this.scoreMargin = 0.5; this.scoreWidth = 7; this.scoreHeight = 2;
            this.scoreColor = "rgb(255, 255, 51)";
            this.fruitTile = {x:26, y:31.5};
            this.blobs = [new ScoreBlob(0), new ScoreBlob(1)];
            this.food = new Fruit();
        }
        draw() {
            this.drawTexts();
            this.drawScore();
            this.blobs.forEach((blob) => blob.draw());
            this.food.draw(this.fruitTile);
        }
        incScore(amount) {
            this.score += amount;
            if (this.score > Data.extraLife * Math.pow(10, this.bonus)) {
                if (this.lives < 4) this.incLife(true);
                this.bonus += 1;
            }
            this.drawScore();
        }
        incLife(isIncrease) {
            this.lives += isIncrease ? 1 : -1;
            if (isIncrease) { let blob = new ScoreBlob(this.lives - 1); this.blobs.push(blob); blob.draw(); }
            else if (this.blobs.length) { let blob = this.blobs.pop(); blob.clear(); }
        }
        newLevel() { this.level += 1; this.ghosts = 0; Data.level = this.level; }
        pill(value) { this.incScore(value * Data.pillMult); }
        fruit() { let score = Data.getLevelData("fruitScore"); this.incScore(score); return score; }
        kill(amount) {
            var score = Data.getGhostScore(amount);
            this.incScore(score);
            if (amount === 4) { this.ghosts += 1; if (this.ghosts === 4) this.incScore(Data.eyesBonus); }
            return score;
        }
        died() { this.incLife(false); return this.lives >= 0; }
        drawTexts() {
            this.canvas.drawText({text:"Score", size:1.8, pos:{x:this.scoreLeft, y:this.textTop}});
            this.canvas.drawText({text:"Lives", size:1.8, pos:{x:this.livesLeft, y:this.textTop}});
        }
        drawScore() {
            let left = this.ctx.measureText("Score").width;
            let margin = this.scoreMargin * Board.tileSize;
            let top = this.textTop * Board.tileSize;
            let width = this.scoreWidth * Board.tileSize + margin / 2;
            let height = this.scoreHeight * Board.tileSize;
            this.ctx.save();
            this.ctx.fillStyle = this.scoreColor;
            this.ctx.textAlign = "left";
            this.ctx.font = "1.8em 'Whimsy TT'";
            this.ctx.clearRect(left + margin / 2, top - height / 2 - 2, width, height + 2);
            this.ctx.fillText(this.score, left + margin, top);
            this.ctx.restore();
        }
        getLevel() { return this.level; }
        getScore() { return this.score; }
    }

    class ScoreBlob extends Blob {
        constructor(number) {
            super();
            this.init(Board.boardCanvas);
            this.tile = {x:19.5, y:31.8};
            this.x = Board.getTileCenter(this.tile.x + number * 1.4);
            this.y = Board.getTileCenter(this.tile.y);
            this.dir = Board.startingDir;
        }
        clear() { this.ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); }
    }

    // ============== Animations ==============
    class Animation {
        constructor() { this.time = 0; }
        incTimer(time) { this.time += time; }
        isAnimating() { return this.endTime > this.time; }
        blocksGameLoop() { return this.blocksGame; }
        animate() { return undefined; }
        onEnd() {
            if (this.canvas) {
                if (this.clearAll) this.canvas.clear();
                else this.canvas.clearSavedRects();
            }
            if (this.callback) this.callback();
        }
    }

    class ReadyAnimation extends Animation {
        constructor(canvas, callback) {
            super();
            this.canvas = canvas; this.callback = callback;
            this.blocksGame = true; this.endTime = 3000;
            this.canvas.drawText({color:"rgb(255, 255, 51)", text:"Ready!", pos:{x:14, y:17.3}});
        }
    }

    class PausedAnimation extends Animation {
        constructor(canvas) {
            super();
            this.canvas = canvas; this.blocksGame = true;
            this.timePart = 500; this.maxSize = 2.2; this.minSize = 1.5; this.clearAll = true;
        }
        isAnimating() { return true; }
        animate() {
            let time = this.time % this.timePart;
            let anim = Math.floor(this.time / this.timePart) % 2;
            let part = time * (this.maxSize - this.minSize) / this.timePart;
            let size = anim ? this.maxSize - part : this.minSize + part;
            this.canvas.clear();
            this.canvas.fill(0.8);
            this.canvas.drawText({size:size, color:"rgb(255, 255, 51)", text:"Paused!", pos:{x:14, y:17.3}, alpha:0.8});
        }
    }

    class DeathAnimation extends Animation {
        constructor(canvas, blob, callback) {
            super();
            this.canvas = canvas; this.ctx = canvas.context;
            this.blob = blob; this.callback = callback;
            this.blocksGame = true; this.endTime = 1350;
            this.x = blob.getX(); this.y = blob.getY();
        }
        animate() {
            let count = Math.round(this.time / 15);
            this.canvas.clearSavedRects();
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            if (this.time < 750) this.blob.drawDeath(this.ctx, count);
            else if (this.time < 1050) this.blob.drawCircle(this.ctx, count - 50);
            else this.blob.drawCircle(this.ctx, count - 70);
            this.ctx.restore();
            this.canvas.savePos(this.x, this.y);
        }
    }

    class GameOverAnimation extends Animation {
        constructor(canvas, callback) {
            super();
            this.canvas = canvas; this.callback = callback;
            this.blocksGame = true; this.endTime = 2000;
        }
        animate() {
            let size = Math.round(this.endTime - this.time) / 700;
            let alpha = Math.round(this.endTime - this.time) / 2000;
            this.canvas.clear();
            this.canvas.fill(0.8);
            this.canvas.drawText({size:Math.max(2, size), color:"rgba(255, 0, 0, " + Math.max(0, alpha) + ")", text:"Game Over", pos:{x:14, y:17.3}, alpha:0.8});
        }
    }

    class GhostScoreAnimation extends Animation {
        constructor(canvas, text, pos) {
            super();
            this.canvas = canvas; this.text = text; this.pos = pos;
            this.blocksGame = true; this.endTime = 1000;
        }
        animate() {
            let size = Math.min(0.2 + Math.round(this.time * 100 / 500) / 100, 1);
            this.canvas.clearSavedRects();
            this.canvas.drawText({size:size, color:"rgb(51, 255, 255)", text:this.text, pos:{x:this.pos.x+0.5, y:this.pos.y+0.5}});
            if (this.time > 200) this.blocksGame = false;
        }
    }

    class FruitScoreAnimation extends Animation {
        constructor(canvas, text, pos) {
            super();
            this.canvas = canvas; this.text = text; this.pos = pos;
            this.blocksGame = true; this.endTime = 2400;
        }
        animate() {
            let color = "rgb(255, 184, 255)";
            if (this.time > 200 && this.time < 2400) {
                let alpha = this.time < 1000 ? 1 : 1 - Math.round((this.time - 1000) * 1.25) / 2000;
                color = "rgba(255, 184, 255, " + alpha + ")";
            }
            this.canvas.clear();
            this.canvas.drawText({size:1, color:color, text:this.text, pos:{x:this.pos.x+0.5, y:this.pos.y+0.5}});
            if (this.time > 200) this.blocksGame = false;
        }
    }

    class EndLevelAnimation extends Animation {
        constructor(callback) {
            super();
            this.callback = callback; this.blinks = 0;
            this.blocksGame = true; this.blinkTimer = 150; this.endTime = 1600;
        }
        animate() {
            if (this.time > this.blinkTimer) {
                Board.boardCanvas.clear();
                Board.drawBoard(this.blinks % 2 === 0);
                this.blinks += 1;
                this.blinkTimer += 150;
            }
        }
    }

    class NewLevelAnimation extends Animation {
        constructor(canvas, level, callback) {
            super();
            this.canvas = canvas; this.level = level; this.callback = callback;
            this.blinks = 0; this.blocksGame = true; this.blinkTimer = 150;
            this.endTime = 2000; this.clearAll = true;
        }
        animate() {
            let calc = Math.round(this.time * 0.03);
            let pos = calc < 17.15 ? calc - 2 : 15;
            let lvl = (this.level < 10 ? "0" : "") + this.level;
            let right = Board.cols;
            this.canvas.clear();
            this.canvas.fill(0.8);
            this.canvas.drawText({color:"rgb(255,255,255)", align:"right", text:"Level", pos:{x:pos, y:17.3}});
            this.canvas.drawText({color:"rgb(255,255,51)", align:"left", text:lvl, pos:{x:right-pos+2, y:17.3}});
        }
    }

    class Animations {
        constructor() { this.canvas = Board.screenCanvas; this.animations = []; }
        isAnimating() { return this.animations.length && this.animations.some((anim) => anim.blocksGameLoop()); }
        animate(time) {
            if (this.animations.length) {
                this.animations.forEach((animation, index, object) => {
                    animation.incTimer(time);
                    if (animation.isAnimating()) animation.animate();
                    else { animation.onEnd(); object.splice(index, 1); }
                });
            }
        }
        endAll() { this.animations.forEach((anim) => anim.onEnd()); this.animations = []; }
        add(animation) { this.animations.push(animation); }
        ready(callback) { this.add(new ReadyAnimation(this.canvas, callback)); }
        paused() { this.add(new PausedAnimation(this.canvas)); }
        death(blob, callback) { this.add(new DeathAnimation(this.canvas, blob, callback)); }
        gameOver(callback) { this.add(new GameOverAnimation(this.canvas, callback)); }
        ghostScore(score, pos) { this.add(new GhostScoreAnimation(this.canvas, score, pos)); }
        fruitScore(score, pos) { this.add(new FruitScoreAnimation(this.canvas, score, pos)); }
        endLevel(callback) { this.add(new EndLevelAnimation(callback)); }
        newLevel(level, callback) { this.add(new NewLevelAnimation(this.canvas, level, callback)); }
    }


    // ============== Main Game ==============
    let display, animations, sounds, score, food, fruit, ghosts, blob;
    let animation, startTime;
    const soundFiles = ["start", "death", "eat1", "eat2", "kill"];

    function gameOver() {
        display.set("ready");
        animations.gameOver(() => {
            food = null; fruit = null; ghosts = null; blob = null;
            Board.clearAll();
            display.set("gameOver").show();
            document.getElementById("final-score").textContent = score.getScore();
        });
    }

    function createPlayers(newLife) {
        ghosts = new Ghosts(newLife ? ghosts : null);
        blob = new Blob();
        blob.draw();
        ghosts.draw();
        animations.ready(() => display.set("playing"));
    }

    function blobEating() {
        let tile = blob.getTile(), atPill = food.isAtPill(tile);
        if (atPill) {
            let value = food.eatPill(tile), total = food.getLeftPills();
            fruit.add(total);
            score.pill(value);
            ghosts.resetPenTimer();
            ghosts.checkElroyDots(total);
            if (value === Data.energizerValue) ghosts.frighten(blob);
            sounds[blob.getSound()]();
        } else if (fruit.isAtPos(tile)) {
            let text = score.fruit();
            fruit.eat();
            animations.fruitScore(text, Board.fruitTile);
        }
        blob.onEat(atPill, ghosts.areFrighten());
    }

    function ghostCrash() {
        ghosts.crash(blob.getTile(), (eyesCounter, tile) => {
            let text = score.kill(eyesCounter);
            animations.ghostScore(text, tile);
            sounds.kill();
        }, () => {
            Board.clearGame();
            animations.death(blob, newLife);
            sounds.death();
        });
    }

    function newLife() {
        if (!score.died()) gameOver();
        else { display.set("ready"); createPlayers(true); }
    }

    function newLevel() {
        animations.newLevel(score.getLevel(), () => {
            food = new Food();
            fruit = new Fruit();
            Board.clearGame();
            food.draw();
            score.draw();
            createPlayers(false);
        });
    }

    function requestAnimation() {
        startTime = new Date().getTime();
        animation = window.requestAnimationFrame(() => {
            let time = new Date().getTime() - startTime;
            let speed = time / 16;
            if (speed > 5) return requestAnimation();
            if (animations.isAnimating()) animations.animate(time);
            else if (display.isPlaying()) {
                Board.clearGame();
                food.wink();
                fruit.reduceTimer(time);
                ghosts.animate(time, speed, blob);
                let newTile = blob.animate(speed);
                animations.animate(time);
                if (newTile) { ghosts.setTargets(blob); blobEating(); }
                if (food.getLeftPills() === 0) { score.newLevel(); animations.endLevel(newLevel); }
                ghostCrash();
            }
            requestAnimation();
        });
    }

    function cancelAnimation() { window.cancelAnimationFrame(animation); }

    function newGame() {
        display.set("ready").show();
        cancelAnimation();
        score = new Score();
        food = new Food();
        fruit = new Fruit();
        Board.drawBoard();
        food.draw();
        score.draw();
        createPlayers(false);
        requestAnimation();
        sounds.start();
    }

    function togglePause() {
        if (display.isPaused()) { display.set("playing"); animations.endAll(); }
        else { display.set("paused"); animations.paused(); }
    }

    // ============== Touch Controls ==============
    function setupTouchControls() {
        const dpadBtns = document.querySelectorAll('.dpad-btn');
        dpadBtns.forEach(btn => {
            const handleTouch = (e) => {
                e.preventDefault();
                if (!blob || !display.isPlaying()) return;
                const dir = btn.dataset.dir;
                switch(dir) {
                    case 'up': blob.makeTurn({x:0, y:-1}); break;
                    case 'down': blob.makeTurn({x:0, y:1}); break;
                    case 'left': blob.makeTurn({x:-1, y:0}); break;
                    case 'right': blob.makeTurn({x:1, y:0}); break;
                }
            };
            btn.addEventListener('touchstart', handleTouch, {passive: false});
            btn.addEventListener('mousedown', handleTouch);
        });

        const pauseBtn = document.getElementById('pause-btn');
        pauseBtn.addEventListener('click', () => {
            if (display.isPlaying()) togglePause();
        });

        // Swipe controls
        let touchStartX = 0, touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.dpad') || e.target.closest('#pause-btn')) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, {passive: true});

        document.addEventListener('touchend', (e) => {
            if (e.target.closest('.dpad') || e.target.closest('#pause-btn')) return;
            if (!blob || !display.isPlaying()) return;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            const minSwipe = 30;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
                blob.makeTurn({x: dx > 0 ? 1 : -1, y: 0});
            } else if (Math.abs(dy) > minSwipe) {
                blob.makeTurn({x: 0, y: dy > 0 ? 1 : -1});
            }
        }, {passive: true});
    }

    // ============== Scaling ==============
    function scaleGame() {
        const container = document.getElementById('container');
        const gameWidth = 336;
        const gameHeight = 396;
        const padding = 180; // Space for touch controls
        const availWidth = window.innerWidth;
        const availHeight = window.innerHeight - padding;
        const scaleX = availWidth / gameWidth;
        const scaleY = availHeight / gameHeight;
        const scale = Math.min(scaleX, scaleY, 2);
        container.style.setProperty('--scale', scale);
    }

    // ============== Init ==============
    function main() {
        Board.create();
        display = new Display(() => {});
        animations = new Animations();
        sounds = new Sounds(soundFiles, "pacman.sound");

        document.body.addEventListener("click", (e) => {
            let element = Utils.getTarget(e);
            if (element.dataset.action === "play") { newGame(); e.preventDefault(); }
            else if (element.dataset.action === "mainScreen") { display.set("mainScreen").show(); e.preventDefault(); }
        });

        setupTouchControls();
        scaleGame();
        window.addEventListener('resize', scaleGame);
    }

    window.addEventListener("load", main, false);

})();
