console.log("content working");

var myPort = chrome.runtime.connect({name:"port-cs"});

// will wait for mouse button to lift up and activate input function
window.addEventListener('mouseup', input);

function input() {
    let msg = window.getSelection().toString();
    myPort.postMessage(msg);
    console.log("input working, msg:", msg);
}
