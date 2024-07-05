"use strict";
import { Timer } from "./timer.js";

class TabTimer {
    constructor() {
        this.n = 0;
        this.recent;
        this.result =
        {
            "url": [
                {
                    "urlID": 0,
                    "title": "example",
                    "url": "https://example.com/example",
                    "timer": 0,
                    "timerdisplay": "0:0:0:0",
                    "recent": 0,
                }
            ],
            "domain": [
                {
                    "domainID": 0,
                    "domain": "example.com",
                    "timer": 0,
                    "timerdisplay": "0:0:0:0",
                    "recent": 0,
                }
            ]
        }
        this.urlkeymap = {};
        this.domainkeymap = {};
        this.updateKeymap();
        this.latestobj = new Timer();
        this.latestobj.start();
        this.latestid = 0;
        this.first = true;
    }

    add(url, title) {
        // before obj 
        console.log(this.result);
        this.latestobj.stop();
        let time = this.latestobj.time;                     // 前回addからの経過時間
        let current = this.result.url[this.latestid].timer; // 現在のtime
        this.result.url[this.latestid].timer += time;       // 現在のtimeに加算
        current = this.result.url[this.latestid].timer;     // tmp
        this.result.url[this.latestid].timerdisplay = this.latestobj.formatTime(current);   // 表示用に変換, 更新
        this.result.url[this.latestid].recent = new Date();       // 最新の経過時間

        // let domain = this.getdomain(url);
        let found = this.find(url, 0); // url

        if (!found) {    // result does not exist
            this.n++;
            this.result.url.push({
                "urlID": this.n,
                "title": title,
                "url": url,
                "timer": 0,
                "timerdisplay": "0:0:0:0",
                "recent": 0,
            });
            let timerobj = new Timer();
            timerobj.start();

            this.latestobj = timerobj;
            this.latestid = this.n;

        } else {        // result already exists
            let timerobj = new Timer();
            let current = this.result.url[found].timer;
            timerobj.start(current);
            this.latestobj = timerobj;
            this.latestid = found;
        }
    }    

    getdomain(url) {
        let dmain = url.split("/")[2];
        return dmain;
    }

    updateKeymap() {
        this.result.url.forEach((value, index) => {
            this.urlkeymap[value.url] = index;
        });
        this.result.domain.forEach((value, index) => {
            this.domainkeymap[value.domain] = index;
        });
    }

    find(arg, type) { // type: 0 = url, 1 = domain, arg: url or domain
        this.updateKeymap();
        let keymaps;
        if (type == 0) {
            keymaps = this.urlkeymap;
        } else {
            keymaps = this.domainkeymap;
        }

        let set = Object.keys(keymaps);
        let res;

        if (set.includes(arg)) {
            res = keymaps[arg];
        } else {
            res = false;
        }

        return res;
    }
}

// tabtimer.add("https://example.com/example", "example"); // 3seconds
// console.log(tabtimer);

// setTimeout(() => { 
//     tabtimer.add("https://example.com/example2", "example2"); // 4seconds
//     console.log(tabtimer);
//     setTimeout(() => { 
//         tabtimer.add("https://example.com/example", "example"); // 5seconds
//         console.log(tabtimer);
//         setTimeout(() => { 
//             tabtimer.add("https://example.com/example3", "example"); // 00
//             console.log(tabtimer);
//         }, 5000);    
//     }, 4000);
// }, 3000);

const gettabs = function (from) {
    console.log(from);
    let forcus = chrome.tabs.query({ active: true, currentWindow: true });
    let audio = chrome.tabs.query({ audible: true });

    console.log(forcus);
    return [forcus, audio];
    console.log(then(forcus));

    forcus.then(function (data) {
        console.log("forcus: " + data[0].url);

    });

    audio.then(function (data) {
        console.log("audible: " + data[0].url);
    })
        .catch(function (error) {
            console.log("audible: None");
        });
    
    return {forcus, audio};
}

let tabtimer = new TabTimer();

chrome.tabs.onActivated.addListener(function (activeInfo) {
    let tab = gettabs("onActivated");
    tab[0].then(function (data) {
        console.log(data[0].url);
    });
});

chrome.windows.onFocusChanged.addListener(function (windowId) {
    if (windowId != -1) {
        gettabs("onFocusChanged");
    }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url != undefined) {
        gettabs("onUpdated");
    }
});