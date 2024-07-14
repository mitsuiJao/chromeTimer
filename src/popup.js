const querystr = window.location.search;
const params = new URLSearchParams(querystr);
const query = params.get('query');
if (query == "") {
    query  = "domain";
}

function createKeymap(obj) {
    let result = {
        url: [],
        domain: []
    };

    obj.url.forEach((value, index) => {
        result.url[value.url] = index;
    });
    obj.domain.forEach((value, index) => {
        result.domain[value.domain] = index;
    });

    console.log(result);
    return result;
}

function buileHTML(data, query){
    let domain = data.domain; //arr
    let url = data.url;
    let add;
    if (query == "domain") {
        add = domain;
    } else {
        
    }

    let html = "";
    html += '<div id="table">'
    html += '<table id="mytable">'
    html += '<thead>'
    html +=     '<tr>'
    html +=         '<th>#</th>'
    html +=         `<th>${query}</th>`
    html +=         '<th>Time</th>'
    html +=         '<th>Recent</th>'
    html +=     '</tr>'
    html += '</thead>'

    .forEach((element, index) => {
        html += '<tr>'
        html +=     `<td>${index}</td>`
        html +=     `<td>${element[query]}</td>`
        html +=     `<td>${element.time}</td>`
        html +=     `<td>${element.recent}</td>`
        html += '</tr>'
    });
}



chrome.storage.local.get(null, function (data) {
    console.log(data);
    let keymap = createKeymap(data);
    // buileHTML(data, query);
});
