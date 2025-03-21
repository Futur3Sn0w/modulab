let itemID
let itemNI

let contextItem
let contextURL

let currentFolderID
let currentFolderName

let parentFolderId
let parentFolderName

$(window).on('load', function () {
    bookmarkHandler();
    downloadsModule();
    setBackground();

    const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    const setColorScheme = e => {
        if (e.matches) {
            // Dark
            $('body').removeClass('light-theme').addClass('dark-theme')
        } else {
            // Light
            $('body').removeClass('dark-theme').addClass('light-theme')
        }
    }

    setColorScheme(colorSchemeQueryList);
    colorSchemeQueryList.addEventListener('change', setColorScheme);


    $('.version').text('v' + chrome.runtime.getManifest().version);

    $(".faves-module .links").sortable({
        // containment: "parent",
        // revert: true,
        distance: 3,
        tolerance: "pointer",
        delay: 100,
        items: ".user-bookmark"
    });

    const savedOrder = localStorage.getItem("gAppOrder");
    if (savedOrder) {
        const orderArray = savedOrder.split(",");
        orderArray.forEach(function (id) {
            if (id) {  // Check to avoid appending empty IDs
                $(".googApps .apps").append($("#" + id));  // Append element using the correct selector
            }
        });
    }

    $(".googApps .apps").sortable({
        containment: "parent",
        distance: 3,
        tolerance: "pointer",
        delay: 100,
        items: ".gApp",
        placeholder: "sortable-placeholder gApp",
        stop: function () {
            const order = $(".gApp").map(function () {
                return this.id; // Collect IDs of the sorted elements
            }).get();
            localStorage.setItem("gAppOrder", order.join(",")); // Save the order to localStorage
        }
    });

    chrome.bookmarks.onCreated.addListener(bookmarkHandler);
    chrome.bookmarks.onChanged.addListener(bookmarkHandler);
    chrome.bookmarks.onMoved.addListener(bookmarkHandler);
    chrome.bookmarks.onRemoved.addListener(bookmarkHandler);

    var udl = localStorage.getItem('user-downloads');
    if (udl) {
        if (udl == 'true') {
            $('.downloads-module').removeClass('hidden');
        } else {
            $('.downloads-module').removeClass('visible');
        }
    } else {
        localStorage.setItem('user-downloads', true);
        $('.downloads-module').removeClass('hidden');
    }

    var userCBar = localStorage.getItem('user-cbar');
    if (userCBar) {
        if (userCBar == 'true') {
            $('.chromeBar').addClass('visible');
        } else {
            $('.chromeBar').removeClass('visible');
        }
    } else {
        localStorage.setItem('user-cbar', true);
    }
    setChecks();

    $('body').addClass('loaded');

    if (localStorage.getItem('--accent')) {
        $(':root').css('--accent', localStorage.getItem('--accent'));
        $(':root').css('--accent-contrast', localStorage.getItem('--accent-contrast'));
        $(':root').css('--accent-contrast-text', localStorage.getItem('--accent-contrast-text'));
        $(':root').css('--accent-contrast-alpha', localStorage.getItem('--accent-contrast-alpha'));
    } else {
        setBackground();
        colorTheivery();
    }

})

