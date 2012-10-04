dojo.require("esri.map");
dojo.require("esri.arcgis.utils");
dojo.require('esri.arcgis.Portal');
dojo.require("esri.IdentityManager");
dojo.require("dijit.dijit");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");

var _portal,
    _group,
    _groupTotal,
    _nextQuery,
    _webmapIds = [],
    _mapsLoaded = 0,
    _mapDivs = [],
    _currentMap,
	_loadingMap = false,
    _currentMapIds = [],
    _mapInitiating = false;

var getOppositeOrder = function(order){
    if (order == "Odd"){
        return "Even";
    }
    else{
        return "Odd";
    }
};

var initMaps = function(){

    _portal = new esri.arcgis.Portal(configOptions.portalURL);
    dojo.connect(_portal, 'onLoad', function(){
        queryWebmaps();
    });

};

var queryWebmaps = function(){
    var params = {
        q: 'id: ' + configOptions.group.id
    };

    _portal.queryGroups(params).then(function(groups){
        if (groups.results.length > 0){
            _group = groups.results[0];

            $("#title").html(configOptions.title || _group.title);
            $("#subtitle").html(configOptions.subtitle || _group.snippet);

            var params = {
                q: 'type: Web Map',
                num: configOptions.numOfWebmaps
            };
            _group.queryItems(params).then(addWebmapIds);
        }
    });
};

var addWebmapIds = function(queryResponse){
    if (_groupTotal === undefined){
        _groupTotal = queryResponse.total;
    }

    _nextQuery = queryResponse.nextQueryParams;

    dojo.forEach(queryResponse.results,function(item){
        if (item.type === "Web Map"){
            _webmapIds.push(item.id);
        }
    });

    if (_webmapIds.length < configOptions.numOfWebmaps){
        _group.queryItems(_nextQuery).then(addWebmapIds);
    }
    else if(_mapsLoaded < configOptions.numOfWebmaps){
        loadMaps();
    }
    else{
        displayNewMap();
    }
};

var loadMaps = function(){
    dojo.forEach(_mapDivs,function(mapDiv,i){
        $("#"+mapDiv).append("<div id='"+mapDiv+"Odd' class='map'></div>");
		$("#"+mapDiv+"details").data("webmap",_webmapIds[i]);
		$("#"+mapDiv+"fullscreen").data("webmap",_webmapIds[i]);
        var mapDeferred = esri.arcgis.utils.createMap(_webmapIds[i],mapDiv+"Odd",{
            mapOptions: {
                slider: true,
                nav: false
            },
			ignorePopups:true
        });

        var timeout = setTimeout(function() {
            loadNewMap($("#"+mapDiv+"Odd"));
        }, 10000);

        mapDeferred.addCallback(function(response){

            var map = response.map;
            map.Loaded = false;
            $("#"+mapDiv).data("webmap",_webmapIds[i]);

			var layers = response.itemInfo.itemData.operationalLayers;

			$("#"+mapDiv+"fullscreen").data("details","true");
			if(response.itemInfo.item.description === null){
				$("#"+mapDiv+"fullscreen").data("details","false");
			}

            dojo.connect(dijit.byId("content"), 'resize', map,map.resize);

            dojo.connect(map,"onUpdateEnd", function(){
                if (map.Loaded === false){
					initUI(layers,map,mapDiv);
                    map.Loaded = true;
                    $("#"+mapDiv+"blind").fadeOut();
                    $("#"+mapDiv+"loader").fadeOut();
                    _mapsLoaded++;
                    if(_mapsLoaded === configOptions.numOfWebmaps){
                        randomizeMaps();
                    }
                }
            });

			if(map.loaded){
                clearTimeout(timeout);
          		initUI(layers,map,mapDiv);
				if(map.extent.contains(map._mapParams.extent)){
					map.setLevel(map.getLevel() + 1);
				}
        	}
        	else{
          		dojo.connect(map,"onLoad",function(){
                    clearTimeout(timeout);
					initUI(layers,map,mapDiv);
					if(map.extent.contains(map._mapParams.extent)){
						map.setLevel(map.getLevel() + 1);
					}
				});
        	}

        });



    });
};

var randomizeMaps = function(){
	if (_loadingMap == false){
		setTimeout(function() {
			_loadingMap = true;
			if (_mapsLoaded === _webmapIds.length && _nextQuery.start !== -1){
				_group.queryItems(_nextQuery).then(addWebmapIds);
			}
			else{
				displayNewMap();
			}
		}, configOptions.delay);
	}
};

