<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Странограф</title>

    <!-- Bootstrap -->
    <link href="client/css/bootstrap.min.css" rel="stylesheet">
    <link href="client/css/countries.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <script lang="javascript">
        <?php echo 'var CountriesConfig = ' . json_encode($config) . ';' ?>
    </script>

</head>
<body>

<div class="container">

    <h2>Странограф</h2>

    <p>Проверьте, сколько стран вы вспомните за 10 минут.</p>

    <div class="countryInput">
        <p>Регистр значения не имеет.</p>

        <button class="btn btn-primary sendButton">Отправить</button>
        <div class="inputContainer"><input type="text" placeholder="Введите название страны" class="form-control countryInputField"></div>
        <div style="clear:both"></div>
    </div>

    <div class="gameStatus" style="display: none">
        <div class="infoPanel">
            <div class="timeRemaining">Осталось <span class="minutesRemaining">5</span> мин <span class="secondsRemaining">0</span> сек</div>
            <button class="btn btn-default resetButton">Начать с начала</button>
        </div>

        <div class="matchedRatio">Перечисленные страны: <span class="matchedCount">0</span>/<span class="totalCount">0</span></div>
        <div style="clear: both"></div>
    </div>

    <div class="countriesMatched"></div>

    <div class="results" style="display: none">
        <p>Стран не указано: <span class="nonmatchedCountriesCount"></span></p>
        <div class="nonmatchedCountries"></div>
    </div>

</div>

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="client/js/lib/jquery-1.11.1.js"></script>
<script src="client/js/lib/jquery-ui.js"></script>
<script src="client/js/lib/underscore.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="client/js/lib/bootstrap.min.js"></script>
<script src="client/js/Timer.js"></script>
<script src="client/js/View.js"></script>
<script src="client/js/App.js"></script>
<script src="client/js/main.js"></script>
</body>
</html>