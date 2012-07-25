# Map Matrix

### A storytelling template provided by Esri


This template provides a starting point for creating your web application. This easily configurable template allows you to define the ArcGIS Online group, title and subtitle for the site. This read-me file explains how to setup and configure the template to run on your web server. We've also provided a few tips on how to personalize the template by adding a company logo, customizing the content in the sidebar and adding an overview map.


### Table of Contents

- [Install the web applciation](#-install-the-web-application)
- [Configure the application](#-configure-the-application)
- Specify map options
- Personalize the application


### Install the web application

These instructions assume that you have a Web server like [Internet Information Services(IIS)](http://www.iis.net/) installed and setup on your machine. If you are using another Web server the general installation steps will be the same but you will need to check your Web server's documentation for specific information on deploying and testing the application.

1. Copy the contents of the zip file into your web server's root directory. In IIS, the default location for the web server's root folder is `c:\inetpub\wwwroot`
2. (Optional). If your application edits features in a feature service or generates requests that exceed 2000 characters you may need to setup and use a proxy page. Common situations where you may exceed the URL length are, using complext polygons as input to a task or specifying a spatial reference using well-known text (wkt). View the [Using the proxy page](http://help.arcgis.com/EN/webapi/javascript/arcgis/help/jshelp_start.htm#jshelp/ags_proxy.htm) help topic for details on installing and configuring a proxy page.
3. Test the page using the following URL: http://localhost/[template name]/index.html, where [template name] is the name of the folder where you extracted the zip contents.

[Top](#-map-matrix)


### Configure the application

Now let's configure the application to use a different ArcGIS Online group, title or subtitle.

1. Every saved group on [ArcGIS Online](http://www.arcgis.com) has a unique identifier. To find the group id, navigate to ArcGIS.com, and find the group you want to display. If it is one of your maps, make sure it's shared with everyone (public). View the map details and copy the ID from the URL in the top of your browser. The section you need to copy is highlighted in yellow in the image below.