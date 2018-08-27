  var tagSearchForArray = ['a', 'p'];
    var attrInfo = document.querySelectorAll("a[href^='tel:']");
    var elementsForSearch;
    var pattern = /\D?[0-9]{3}\D?\s?[0-9]{3}\D?\s?[0-9]{4}/g;
    var n = [];
    for (var i = 0; i < tagSearchForArray.length; i++) {
      elementsForSearch = document.getElementsByTagName(tagSearchForArray[i]);
      for (var j = 0; j < elementsForSearch.length; j++) {
        if (elementsForSearch[j].innerText.toLowerCase().match(pattern) != null) {
          for (let value of elementsForSearch[j].innerText.toLowerCase().match(pattern)) {
            // value = value.trim().replace(/[^\d\+]/g,"");
            value = value.trim();
            if (n.indexOf(value) == -1) {
              n.push(value);
            }
          }
        }
      }
    }

    for(let key in attrInfo){
      if(typeof attrInfo[key].href != "undefined" && attrInfo[key].href != "undefined"){
        var ret = attrInfo[key].href.replace('tel:','');
        // ret = ret.trim().replace(/[^\d\+]/g,"");
        ret = ret.trim();
        if(n.indexOf(ret) === -1){
          n.push(ret);
        }
      }
    }

    function changeNumberOnDom(replaceNumberArr){
        for(let key in replaceNumberArr){
            var swap_targets = replaceNumberArr[key].swap_targets[0];
            var trackingNumber = replaceNumberArr[key].number.national;
            // var trackingNumber = replaceNumberArr[key].number.national_string;
            // console.log("swap_targets::",swap_targets);
            // console.log("trackingNumber::",trackingNumber);
            // document.body.innerHTML = document.body.innerHTML.split(key).join(replaceNumberArr[key]);
            document.body.innerHTML = document.body.innerHTML.split(swap_targets).join(trackingNumber);
        }
    }
    
    
    function loadDoc() {
      var xhttp = new XMLHttpRequest();
      // xhttp.open("GET", "http://localhost:1337/number/swap?number="+n, true);
      xhttp.open("GET", "http://18.208.54.106:1337/number/swap?number="+n, true);
      xhttp.send(n.toString());
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText);
          changeNumberOnDom(JSON.parse(this.responseText).data);
        }
      };
    }
    loadDoc();

    // old code
    // var tempObj = {
    //     "928-445-9233":"928-123-4567",
    //     "(928)-123-4567":"(928)-198-7654",
    //     "132-456-7890":"098-765-4321"
    // }


    // function changeNumberOnDom(replaceNumberObj){
    //     for(let key in replaceNumberObj){
    //         document.body.innerHTML = document.body.innerHTML.split(key).join(replaceNumberObj[key]);
    //     }
    // }


    


    
    // // allNumberPatterns();


    // function loadDoc() {
    //   console.log("update data");
    //   changeNumberOnDom(tempObj); 
    //   var xhttp = new XMLHttpRequest();
    //   xhttp.onreadystatechange = function() {
        
    //     if (this.readyState == 4 && this.status == 200) {
    //         console.log("this.responseText::",this.responseText);
    //         // document.getElementById("replaceme").innerHTML = this.responseText;
    //         changeNumberOnDom(tempObj); 
    //     }
    //   };
      
    //   xhttp.open("GET", "https://f3ad67de.ngrok.io/auth/sampleScrapApi?url="+window.location.href, true);
      
    //   xhttp.send();
    // }