function colorTheivery() {
    const colorThief = new ColorThief();
    const img = document.querySelector('.back');

    if (localStorage.getItem('backimg') == '0') {
        // Make sure image is finished loading
        if (img.complete) {
            var rgb = colorThief.getColor(img);
            var rgbPretty = rgb[0] + ", " + rgb[1] + ", " + rgb[2];
            var rgbCSS = 'rgb(' + rgbPretty + ")";
            var contrastText = getContrastYIQ(rgbPretty);

            $(':root').css('--accent', rgbCSS);
            $(':root').css('--accent-contrast', 'rgb(' + contrastText + ')');
            var notCT = (contrastText == '0, 0, 0') ? '255, 255, 255' : '0, 0, 0';
            $(':root').css('--accent-contrast-text', 'rgb(' + notCT + ')');
            $(':root').css('--accent-contrast-alpha', 'rgba(' + notCT + ', .3)');
        } else {
            img.addEventListener('load', function () {
                var rgb = colorThief.getColor(img);
                var rgbCSS = 'rgb(' + rgbPretty + ")";
                var rgbPretty = rgb[0] + ", " + rgb[1] + ", " + rgb[2];
                var contrastText = getContrastYIQ(rgbPretty);

                $(':root').css('--accent', rgbCSS);
                $(':root').css('--accent-contrast', 'rgb(' + contrastText + ')');
                var notCT = (contrastText == '0, 0, 0') ? '255, 255, 255' : '0, 0, 0';
                $(':root').css('--accent-contrast-text', 'rgb(' + notCT + ')');
                $(':root').css('--accent-contrast-alpha', 'rgba(' + notCT + ', .3)');
            });
        }
    } else {
        $(':root').css('--accent', '#DDD');
        $(':root').css('--accent-contrast', 'rgb(0, 0, 0)');
        $(':root').css('--accent-contrast-text', 'rgb(255, 255, 255)');
        $(':root').css('--accent-contrast-alpha', 'rgba(0, 0, 0, .3)');
    }
    localStorage.setItem('--accent', $(':root').css('--accent'));
    localStorage.setItem('--accent-contrast', $(':root').css('--accent-contrast'));
    localStorage.setItem('--accent-contrast-text', $(':root').css('--accent-contrast-text'));
    localStorage.setItem('--accent-contrast-alpha', $(':root').css('--accent-contrast-alpha'));
}

function getContrastYIQ(rgb) {
    var rgbArray = rgb.split(',');
    var r = parseInt(rgbArray[0]);
    var g = parseInt(rgbArray[1]);
    var b = parseInt(rgbArray[2]);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '0, 0, 0' : '255, 255, 255';
}

function setBackground() {
    var userBack = localStorage.getItem('user-back');
    var imgData = localStorage.getItem('backImgData');
    var wall = localStorage.getItem('backimg');
    if (!userBack) {
        localStorage.setItem('user-back', true);
    }

    if (!wall) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            wall = 2
        } else {
            wall = 1
        }
    }

    if (userBack == 'true') {
        if (wall == '0') {
            $('.back').attr('src', imgData);
            $('.wr-wall').removeClass('selected');
            $('.wr-wall[index="0"]').addClass('selected');
            $('.wr-wall[index="0"] .bi').css('background-image', "url('" + imgData + "')");
        } else {
            $('.wr-wall').removeClass('selected');
            $('.wr-wall[index="' + wall + '"]').click();
        }

        $('.back').addClass('visible');
        $('.wall-reel').addClass('visible');
    } else {
        $('.back').removeClass('visible');
        $('.wall-reel').removeClass('visible');
    }

}

$('.faves-module .links').on('sortstop', function (e) {
    var newIndex = $(".faves-module .user-bookmark").index($('.user-bookmark[bookmark-id="' + itemID + '"]'));
    chrome.bookmarks.move(itemID, { index: newIndex });
    e.stopPropagation();
})

$('.version').on('click', function () {
    window.location.href = "https://github.com/futur3sn0w/sf-ntp-ff"
})

$('#back-input').change(function () {
    var reader = new FileReader();
    reader.onload = function (e) {
        var imgData = e.target.result;
        try {
            localStorage.removeItem('backImgData');
            localStorage.setItem('backImgData', imgData);

            $('.wr-wall.selected').removeClass('selected')
            $('.wr-wall[index="0"]').addClass('selected');
            localStorage.setItem('backimg', 0);
            setBackground();
            setTimeout(() => {
                colorTheivery();
                // window.location.reload();
            }, 200);

        } catch (error) {
            alert("The selected image may be too large, or otherwise failed to upload. Try the image again, or try another image! Error: " + error);
        }

    }
    reader.readAsDataURL(this.files[0]);
    reader.onerror = function (e) {
        alert("The image you selected may be too large, or otherwise failed to upload. Try again, or try another image!");
    }
    reader.onabort = function (e) {
        alert("Background upload cancelled.");
    }
});


