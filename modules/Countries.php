<?php

class Countries {

    public $countriesList = [];

    public function Countries() {
        try {
            $this->loadCountries();
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    protected function loadCountries() {
        $filePath = __DIR__ . '/countries.json';

        if(!file_exists($filePath)) {
            throw new Exception('No countries file present');
        }

        $this->countriesList = json_decode(file_get_contents($filePath), true);

        if(empty($this->countriesList)) {
            throw new Exception('Countries list is empty');
        }
    }

    public function getCountries() {
        return $this->countriesList;
    }

    public function getCountriesCount() {
        return count($this->countriesList);
    }

}