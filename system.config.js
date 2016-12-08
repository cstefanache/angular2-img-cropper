(function (global) {

    // map tells the System loader where to look for things
    var map = {
        'app': 'dist', // 'dist',
        'rxjs': 'node_modules/rxjs',
        'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
        '@angular': 'node_modules/@angular',
        'ng2-img-cropper': 'ng2-img-cropper',
        "ng2-tabs": "node_modules/ng2-tabs"
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': {main: 'main.js', defaultExtension: 'js'},
        'rxjs': {defaultExtension: 'js'},
        'angular2-in-memory-web-api': {defaultExtension: 'js'},
        "ng2-tabs": { "main": "index.js", "defaultExtension": "js" }
    };

    var packageNames = [
        'common',
        'compiler',
        'forms',
        'core',
        'platform-browser',
        'platform-browser-dynamic'
    ];

    // add package entries for angular packages in the form '@angular/common': { main: 'index.umd.js', defaultExtension: 'js' }
    packageNames.forEach(function (pkgName) {
        packages['@angular/' + pkgName] = {
            main: '/bundles/' + pkgName + '.umd.js',
            defaultExtension: 'js'
        };
    });

    var config = {
        map: map,
        packages: packages
    };

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) {
        global.filterSystemConfig(config);
    }

    System.config(config);

})(this);