$('.controller-btn').on('click', function () {
    if ($('.controller').hasClass('visible')) {
        $('.controller').removeClass('visible');
        $('body').removeClass('controllerOpen')
    } else {
        $('.controller').addClass('visible');
        $('body').addClass('controllerOpen')
    }
})

$('body').on('contextmenu', function (e) {
    e.preventDefault()
})

$('.gApp').on('click', function () {
    window.open($(this).attr('target'), '_blank')
})

$(document).on('click', '.user-bookmark', function (e) {
    if (!$(e.target).hasClass('label') && !$(e.target).hasClass('backBtn')) {
        if ($(this).attr('bookmark-type') == 'folder') {
            currentFolderID = $(this).attr('bookmark-id');
            currentFolderName = $(this).children('.label').text();

            parentFolderId = $(this).attr('bookmark-parent');

            $('.faves-module').attr('label', currentFolderName);
            $('.faves-module').attr('folderopen', true);

            $('.user-bookmark').remove();
            chrome.bookmarks.getChildren(currentFolderID).then((childs) => {
                // var toolbarNode = childs[0].children[1];
                for (var i = 0; i < childs.length; i++) {
                    var currentChild = childs[i];
                    const div = $('<div class="user-bookmark"></div>');
                    const icn = $('<div class="icon surface-item">');
                    const lbl = $('<p class="label">');
                    if (currentChild.type == 'folder') {
                        chrome.bookmarks.getChildren(currentChild.id).then((childs) => {
                            icn.attr('numcis', childs.length);
                        });
                    } else if (currentChild.type == 'bookmark') {
                        div.attr('bookmark-url', currentChild.url);
                        const backIcn = $('<div class="backIcn">');
                        const frontIcn = $('<div class="frontIcn">');
                        backIcn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=" + currentChild.url + "')");
                        frontIcn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=" + currentChild.url + "')");
                        // icn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=" + currentChild.url + "')");

                        icn.append(backIcn);
                        icn.append(frontIcn);
                    }

                    lbl.text(currentChild.title);
                    div.append(icn);
                    div.append(lbl);
                    div.attr('bookmark-index', currentChild.index);
                    div.attr('bookmark-type', currentChild.type);
                    div.attr('bookmark-id', currentChild.id);
                    div.attr('bookmark-parent', currentChild.parentId);
                    $('.faves-module .links').append(div);
                }
            });
        } else {
            window.open($(this).attr('bookmark-url'), '_blank')
        }
    }
})

$(document).on('click', '.backBtn', function (e) {
    location.reload();
})

