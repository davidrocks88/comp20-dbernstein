// Your JavaScript goes here...
function parse() {
        var request = new XMLHttpRequest();
        var url1 = "http://messagehub.herokuapp.com/messages.jsondata.json";
        var url2 = "data.json"
        request.open("GET", url2, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        request.send(null);

        request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status == 200) {
                        data = JSON.parse(request.responseText);
                        for(var j = 0; j < data.length; j++) {
                                curr = document.getElementById("messages").innerHTML;
                                document.getElementById("messages").innerHTML = 
                                curr + "<br>" + "<H4 id='individualMsg'>" + data[j].content + " - " + data[j].username+ "</H4>";

                        }       
                }
        }
}