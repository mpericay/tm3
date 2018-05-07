/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['jquery', 'stats', 'i18n', 'mustache'], function($, stats, i18n) {
    "use strict";
	
    var localeWiki = 'en';
    var wikiApi = "wikipedia.org/wiki/";
    
    var drawWikiSheet = function(div, data){
	     
         // for common name
         var title = data.parse.title;
         
         var moreinfo = i18n.t("More info");
         var here = i18n.t("here");
         
         $("#tabWiki").html("<div id='subtitle'>" + moreinfo + " <a href='http://" + localeWiki + '.' + wikiApi + title + "' target='_blank'>" + here + "</a></div>");

         // get raw HTML text ... but we need to do a few hacks
         $("#tabWiki").append("<div id='wikiDesc'>" + data.parse.text["*"] + "</div>");
         
         //HACKS
         //remove links
         $('#wikiDesc a').replaceWith(function() {
             return this.childNodes;
         });
         //remove areas (with links)
         $('#wikiDesc area').remove();         
         //remove references
         $('#wikiDesc .reference ').remove();
         //remove references errors
         $('#wikiDesc .mw-ext-cite-error').remove();
         //remove disambiguations 
         $('#wikiDesc .noprint').remove();
     };
     
     var drawLinksSheet = function(title){
        var links = ['<a id="wikispecies" href="http://species.wikimedia.org/wiki/{{title}}" target="_blank"><img alt="Wikispecies Logo" title="Wikispecies" src="img/logos/wikispecies.png" /></a>',
                '<a id="eol" href="http://www.gbif.org/species/search?q={{title}}" target="_blank"><img alt="Encyclopedia Of Life Logo" title="Encyclopedia Of Life" src="img/logos/eol.png" /></a>',
                '<a id="gbif" href="http://www.eol.org/search?q={{title2}}" target="_blank"><img alt="GBIF Logo" title="GBIF" src="img/logos/gbif.jpg" /></a>'].join("\n");
        
        var data = {
            "title": title,
            "title2": title.replace(" ","+")
        }
        
        links = Mustache.render(links, data);
        
         $("#tabLinks").html(links);
     };
     
     var createTabs = function(div){
        drawTabsHTML(div);
        //tabs
        $("#tabStats").show();
        $("#tabWiki").hide();
        $("#tabLinks").hide();
        $('#sheetTabs a').click(function (e) {
            e.preventDefault();
            $(this).tab("show");
            $("#tabWiki").hide();
            $("#tabStats").hide();
            $("#tabLinks").hide();
            var div = $(this).attr("data");
            $("#" + div).show();
        });
     };
     
     var drawTabsHTML = function(div) {
        
        var html= ['<div id="divSheetModal">',
                    '<div id="content">',
                    '   <div id="title"></div>',
                    '   <div id="subtitle"></div>',
                    '   <ul class="nav nav-tabs" id="sheetTabs">',
                    '       <li class="active"><a href="#" data="tabStats">{{stats}}</a></li>',
                    '       <li><a href="#" data="tabWiki">{{wikipedia}}</a></li>',
                    '       <li><a href="#" data="tabLinks">{{links}}</a></li>',
        			'   </ul>',
                    '   <div id="tabStats" class="tabContent"></div>',
                    '   <div id="tabWiki" class="tabContent"></div>',
                    '   <div id="tabLinks" class="tabContent"></div>',
                    ' </div>'].join("\n");
        
        var data = {
            stats: i18n.t('Stats'),
            wikipedia: i18n.t('Wikipedia'),
            links: i18n.t('Links')
        };
        
        $(div).html(Mustache.render(html, data));
     };
     
     var getWikiInfo = function(div, taxon){
         
         var wiki_url = "http://" + localeWiki + ".wikipedia.org/w/api.php?action=parse&prop=text&section=0&format=json&page="+ taxon + "&contentformat=text%2Fx-wiki&redirects=";
             
         $.getJSON(wiki_url+"&callback=?", //for JSONP
            {
                //additional params
                //ID: UI.taxon.id
            },
            function(data){
            // parse JSON data
                if(data.parse) {
                    drawWikiSheet(div, data);
                    drawLinksSheet(taxon);                    
                } else {
                    div.find("#title").html("No results");
                    div.find("#subtitle").html("No results found for " + " " + taxon + " " + " at Wikipedia");
                    div.find("#sheetTabs").hide();
                }
        });
             
     };
    
	return {
       showSheet: function(div, taxon, locale) {
            if(locale) localeWiki = locale;
            createTabs(div);
            var latinName = taxon.getChild()['name'];
            
            div.find("#title").html(latinName);
            stats.createPie("#tabStats", taxon);
			return getWikiInfo(div, latinName);
       }
	};
	
});