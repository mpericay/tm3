/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['i18n', 'leafletjs', 'select'], function(i18n) {
    "use strict";

   var phylumLegend = new cdb.geo.ui.Legend.Custom({
        title: "Legend",
        data: [
          { name: "Tracheophyta",  value: "#58A062" },
          { name: "Chordata",       value: "#F07971" },
          { name: "Mollusca",         value: "#54BFDE" },
          { name: "Arthropoda",         value: "#AAAAAA" },
          { name: "Others",          value: "#FABB5C" }
        ]
    });

   var institutionLegend = new cdb.geo.ui.Legend.Custom({
        title: "Legend",
        data: [
          { name: "IBB",  value: "#58A062" },
          { name: "MVHN", value: "#343FCE" },
          { name: "IMEDEA", value: "#F02921" },
          { name: "UB", value: "#5A9DDA" },
          { name: "MCNB", value: "#FABB5C" }
        ]
    });

   var basisLegend = new cdb.geo.ui.Legend.Custom({
        title: "Legend",
        data: [
          { name: "Non-fossil",  value: "#58A062" },
          { name: "Fossil",       value: "#F07971" }
        ]
    });

    var intensityLegend = new cdb.geo.ui.Legend.Intensity({
        title: "Legend",
        left: "1", right: "10+", color: "#FFCC00"
    });

    var legends = {
        'intensity': {
            cdbLegend: intensityLegend,
            cartoCSS: "#mcnb_dev{marker-fill: #FFCC00;marker-width: 10;marker-line-color: #FFF;marker-line-width: 1.5;marker-line-opacity: 1;marker-opacity: 0.9;marker-comp-op: multiply;marker-type: ellipse;marker-placement: point;marker-allow-overlap: true;marker-clip: false;marker-multi-policy: largest; }",
            name: "Intensity",
            active: true
        },
        'phylum': {
            cdbLegend: phylumLegend,
            cartoCSS: '#mcnb_dev { marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 10; marker-allow-overlap: true; #mcnb_dev[phylum="Tracheophyta"] { marker-fill: #58A062;} #mcnb_dev[phylum="Chordata"] { marker-fill: #F07971;}#mcnb_dev[phylum="Mollusca"] { marker-fill: #54BFDE;}#mcnb_dev[phylum="Arthropoda"] { marker-fill: #AAAAAA;}#mcnb_dev { marker-fill: #FABB5C;} }',
            name: "Phylum"
        },
        'basis': {
            cdbLegend: basisLegend,
            cartoCSS: '#mcnb_dev { marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 10; marker-allow-overlap: true; #mcnb_dev[basisofrecord="Non-fossil/No fòssil/No fósil"] { marker-fill: #58A062;} #mcnb_dev[basisofrecord="Fossil/Fòssil/Fósil"] { marker-fill: #F07971;} }',
            name: "Basis of record"
        },
        'institution': {
            cdbLegend: institutionLegend,
            cartoCSS: '#mcnb_dev { marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 10; marker-allow-overlap: true; #mcnb_dev[institutioncode="Institut Botànic de Barcelona"] { marker-fill: #58A062;} #mcnb_dev[institutioncode="Museu Valencià d\'Història Natural"] { marker-fill: #343FCE;}#mcnb_dev[institutioncode="Institut Mediterrani d\'Estudis Avançats"] { marker-fill: #F02921;}#mcnb_dev[institutioncode="Universitat de Barcelona"] { marker-fill: #5A9DDA;}#mcnb_dev[institutioncode="Museu Ciències Naturals Barcelona"] { marker-fill: #FABB5C;}#mcnb_dev { marker-fill: #FABB5C;} }',
            name: "Institution"
        },

    };

    var legendDiv;

    var createLegend = function(sym, parent){
        if (typeof sym === "undefined") {
            $.each(legends, function(key, value) {
                if (legends[key].active) {
                    sym = key;
                }
            });
        }

        legendDiv = L.DomUtil.create( "div", "legend", parent);
        disableEvent(legendDiv, 'click');
        disableEvent(legendDiv, 'dblclick');
        setLegend(sym);
    };

    var disableEvent = function(div, event) {
        $(div).bind(event, function(e) {
            e.stopPropagation();
        });
    }

    var setLegend = function(sym) {
        if (!legendDiv) return;
        $(legendDiv).empty();
        $(legendDiv).append(legends[sym].cdbLegend.render().el);
    }

    var disableDragging = function(element, map) {
        // Disable dragging when user's cursor enters the element
        element.addEventListener('mouseover', function () {
            map.dragging.disable();
        });

        // Re-enable dragging when user's cursor leaves the element
        element.addEventListener('mouseout', function () {
            map.dragging.enable();
        });
    }

    var createSwitcher = function(map, sublayer, withLegend) {
        var switcher = L.control({position: "bottomright"});
        switcher.onAdd = function(map) {
            var combolegend = L.DomUtil.create( "div", "combolegend");
            disableEvent(combolegend, 'mousewheel DOMMouseScroll MozMousePixelScroll');
            var combo = L.DomUtil.create( "div", "cssSelector", combolegend);
            var sel =  L.DomUtil.create( "select", "form-control dropup", combo );
            $.each(legends, function(key, value) {
                var option =  L.DomUtil.create( "option", "", sel );
                option.value = key;
                option.innerHTML = value.name;

                if (legends[key].active) {
                    if(withLegend) createLegend(key, combolegend);
                    option.selected = "selected";
                }
            });

            disableDragging(combolegend, map);

            $(sel).change(function() {
                if(withLegend) setLegend(this.value);
                sublayer.setCartoCSS(legends[this.value].cartoCSS);

                // translate legend
                // should be refactored: this onchange function better be a callback in ui module
                var leg = document.getElementsByClassName("legend")[0];
                leg.lang = "";
                i18n.translateDocTree(leg);
            });

            // make select responsive and mobile-friendly with https://silviomoreto.github.io/bootstrap-select/
            $(sel).selectpicker({
                size: 4
            });

            return combolegend;
        };
        switcher.addTo(map);

    };

	return {
       createSwitcher: function(map, sublayer, withLegend) {
       		return createSwitcher(map, sublayer, withLegend);
       }
	};

});
