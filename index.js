    var tempObj = {
        "928-445-9233":"928-123-4567",
        "(928)-123-4567":"(928)-198-7654",
        "132-456-7890":"098-765-4321"
    }


    function changeNumberOnDom(replaceNumberObj){
        for(let key in replaceNumberObj){
            document.body.innerHTML = document.body.innerHTML.split(key).join(replaceNumberObj[key]);
        }
    }


    


    
    // allNumberPatterns();


    function loadDoc() {
      console.log("update data");
      changeNumberOnDom(tempObj); 
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        
        if (this.readyState == 4 && this.status == 200) {
            console.log("this.responseText::",this.responseText);
            // document.getElementById("replaceme").innerHTML = this.responseText;
            changeNumberOnDom(tempObj); 
        }
      };
      
      xhttp.open("GET", "https://f3ad67de.ngrok.io/auth/sampleScrapApi?url="+window.location.href, true);
      
      xhttp.send();
    }
