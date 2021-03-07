$(document).ready(function () {
    let navBarHeight = 55;
    let nav = document.querySelector('.template-nabar');
    nav.style.height = navBarHeight + 'px';

    let AllContainer = document.querySelector('.all-container');
    AllContainer.style.height = 'calc(100% - ' + navBarHeight + 'px)';


    let navTabHeight = document.querySelector('#myTab').clientHeight;
    let tabsContainer = document.querySelector('#myTabContent');
    tabsContainer.style.height = 'calc(100% - ' + navTabHeight + 'px)';

    let PannelTitleDivHeight=document.querySelector('.pannel-title').clientHeight;
    $(".body-container").css({"height": 'calc(100% - ' + PannelTitleDivHeight + 'px)'});

});
