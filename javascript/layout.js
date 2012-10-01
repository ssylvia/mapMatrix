$(document).ready(function(){
    $(".mapPane").each(function(){
        _mapDivs.push($(this).attr("id"));
        $(this).append("<div id='" + $(this).attr("id") +"blind' class='mapBlind'></div>");
        $(this).append("<img id='" + $(this).attr("id") +"loader' class='loader' src='images/loader.gif' alt=''>");
		$(this).append("<div id='" + $(this).attr("id") +"controls' class='mapControls'><img id='" + $(this).attr("id") +"details' class='details mapCtrl' title='View map details' alt='' src='images/details.png'><img id='" + $(this).attr("id") +"fullscreen' class='fullscreen mapCtrl' title='View larger map' alt='' src='images/fullscreen.png'></div>");
		$(".mapControls").fadeTo("1","0.8").hide();
		$(".mapCtrl").fadeTo("1","0.7");
    });
	$(".mapPane").hover(function(){
		_currentMap = $(this).attr("id");
		$(this).children(".mapControls").stop(true,true).slideDown("fast");
		$(this).children(".map").children(".container").children(".esriSimpleSlider").stop(true,true).slideDown("fast");
	},function(){
		_currentMap = null;
		$(this).children(".mapControls").stop(true,true).slideUp("fast");
		$(this).children(".map").children(".container").children(".esriSimpleSlider").stop(true,true).slideUp("fast");
	});
	$(".mapCtrl").hover(function(){
		$(this).stop(true,true).fadeTo(100,"1.0");
	},function(){
		$(this).stop(true,true).fadeTo(100,"0.7");
	});
	$(".details").click(function(e) {
        if(navigator.userAgent.match(/iPad/i) != null){
            window.open("http://www.arcgis.com/home/item.html?id=" + $(this).data("webmap"));
        }
        else{
            $.colorbox({
    			iframe:true,
    			href:"http://www.arcgis.com/home/item.html?id=" + $(this).data("webmap"),
    			width:"90%",
    			height:"90%"
    		});
        }
    });
	$(".fullscreen").click(function(e) {
        $.colorbox({
			iframe:true,
			href:"http://storymaps.esri.com/templates/sidepanel/?displayDescription=" + $(this).data("details") + "&displayLegend=" + $(this).data("legend") + "&webmap=" + $(this).data("webmap"),
			width:"90%",
			height:"90%"
		});
    });
});

$(window).resize(function(){
    resetLayout();
});

dojo.ready(function(){
    resetLayout();
});

var resetLayout = function(){
    $(".loader").each(function(){
        var top = (($(this).parent().height()/2)-15);
        var left = (($(this).parent().width()/2)-15);
        $(this).css("top",top).css("left",left);
        if(_mapsLoaded === 0 && _webmapIds !== undefined){
            $(".loader").fadeIn("fast");
        }
    });
};