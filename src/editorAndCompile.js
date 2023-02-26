var language_id;
var langArray;

const getIDS = () => {
    fetch("https://ce.judge0.com/languages/").then(response => response.json())
    .then(function (response) {
        langArray = response;
        
        let dropDown = document.getElementById('langSelect');

        for(var i = 0; i < langArray.length; i++){
            let option = document.createElement('option');
            

            option.setAttribute('value', langArray[i].id);
            
            let langName = document.createTextNode(langArray[i].name);
            option.appendChild(langName);

            dropDown.appendChild(option);
        }

        changeLang(dropDown);
    });
}

var editor = ace.edit("editor");
            editor.setTheme("ace/theme/dawn");
            editor.session.setMode("ace/mode/python");
            editor.resize();

const changeLang = (dropDown) => {
    language_id = dropDown.value;
    console.log("id",language_id);

    let name = dropDown.options[dropDown.selectedIndex].text.split(" (");

    editor.session.setMode('ace/mode/' + name[0]);

    console.log(name);
}
    
const handleCompile = () => {

    let button = document.getElementById("compileButton");

    button.innerHTML = "<div class='dot-flashing'></div>";
    button.setAttribute('disabled', 'true');

    const editorCode = editor.getValue();

    console.log("Code: ", editorCode);

    const test = btoa(editorCode);

    const API_URL = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*';
    
    const options = {
    method: 'POST',
    headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '0f362b5a43msh406f5870c7e287ep11dc52jsnc6ef63ed4990',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    },
    body: '{"language_id":' + language_id + ',"source_code":"' + test + '"}',
    };

    fetch(API_URL, options).then(response => response.json())
    .then(function (response) {
        console.log("Response token", response);
        const token = response.token;
        console.log(token);
        checkStatus(token);
    })
    .catch(function (err) {
        console.error(err);

        let error = err.response ? err.response.data : err;
    });

    const checkStatus = (token) => {
        let url =  'https://judge0-ce.p.rapidapi.com/submissions/'+ token + '?base64_encoded=true&fields=*';
        const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0f362b5a43msh406f5870c7e287ep11dc52jsnc6ef63ed4990',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        }
        };
    
        try{
            fetch(url, options).then(reply => reply.json()).then(function (reply) {
                console.log("response to token:", reply);
                let statusId = reply.status;

            console.log("status:", statusId);
    
            if(statusId === 1 || statusId === 2){
                setTimeout(() => {
                    checkStatus(token);
                }, 2000);
                return;
            }else{
                console.log("Response Data: ", reply.stdout);
                outputData(reply.stdout);
                return;
            }
            });

                
        }catch(error){
            console.log("Error", error);
        }
    }

    const outputData = (results) => {
        let statusId = results?.status?.id;

        console.log("results" + results);
    
        let msg = atob(results);

        console.log(msg);

           /* if(statusId === 3){
                msg = atob(results);
            }else{
                btoa(results?.stdout) !== null ? msg = btoa(results?.stdout) : msg = null;
            }
    
            switch(statusId){
                case 6:
                    msg = btoa(results?.compile_output);
                    break;
                case 3:
                    btoa(results?.stdout) !== null ? msg = btoa(results?.stdout) : msg = null;
                    break;
                case 5:
                    msg = 'Time Limited Exceeded';
                    break;
                case 2:
                    console.log("case 1");
                    break;
                default:
                    msg = "hit default";
        }*/
        button.innerHTML = "Compile";
        button.removeAttribute('disabled');
        document.getElementById('output').innerHTML = msg;
    }
}

const preSet = (code) => {
    let str;

    if(code === 'helloWorld'){
        str = 'print("Hello World")';
    }else if(code === 'time'){
        str =
`from datetime import datetime

now = datetime.now()
current_time = now.strftime("%H:%M:%S")

print("Current Time =", current_time)`;
    }else if(code === 'pi'){
        str = 
`def calculatePI(n):
    total = 0
    for x in range(n):
        total += fraction(x)
    return 4.0 * total
    
def fraction(n):
    return pow(-1.0, n)/(2.0*n+1.0)
    
n=10000
print(calculatePI(n))`
    }

    editor.setValue(str, 1);
}

const testLangId = () => {
 /* fetch("https://ce.judge0.com/languages/").then(response => response.json())
.then(function (response) {
    console.log(response);

    const langArray = response;

    
});*/

document.getElementById("output").innerHTML = language_id;

  
}