$(document).on('click', 'AAAAAbackBtn', function (e) {
    if (parentFolderId == "toolbar_____") {
        $('.faves-module').attr('label', 'Favorites');
        $('.faves-module').attr('folderopen', false);

        bookmarkHandler();
    } else if (parentFolderId !== 'toolbar_____') {
        chrome.bookmarks.get(parentFolderId).then((results) => {
            parentFolderName = results[0].title;
        });
        $('.faves-module').attr('label', parentFolderName);
        $('.faves-module').attr('folderopen', true);

        $('.user-bookmark').remove();
        chrome.bookmarks.getChildren(parentFolderId).then((childs) => {
            // var toolbarNode = childs[0].children[1];
            for (var i = 0; i < childs.length; i++) {
                var currentChild = childs[i];
                const div = $('<div class="user-bookmark"></div>');
                const icn = $('<div class="icon surface-item">');
                const lbl = $('<p class="label">');
                if (currentChild.type == 'folder') {
                    chrome.bookmarks.getChildren(currentChild.id).then((childs) => {
                        icn.attr('numcis', childs.length);
                    });
                } else if (currentChild.type == 'bookmark') {
                    div.attr('bookmark-url', currentChild.url);
                    const backIcn = $('<div class="backIcn">');
                    const frontIcn = $('<div class="frontIcn">');
                    backIcn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=" + currentChild.url + "')");
                    backIcn.attr('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=" + currentChild.url + "')");
                    frontIcn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=" + currentChild.url + "')");
                    // icn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=" + currentChild.url + "')");

                    icn.append(backIcn);
                    icn.append(frontIcn);
                }

                lbl.text(currentChild.title);
                div.append(icn);
                div.append(lbl);
                div.attr('bookmark-index', currentChild.index);
                div.attr('bookmark-type', currentChild.type);
                div.attr('bookmark-id', currentChild.id);
                div.attr('bookmark-parent', currentChild.parentId);
                $('.faves-module .links').append(div);
            }
        });
    }

    currentFolderID = parentFolderId
    currentFolderName = parentFolderName

    chrome.bookmarks.get(parentFolderId).then((results) => {
        parentFolderId = results[0].parentId;
    });

    e.stopPropagation()
})

$(document).on('contextmenu', '.user-bookmark', function (e) {
    contextItem = null;
    $('.item-context-menu').css({
        left: e.pageX,
        top: e.pageY
    });
    if ($(this).attr('bookmark-type') == 'folder') {
        $('.icm-newtab').hide();
    } else {
        $('.icm-newtab').show();
        contextURL = $(this).attr('bookmark-url');
    }
    contextItem = $(this).attr('bookmark-id');

    $('.item-context-menu').addClass('visible');
})

$('.waffleBtn').on('click', function () {
    $('.googApps').addClass('visible');
})

$('.icm-newtab').on('click', function () {
    window.open(contextURL, '_blank');
    $('.item-context-menu').removeClass('visible');
})

$('.icm-delete').on('click', function () {
    chrome.bookmarks.remove(contextItem);
    bookmarkHandler();
    $('.item-context-menu').removeClass('visible');
})

$('.icm-rename').on('click', function () {
    $('.user-bookmark[bookmark-id="' + contextItem + '"] .label').dblclick()
    $('.item-context-menu').removeClass('visible');
})

$(document).on("mouseup", function (e) {
    var container = $('.controller');
    var containerBtn = $('.controller-btn');
    var container2 = $('.item-context-menu');
    var container2Btn = $('.user-bookmark');
    var container3 = $('.label');
    var container4 = $('.backBtn');
    var container4 = $('.googApps');
    var container4Btn = $('.waffleBtn');

    if (!container.is(e.target) && container.has(e.target).length === 0 && !containerBtn.is(e.target) && containerBtn.has(e.target).length === 0) {
        container.removeClass('visible');
        $('body').removeClass('controllerOpen');
    }

    if (!container2.is(e.target) && container2.has(e.target).length === 0 && !container2Btn.is(e.target) && container2Btn.has(e.target).length === 0) {
        container2.removeClass('visible');
    }

    if (!container3.is(e.target) && container3.has(e.target).length === 0 && !container2Btn.is(e.target) && container2Btn.has(e.target).length === 0 && !container2.is(e.target) && container2.has(e.target).length === 0 && !container4.is(e.target) && container4.has(e.target).length === 0) {
        // container3.removeClass('visible');
        nameCheck();
    }

    if (!container4.is(e.target) && container4.has(e.target).length === 0 && !container4Btn.is(e.target) && container4Btn.has(e.target).length === 0) {
        container4.removeClass('visible');
    }

});

