/** Copyright Stewart Allen <sa@grid.space> -- All Rights Reserved */

"use strict";

function $(id) {
    return document.getElementById(id);
}

function $d(id, v) {
    $(id).style.display = v;
}

function $h(id, h) {
    $(id).innerHTML = h;
}

function estop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
}

(function() {

let DOC = document,
    WIN = window;

function init() {
    let moto = self.moto,
        sky = false,
        dark = false,
        ortho = false,
        zoomrev = true,
        zoomspd = 1,
        space = moto.Space,
        platform = space.platform,
        platcolor = 0x00ff00;

    // setup default workspace
    space.sky.set({
        grid: sky,
        color: dark ? 0 : 0xffffff
    });
    space.init($('container'), delta => { }, ortho);
    platform.onMove(delta => { });
    platform.set({
        volume: false,
        round: false,
        zOffset: 0.2,
        opacity: 0.3,
        color: 0xcccccc,
        zoom: { reverse: true, speed: 1 },
        size: { width: 300, depth: 300, height: 2.5, maxz: 2.5 },
        grid: { major: 25, minor: 5, majorColor: 0x999999, minorColor: 0xcccccc }
    });
    space.view.setZoom(zoomrev, zoomspd);
    space.useDefaultKeys(true);

    // add file drop handler
    space.event.addHandlers(self, [
        'drop', (evt) => {
            estop(evt);
            platform.setColor(platcolor);
            load.File.load(evt.dataTransfer.files[0])
                .then(data => {
                    console.log({data});
                })
        },
        'dragover', (evt) => {
            estop(evt);
            evt.dataTransfer.dropEffect = 'copy';
            let color = platform.setColor(0x00ff00);
            if (color !== 0x00ff00) platcolor = color;
        },
        'dragleave', (evt) => {
            platform.setColor(platcolor);
        }
    ]);

    // start worker
    moto.client.start(`/code/mesh_work?${gapp.version}`);

    // set app version
    $h('app-name', "Mesh:Tool");
    $h('app-vers', gapp.version);

    // hide loading curtain
    $d('curtain','none');
}

// remove version cache bust from url
WIN.history.replaceState({},'','/mesh/');

// setup init() trigger when dom + scripts complete
DOC.onreadystatechange = function() {
    if (DOC.readyState === 'complete') {
        init();
    }
}

})();