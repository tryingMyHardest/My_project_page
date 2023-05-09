var language_id = 54;
var start;
var end;

var editor = ace.edit("editor");
            editor.setTheme("ace/theme/dawn");
            editor.session.setMode("ace/mode/c_cpp");
            editor.resize();

const changeLang = (dropDown) => {
    language_id = dropDown.value;

    let name;

    switch(language_id){
        case "54": name = 'c_cpp';
                break;
        case "51": name = 'csharp';
                break;
        case "62": name = 'java';
                break;
        case "63": name = 'javascript';
                break;
        case "68": name = 'php';
                break;
        case "71": name = 'python';
    }
    editor.session.setMode('ace/mode/' + name);

    let file = document.querySelector(".fileSelector");
    if(file.files.length == 0){
        preSet(language_id);
    }
}
    
const handleCompile = () => {

    start = Date.now();

    let button = document.getElementById("compileButton");

    button.innerHTML = "<div class='dot-flashing'></div>";
    button.setAttribute('disabled', 'true');

    const editorCode = editor.getValue();

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
        
        const token = response.token;
     
        checkStatus(token);
    })
    .catch(function (err) {

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
                let status = reply.status;
    
            if(status.id === 1 || status.id === 2){
                setTimeout(() => {
                    checkStatus(token);
                }, 2000);
                return;
            }else{
                end = Date.now();
                outputData(reply);
                return;
            }
            });

                
        }catch(error){
            console.log("Error", error);
        }
    }

    const outputData = (reply) => {
       let time = (end - start)/1000;
    
        let msg = reply.status.description + " - " + time + 'sec<br><br>';
    
            switch(reply.status.id){
                case 3:
                    atob(reply.stdout) !== null ? msg += atob(reply.stdout) : msg += null;
                    break;
                case 6:
                    msg += atob(reply.compile_output);
        }

        button.innerHTML = "Compile";
        button.removeAttribute('disabled');
        document.getElementById('output').innerHTML = changeChar(msg);
    }
}

const changeChar = (str) => {
    let found = true;

    while(found){
        if(str.includes('â')){
            str = str.replace('â', '');
        }else{
            found = false;
        }
    }

    return str;
}

const preSet = (id) => {
    let str;

    if(id == 54){
        str = `#include <iostream>
using namespace std;
        
int main() {
    cout << "Hello World in C++!";
    return 0;
}`;
    }else if(id == 51){
        str =
`using System;

class HelloWorld {
  static void Main() {
    Console.WriteLine("Hello World in C#!");
  }
}`;
    }else if(id == 62){
        str = 
`public class Main {
	public static void main(String[] args) {
		System.out.println("Hello World in Java!");
	}
}`
    }else if(id == 63){
        str = `console.log("Hello World in Javascript!")`;
    }else if(id == 68){
        str = `echo "Hello World in PHP!"`;
    }else if(id == 71){
        str = `print("Hello World in Python!")`;
    }

    editor.setValue(str, 1);
}

const fileSelector = document.querySelector('.fileSelector');
  fileSelector.addEventListener('change', (event) => {
    const file = event.target.files[0];
    
    const reader = new FileReader();
    reader.onload = function () {
        let code = reader.result;
        editor.setValue(code, 1);
    }
    reader.readAsText(file);
    editor.setValue(code, 1);
  });


  const saveFile = (content, fileName, fileType) => {
    let a = document.createElement('a');

    let file = new Blob([content], {type: 'text/plain'});

    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const clickSave = () => {
    let content = editor.getValue();
    const timeStamp = new Date();

    let fileName;
    
    let date;

    if(nameInput.value == ''){
        date = timeStamp.getMonth()+1 + "-" + timeStamp.getDate() + "-" +
        timeStamp.getFullYear() + "_" + timeStamp.getHours() + timeStamp.getMinutes() + timeStamp.getSeconds();
        fileName = "code_" + date;
    }else{
        let chars = new RegExp('[\\,.!;\[\{\}\(\)@#\$%\^&\+=/:"*?<>|]');
        
        if(nameInput.value.match(chars)){
            nameInput.classList.add('red');
            nameInput.value = '';
            return;
        }else{
            fileName = nameInput.value;
        }
    }

    saveFile(content, fileName);
    
  }

  const nameInput = document.querySelector(".fileName");

  nameInput.addEventListener('change', function() {
    nameInput.classList.remove('red');
  })

  const h1 = document.querySelector("h1");

  let lastScrollY = window.scrollY;

  window.onscroll = () => {handleScroll()};

  const handleScroll = () => {
    if(lastScrollY < window.scrollY && lastScrollY > 0){
        h1.classList.add('hide-h1');
    }else{
        h1.classList.remove("hide-h1");
    }

    lastScrollY = window.scrollY;
  }