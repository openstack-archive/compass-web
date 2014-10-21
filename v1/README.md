Compass-Web V1
===========

`Compass-Web V1` is based on [JavaScriptMVC](http://v32.javascriptmvc.com/) framework. It has five modules: Servers, Security, Networking, Host Configuration and Deployment.

 1. *Servers Module*. Discover available servers with switch information and add a subset of the servers to a cluster.

 2. *Security Module*. Specify credentials for the OpenStack system.

 3. *Networking Module*. Specify network addresses needed to facilitate the OpenStack cluster you want to use for your OpenStack servers.

 4. *Host Configuration Module* Configure host names of the servers in the cluster.

 5. *Deployment Module* Deploy OpenStack onto the servers with the realtime progressbars.


Framework
---------
[JavaScriptMVC v3.2.4](http://v32.javascriptmvc.com/)
JavaScriptMVC is a MIT licensed, client-side, JavaScript framework that builds maintainable, error-free, lightweight applications as quick as possible.

Third-party Libraries
---------------------
 * [jQueryUI](http://jqueryui.com/)
  jQuery UI is a curated set of user interface interactions, effects, widgets, and themes built on top of the jQuery JavaScript Library. It is included for widgets such as accordion, tabs, dialog and progressbar.

 * [d3](http://d3js.org/)
  D3.js is a JavaScript library for manipulating documents based on data. It is included for the graph-based progress bars in Deployment module to have a collapsible tree layout for switches and servers.

 * [DataTables](http://www.datatables.net/)
  DataTables is a plug-in for the jQuery Javascript library to add advanced interaction controls to any HTML table. It is included to have advanced interaction controls to HTML table in Servers and Deployment modules.