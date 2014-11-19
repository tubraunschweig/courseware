define({
    normalizeYouTubeLink: function (url) {
        // YouTube API Docs - https://developers.google.com/youtube/
        //
        // Discussion of valid YouTube video IDs
        // https://groups.google.com/forum/#!topic/youtube-api-gdata/maM-h-zKPZc
        //
        // examples for long URL, short URL, and embed URL:
        // http://www.youtube.com/watch?v=C3HFAyigqoY&feature=youtu.be
        // http://youtu.be/C3HFAyigqoY
        // //www.youtube.com/embed/C3HFAyigqoY
        //
        // examples for IDs with _ and - characters:
        // http://www.youtube.com/watch?v=k_wJsio68D4
        // http://www.youtube.com/watch?v=h-TPSylHrvE
        var
        videoId = '[\\w\\-]*',
        idQuery = 'v=(' + videoId + ')',
        queryName = '(?:[^=&;#]{2,}|[^=&;#v])',
        queryValue = '(?:=[^&;#]*)?',
        otherQueries = '(?:' + queryName + queryValue + '[&;])*',
        longLink = '(?:www\\.)?youtube\\.com\\/watch\\?' + otherQueries + idQuery,
        shortLink = 'youtu\\.be\\/(' + videoId + ')',
        youTubeLink = '^\\s*'       // ignore whitespace at beginning of line
        + '(?:https?:)?\\/\\/'  // URL scheme is optional
        + '(?:' + longLink + '|' + shortLink + ')',
        matches = url.match(new RegExp(youTubeLink)),
        id = matches ? (matches[1] || matches[2]) : null;
	return id;
        //return id ? ('//www.youtube.com/embed/' + id) : url;
    },
    normalizeMatterhornLink: function (url) {
        // see https://opencast.jira.com/wiki/display/MH/Engage+URL+Parameters
        // http://someURL:8080/engage/ui/watch.html?id=someMediaPackageId
        // http://someURL:8080/engage/ui/embed.html?id=someMediaPackageId
        return url.replace('/engage/ui/watch.html?', '/engage/ui/embed.html?');
    },
    normalizeLink: function (url) {
        return url && this.normalizeMatterhornLink(this.normalizeYouTubeLink(url));
    },
    normalizeIFrame: function (view, newUrl) {
        var iframe = view.$('iframe'),
            url = this.normalizeLink(newUrl || iframe.attr('src'));
	  
        if (iframe.attr('src') != url) {
            iframe.attr('src', url);
        }
    },
    getYouTubeId: function(url){
    console.log(url);
    if (url.length == 11) return url;
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    //console.log(match);
    if (match&&match[7].length==11){
        return match[7];
    }else{
        return 'fehler';
    }
    },

    getUrl: function(view, videotype){
	var url = '';
	switch(videotype){
		case 'youtube': 
		var id = view.$('#youtubeid'),
                value = id.val(),
		youtubeid = this.getYouTubeId(value);
                url = this.buildYouTubeLink(youtubeid, view.$('#videostartmin').val(), view.$('#videostartsec').val(), view.$('#videoendmin').val(),view.$('#videoendsec').val());
		id.val(youtubeid);
                break;
		case 'matterhorn': url = this.normalizeMatterhornLink(view.$('#urlinput').val()); break;
		case 'url': url = view.$('#urlinput').val(); break;
	}
	return url;
    },
    getVideoType: function(view, url){
	var videotype = '';
	if(url.indexOf("youtube") != -1) videotype = "youtube";
	else if (url.indexOf("engage") != -1) videotype = "matterhorn";
	else videotype = "url";
	return videotype;
    },
    buildYouTubeLink: function(id, startmin, startsec, endmin, endsec){

	var url =  'http://www.youtube.com/embed/'+id, start = 0, end = 0;
	if(startmin != '') start += parseInt(startmin)*60;
	if(startsec != '') start += parseInt(startsec);
	if(endmin != '') end += parseInt(endmin)*60;
	if(endsec != '') end  += parseInt(endsec);
	if (start != 0){
		url += '?start='+start;
		if ((end != 0)&&(start < end)) url += '&end='+end;
	}else{
		if (end != 0) url += '?end='+end;
	}
	
	return url;
    },
    loadYouTubeInfo: function(url){
	var id, startmin, startsec, endmin, endsec;
		
    },
    showPreview: function(view, url){
	var iframe = view.$('iframe');
	iframe.attr('src', url);
    }
	
});
