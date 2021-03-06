/**
 * @author Martí Pericay <marti@pericay.com>
 */

define(['i18n', 'taxon', 'map', 'search', 'text!../../sections/help.html', 'text!../../sections/about.ca.html', 'text!../../sections/about.es.html', 'text!../../sections/about.en.html', 'sheet', 'bootstrap', 'typeahead', 'select'], function(i18n, taxon, map, search, help, about_ca, about_es, about_en, sheet) {
    "use strict";

	var params = {};
    location.search.substr(1).split("&").forEach(function(item) {
        var kv = item.split("=");
        params[kv[0]] = kv[1];
    });

    // for API
    var taxonId = (params.hasOwnProperty('id') ? params.id : 'Animalia');
    var level = ((params.hasOwnProperty('level') && parseInt(params.level)) ? params.level : '1');
    var taxonSearch = (params.hasOwnProperty('taxon') ? params.taxon : '');
    var placenameSearch = (params.hasOwnProperty('placename') ? params.placename : '');
    var zoom = (params.hasOwnProperty('zoom') ? params.zoom : '6');
    var lat = (params.hasOwnProperty('lat') ? params.lat : '41');
    var lon = (params.hasOwnProperty('lon') ? params.lon : '5');
    var currentTaxon;
    // store filters
    var activeFilters = [];

    var setTaxon = function(newTaxon, filters) {

		// check if filters are changing
	    if (!filters) filters = activeFilters;

        if (!newTaxon) {
            newTaxon = currentTaxon;
            updateUI(newTaxon, filters);
        } else {
            //make the JSON query to get taxon
            var total_query = buildQuery(newTaxon, false, false);

            makeQuery(total_query, function(data) {
                if (data.error) {
                    if (data.error == "empty") data.error = "Taxon does not exist";
                    updateMenu("#menuTaxon", taxon, data.error);
                // we need to update info for new taxon
                } else {
                    // we must convert from lineal object obtained in API to nested TaxoMap JSON format (children objects)
                    newTaxon.convertFromApi(data);
                    updateBreadcrumb("#breadcrumbTaxon", newTaxon);
                    updateUI(newTaxon, filters);
                }
            });
        }

        // clear search
        $('#noresults').hide();

        //update taxon_id
        currentTaxon = newTaxon;
	};

    var updateUI = function(newTaxon, filters) {
        //change the taxon layer
        var query = newTaxon.getSqlWhere() + sheet.getFiltersSQL(filters, ["fieldvalue", "minmax"]);
        map.setSql(query);

        //updateMenus
        updateMenus(newTaxon, filters);
    };

    var updateMenu = function(div, taxon, noresults) {

        //delete everything
        $(div).empty();

        var parent = taxon.getParent();
        var child = taxon.getChild();
        var level = taxon.level;

        if(level) $(div).append(drawMenuParent(parent, level));

        // title (active taxon): last level has no 'child' element, we use 'children of parent'
        var active_taxon = (child ? child['name'] : parent['children'][0]['name']);

        if (noresults) {
            $(div).append(drawTitle(active_taxon));
            var msg = $( "<li/>");
            msg.append(i18n.t(noresults));
            $(div).append(msg);
            return;
        }

        $(div).append(drawTitle(active_taxon));
        $(div).append(drawDownload(taxon, activeFilters));
        if(child) $(div).append(drawSheetLink(taxon));

        if(child && child["children"]) $(div).append(drawMenuChildren(child["children"], level));

        i18n.translateDocTree();
    };

    var drawTitle = function(title) {
        var html = "<li><a href='#' class='active'>" + title + "</a></li>";
        return html;
    }

     var drawSheetLink = function(taxon) {
        var li =  $( "<span/>");

        var link =  $( "<a/>", {
		    html: "",
            id: "wiki",
            href: "#",
            "class": "sheetLink links",
            "data-toggle": "modal",
            "data-target": "#textModal"
        }).on('click', function() {
            sheet.showSheet($('#textModal .modal-body'), taxon, i18n.getLang(), activeFilters);
        }).appendTo(li);

        link.tooltip({"title": i18n.t("Statistics and info"), trigger: "hover"});

        return li;
    };

    var drawDownload = function(taxon, filters) {
        var li =  $( "<span/>");

        var link =  $( "<a/>", {
		    html: "",
            href: "#",
            "class": "downloadLink links",
            tabindex: "1"
        }).appendTo(li);

        link.tooltip({"title": i18n.t("Download selection")});

        var pop = drawDownloadPopover(taxon, filters);

        link.popover({
            content: pop,
            toggle: "popover",
            container: "body",
            trigger: "focus",
            html: true
        });

        return li;
    };

    var drawDownloadPopover = function(taxon, filters) {
        var downloadFormats = [
            { name: "Spreadsheet (CSV)", format: "csv"},
            { name: "Google Earth (KML)", format: "kml"},
            { name: "GIS software (SHP)", format: "shape-zip"},
            { name: "Geometry (GeoJSON)", format: "application/json"}
        ];

        var pop = $( "<div/>", {
		    html: ""
        });

        var attachEvent = function(item, num) {
            item.on("click", function() {
                map.getQuotes(taxon, sheet.getFiltersSQL(filters, ["circle", "fieldvalue", "minmax"]), downloadFormats[num].format);
            });
        };

        for(var i = 0; i < downloadFormats.length; i++) {
            var csv = $( "<a/>", {
                html: downloadFormats[i].name,
                href: "#",
                "class": "downloadFormatList"
            }).appendTo(pop);
            attachEvent(csv, i);
        }

        i18n.translateDocTree(pop[0]);

        return pop;
    };

    var drawMenuChildren = function(childArray, parentLevel) {
        var level = parseInt(parentLevel) + 1;
        var data = [];

        for(var i=0; i<childArray.length; i++) {
            //if no id, we don't want to show the possibility to go further: there's no information
            if(childArray[i]['id']) data.push(drawMenuItem({ "name": childArray[i]['name'], "id": childArray[i]['id'], "level": level, "count": childArray[i]['count']}));
        }
        return data;
    };

    var drawBreadcrumbItem = function(item) {
        var link = $( "<a/>", {
    		href: "#",
    		"class": item.className });

		var link = setLink(link, item);

        var div =  $( "<div/>", {
            html: item.name,
        }).appendTo(link);

		return link;
    };

    var drawMenuItem = function(item) {
    	var title = item.name + (item.count? " <small>(" + item.count + ")<small>" : "");
		var li = $( "<li/>");
        var link =  $( "<a/>", {
		    html: title,
            href: "#",
    		"class": item.className
        }).appendTo(li);

        link = setLink(link, item);
        if(item.tooltip) link.tooltip({"title": i18n.t(item.tooltip)});

		return li;
    };

    var setLink = function(el, item) {

		el.data("id", item.id);
		el.on("click", function(){
			setTaxon(new taxon($(this).data("id"), item.level));
		});

        return el;
    };

    var drawMenuParent = function(parent, level) {
        return drawMenuItem({"name": "↩", "id": parent.id, "level": level-1, "className": "parent links", "tooltip": "Parent taxon"});
    };

    var updateBreadcrumb = function(div, taxon) {
    	$(div).html(drawBreadcrumb(taxon.tree));
        makeBreadcrumbResponsive(div);
        $(window).resize(function() {
            makeBreadcrumbResponsive(div);
        });
    };

    var flatten = function(children, newArray) {
    	if(!newArray) newArray = [];
        if(!children["children"]) return newArray;
        newArray.push({"name": children["name"], "id": children["id"]});
        return flatten(children["children"][0], newArray);
	};

    var drawBreadcrumb = function(childArray) {
        level = parseInt(level);// must be a number!
        var html = [];
        html.push(drawBreadcrumbItem({
            name: "Eukaryota",
            id: "Eukaryota",
            className: "btn",
            level: 0}));
        html.push('<div class="btn dots">...</div>');
        var ancestry = flatten(childArray);

		for(var k=1; k < ancestry.length; k++) {
			ancestry[k].level = k;
            ancestry[k].className = "btn";
			html.push(drawBreadcrumbItem(ancestry[k]));
		}

        return html;
    };

    var makeBreadcrumbResponsive = function(div) {
        var ellipses = $(div + " :nth-child(2)");
        if ($(div + " a:hidden").length >0) {ellipses.show()} else {ellipses.hide()};
    };

    var buildQuery = function(taxon, children, filters) {
        var query = "taxon/";
        if(children) query = "subtaxa/";
        query += taxon.id + "/" + taxon.level + "/?";
        if(filters) query += sheet.getFiltersREST(filters, ["circle", "fieldvalue", "minmax"]);

        return map.getApi() + query;
    };

    var makeQuery = function(query, callback) {
        $.getJSON(query,
            {
              //format: "json"
            },
            function(data){
                //got results
                if(data && data.length) {
                    callback(data);
                } else {
                    callback({ error: "empty" });
                }
            }).error(function(jqXHR, textStatus, errorThrown) {
                var msg = "An error occured: ";
                if(textStatus) msg += errorThrown;
                callback({ error: msg });
        });
    };

	var updateMenus = function(taxon, filters) {

		//var direction = (taxon && (currentTaxon.level > taxon.level)) ? "right" : "left";
        if(!taxon) taxon = currentTaxon;

		//menu loading
		var loadingDiv = $("<div/>", {
			"class": "menuLoading"
		});
		$("#menuTaxon").html(loadingDiv);

        //if filter is null or undefined, we don't change it
    	if(!filters) filters = activeFilters;
    	else activeFilters = filters;

        //query to get children
        var query = buildQuery(taxon, true, filters);
        makeQuery(query, function(data) {
            $('#menuTaxon').hide().show({ direction: 'right' });
            if (data.error) {
                if (data.error == "empty") data.error = "No results";
                updateMenu("#menuTaxon", taxon, data.error);
            } else {
                taxon.convertFromApi(data);
                // update Menu
                updateMenu("#menuTaxon", taxon);
            }
        });
	};

    var loadTaxoMap = function(taxon, latlon) {
        setTaxon(taxon);

        // center + zoom mode
        var options = {
            where: taxon.getSqlWhere(),
            lat: latlon.lat,
            lon: latlon.lon,
            zoom: zoom
        }
        //bounds mode (don't set center to avoid navigation)
        if (latlon.northeast) {
            options = {
                where: taxon.getSqlWhere()
            }
        }

        var leafletMap = map.createMap(options);
        if (latlon.northeast) leafletMap.fitBounds(L.latLngBounds(latlon.northeast, latlon.southwest));
        map.createGeoFilter("#circleFilter", updateMenus);
        map.createComboFilter("#fvFilter", setTaxon);
        map.createTimeSlider("#sliderContainer", setTaxon);
        return taxon;
    }

	//if looking for a generic taxon name: Ajax query to API
    //default
    var taxonAjax, taxonAjaxDefault;
    taxonAjax = taxonAjaxDefault = [ [{ id: taxonId, level: level}] ];
    //search API
    if (taxonSearch) taxonAjax = $.get(map.getApi() + 'search/' + taxonSearch + '/');

    //if looking for a place name
    //default
    var placeAjax, placeAjaxDefault;
    placeAjax = placeAjaxDefault = [{ results: [{geometry: {lat: lat, lon: lon}}] }];
    //search Opencage
    if (placenameSearch) {
        placeAjax = $.get('proxy/jsonproxy.php?endpoint=opencage&q=' + placenameSearch);
    }

    $.when(taxonAjax, placeAjax).done(function(taxonData, placeData) {
        //check taxon not found
        if (!taxonData[0]) {
            taxonData = taxonAjaxDefault;
            console.log("Couldn't find a taxon named " + decodeURIComponent(taxonSearch));
        }
        //check placename not found
        if (!placeData[0].results[0]) {
            placeData = placeAjaxDefault;
            console.log("Couldn't find a place named " + decodeURIComponent(placenameSearch));
        }

        //center or bounds?
        var latlon;
        if (placeData[0].results[0].bounds) {
            latlon =  placeData[0].results[0].bounds;
        } else {
            latlon = placeData[0].results[0].geometry;
        }
        currentTaxon = loadTaxoMap(new taxon(taxonData[0][0].id, taxonData[0][0].level), latlon);

      });


    $("#toggleButton").click(function(e) {
	    e.preventDefault();
        //needs some logic to be combined with sidebar auto-hiding
        //$(this).html(">>");
	    $("#wrapper").toggleClass("toggled");
	});

    // text modal management
 	var texts = {
 		"about": {
 			"ca": about_ca,
            "es": about_es,
            "en": about_en
 		},
 		"help": {
 			"ca": help,
            "en": help,
            "es": help
 		}
 	};
 	$(document).on("click", ".open-textModal", function () {
 	     var pageId = $(this).data("id");
 	     var html = texts[pageId][i18n.getLang()];
 	     $('#textModal .modal-content').css('height',$( window ).height()*0.8);
 	     $("#textModal .modal-body").html(html);
 	});

    var stopVideo = function (element) {
        var iframe = element.querySelector('iframe');
        var video = element.querySelector('video');
        if (iframe) {
            var iframeSrc = iframe.src;
            iframe.src = iframeSrc;
        }
        if (video) {
            video.pause();
        }
    };

    //stop video when closing modal
    $('#textModal').on('hidden.bs.modal', function () {
       stopVideo(document.getElementById('textModal'));
     });

    //search
    search.create("#taxon", "#noresults", setTaxon);

	//translate DOM on click
	$(document).on("click", ".setLang", function() {
		var langId = $(this).data("id");
		i18n.setLang(langId);
		i18n.translateDocTree();
	});

});
