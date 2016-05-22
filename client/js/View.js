
var View = function() {};

View.prototype = {

    flashMatchedCountry: function (element) {
        element.animate({
            'background-color': '#f77'
        }, 250).animate({
            'background-color': '#fff'
        }, 250).focus();
    },

    reset: function() {

        $('.results').hide();
        $('.countriesMatched').html('');
        $('.matchedCount').html('0');
        $('.gameStatus').hide();


        $('.countryInput button').prop('disabled', false);
        window.App.$input.prop('disabled', false).val('');
    }

};