console.log("popup working");

// send a message when clicked on
// activate function that takes in a response
chrome.runtime.sendMessage({message: "popup active"}, 
    function(response) {
        let msg = "placeholder";
        let grade = "placeholder";
        if (response == undefined) {
            msg = "[No text input.]";
            grade = "[No grade available.]"
        } else {
            msg = response.text[0];
            grade = response.text[1];
        }
        document.getElementById("test").innerHTML = msg;
        document.getElementById("grade").innerHTML = grade;
    }
)

document.addEventListener('DOMContentLoaded', function() {
    var anvil = document.getElementById('anvilbutton');
    var trans = document.getElementById('translatebutton');
    var forums = document.getElementById('forumsbutton');
    anvil.addEventListener("click", function() {
        window.open('https://MYVTAU2BNHGGVZLM.anvil.app/VB5FLBY5BBKQ5PE45V62J74B', '_blank');
    }) 
    trans.addEventListener("click", function() {
        window.open('https://translate.google.com/', '_blank');
    })
    forums.addEventListener("click", function() {
        window.open('https://ez-mail.wixsite.com/email','_blank');
    })
})


//div.anvil-panel-row