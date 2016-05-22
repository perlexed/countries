
var jQuery = window.jQuery.noConflict(true);
var $ = jQuery;

var App = new App(window.CountriesConfig || {});
window.App = App;

$.ready(App.run());