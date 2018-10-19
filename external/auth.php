<!DOCTYPE html>
<html lang="en">
<head>
    <title>Twitch Light Alerts</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
</head>
<body class="bg-dark pt-5">
    <div class="container pt-5">
        <h1 class="display-4 text-center text-light">Twitch Light Alerts</h1>
        <form>
            <div class="form-group">
<?php

$token = $_GET["code"];
$refreshToken = $_GET["refreshToken"];

if($token != null && $refreshToken === null) {
	$result = doPostRequest($token, false);
    echo '<label for="accessToken" class="text-light">Access Token</label>';
	echo '<input type="text" class="form-control" id="accessToken" value="' . $result['access_token'] . '"></br>';
    echo '<label for="refreshToken" class="text-light">Refresh Token</label>';
    echo '<input type="text" class="form-control" id="refreshToken" value="' . $result['refresh_token'] . '"></br>';
    $result2 = doGetRequest($result['access_token']);
    echo '<label for="socketToken" class="text-light">Socket Token</label>';
    echo '<input type="text" class="form-control" id="socketToken" value="' . $result2['socket_token'] . '"></br>';
}

if($refreshToken != null) {
	$result = doPostRequest($refreshToken, true);
    echo '<label for="accessToken" class="text-light">Access Token</label>';
    echo '<input type="text" class="form-control" id="accessToken" value="' . $result['access_token'] . '"></br>';
    echo '<label for="refreshToken" class="text-light">Refresh Token</label>';
    echo '<input type="text" class="form-control" id="refreshToken" value="' . $result['refresh_token'] . '"></br>';
    $result2 = doGetRequest($result['access_token']);
    echo '<label for="socketToken" class="text-light">Socket Token</label>';
    echo '<input type="text" class="form-control" id="socketToken" value="' . $result2['socket_token'] . '"></br>';
}

function doPostRequest($token, $isRefresh){
    $clientId = "9JXyQsH9fUQ34KPresGZIsMEOnkVRV0Rva7w2nCy";
    $secret = "5CV3DCrtIyz8l5nDi6kIacYNxx2tjM5a3tgBaGHB";
	$url = "https://streamlabs.com/api/v1.0/token";
	$type = "authorization_code";
	if($isRefresh) {
	    $type = "refresh_token";
    }

    $ch = curl_init();
	$uri = "grant_type=" . $type . "&client_id=" . $clientId . "&client_secret=" . $secret . "&redirect_uri=http://twitch.bad-media.de/auth.php&code=" . $token;
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $uri);
    curl_setopt($ch, CURLOPT_POST, 1);
    $headers[] = "Content-Type: application/x-www-form-urlencoded";
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $result = curl_exec($ch);
    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    }
    curl_close ($ch);

    return json_decode($result, true);
}

function doGetRequest($accessToken){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://streamlabs.com/api/v1.0/socket/token?access_token=" . $accessToken);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);

    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    }
    curl_close ($ch);

    return json_decode($result, true);
}
?>
            </div>
        </form>
    </div>
</html>
