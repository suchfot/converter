<?php
header('Content-Type: application/json');
$curl = curl_init();
$apikey = json_decode(file_get_contents("currencies/apikey.json"), true)['apikey'];
$convertin = "EUR";

if(isset($_GET['convertin'])){
  $convertin = $_GET['convertin'];
}

$filename = 'currencies/'.$convertin.'.json';
if( is_file( $filename ) and filemtime($filename) >= strtotime('today')){
    $result = file_get_contents($filename);
}else{
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.apilayer.com/currency_data/live?source=".$convertin."&currencies=",
        CURLOPT_HTTPHEADER => array(
          "Content-Type: text/plain",
          "apikey: $apikey"
        ),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET"
      ));

      $result = curl_exec($curl);

      curl_close($curl);
      file_put_contents($filename, $result);
}

echo json_encode($result);

?>