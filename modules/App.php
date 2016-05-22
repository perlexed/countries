<?php

class App {

    protected static $instance;

    public $countries;

    public function App() {
        if(empty($this->countries)) {
            $this->countries = new Countries();
        }
    }

    public static function get() {
        if(self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function checkCountry($countryName) {

        $errors = [];
        $countryMatch = false;
        $countrySourceName = '';

        $timeLimit = 5 * 60; // 5 минут


        if(empty($_SESSION['startTime'])) {
            $_SESSION['startTime'] = time();
        }

        if(empty($_SESSION['alreadyMatched'])) {
            $_SESSION['alreadyMatched'] = [];
        }

        if(time() - $_SESSION['startTime'] + $timeLimit < 0) {
            $errors['timeout'] = 'Закончилось отведенное время';
            return [$errors];
        }

        $countries = $this->countries->getCountries();

        if(empty($countries)) {
            $errors['countriesListParseError'] = 'Невозможно прочитать список стран';
        } elseif(empty($countryName)) {
            $errors['noCountry'] = 'Не указана страна';
        } else {

            foreach($countries as $countryListName) {
                if(mb_strtoupper($countryListName, 'UTF-8') === mb_strtoupper($countryName, 'UTF-8')) {

                    if(in_array($countryListName, $_SESSION['alreadyMatched'])) {
                        $errors['alreadyMatched'] = $countryListName;
                    } else {
                        $countryMatch = true;
                        $countrySourceName = $countryListName;
                        $_SESSION['alreadyMatched'][] = $countryListName;
                    }
                    break;
                }
            }
        }

        return [
            'errors' => $errors,
            'compareResult' => $countryMatch,
            'sourceName' => $countrySourceName
        ];

    }

    public function index() {

        $config = [
            'startTime' => !empty($_SESSION['startTime']) ? $_SESSION['startTime'] : null,
            'countriesMatched' => !empty($_SESSION['alreadyMatched']) ? $_SESSION['alreadyMatched'] : [],
            'countriesTotal' => $this->countries->getCountriesCount(),
            'routerUrl' => 'http://' . $_SERVER['HTTP_HOST'] . (DEBUG ? '/countries/www/index.php' : '/index.php')
        ];

        require_once(__DIR__ . '/../client/index.php');
    }

    public function route() {

        switch(!empty($_REQUEST['action']) ? $_REQUEST['action'] : null) {
            case 'checkCountry':
                $country = !empty($_REQUEST['countryName']) ? $_REQUEST['countryName'] : null;
                if($country) {
                    echo json_encode($this->checkCountry($country));
                } else {
                    die('Country name is missing');
                }
                break;
            case 'getNonmatchedCountries':
                $nonmatched = [];
                foreach($this->countries->getCountries() as $country) {
                    if(!in_array($country, $_SESSION['alreadyMatched'])) {
                        $nonmatched[] = $country;
                    }
                }
                echo json_encode([ 'matched' => $nonmatched ]);
                break;
            case 'reset':
                $_SESSION['alreadyMatched'] = [];
                $_SESSION['startTime'] = null;
                break;
            case null:
            default:
                $this->index();
                break;
        }
    }

}