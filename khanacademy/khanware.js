let loadedPlugins = [];

// document.querySelector("link[rel~='icon']").href = 'https://avatars.githubusercontent.com/u/108840059?s=400&u=0844355ae566900e9f7038564942804b696a4d0e&v=4';

/* Emmiter */
class EventEmitter{constructor(){this.events={}}on(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]||(this.events[t]=[]),this.events[t].push(e)})}off(t,e){"string"==typeof t&&(t=[t]),t.forEach(t=>{this.events[t]&&(this.events[t]=this.events[t].filter(t=>t!==e))})}emit(t,...e){this.events[t]&&this.events[t].forEach(t=>{t(...e)})}once(t,e){"string"==typeof t&&(t=[t]);let s=(...i)=>{e(...i),this.off(t,s)};this.on(t,s)}};
const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => { for (let mutation of mutationsList) if (mutation.type === 'childList') plppdo.emit('domChanged'); }).observe(document.body, { childList: true, subtree: true });

/* Misc Functions */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play(); };
const findAndClickBySelector = selector => { const element = document.querySelector(selector); if (element) { element.click(); sendToast(`⭕ Pressionando ${selector}...`, 1000); } };

function sendToast(text, duration=5000, gravity='bottom') { Toastify({ text: text, duration: duration, gravity: gravity, position: "center", stopOnFocus: true, style: { background: "#000000" } }).showToast(); };

async function loadScript(url, label) { return fetch(url).then(response => response.text()).then(script => { loadedPlugins.push(label); eval(script); }); }
async function loadCss(url) { return new Promise((resolve) => { const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = url; link.onload = () => resolve(); document.head.appendChild(link); }); }

/* Main Functions */ 
function setupMain(){
    /* QuestionSpoof */
    (function () {
        const phrases = [ 
            "Agradece eu depois ai :) (vz)",
            "Feito por [Nix](github.com/Niximkk)"
        ];
        
        const originalFetch = window.fetch;
        
        window.fetch = async function (input, init) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init && init.body) body = init.body;
        
            const originalResponse = await originalFetch.apply(this, arguments);
            const clonedResponse = originalResponse.clone();
        
            try {
                const responseBody = await clonedResponse.text();
                let responseObj = JSON.parse(responseBody);
                if (responseObj?.data?.assessmentItem?.item?.itemData) {
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    if(itemData.question.content[0] === itemData.question.content[0].toUpperCase()){
                        itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false }
                        itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                        itemData.question.widgets = { "radio 1": { type: "radio", options: { choices: [ { content: "By Nix, Featured by Vz", correct: true }, { content: " ", correct: false } ] } } };
                        responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                        return new Response(JSON.stringify(responseObj), { status: originalResponse.status, statusText: originalResponse.statusText, headers: originalResponse.headers });
                    }
                }
            } catch (e) { }
            return originalResponse;
        };
    })();

    /* VideoSpoof */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init && init.body) body = init.body;
            if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
                try {
                    let bodyObj = JSON.parse(body);
                    if (bodyObj.variables && bodyObj.variables.input) {
                        const durationSeconds = bodyObj.variables.input.durationSeconds;
                        bodyObj.variables.input.secondsWatched = durationSeconds;
                        bodyObj.variables.input.lastSecondWatched = durationSeconds;
                        body = JSON.stringify(bodyObj);
                        if (input instanceof Request) { input = new Request(input, { body: body }); } 
                        else init.body = body; 
                    }
                } catch (e) { debug(`🚨 Error @ videoSpoof.js\n${e}`); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    /* MinuteFarm */
    (function () {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init = {}) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init.body) body = init.body;
            if (body && input.url.includes("mark_conversions")) {
                try {
                    if (body.includes("termination_event")) { sendToast("🚫 Limitador de tempo bloqueado.", 1000); return; }
                } catch (e) { debug(`🚨 Error @ minuteFarm.js\n${e}`); }
            }
            return originalFetch.apply(this, arguments);
        };
    })();
}
/* Inject */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { alert("❌ Khanware Failed to Injected!\n\nVocê precisa executar o Khanware no site do Khan Academy! (https://pt.khanacademy.org/)"); window.location.href = "https://pt.khanacademy.org/?lang=pt"; }

loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
.then(async () => {    
    sendToast("Khanware Injetado! Esconde do longo ai hein", 5000);
        
    await delay(500);
    setupMain();
    
    console.clear();
});
