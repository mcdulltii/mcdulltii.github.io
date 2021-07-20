function checkBackground() {
    var vimeo = $('.vimeo-wrapper')[0];
    if($(window).width() > 575){ // "Small" devices size in Bootstrap
        if (vimeo.children.length == 0) {
            const iframe = document.createElement("iframe");
            iframe.setAttribute("webkitallowfullscreen","");
            iframe.setAttribute("mozallowfullscreen","");
            iframe.setAttribute("allowfullscreen","");
            iframe.setAttribute("src","");
            iframe.setAttribute("frameborder","0");
            vimeo.appendChild(iframe);
        }
        vimeo.children[0].src="https://player.vimeo.com/video/368071353?autopause=0&muted=1&color=000000&portrait=0&background=1&autoplay=1&loop=1&byline=0&title=0&controls=0&quality=1080p";
        document.body.style.backgroundImage = "";
    } else {
        if (vimeo.children.length != 0) {
            vimeo.children[0].remove();
        }
        document.body.style.backgroundImage = 'url("https://i.vimeocdn.com/video/824643252?mw=960&mh=540")';
    }
}

$(document).ready(function() {
    checkBackground();
    window.onresize = checkBackground;
});