var displayNewMap = function(){
    if (_mapInitiating === false){
        _mapInitiating = true;
        var webmap;
        if (_mapsLoaded < _groupTotal){
            webmap = _mapsLoaded;
        }
        else{
            if (configOptions.loop === true){
                _mapsLoaded = 0;
                webmap = 0;
            }
            else{
                webmap = Math.floor(Math.random()*_groupTotal);
            }
        }
        var mapDiv = _mapDivs[Math.floor(Math.random()*_mapDivs.length)];
        if (_currentMap === mapDiv) {
            if (_mapDivs.indexOf(mapDiv) < _mapDivs.length - 1){
                mapDiv = _mapDivs[_mapDivs.indexOf(mapDiv) + 1];
            }
            else{
                mapDiv = _mapDivs[_mapDivs.indexOf(mapDiv) - 1];
            }
        }
        $("#"+mapDiv+"loader").fadeIn();
        $("#"+mapDiv+"blind").fadeTo("slow","0.1");

        var order;
        if ($("#"+mapDiv+"Odd").length > 0){
            order = "Even";
        }
        else{
            order = "Odd";

        }

        $("#"+mapDiv+getOppositeOrder(order)).css("z-index","10");
        $("#"+mapDiv).append("<div id='"+mapDiv+order+"' class='map'></div>");
        $("#"+mapDiv+order).css("z-index","0");

        var map;

        $(".mapPane").each(function(){
            if($(this).data("webmap") == _webmapIds[webmap]){
                mapDiv = $(this).attr("id");
            }
        });

        var mapDeferred = esri.arcgis.utils.createMap(_webmapIds[webmap],mapDiv+order,{
            mapOptions: {
                slider: true,
                nav: false
            },
    		ignorePopups:true
        });

        var timeout = setTimeout(function() {
            if (map === undefined) {
                $("#"+mapDiv+"blind").fadeOut();
                $("#"+mapDiv+"loader").fadeOut();
                 $("#"+mapDiv+order).remove();
                if (_mapsLoaded <= _groupTotal){
                    _mapsLoaded++;
                }
                _mapInitiating = false;
                displayNewMap();
            }
        }, 10000);

        mapDeferred.addCallback(function(response){

            map = response.map;
            map.Loaded = false;
            $("#"+mapDiv).data("webmap",_webmapIds[webmap]);

    		var layers = response.itemInfo.itemData.operationalLayers;

    		$("#"+mapDiv+"fullscreen").data("details","true");
    		if(response.itemInfo.item.description === null){
    			$("#"+mapDiv+"fullscreen").data("details","false");
    		}

            dojo.connect(dijit.byId("content"), 'resize', map,map.resize);

            dojo.connect(map,"onUpdateEnd", function(){
                if (map.Loaded === false){
                    map.Loaded = true;
    				_loadingMap = false;
                    $("#"+mapDiv+getOppositeOrder(order)).fadeOut("slow");
                    $("#"+mapDiv+"blind").fadeOut();
                    $("#"+mapDiv+"loader").fadeOut();
    				$("#"+mapDiv+"details").data("webmap",_webmapIds[webmap]);
    				$("#"+mapDiv+"fullscreen").data("webmap",_webmapIds[webmap]);
                    setTimeout(function(){
                        $("#"+mapDiv+getOppositeOrder(order)).remove();
                    },500);

                    if (_mapsLoaded <= _groupTotal){
                        _mapsLoaded++;
                    }
                    randomizeMaps();
                }
            });

    		if(map.loaded){
                clearTimeout(timeout);
                _mapInitiating = false;
              	initUI(layers,map,mapDiv);
    			if(map.extent.contains(map._mapParams.extent)){
    				map.setLevel(map.getLevel() + 1);
    			}
            }
            else{
            	dojo.connect(map,"onLoad",function(){
                    _mapInitiating = false;
                    clearTimeout(timeout);
    				initUI(layers,map,mapDiv);
    				if(map.extent.contains(map._mapParams.extent)){
    					map.setLevel(map.getLevel() + 1);
    				}
    			});
            }

        });

    }

};

var loadNewMap = function(mapDiv){
    console.log("Error loading map");
    _mapsLoaded++;
    mapDiv.empty();
    if (_mapsLoaded === _webmapIds.length && _nextQuery.start !== -1){
    	_group.queryItems(_nextQuery).then(function(queryResponse){
            _nextQuery = queryResponse.nextQueryParams;

            dojo.forEach(queryResponse.results,function(item){
                if (item.type === "Web Map"){
                    _webmapIds.push(item.id);
                }
            });
        });
	}
};

var initUI = function initUI(layers,map,mapDiv){

	var layerInfo = buildLayersList(layers);

	if(layerInfo.length > 0){
		$("#"+mapDiv+"fullscreen").data("legend","true");
    }
    else{
		$("#"+mapDiv+"fullscreen").data("legend","false");
    }
};

var buildLayersList = function(layers){
	//layers  arg is  response.itemInfo.itemData.operationalLayers;
	var layerInfos = [];
    dojo.forEach(layers, function(mapLayer, index){
    	var layerInfo = {};
		if (mapLayer.featureCollection && mapLayer.type !== "CSV") {
			if (mapLayer.featureCollection.showLegend === true) {
				dojo.forEach(mapLayer.featureCollection.layers, function(fcMapLayer){
					if (fcMapLayer.showLegend !== false) {
						layerInfo = {
							"layer": fcMapLayer.layerObject,
							"title": mapLayer.title,
							"defaultSymbol": false
						};
						if (mapLayer.featureCollection.layers.length > 1) {
							layerInfo.title += " - " + fcMapLayer.layerDefinition.name;
						}
						layerInfos.push(layerInfo);
					}
				});
			}
		}
		else if (mapLayer.showLegend !== false) {
			layerInfo = {
				"layer": mapLayer.layerObject,
				"title": mapLayer.title,
				"defaultSymbol": false
			};
			//does it have layers too? If so check to see if showLegend is false
			if (mapLayer.layers) {
				var hideLayers = dojo.map(dojo.filter(mapLayer.layers, function(lyr){
					return (lyr.showLegend === false);
				}), function(lyr){
					return lyr.id
				});
				if (hideLayers.length) {
					layerInfo.hideLayers = hideLayers;
					}
				}
				layerInfos.push(layerInfo);
			}
		});
		return layerInfos;
	}