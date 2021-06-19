function regurl(url) {
    return url.match(/:\/\/(.[^/]+)/)[1];
}

var ref = document.referrer;
if (ref.length == 0 || regurl(ref) == window.location.hostname) {
    // redirect
    window.location.href = '/homepage';
}
