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
        this.URLlatestid = 0;
        this.DOMAINlatestid = 0;
        this.first = true;
    }

    add(url, title) {
        // :before
        console.log(this.result);
        this.latestobj.stop();
        let time = this.latestobj.time;                     // 前回addからの経過時間
        console.log(time);
        let URLcurrent = this.result.url[this.URLlatestid].timer; // 現在のtime
        let DOMAINcurrent = this.result.domain[this.DOMAINlatestid].timer; // 現在のtime
        this.result.url[this.URLlatestid].timer += time;       // 現在のtimeに加算
        this.result.domain[this.DOMAINlatestid].timer += time;    // 現在のtimeに加算
        URLcurrent = this.result.url[this.URLlatestid].timer;     // tmp
        DOMAINcurrent = this.result.domain[this.DOMAINlatestid].timer; // tmp
        this.result.url[this.URLlatestid].timerdisplay = this.latestobj.formatTime(URLcurrent);   // 表示用に変換, 更新
        this.result.domain[this.DOMAINlatestid].timerdisplay = this.latestobj.formatTime(DOMAINcurrent); // 表示用に変換, 更新
        this.result.url[this.URLlatestid].recent = new Date();       // 最新の経過時間
        this.result.domain[this.DOMAINlatestid].recent = new Date();    // 最新の経過時間

        // let domain = this.getdomain(url);
        let found = this.find(url, 0); // usrl

        // :after
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
            this.URLlatestid = this.n;

        } else {        // result already exists
            let timerobj = new Timer();
            let current = this.result.url[found].timer;
            timerobj.start(current);
            this.latestobj = timerobj;
            this.URLlatestid = found;
        }
    }

    _reload() {
        this.add("https://example.com/example", "example");
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



async function getTabInfo(from) { //  awaitはpromiseのresolveを待ち、その値を返す、rejectされた場合はエラーを投げる
    // console.log(from);
    let tabinfo = {
        "forcus": {
            "url": "",
            "title": ""
        },
        "audio": {
            "url": "",
            "title": "",
        }
    };
    
    let forcus = await chrome.tabs.query({ active: true, currentWindow: true });
    tabinfo.forcus.url = forcus[0].url;
    tabinfo.forcus.title = forcus[0].title;
    
    try {
        let audio = await chrome.tabs.query({ audible: true });
        tabinfo.audio.url = audio[0].url;
        tabinfo.audio.title = audio[0].title;
    } catch (error) {
        console.log("audible: None");
    }
    return tabinfo;
}

let tabtimer = new TabTimer();
let flg = false;

// tabtimer.add("https://example.com/example100", "example"); // 3seconds
// console.log(tabtimer);

// setTimeout(() => { 
//     tabtimer.add("https://example.com/example2", "example2"); // 4seconds
//     console.log(tabtimer);
//     setTimeout(() => { 
//         tabtimer.add("https://example.com/example100", "example"); // 5seconds
//         console.log(tabtimer);
//         setTimeout(() => { 
//             tabtimer.add("https://example.com/example3", "example"); // 00
//             console.log(tabtimer);
//         }, 5000);    
//     }, 4000);
// }, 3000);


chrome.tabs.onActivated.addListener(async function (activeInfo) {
    if (flg) {
        return;
    } else {
        flg = true;
        setTimeout(() => { flg = false; }, 100);
    }
    console.log("onActivated");
    let data = await getTabInfo()
    tabtimer.add(data.forcus.url, data.forcus.title);
});

chrome.windows.onFocusChanged.addListener(async function (windowId) {
    if (flg) {
        return;
    } else {
        flg = true;
        setTimeout(() => { flg = false; }, 100);
    }
    if (windowId != -1) {
        console.log("onFocusChanged");
        let data = await getTabInfo()
        tabtimer.add(data.forcus.url, data.forcus.title);
    }
});

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (flg) {
        return;
    } else {
        flg = true;
        setTimeout(() => { flg = false; }, 100);
    }
    if (changeInfo.url != undefined) {
        console.log("onUpdated");
        let data = await getTabInfo()
        tabtimer.add(data.forcus.url, data.forcus.title);
        }
});