function nameCheck() {
    const hasAttribute = Array.from($('.label')).some(element => element.hasAttribute('contenteditable'));
    if (hasAttribute) {
        if (itemID) {
            chrome.bookmarks.update(itemID, { title: $('.user-bookmark[bookmark-id="' + itemID + '"] .label').text() })
            $(this).attr('contenteditable', 'false');
            $(".faves-module .links").sortable("enable");
        }
    }
}

$(document).on('mousedown', '.user-bookmark', function () {
    $(this).addClass('active');
    itemID = $('.user-bookmark.active').attr('bookmark-id');
})

$(document).on('mouseup', '.user-bookmark', function () {
    $(this).removeClass('active');
})

$(document).on('dblclick', '.label', function () {
    contextItem = null;
    $(".faves-module .links").sortable("disable");
    $(this).attr('contenteditable', 'true');
    $(this).focus();
    $(this).select();
    contextItem = $(this).parent().attr('bookmark-id');
})

$(document).on('keypress', '.label', function (e) {
    if (e.which == 13) {
        nameCheck();
    }
})

function downloadsModule() {
    $('.user-download').remove();
    $('.downloads-module').addClass('is-empty');

    chrome.downloads.search({
        limit: 8,
        orderBy: ["-startTime"]
    }).then(function (items) {
        items.forEach(function (item) {
            var div = $("<div>").addClass("user-download").addClass("surface-item");
            var img = $("<div>").addClass("icon");
            var label = $("<p>").addClass("label").text(item.filename.slice(item.filename.lastIndexOf('/') + 1));
            chrome.downloads.getFileIcon(item.id).then(function (iconUrl) {
                img.css("background-image", "url(" + iconUrl + ")");
            });
            div.append(img).append(label);
            div.click(function () {
                chrome.downloads.open(item.id)
            })
            div.hover(
                function () {
                    var button = $("<button class='showFile'>").attr('data-text', "􀊫");
                    button.click(function () {
                        chrome.downloads.show(item.id)
                    })
                    $(this).append(button);
                },
                function () {
                    $(this).find("button").remove();
                }
            );


            $(".downloads-module").append(div);
        });
        var dlItems = $('.downloads-module').children('.user-download').length;
        if (dlItems === 0) {

        } else if (dlItems > 0) {
            $('.downloads-module').addClass('is-empty');
            $('.downloads-module').removeClass('is-empty');
        }
    });
}

function bookmarkHandler() {
    $('.faves-module').hide();
    $('.user-bookmark').remove();
    $('.faves-module').addClass('is-empty');

    chrome.bookmarks.getChildren("1").then((toolbarNode) => {
        toolbarNode.forEach((currentChild) => {
            const div = $('<div class="user-bookmark"></div>');
            const icn = $('<div class="icon surface-item">');
            const lbl = $('<p class="label">');
            let ccType = 'bookmark';

            if (!currentChild.url || currentChild.url == undefined) {
                ccType = 'folder'
                chrome.bookmarks.getChildren(currentChild.id).then((childs) => {
                    icn.attr('numcis', childs.length);
                });
            } else {
                div.attr('bookmark-url', currentChild.url);
                const backIcn = $('<div class="backIcn">');
                const frontIcn = $('<div class="frontIcn">');
                backIcn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=" + currentChild.url + "')");
                frontIcn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=32&domain_url=" + currentChild.url + "')");

                icn.append(backIcn);
                icn.append(frontIcn);
            }

            if (currentChild.type !== 'separator') {
                lbl.text(currentChild.title);
                div.append(icn);
                div.append(lbl);
                div.attr('bookmark-index', currentChild.index);
                div.attr('bookmark-type', ccType);
                div.attr('bookmark-id', currentChild.id);
                div.attr('bookmark-parent', currentChild.parentId);
                $('.faves-module .links').append(div);
            }
        });

        const favItems = $('.faves-module').children('.user-bookmark').length;
        if (favItems > 0) {
            $('.faves-module').removeClass('is-empty').sortable("refresh");
        }

        $('.faves-module').show();
    });
}


