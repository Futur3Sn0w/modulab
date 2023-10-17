let itemID
let itemNI
var numItems = 0;

let contextItem
let contextURL

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

    $(".faves-module").sortable({
        // containment: "parent",
        // revert: true,
    });

    $('.faves-module').on('sortupdate', function () {
        itemNI = $('.user-bookmark[bookmark-id="' + itemID + '"]').index();
        browser.bookmarks.move(itemID, { index: itemNI });
    })

    browser.bookmarks.onCreated.addListener(bookmarkHandler);
    browser.bookmarks.onChanged.addListener(bookmarkHandler);
    browser.bookmarks.onMoved.addListener(bookmarkHandler);
    browser.bookmarks.onRemoved.addListener(bookmarkHandler);
})

$(document).on('click', '.user-bookmark', function () {
    if ($(this).attr('bookmark-type') == 'folder') {

    } else {
        window.location.href = $(this).attr('bookmark-url')
    }
})

$(document).on('contextmenu', '.user-bookmark', function (e) {
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
})

$('.icm-delete').on('click', function () {
    browser.bookmarks.remove(contextItem);
    bookmarkHandler();
    $('.item-context-menu').removeClass('visible');
})

$(document).on("mouseup", function (e) {
    var container = $('.controller');
    var containerBtn = $('.controller-btn');
    var container2 = $('.item-context-menu');
    var container2Btn = $('.user-bookmark');
    if (!container.is(e.target) && container.has(e.target).length === 0 && !containerBtn.is(e.target) && containerBtn.has(e.target).length === 0) {
        container.removeClass('visible');
    }

    if (!container2.is(e.target) && container2.has(e.target).length === 0 && !container2Btn.is(e.target) && container2Btn.has(e.target).length === 0) {
        container2.removeClass('visible');
    }
});

$(document).on('mousedown', '.user-bookmark', function () {
    $(this).addClass('active');
    itemID = $(this).attr('bookmark-id');
})

$(document).on('mouseup', '.user-bookmark', function () {
    $(this).removeClass('active');
})

function bookmarkHandler(id, reorderInfo) {
    numItems = 0;
    $('.faves-module').hide();
    $('.faves-module').empty();
    $('.faves-module').addClass('is-empty');
    browser.bookmarks.getTree().then((bookmarks) => {
        var toolbarNode = bookmarks[0].children[1];
        for (var i = 0; i < toolbarNode.children.length; i++) {
            var currentChild = toolbarNode.children[i];
            if (currentChild.type == 'separator') {

            } else {
                const div = $('<div class="user-bookmark"></div>');
                const icn = $('<div class="icon surface-item">');
                const lbl = $('<p class="label">');
                icn.css('background-image', "url('https://s2.googleusercontent.com/s2/favicons?sz=64&domain_url=" + currentChild.url + "')");
                lbl.text(currentChild.title);
                div.append(icn);
                div.append(lbl);
                div.attr('bookmark-url', currentChild.url);
                div.attr('bookmark-index', currentChild.index);
                div.attr('bookmark-type', currentChild.type);
                div.attr('bookmark-id', currentChild.id);
                $('.faves-module').append(div);
            }
            if (currentChild.type == "bookmark" || currentChild.type == "folder") {
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