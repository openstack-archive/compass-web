Compass-Web V2
==============

`Compass-Web V2` is an [AngularJS](https://angularjs.org/) based project for distributed systems deployment and monitoring.


Why Compass-Web V2?
-------------------
`Compass-Web V2` is designed to help users have a streamlined OpenStack deployment experience,
and provide extensibility to deploy other distributed systems such as Ceph system.
It targets to make a great-practice structure to ensure code resuability and module extensibility.

`Compass-Web V2` also comes prepackaged with the required frameworks: 
[AngularUI Router](https://github.com/angular-ui/ui-router)
[Twitter Bootstrap](http://getbootstrap.com),
[Angular Bootstrap](http://angular-ui.github.io/bootstrap),
[ngTable](http://bazalt-cms.com/ng-table/),
[Font Awesome](http://fortawesome.github.com/Font-Awesome),
[D3](http://d3js.org/),
[NVD3](http://nvd3.org/)
etc.


Directory Structure
-------------------
```
v2/
├── assets/
│   ├── css/
│   │   ├── <css files>
│   ├── font/
│   │   ├── <font files>
│   └── img/
│       ├── <image files>
├── dash/
│   ├── <kibana monitoring app>
├── data/
│   ├── <config data>
├── index.html
├── src/
│   ├── app/
│   │   ├── app.js
│   │   ├── appDev.js
│   │   ├── services.js
│   │   ├── cluster/
│   │   │   ├── <cluster module>
│   │   ├── login/
│   │   │   ├── <login module>
│   │   ├── monitoring/
│   │   │   ├── <monitoring module>
│   │   ├── server/
│   │   │   ├── <server module>
│   │   ├── topnav/
│   │   │   ├── <top navbar module>
│   │   ├── user/
│   │   │   ├── <user module>
│   │   └── wizard/
│   │       ├── <wizard module>
│   ├── common/
│   │   ├── <reusable component>
│   ├── bootstrap.js
│   └── main.js
└── vendor/
    ├── <libraries>
```

Functional Modules
------------------

* Cluster Module *

* Monitoring Module *

* Server Module *

* Wizard Module *



