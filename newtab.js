let itemID
let itemNI
var numItems = 0;
var numB = 0;
var numF = 0;

let contextItem
let contextURL

let currentFolderID
let currentFolderName

let parentFolderId
let parentFolderName

$('.controller-btn').on('click', function () {
    if ($('.controller').hasClass('visible')) {
        $('.controller').removeClass('visible');
    } else {
        $('.controller').addClass('visible');
    }
})

$('body').on('contextmenu', function (e) {
    e.preventDefault()
})

$(window).on('load', function () {
    bookmarkHandler();

    if (localStorage.getItem('backimg')) {
        var wall = localStorage.getItem('backimg');
        $('.wr-wall[index="' + wall + '"]').click();
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            $('.wr-wall[index="2"]').click();
        } else {
            $('.wr-wall[index="1"]').click();
        }
    }

    $(".faves-module").sortable({
        // containment: "parent",
        revert: true,
        items: ".user-bookmark"
    });

    $('.faves-module').on('sortupdate', function () {
        itemNI = $('.user-bookmark[bookmark-id="' + itemID + '"]').index();
        browser.bookmarks.move(itemID, { index: itemNI });
    })

    browser.bookmarks.onCreated.addListener(bookmarkHandler);
    browser.bookmarks.onChanged.addListener(bookmarkHandler);
    browser.bookmarks.onMoved.addListener(bookmarkHandler);
    browser.bookmarks.onRemoved.addListener(bookmarkHandler);

    var userBack = localStorage.getItem('user-back');
    if (userBack) {
        if (userBack == 'true') {
            $('.back').addClass('visible');
            $('.wall-reel').addClass('visible');
        } else {
            $('.back').removeClass('visible');
            $('.wall-reel').removeClass('visible');
        }
    } else {
        localStorage.setItem('user-back', true);
        $('.wall-reel').addClass('visible');
        $('.back').addClass('visible');
    }
    setChecks();

    $('body').addClass('loaded');
})

$(document).on('mousedown', function () {
    $('.hud').empty();
    $('.hud').append("1:" + currentFolderID).append('<br>');
    $('.hud').append("2:" + currentFolderName).append('<br>');
    $('.hud').append("3:" + parentFolderId).append('<br>');
})

