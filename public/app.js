let myLeads = []
let count = 0
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const tabBtn = document.getElementById("tab-btn")
const copyBtn = document.getElementById("copy-btn")
let options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
}

//Get Myleads from Db
fetch('http://localhost:3000/api/start').then( res => {
    if (!res.ok) {
        const e = new Error(`Erorr with code: ${res.status}`)
        e.name = `${res.status} error`
        throw e
    }
    return res.json()
}).then( leeds => {
    //console.log(leeds)
    if (leeds) {
        myLeads = JSON.parse(leeds).myLeads
        count = myLeads.length
        render(myLeads)
    }
}).catch(err => {
    if (err.name = 'Error') {
        location = 'serverNotStarted.html'
    } else {
        console.error(err)
    }
}) 

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

function sendToServer() {
    const leedsObj = {myLeads: myLeads, _id: count}
    options.body = JSON.stringify(leedsObj)
    //console.log(options)
    fetch('http://localhost:3000/api/update',options)
}

copyBtn.addEventListener("click", function() {
    let clipboardTxt = ""
    for (let i = 0; i < myLeads.length; i++) {
        clipboardTxt += myLeads[i]+"\n"
    }
    navigator.clipboard.writeText(clipboardTxt)
})

tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myLeads.push(tabs[0].url)
        count += 1
        sendToServer() //Send leeds to server and save then in Db
        render(myLeads)
    })
})



deleteBtn.addEventListener("dblclick", function() {
    //localStorage.clear()
    fetch('http://localhost:3000/api/clear')
    myLeads = []
    count = 0
    render(myLeads)
})

inputBtn.addEventListener("click", function() {
    if (inputEl.value) {
        myLeads.push(inputEl.value)
        count += 1
        inputEl.value = ""
        sendToServer() //Send leeds to server and save then in Db
        render(myLeads)
    }
})