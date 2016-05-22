
var App = function(config) {
    this.init(config);
};

App.prototype = {

    countriesMatched: [],
    countriesTotal: 0,

    timer: null,
    view: null,
    routerUrl: null,

    $input: null,

    init: function(config) {
        this.countriesTotal = config['countriesTotal'] || 0;
        this.countriesMatched = config['countriesMatched'] || [];
        this.routerUrl = config['routerUrl'] || null;

        this.timer = new Timer({
            timeLimit: 10 * 60 * 1000,
            context: this,
            startTime:  config['startTime'] || 0,
            startCallback: this.onStart,
            tickCallback: this.updateTimer,
            stopCallback: this.onTimerStop
        });

        this.view = new View();
    },

    run: function() {

        $('.totalCount').html(this.countriesTotal);

        this.$input = $('input.countryInputField');

        this.$input.keypress(_.bind(function(event) {
            if(event.keyCode == 13) {
                var countryName = this.$input.val().trim();
                if(countryName) {
                    this.checkCountry(countryName);
                }
            }
        }, this));

        $('.countryInput button').on('click', _.bind(function() {
            var countryName = this.$input.val().trim();
            if(countryName) {
                this.checkCountry(countryName);
            }
        }, this));

        $('.resetButton').on('click', _.bind(function() {
            if(window.confirm("Вы хотите сбросить прогресс и начать с начала?")) {
                this.resetProgress();
            }
        }, this));

        _.each(this.countriesMatched, _.bind(function(countryName) {
            this.addMatchedCountry(countryName);
        }, this));

        $('.matchedCount').html(_.size(this.countriesMatched));


        this.timer.checkAutostart();
    },

    onStart: function() {
        this.updateTimer();

        $('.gameStatus').show();
    },

    updateTimer: function() {
        var remainingTime = this.timer.getRemainingTime();

        if(!remainingTime) {
            remainingTime = {
                seconds: 0,
                minutes: 0
            };
        }

        $('.minutesRemaining').html(remainingTime.minutes);
        $('.secondsRemaining').html(remainingTime.seconds);
    },

    checkCountry: function(country) {
        if(!country) {
            return;
        }

        this.timer.start();

        $.ajax({
            url: this.routerUrl + "?action=checkCountry",
            data: {
                countryName: country
            }
        }).done(_.bind(function( data ) {
            var response = JSON.parse(data);
            if(!response) {
                this.processErrors({'serverResponseParseError': 'Не удается прочитать ответ сервера'});
            } else if(response['errors'] && !_.isEmpty(response['errors'])) {
                this.processErrors(response['errors']);
            } else {
                this.checkMatch(!!response['compareResult'], response['sourceName'] || country);
            }
        }, this));
    },

    processErrors: function(errors) {
        if(errors['alreadyMatched']) {
            var countryName = errors['alreadyMatched'];
            var context = this;
            $('.countriesMatched').children().each(function() {
                if(countryName === $(this).text()) {
                    context.view.flashMatchedCountry($(this));
                }
            })
        } else {
            console.error('request error', errors);
        }
    },

    checkMatch: function(isMatched, countryName) {
        if(isMatched) {

            $('input.countryInputField').animate({
                'background-color': '#7f7'
            }, 250).val('').animate({
                'background-color': '#fff'
            }, 250).focus();

            this.countriesMatched.push(countryName);
            this.addMatchedCountry(countryName);
            $('.matchedCount').html(_.size(this.countriesMatched));

        } else {
            $('input.countryInputField').animate({
                'background-color': '#f77'
            }, 250).animate({
                'background-color': '#fff'
            }, 250).focus();
        }
    },

    addMatchedCountry: function(countryName) {
        if(countryName) {
            $('.countriesMatched').prepend('<div>' + countryName + '</div>');
        }
    },

    onTimerStop: function() {
        this.updateTimer();
        $('.gameStatus').show();

        $.ajax({
            url: this.routerUrl + "?action=getNonmatchedCountries"
        }).done(_.bind(function( data ) {
                var response = JSON.parse(data);
                var matched = response && response['matched'] ? response['matched'] : [];

                var nonmatchedCountries = $('.nonmatchedCountries');
                _.each(matched.sort(), _.bind(function(matchedCountry) {
                    nonmatchedCountries.append('<div>' + matchedCountry + '</div>');
                }, this));

                $('.nonmatchedCountriesCount').html(matched.length);

        }, this));


        $('.countryInput button').prop('disabled', true);
        this.$input.prop('disabled', true).val('');

        $('.results').show();
    },

    resetProgress: function() {
        this.timer.reset();
        this.view.reset();

        this.countriesMatched = [];
        $.ajax({ url: this.routerUrl + "?action=reset" });
    }

};