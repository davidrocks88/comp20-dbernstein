// Your JavaScript goes here...
function parse() {
        i = 0;
        var request = new XMLHttpRequest();
        var url = "http://localhost:8000/data.json";
        request.open("GET", url, true);
        //console.log(request);
        request.send(null);
console.log(request);
        request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status == 200 && i ==0) {
                        data = JSON.parse(request.responseText);
                        for(var j = 0; j < data.length; j++) {
                                curr = document.getElementById("messages").innerHTML;
                                document.getElementById("messages").innerHTML = 
                                curr + "<br>" + "<h6 id='individualMsg'>" + data[j].content + " - " + data[j].username+ "</h6>";

                        }       
                        i++;
                }
        }


}