const querystr = window.location.search;
const params = new URLSearchParams(querystr);
const query = params.get('query');

function createKeymap(obj) {
    let result = {
        url: {},
        domain: {}
    };

    obj.url.forEach((value, index) => {
        result.url[value.url] = index;
    });
    obj.domain.forEach((value, index) => {
        result.domain[value.domain] = index;
    });

    return result;
}

function urlFromDomain(data, domain) {
    let result = []
    let keymap = createKeymap(data);
    let tmp = keymap.domain[domain];
    let urlset = data.domain[tmp].urlset;
    urlset.forEach((val) => {
        result.push(data.url[val]);
    });
    return result;
}

function getAgo(time) {
    let posted = time;

    let diff = new Date().getTime() - posted.getTime();

    let progress = new Date(diff);

    let ago;

    if (progress.getUTCFullYear() - 1970) {
        ago = progress.getUTCFullYear() - 1970 + '年前';
    } else if (progress.getUTCMonth()) {
        ago = progress.getUTCMonth() + 'ヶ月前';
    } else if (progress.getUTCDate() - 1) {
        ago = progress.getUTCDate() - 1 + '日前';
    } else if (progress.getUTCHours()) {
        ago = progress.getUTCHours() + '時間前';
    } else if (progress.getUTCMinutes()) {
        ago = progress.getUTCMinutes() + '分前';
    } else {
        ago = 'たった今';
    }
    return ago;
}

function buileHTML(data, query) {
    let add, flg;
    if (query == undefined) {
        add = data.domain;
        flg = "domain";
    } else {
        add = urlFromDomain(data, query);
        flg = "url";
    }

    console.log(add);

    let html = "";
    html += '<table id="mytable">'
    html += '<thead>'
    html += '<tr>'
    html += '<th>#</th>'
    html += `<th>${flg}</th>`
    html += '<th>Time</th>'
    html += '<th>Recent</th>'
    html += '</tr>'
    html += '</thead>'

    add.forEach((element, index) => {
        if (flg == "url") {
            flg = element.url;
        } else {
            flg = element.domain;
        }
        let recent = getAgo(new Date(element.recent));
        
        html += '<tbody>'
        html += '<tr>'
        html += `<td>${index}</td>`
        html += `<td>${flg}</td>`
        html += `<td>${element.timerdisplay}</td>`
        html += `<td>${recent}</td>`
        html += '</tr>'
    });
    html += '</tbody>'
    html += '</table>'

    let main_element = document.getElementById("main");
    main_element.insertAdjacentHTML("beforeend", html);
}



chrome.storage.local.get(null, function (data) {
    console.log(data);
    buileHTML(data);
});
