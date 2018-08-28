var tagSearchForArray = ['a', 'p'];
  var attrInfo = document.querySelectorAll("a[href^='tel:']");
  var elementsForSearch;
  var pattern = /(?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4})/g;
  var n = [];
  var source = '';

  //  For innerHTML Content
  for (var i = 0; i < tagSearchForArray.length; i++) {
    elementsForSearch = document.getElementsByTagName(tagSearchForArray[i]);
    for (var j = 0; j < elementsForSearch.length; j++) {
      if (elementsForSearch[j].innerText.toLowerCase().match(pattern) != null) {
        for (let value of elementsForSearch[j].innerText.toLowerCase().match(pattern)) {
          value = value.trim();
          if (n.indexOf(value) == -1) {
            n.push(value);
          }
        }
      }
    }
  }

  //  For href attr param
  for(let key in attrInfo){
    if(typeof attrInfo[key].href != "undefined" && attrInfo[key].href != "undefined"){
      var ret = attrInfo[key].href.replace('tel:','');
      ret = ret.trim();
      if(n.indexOf(ret) === -1){
        n.push(ret);
      }
    }
  }

  changeNumberOnDom = function(replaceNumberArr){
    for(let key in replaceNumberArr) {
      var swap_targets = replaceNumberArr[key].swap_targets[0];
      var trackingNumber = replaceNumberArr[key].number.national;
      for (var i = 0; i < n.length; i++) {
        let value = removeSpecialCharFromNumber(n[i]);
        if (value == swap_targets) {
          document.body.innerHTML = document.body.innerHTML.split(n[i]).join(trackingNumber);
        }
      }
    }
  }

  getSource = function(e, a) {
    return e = e || "direct",
    e.match(/doubleclick/) || a.match(/gclid=/) ? "google_paid" : e.match(/google/) && !e.match(/mail\.google\.com/) ? e.match(/maps\.google\.[a-z\.]{2,5}/) ? "google_local" : e.match(/google\.[a-z\.]{2,5}\/(aclk|afs)/) || e.match(/googleadservices/) || a.match(/utm_(medium|source)=[cp]pc/i) || a.match(/(matchtype|adposition)=/i) ? "google_paid" : "google_organic" : e.match(/yahoo/) && !e.match(/mail\.yahoo\.com/) ? e.match(/local\.(search\.)?yahoo\.com/) ? "yahoo_local" : a.match(/utm_medium=[cp]pc/i) ? "yahoo_paid" : "yahoo_organic" : e.match(/(\/|\.)bing\./) || a.match(/utm_source=bing/i) ? e.match(/bing\.com\/local/) ? "bing_local" : a.match(/utm_medium=[pc]pc/i) ? "bing_paid" : "bing_organic" : e.match(/msn\.com/) ? "bing_paid" : "direct" === e ? a.match(/utm_medium=[cp]pc/i) && a.match(/utm_source=google/i) ? "google_paid" : "direct" : CallTrkSwapAdit.getReferrerDomain(e)
  }

  getReferrerDomain = function(e, a) {
    var a = e.split("/")[2]
    , r = a.split(".");
    return r.length > 2 ? r[r.length - 2] + "." + r[r.length - 1] : a
  }

  getFilterNumberArray = function(n) {
    let number = [];
    for (var i = 0; i < n.length; i++) {
      let value = removeSpecialCharFromNumber(n[i]);
      if(number.indexOf(value) === -1){
        number.push(value);
      }
    }
    return number;
  }

  removeSpecialCharFromNumber = function(number) {
    return parseInt(number.toString().trim().replace(/[^\d\+]/g,""));
  }

  loadDoc = function() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://18.208.54.106:1337/number/swap?number="+getFilterNumberArray(n)+"&referrer_tracking_source="+getSource(document.referrer, document.URL), true);
    xhttp.send(n.toString());
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        changeNumberOnDom(JSON.parse(this.responseText).data);
      }
    };
  }