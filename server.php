<?php

function getExchangeRates() {
    // URL Open Exchange Rates API
    $apiUrl = "https://openexchangerates.org/api/latest.json";
    $appId = "766970c19e8a4cab933b9f562bd4998b"; // Zde vložte svůj App ID z Open Exchange Rates
    $url = "$apiUrl?app_id=$appId";

    // Inicializace cURL
    $ch = curl_init();

    // Nastavení URL a další potřebné možnosti pro cURL
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    
    // Získání výsledku
    $response = curl_exec($ch);

    // Kontrola, zda nedošlo k chybě
    if ($response === false) {
        echo 'cURL Error: ' . curl_error($ch);
        curl_close($ch);
        return false;
    }

    // Uzavření cURL
    curl_close($ch);

    // Vrácení odpovědi
    return $response;
}

function saveDataToFile($data, $filename) {
    // Zapsání dat do souboru
    file_put_contents($filename, $data);
}

function loadDataFromFile($filename) {
    // Načtení dat ze souboru
    if (file_exists($filename)) {
        return file_get_contents($filename);
    }
    return false;
}

// Hlavní logika serveru
$requestUri = $_SERVER['REQUEST_URI'];

if ($requestUri == '/savedData') {
    $filename = 'cache.json';
    
    // Načtení dat z cache souboru
    $data = loadDataFromFile($filename);

    if ($data === false) {
        // Pokud cache neexistuje nebo nelze načíst, získání nových dat
        $data = getExchangeRates();

        if ($data !== false) {
            // Uložení nových dat do cache souboru
            saveDataToFile($data, $filename);
        } else {
            // Chyba při získávání dat
            http_response_code(500);
            echo json_encode(["error" => "Unable to fetch data"]);
            exit();
        }
    }

    // Nastavení hlavičky pro JSON odpověď
    header('Content-Type: application/json');
    echo $data;
} else {
    // Chybová stránka pro neplatnou URL
    http_response_code(404);
    echo json_encode(["error" => "Not Found"]);
}
?>