$('.wr-wall:not([index="0"])').on('click', function () {
    $('.wr-wall.selected').removeClass('selected')
    $(this).addClass('selected');
    if (!$('.wr-wall.selected').attr('index') == '0') {
        localStorage.setItem('backimg', $(this).attr('index'));
        var bi = $('.wr-wall.selected').css('background-image');
        var url = bi.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
        // alert(url);
        $('.back').attr('src', url);
    }
})

function setChecks() {
    $('.settingBox[label="Chrome bar"]').appendTo('.controller');
    let sections = $('<div>').addClass('sections');
    $('.ntp-module').each((module) => {
        var cmod = $('.ntp-module').eq(module);
        var label = cmod.attr('label');
        var labelClean = cmod.attr('label').replace(' ', '');
        var isVisible = !cmod.hasClass('hidden');

        var settingBox = $('<div>').addClass('settingBox').attr('label', label).attr('index', module);
        var newLabel = $('<label>').text(label).attr('for', labelClean);
        var checkbox = $('<input>').attr('type', 'checkbox').attr('id', labelClean).prop('checked', isVisible).addClass('settingCB');

        settingBox.append(checkbox);
        settingBox.append(newLabel);

        sections.append(settingBox);
    });
    $('.controller').append(sections);
    $('.settingBox[label="Background"]').appendTo('.controller');
    $('.wall-reel').appendTo('.controller');

    if ($('.back').hasClass('visible')) {
        $('.settingCB[id="background"]').prop('checked', true);
    } else {
        $('.settingCB[id="background"]').prop('checked', false);
    }

    if ($('.downloads-module').hasClass('hidden')) {
        $('.settingCB[id="Recentdownloads"]').prop('checked', false);
    } else {
        $('.settingCB[id="Recentdownloads"]').prop('checked', true);
    }

    if ($('.chromeBar').hasClass('visible')) {
        $('.settingCB[id="cBar"]').prop('checked', true);
    } else {
        $('.settingCB[id="cBar"]').prop('checked', false);
    }
}

$(document).on('change', '.settingCB:not(.meta)', function () {
    var state = $(this).prop('checked');
    var thisLabel = $(this).parent().attr('label');
    if (state) {
        $('.ntp-module[label="' + thisLabel + '"]').removeClass('hidden');
    } else {
        $('.ntp-module[label="' + thisLabel + '"]').addClass('hidden');
    }
})

$(document).on('change', '.settingCB[id="Recentdownloads"]', function () {
    var state = $(this).prop('checked');
    if (state) {
        $('.user-downloads').removeClass('hidden');
    } else {
        $('.user-downloads').addClass('hidden');
    }
    localStorage.setItem('user-downloads', state);
})

$(document).on('change', '.settingCB[id="background"]', function () {
    var state = $(this).prop('checked');
    if (state) {
        $('.back').addClass('visible');
        $('.wall-reel').addClass('visible');
    } else {
        $('.back').removeClass('visible');
        $('.wall-reel').removeClass('visible');
    }
    localStorage.setItem('user-back', state);
})

$(document).on('change', '.settingCB[id="cBar"]', function () {
    var state = $(this).prop('checked');
    if (state) {
        $('.chromeBar').addClass('visible');
    } else {
        $('.chromeBar').removeClass('visible');
    }
    localStorage.setItem('user-cbar', state);
})

const savedColor = localStorage.getItem('backColor');
if (savedColor) {
    $('.back').css('background-color', savedColor);
    $('.backColorSel').val(savedColor); // Set input to saved color if applicable
}

// Listen for color input changes and update background color & localStorage
$('.backColorSel').on('input', function () {
    const selectedColor = $(this).val(); // Get the selected color value
    $('.back').css('background-color', selectedColor); // Apply the color
    localStorage.setItem('backColor', selectedColor); // Save the color in localStorage
});