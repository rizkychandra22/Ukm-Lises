<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="{{ Vite::asset('!FrontEnd-React-Ts/src/assets/logo-bg-light.png') }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lises Asmarandana</title>

    @viteReactRefresh
    @vite('!FrontEnd-React-Ts/src/main.tsx')
</head>
<body>
    <div id="root"></div>
</body>
</html>