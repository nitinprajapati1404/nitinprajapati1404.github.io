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

function AditCallTrkSwap() {
    var company;
}

AditCallTrkSwap.prototype.getFilterNumberArray = function(n) {
    let number = [];
    for (var i = 0; i < n.length; i++) {
        let value = AditCallTrkSwap.removeSpecialCharFromNumber(n[i]);
        if(number.indexOf(value) === -1){
            number.push(value);
        }
    }
    return number;
}

AditCallTrkSwap.removeSpecialCharFromNumber = function(number) {
    return parseInt(number.toString().trim().replace(/[^\d\+]/g,""));
}

AditCallTrkSwap.prototype.loadDoc = function() {
    var xhttp = new XMLHttpRequest();
    console.log("compnayid::",this.getCompanyId('company'));
    console.log("runn::",this.run());
    xhttp.open("GET", "http://18.208.54.106:3000/number/"+this.getCompanyId('company')+"/swap?number="+this.getFilterNumberArray(n)+"&referrer_tracking_source="+this.run(), true);
    xhttp.send(n.toString());
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            AditCallTrkSwap.changeNumberOnDom(JSON.parse(this.responseText).data);
        }
    };
}

AditCallTrkSwap.prototype.getCompanyId = function(k) {
    var scripts = document.getElementsByTagName("script"), src = scripts[scripts.length-1].src;
    return decodeURIComponent((new RegExp("[?|&]" + k + "=([^&;]+?)(&|#|;|$)").exec(src) || [null, ""])[1].replace(/\+/g, "%20")) || null;
}

AditCallTrkSwap.changeNumberOnDom = function(replaceNumberArr){
    for(let key in replaceNumberArr) {
        var swap_targets = replaceNumberArr[key].swap_targets[0];
        var trackingNumber = replaceNumberArr[key].number.national;
        for (var i = 0; i < n.length; i++) {
            let value = AditCallTrkSwap.removeSpecialCharFromNumber(n[i]);
            if (value == swap_targets) {
                document.body.innerHTML = document.body.innerHTML.split(n[i]).join(trackingNumber);
            }
        }
    }
}

AditCallTrkSwap.prototype.run = function() {
    this.referrer = this.getReferrer(),
    this.landing = this.getLanding(),
    this.referrer_key = AditCallTrkSwap.getReferrerKey(this.referrer, this.landing);
    return this.referrer_key;
}

AditCallTrkSwap.prototype.getReferrer = function() {
    var e = AditCallTrkSwap.readCookie("AditCallTrkSwap_referrer");
    return e || (e = this.getCurrentReferrer()), AditCallTrkSwap.createCookie("AditCallTrkSwap_referrer", decodeURIComponent(e)),
    e;
}

AditCallTrkSwap.prototype.getLanding = function() {
    var e = AditCallTrkSwap.readCookie("AditCallTrkSwap_landing");
    return e || (e = AditCallTrkSwap.documentURL()),
    AditCallTrkSwap.createCookie("AditCallTrkSwap_landing", decodeURIComponent(e)),
    e;
}

AditCallTrkSwap.getReferrerKey = function(e, a) {
    a = decodeURIComponent(a), e = decodeURIComponent(e)
    return e = e || "direct", AditCallTrkSwap.getGoogleSource(e, a)
}

AditCallTrkSwap.getGoogleSource = function(e, a) {
    return e.match(/doubleclick/) || a.match(/gclid=/) ? "google_paid" : e.match(/google/) && !e.match(/mail\.google\.com/) ? e.match(/maps\.google\.[a-z\.]{2,5}/)  ? "google_local" : e.match(/google\.[a-z\.]{2,5}\/(aclk|afs)/) || e.match(/googleadservices/) || a.match(/utm_(medium|source)=[cp]pc/i) || a.match(/(matchtype|adposition)=/i) ? "google_paid" : "google_organic" : this.getYahooSource(e, a);
}

AditCallTrkSwap.getYahooSource = function(e, a) {
    return e.match(/yahoo/) && !e.match(/mail\.yahoo\.com/) ? e.match(/local\.(search\.)?yahoo\.com/) ? "yahoo_local" : a.match(/utm_medium=[cp]pc/i) || a.match(/utm_source=Yahoo/i) || a.match(/utm_source=yahoo/i) ? "yahoo_paid" : "yahoo_organic" : this.getBingSource(e, a);
}

AditCallTrkSwap.getBingSource = function(e, a) {
    return e.match(/(\/|\.)bing\./) || a.match(/utm_source=bing/i) ? e.match(/bing\.com\/local/) ? "bing_local" : a.match(/utm_medium=[pc]pc/i) ? "bing_paid" : "bing_organic" : e.match(/msn\.com/) ? "bing_paid" : this.getFacebookSource(e, a);
}

AditCallTrkSwap.getFacebookSource = function(e, a) {
    if (e.match(/(\/|\.)facebook\./)) {
        if (a.match(/utm_medium=[cp]pc/i)) {
            return "facebook_paid";
        } else if (e.match(/facebook\.com/i)) {
            return "facebook_organic"
        } else {
            return AditCallTrkSwap.directSource(e, a)
        }
    } else {
        return AditCallTrkSwap.directSource(e, a)
    }
}

AditCallTrkSwap.directSource = function(e, a) {
    return "direct" === e ? a.match(/utm_medium=[cp]pc/i) && a.match(/utm_source=google/i) ? "google_paid" : "direct" : AditCallTrkSwap.getReferrerDomain(e);
}

AditCallTrkSwap.prototype.getCurrentReferrer = function() {
    var e = this.getURLParameter("utm_referrer");
    return e || (e = AditCallTrkSwap.documentReferrer()),
    e || (e = "direct"),
    e
}

AditCallTrkSwap.getReferrerDomain = function(e) {
    var a = e.split("/")[2]
      , r = a.split(".");
    return r.length > 2 ? r[r.length - 2] + "." + r[r.length - 1] : a
}

AditCallTrkSwap.prototype.getURLParameter = function(e) {
    return decodeURIComponent((new RegExp("[?|&]" + e + "=([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null
}

AditCallTrkSwap.documentReferrer = function() {
    // return "www.facebook.com";
    console.log(document.referrer);
    return document.referrer
}

AditCallTrkSwap.documentURL = function() {
    return document.URL
}

AditCallTrkSwap.windowLocation = function() {
    return window.location
}

AditCallTrkSwap.createCookie = function(e, a, r, t) {   //  e = name, a = value, r = days, t = domain
    var n = "";
    if (null == r && (r = this.cookieDuration()), r) {
        var l = new Date;
        l.setTime(l.getTime() + 24 * r * 60 * 60 * 1e3),
        n = "; expires=" + l.toGMTString()
    }
    var o = e + "=" + escape(a) + n + "; path=/";
    if (t)
        o += "; domain=" + t;

    return this.documentCookie(o), o;
}

AditCallTrkSwap.cookieDuration = function() {
    return 364;
}

AditCallTrkSwap.readCookie = function(e) {
    var a = this.cookieValues(e);
    return (a != null && a.length >= 1) ? a : null;
}

AditCallTrkSwap.cookieValues = function(e) {
    var nameEQ = e + "=";
    var ca = this.documentCookie().split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

AditCallTrkSwap.documentCookie = function(e) {
    return e ? document.cookie = e : document.cookie
}

!function() {
    new AditCallTrkSwap().loadDoc()
}();
