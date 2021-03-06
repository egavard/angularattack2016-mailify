(function(global) {

    // map tells the System loader where to look for things
    var map = {
        'app':                        'app', // 'dist',
        'rxjs':                       'node_modules/rxjs',
        'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
        '@angular':                   'node_modules/@angular',
        'ng2-charts':                 'app/libs/ng2-charts-upgrade-rc1',
		'ng2-bootstrap':              'node_modules/ng2-bootstrap',
        'ng2-bs3-modal':               'node_modules/ng2-bs3-modal',
		'moment':                     'node_modules/moment',
		'color-picker':               'app/libs/color-picker',
        'angular2-grid':               'node_modules/angular2-grid'


    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app':                        { main: 'main.js',  defaultExtension: 'js' },
        'rxjs':                       { defaultExtension: 'js' },
        'angular2-in-memory-web-api': { defaultExtension: 'js' },
        'ng2-charts':                 { defaultExtension: 'js' },
		'ng2-bootstrap':              { defaultExtension: 'js' },
        'ng2-bs3-modal':              { defaultExtension: 'js' },
        'moment':                     { main: 'moment.js', defaultExtension: 'js' },
		'color-picker':               { defaultExtension: 'js' },
        'angular2-grid':              { defaultExtension: 'js', main:'NgGrid.js'}
    };

    var packageNames = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/router-deprecated',
        '@angular/testing',
        '@angular/upgrade'
    ];

    // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
    packageNames.forEach(function(pkgName) {
        packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
    });

    var config = {
        map: map,
        packages: packages
    }

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) { global.filterSystemConfig(config); }

    System.config(config);

})(this);