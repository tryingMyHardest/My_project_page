var language_id = 54;

var editor = ace.edit("editor");
            editor.setTheme("ace/theme/dawn");
            editor.session.setMode("ace/mode/c_cpp");
            editor.resize();

const changeLang = (dropDown) => {
    language_id = dropDown.value;
    console.log("id",language_id);

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
    console.log(name);

    preSet(language_id);
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

