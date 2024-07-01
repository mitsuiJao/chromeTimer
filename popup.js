"use strict";
importScripts("timer.js");

const gettabs = function (from) {
    console.log(from);
    let tabs = chrome.tabs.query({ active: true, currentWindow: true });
    tabs.then(function (data) {
        console.log(data[0].url);
    });
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
    // タブがアクティブになった時の処理
    gettabs("onActivated");
});

chrome.windows.onFocusChanged.addListener(function (windowId) {
    // ウィンドウがアクティブになった時の処理
    if (windowId != -1) {
        gettabs("onFocusChanged");
    }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // タブの情報が更新された時の処理
    if (changeInfo.url != undefined) {
        gettabs("onUpdated");
    }
});

