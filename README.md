# Map Matrix
## A storytelling template provided by Esri


This template provides a starting point for creating your web application. This easily configurable template allows you to define the ArcGIS Online group, title and subtitle for the site. This read-me file explains how to setup and configure the template to run on your web server. We've also provided a few tips on how to personalize the template by adding a company logo.


### Table of Contents

- [Install the web applciation](#-install-the-web-application)
- [Configure the application](#-configure-the-application)
- [Personalize the application](#-personalize-the-application)


### Install the web application

These instructions assume that you have a Web server like [Internet Information Services(IIS)](http://www.iis.net/) installed and setup on your machine. If you are using another Web server the general installation steps will be the same but you will need to check your Web server's documentation for specific information on deploying and testing the application.

1. Copy the contents of the zip file into your web server's root directory. In IIS, the default location for the web server's root folder is `c:\inetpub\wwwroot`
2. (Optional). If your application edits features in a feature service or generates requests that exceed 2000 characters you may need to setup and use a proxy page. Common situations where you may exceed the URL length are, using complext polygons as input to a task or specifying a spatial reference using well-known text (wkt). View the [Using the proxy page](http://help.arcgis.com/EN/webapi/javascript/arcgis/help/jshelp_start.htm#jshelp/ags_proxy.htm) help topic for details on installing and configuring a proxy page.
3. Test the page using the following URL: http://localhost/[template name]/index.html, where [template name] is the name of the folder where you extracted the zip contents.

[Top](#-map-matrix)


### Configure the application

Now let's configure the application to use a different ArcGIS Online group, title or subtitle.

1. Every group on [ArcGIS Online](http://www.arcgis.com) can be queried using the group name and group owner. To find the group name and owner information, navigate to ArcGIS.com, and find the group you want to display. The name will be at the top of the group in bold. The owner information is listed under the "Group Details" on the right side of the page.
2. Open the index.html file in a text editor. You can edit this file to set the following application properties:
    - **title**: The main title that will be displayed in the application/
    - **subtitle**: The subtitle that will be displayed underneath the title in the main application.
    - **group**: Enter the group name and owner information for which you wish to query.
    - **numOfWebmaps**: The number of webmaps you wish to disply at once though this application. This should remain as 6 unless you modify the application.
    - **portalURL**: Will be `http://www.arcgis.com` unless the group is listed under a organization or other portal.
    - **delay**: The time between each new map being loaded.
    - **loop**: If loop is true, the application will loop through the map in order. If false, the application will randomly display a map from the group.
3. To modify these options, change the following code:

    Change only the code within asterisk  (*).

        function init(){
            configOptions = {
                //Enter main title for application
                title : " *This is a custom title for your application* ",
                //Enter the subtitle for the application
                subtitle : " *This is a custom subtitlefor your application* ",
                //Enter Portal group information
                group : {
                   "owner" : " *Enter group owner here* ",
                },
                //Enter the number of webmaps in the gallery at a given time
                numOfWebmaps : *6*,
                //Enter the Portal URL
                portalURL : " *http://www.arcgis.com* ",
                //Enter the delay used for switching maps (in milliseconds)
                delay : *8000*,
                //Enter "true" to loop through maps or "false" to go through maps randomly after first loop
                loop : *true*
                }
            }
        }

4. Save the file then test your [application](http://localhost/Chrome/index.html) and note that it now displays your application and if specified your custom title and subtitle.

[Top](#-map-matrix)

### Personalize the application


###### Add a logo to the application

You can personalize your site by adding a custom logo to the application's header next to the map title.

1. First copy your custom logo to the images subdirectory.
2. Open layout.css in a text editor.
3. Find the section of code that has an id of "logoArea" and add the following attribute.

        background:url(../images/yourImage.png) top left no-repeat;
        
4. Run the application and the custom logo should appear to the left of the title in the application header.


[Top](#-map-matrix)