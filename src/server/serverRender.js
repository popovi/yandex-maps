import * as fs from "fs";
import * as paths from "../../webpack/paths";

async function renderResponse() {
    // injecting assets ...
    // stylesheets tags
    const css = getGeneratedCSSPaths();
    //

    // JS tags
    const jsScripts = getGeneratedJSPaths();
    //

    const fullPageComponentString =
        `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                    <link rel="shortcut icon" href="/assets/images/favicon.ico" />
                    <title>Y-Maps</title>
                    ${css}
                    <script src="https://api-maps.yandex.ru/2.1/?apikey=c5cf644b-d03b-4b01-841b-796d3eb821c1&lang=ru_RU"></script>
                </head>
                <body>
                    <div id="main"></div>
                    <div id="modal"></div>
                    ${jsScripts}
                </body>
            </html>`;

    return fullPageComponentString;
}

function getGeneratedJSPaths() {
    let jsScripts = "";
    const filesArr = fs.readdirSync(`./${paths.outpath}/javascripts/`);
    for (let i = 0; i < filesArr.length; i++)
        jsScripts += `<script src="/javascripts/${filesArr[i]}"></script>`;

    return jsScripts;
}

function getGeneratedCSSPaths(){
    let css = "";
    const filesArr = fs.readdirSync(`./${paths.outpath}/stylesheets/`);
    for (let i = 0; i < filesArr.length; i++)
        css += `<link rel="stylesheet" href="/stylesheets/${filesArr[i]}" />`;

    return css;
}


export { renderResponse };