$(document).on('click', '.user-bookmark', function (e) {
    if (!$(e.target).hasClass('label') && !$(e.target).hasClass('backBtn')) {
        if ($(this).attr('bookmark-type') == 'folder') {
            currentFolderID = $(this).attr('bookmark-id');
            currentFolderName = $(this).children('.label').text();

            browser.bookmarks.get(currentFolderID).then((results) => {
                parentFolderId = results[0].parentId;
            });

            $('.faves-module').attr('label', currentFolderName);
            $('.faves-module').attr('folderopen', true);

            $('.user-bookmark').remove();
            browser.bookmarks.getChildren(currentFolderID).then((childs) => {
                // var toolbarNode = childs[0].children[1];
                for (var i = 0; i < childs.length; i++) {
                    var currentChild = childs[i];
                    const div = $('<div class="user-bookmark"></div>');
                    const icn = $('<div class="icon surface-item">');
                    const lbl = $('<p class="label">');
                    if (currentChild.type == 'folder') {
                        browser.bookmarks.getChildren(currentChild.id).then((childs) => {
                            icn.text(childs.length);
                        });
                    } else if (currentChild.type == 'bookmark') {
                        div.attr('bookmark-url', currentChild.url);
                        icn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=64&domain_url=" + currentChild.url + "')");
                    }

                    lbl.text(currentChild.title);
                    div.append(icn);
                    div.append(lbl);
                    div.attr('bookmark-index', currentChild.index);
                    div.attr('bookmark-type', currentChild.type);
                    div.attr('bookmark-id', currentChild.id);
                    $('.faves-module').append(div);

                    if (currentChild.type == "bookmark") {
                        numB++;
                    } else if (currentChild.type == "folder") {
                        numF++;
                    }
                    numItems++;
                }
            });
        } else {
            window.location.href = $(this).attr('bookmark-url')
        }
    }
})
$(document).on('click', '.backBtn', function (e) {
    browser.bookmarks.get(parentFolderId).then((results) => {
        parentFolderId = results[0].parentId;
    });

    if (parentFolderId == "toolbar_____") {
        $('.faves-module').attr('label', 'Favorites');
        $('.faves-module').attr('folderopen', false);

        bookmarkHandler();
    } else if (parentFolderId !== 'toolbar_____') {
        browser.bookmarks.get(parentFolderId).then((results) => {
            parentFolderName = results[0].title;
        });
        $('.faves-module').attr('label', parentFolderName);
        $('.faves-module').attr('folderopen', true);

        $('.user-bookmark').remove();
        browser.bookmarks.getChildren(parentFolderId).then((childs) => {
            // var toolbarNode = childs[0].children[1];
            for (var i = 0; i < childs.length; i++) {
                var currentChild = childs[i];
                const div = $('<div class="user-bookmark"></div>');
                const icn = $('<div class="icon surface-item">');
                const lbl = $('<p class="label">');
                if (currentChild.type == 'folder') {
                    browser.bookmarks.getChildren(currentChild.id).then((childs) => {
                        icn.text(childs.length);
                    });
                } else if (currentChild.type == 'bookmark') {
                    div.attr('bookmark-url', currentChild.url);
                    icn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=64&domain_url=" + currentChild.url + "')");
                }

                lbl.text(currentChild.title);
                div.append(icn);
                div.append(lbl);
                div.attr('bookmark-index', currentChild.index);
                div.attr('bookmark-type', currentChild.type);
                div.attr('bookmark-id', currentChild.id);
                $('.faves-module').append(div);

                if (currentChild.type == "bookmark") {
                    numB++;
                } else if (currentChild.type == "folder") {
                    numF++;
                }
                numItems++;
            }
        });
    }

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

$('.icm-newtab').on('click', function () {
    window.open(contextURL, '_blank');
    $('.item-context-menu').removeClass('visible');
})

$('.icm-delete').on('click', function () {
    browser.bookmarks.remove(contextItem);
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

    if (!container.is(e.target) && container.has(e.target).length === 0 && !containerBtn.is(e.target) && containerBtn.has(e.target).length === 0) {
        container.removeClass('visible');
    }

    if (!container2.is(e.target) && container2.has(e.target).length === 0 && !container2Btn.is(e.target) && container2Btn.has(e.target).length === 0) {
        container2.removeClass('visible');
    }

    if (!container3.is(e.target) && container3.has(e.target).length === 0 && !container2Btn.is(e.target) && container2Btn.has(e.target).length === 0 && !container2.is(e.target) && container2.has(e.target).length === 0 && !container4.is(e.target) && container4.has(e.target).length === 0) {
        // container3.removeClass('visible');
        nameCheck();
    }

});

function nameCheck() {
    const hasAttribute = Array.from($('.label')).some(element => element.hasAttribute('contenteditable'));
    if (hasAttribute) {
        if (itemID) {
            browser.bookmarks.update(itemID, { title: $('.user-bookmark[bookmark-id="' + itemID + '"] .label').text() })
            $(this).attr('contenteditable', 'false');
            $(".faves-module").sortable("enable");
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
    $(".faves-module").sortable("disable");
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


function bookmarkHandler(id, reorderInfo) {
    numItems = 0;
    $('.faves-module').hide();
    $('.user-bookmark').remove();
    $('.faves-module').addClass('is-empty');
    browser.bookmarks.getTree().then((bookmarks) => {
        var toolbarNode = bookmarks[0].children[1];
        for (var i = 0; i < toolbarNode.children.length; i++) {
            var currentChild = toolbarNode.children[i];
            const div = $('<div class="user-bookmark"></div>');
            const icn = $('<div class="icon surface-item">');
            const lbl = $('<p class="label">');
            if (currentChild.type == 'separator') {
                div.attr('bookmark-index', currentChild.index);
                div.attr('bookmark-type', currentChild.type);
                div.attr('bookmark-id', currentChild.id);
                $('.faves-module').append(div);
            } else if (currentChild.type == 'folder') {
                browser.bookmarks.getChildren(currentChild.id).then((childs) => {
                    icn.text(childs.length);
                });
            } else if (currentChild.type == 'bookmark') {
                div.attr('bookmark-url', currentChild.url);
                icn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=64&domain_url=" + currentChild.url + "')");
            }

            if (currentChild.type !== 'separator') {
                lbl.text(currentChild.title);
                div.append(icn);
                div.append(lbl);
                div.attr('bookmark-index', currentChild.index);
                div.attr('bookmark-type', currentChild.type);
                div.attr('bookmark-id', currentChild.id);
                $('.faves-module').append(div);
            }

            if (currentChild.type == "bookmark") {
                numB++;
                numItems++;
            } else if (currentChild.type == "folder") {
                numF++;
                numItems++;
            }
        }
    });
    setTimeout(() => {
        if (numItems === 0) {

        } else if (numItems > 0) {
            $('.faves-module').addClass('is-empty');
            $('.faves-module').removeClass('is-empty');
            $('.faves-module').sortable("refresh");
        }
    }, 100);
    $('.faves-module').show();
}

$('.wr-wall').on('click', function () {
    $('.wr-wall.selected').removeClass('selected')
    $(this).addClass('selected');
    localStorage.setItem('backimg', $(this).attr('index'));
    var bi = $(this).css('background-image');
    $('.back').css('background-image', bi);
})

function setChecks() {
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
        $('.controller').append(settingBox);
    });
    $('.settingBox[label="Background"]').appendTo('.controller');
    $('.wall-reel').appendTo('.controller');

    if ($('.back').hasClass('visible')) {
        $('.settingCB[id="background"]').prop('checked', true);
    } else {
        $('.settingCB[id="background"]').prop('checked', false);
    }
}

$(document).on('change', '.settingCB:not([id="background"])', function () {
    var state = $(this).prop('checked');
    var thisLabel = $(this).parent().attr('label');
    if (state) {
        $('.ntp-module[label="' + thisLabel + '"]').removeClass('hidden');
    } else {
        $('.ntp-module[label="' + thisLabel + '"]').addClass('hidden');
    }
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

function saveSettings() {

}