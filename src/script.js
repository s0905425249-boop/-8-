let canvas =
document.getElementById("canvas");

let ctx =
canvas.getContext("2d");
let imageList = [];
let currentIndex = -1;
let historyImages = [];

let historyIndex = -1;

let originalImageData;

let originalWidth;
let originalHeight;




function addLog(text){

    let now = new Date();

    let time =
    now.toLocaleTimeString();

    let history =
    document.getElementById("history");

    history.innerHTML +=

    "[" +
    time +
    "] " +
    text +
    "<br>";
}

function openImage(){

    let file =
    document.getElementById("fileInput")
    .files[0];

    if(!file){

        alert("請先選擇圖片");

        return;
    }

    let reader =
    new FileReader();

    reader.onload = function(e){

    let img = new Image();

    img.onload = function(){

        canvas.width =
        img.width;

        canvas.height =
        img.height;

        ctx.drawImage(
            img,
            0,
            0
        );
    }

    img.src =
    e.target.result;

    addLog(
        "開啟圖片：" +
        file.name
    );
}

    reader.readAsDataURL(file);
}

function grayImage(){

    saveState();

    let imageData =
    ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let data =
    imageData.data;

    for(
        let i=0;
        i<data.length;
        i+=4
    ){

        let gray =

        (
            data[i]
            +
            data[i+1]
            +
            data[i+2]
        ) / 3;

        data[i] = gray;
        data[i+1] = gray;
        data[i+2] = gray;
    }

    ctx.putImageData(
        imageData,
        0,
        0
    );

    saveState();
    

    addLog("使用灰階");

    document
    .getElementById("explain")
    .innerHTML =

    `
    <h3>灰階效果 (Grayscale)</h3>

功能：

<br>

將彩色圖片轉換成黑白圖片，
只保留亮度資訊。

<br><br>

運作原理：

<br>

每個像素都由

R(紅色)

G(綠色)

B(藍色)

三個數值組成。

<br><br>

例如：

<br>

R=200

G=150

B=100

<br><br>

將三個顏色平均：

<br>

Gray=(R+G+B)/3

<br>

Gray=(200+150+100)/3

<br>

Gray=150

<br><br>

再把：

<br>

R=150

G=150

B=150

<br><br>

就會變成灰色。

<br><br>

程式碼：

<pre>
let gray =

(r+g+b)/3;

r=gray;
g=gray;
b=gray;
</pre>

實際用途：

<br>

✓ 人臉辨識

<br>

✓ 車牌辨識

<br>

✓ AI影像分析

<br>

✓ 降低運算量
    `;
}

function loadFiles(){

    let files =
    document.getElementById(
        "fileInput"
    ).files;

    let fileList =
    document.getElementById(
        "fileList"
    );

    for(
        let i=0;
        i<files.length;
        i++
    ){

        imageList.push(
            files[i]
        );

        let index =
        imageList.length - 1;

        let div =
        document.createElement(
            "div"
        );

        div.innerText =
        files[i].name;

        div.style.cursor =
        "pointer";

        div.style.padding =
        "5px";

        div.style.borderBottom =
        "1px solid lightgray";

        div.onclick =
        function(){

            showImage(index);

        };

        fileList.appendChild(div);
    }

    if(
        currentIndex == -1
        &&
        imageList.length > 0
    ){

        showImage(0);

    }
}

function showImage(index){
    
    currentIndex = index;

    let file =
    imageList[index];

    document
    .getElementById(
    "currentImageName"
    )
    .innerText =
    file.name;

    let ext =
    file.name
    .split(".")
    .pop()
    .toUpperCase();

    document
    .getElementById("imageInfo")
    .innerHTML =

    `
    檔名：
    ${file.name}

    <br><br>

    格式：
    ${ext}
    `;

    let reader =
    new FileReader();

    reader.onload = function(e){

        let img =
        new Image();

        img.onload = function(){
    
    originalWidth = img.width;
    originalHeight = img.height;        

    document
.getElementById(
"imageInfo"
)
.innerHTML +=

`
<br><br>

尺寸：

${img.width}
×

${img.height}
`;

    canvas.width =
    img.width;

    canvas.height =
    img.height;

    ctx.drawImage(
        img,
        0,
        0
    );

    originalImageData =
    ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

        img.src =
        e.target.result;
    }

    reader.readAsDataURL(file);

    addLog(
        "切換圖片：" +
        file.name
    );
    historyImages = [];
    historyIndex = -1;

    setTimeout(function(){

    saveState();

    },100);
}

function saveState(){

    let data = canvas.toDataURL();

    historyImages =
    historyImages.slice(
        0,
        historyIndex + 1
    );

    historyImages.push(data);

    historyIndex++;
}

function undo(){

    if(historyIndex <= 0){

        return;
    }

    historyIndex--;

    let img =
    new Image();

    img.onload = function(){

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.drawImage(
            img,
            0,
            0
        );
    }

    img.src =
    historyImages[historyIndex];

    addLog("上一步");
}

function redo(){

    if(
        historyIndex >=
        historyImages.length - 1
    ){

        return;
    }

    historyIndex++;

    let img =
    new Image();

    img.onload = function(){

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.drawImage(
            img,
            0,
            0
        );
    }

    img.src =
    historyImages[historyIndex];

    addLog("下一步");
}

function resetImage(){

    if(!originalImageData){

        return;
    }

    canvas.width =
    originalWidth;

    canvas.height =
    originalHeight;

    ctx.putImageData(
        originalImageData,
        0,
        0
    );

    historyImages = [];
    historyIndex = -1;

    saveState();

    document.getElementById(
        "brightness"
    ).value = 0;

    document.getElementById(
        "contrast"
    ).value = 0;

    addLog("完全復原");
}

function negativeImage(){

    saveState();

    let imageData =
    ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let data =
    imageData.data;

    for(
        let i=0;
        i<data.length;
        i+=4
    ){

        data[i] =
        255 - data[i];

        data[i+1] =
        255 - data[i+1];

        data[i+2] =
        255 - data[i+2];
    }

    ctx.putImageData(
        imageData,
        0,
        0
    );

    saveState();

    addLog("使用負片");

    document
    .getElementById("explain")
    .innerHTML =

    `
    <h3>負片效果 (Negative)</h3>

功能：

<br>

將所有顏色反轉。

<br><br>

運作原理：

<br>

顏色範圍是：

0 ~ 255

<br><br>

利用：

<br>

255 - 原本顏色

<br><br>

例如：

<br>

R=50

<br>

255-50

=205

<br><br>

就會得到相反顏色。

<br><br>

公式：

<br>

R=255-R

G=255-G

B=255-B

<br><br>

程式碼：

<pre>
r=255-r;

g=255-g;

b=255-b;
</pre>

用途：

<br>

✓ 特效製作

<br>

✓ 底片模擬

<br>

✓ 醫學影像觀察
    `;
}

function saveImage(){

    let link =
    document.createElement("a");

    link.download =
    "result.png";

    link.href =
    canvas.toDataURL();

    link.click();

    addLog("儲存圖片");
}

function changeBrightness(){

    if(!originalImageData){

        return;
    }

    let value =
    parseInt(
        document
        .getElementById("brightness")
        .value
    );

    let imageData =
    new ImageData(
        new Uint8ClampedArray(
            originalImageData.data
        ),
        originalImageData.width,
        originalImageData.height
    );

    let data =
    imageData.data;

    for(
        let i=0;
        i<data.length;
        i+=4
    ){

        data[i] =
        Math.min(
            255,
            Math.max(
                0,
                data[i] + value
            )
        );

        data[i+1] =
        Math.min(
            255,
            Math.max(
                0,
                data[i+1] + value
            )
        );

        data[i+2] =
        Math.min(
            255,
            Math.max(
                0,
                data[i+2] + value
            )
        );
    }

    ctx.putImageData(
        imageData,
        0,
        0
    );

    document.getElementById("explain").innerHTML =

`
<h3>亮度調整 (Brightness)</h3>

<hr>

<b>【功能介紹】</b>

<br><br>

亮度調整可讓圖片變亮或變暗。

<br><br>

亮度提高：

<br>

整體畫面更明亮。

<br><br>

亮度降低：

<br>

整體畫面更昏暗。

<hr>

<b>【運作原理】</b>

<br><br>

對每個像素的RGB數值
加上相同數值。

<br><br>

例如：

<br>

R=100

G=120

B=150

<br><br>

亮度+50

<br><br>

R=150

G=170

B=200

<hr>

<b>【處理流程】</b>

<br>

1. 讀取滑桿數值

<br>

2. 取得圖片資料

<br>

3. 掃描所有像素

<br>

4. RGB加上亮度值

<br>

5. 限制範圍0~255

<br>

6. 更新畫面

<hr>

<b>【數學公式】</b>

<br>

R = R + value

<br>

G = G + value

<br>

B = B + value

<hr>

<b>【程式碼解析】</b>

<pre>
data[i] += value;

data[i+1] += value;

data[i+2] += value;
</pre>

說明：

<br>

將RGB三個顏色同時增加。

<hr>

<b>【實際應用】</b>

<br>

✓ 夜間照片增亮

<br>

✓ 修正曝光不足

<br>

✓ 增加可視性

<hr>

<b>【本系統實作方式】</b>

<br>

利用Canvas取得像素資料，

逐一修改RGB數值後重新繪製。

<hr>

<b>【功能難度】</b>

<br>

★☆☆☆☆ 初級
`;
}

function changeContrast(){

    if(!originalImageData){

        return;
    }

    let value =
    parseInt(
        document
        .getElementById("contrast")
        .value
    );

    let factor =
    (259 * (value + 255))
    /
    (255 * (259 - value));

    let imageData =
    new ImageData(
        new Uint8ClampedArray(
            originalImageData.data
        ),
        originalImageData.width,
        originalImageData.height
    );

    let data =
    imageData.data;

    for(
        let i=0;
        i<data.length;
        i+=4
    ){

        data[i] =
        factor *
        (data[i]-128)
        +128;

        data[i+1] =
        factor *
        (data[i+1]-128)
        +128;

        data[i+2] =
        factor *
        (data[i+2]-128)
        +128;
    }

    ctx.putImageData(
        imageData,
        0,
        0
    );

    document
.getElementById("explain")
.innerHTML =

`
<h3>對比度調整 (Contrast)</h3>

<hr>

<b>【功能介紹】</b>

<br><br>

對比度決定亮部與暗部差異。

<br><br>

提高對比度：

<br>

亮的更亮

暗的更暗

<br><br>

降低對比度：

<br>

畫面變平淡

<hr>

<b>【運作原理】</b>

<br><br>

以128作為中心點。

<br><br>

距離128越遠，

變化越明顯。

<hr>

<b>【數學公式】</b>

<br>

new =

(old-128)

×factor

+128

<hr>

<b>【程式碼解析】</b>

<pre>
factor =

(259*(value+255))

/

(255*(259-value));

pixel =

factor

*

(pixel-128)

+128;
</pre>

<hr>

<b>【實際應用】</b>

<br>

✓ 增加細節

<br>

✓ 強化畫面層次

<br>

✓ AI影像增強

<hr>

<b>【本系統實作方式】</b>

<br>

根據滑桿值計算factor，

再套用至所有像素。

<hr>

<b>【功能難度】</b>

<br>

★★★☆☆ 中級
`;
}

function blurImage(){

    saveState();

    let imageData =
    ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let data =
    imageData.data;

    let copy =
    new Uint8ClampedArray(data);

    let blurLevel =
    parseInt(
    document.getElementById("blurLevel").value
);
    for(
        let y=1;
        y<canvas.height-1;
        y++
    ){

        for(
            let x=1;
            x<canvas.width-1;
            x++
        ){

            let r=0;
            let g=0;
            let b=0;

            for(
                let dy=-1;
                dy<=1;
                dy++
            ){

                for(
                    let dx=-1;
                    dx<=1;
                    dx++
                ){

                    let index =
                    (
                        (y+dy)
                        *
                        canvas.width
                        +
                        (x+dx)
                    ) * 4;

                    r += copy[index];
                    g += copy[index+1];
                    b += copy[index+2];
                }
            }

            let i =
            (
                y *
                canvas.width
                +
                x
            ) * 4;

            let total =
    (blurLevel*2+1)
    *
    (blurLevel*2+1);

    data[i] =
    r/total;

    data[i+1] =
    g/total;

    data[i+2] =
    b/total;
        }
    }

    ctx.putImageData(
        imageData,
        0,
        0
    );

    saveState();

    addLog("使用模糊");

    document
.getElementById("explain")
.innerHTML =

`
<h3>模糊效果 (Blur)</h3>

功能：

<br>

降低圖片細節，
讓圖片看起來較柔和。

<br><br>

運作原理：

<br>

取目前像素周圍的像素，
再計算平均值。

<br><br>

例如：

<br>

100 120 110

130 150 140

120 130 110

<br><br>

平均值：

<br>

(100+120+110+130+150+140+120+130+110)/9

=123

<br><br>

中心像素就會變成123。

<br><br>

程式碼：

<pre>
r += copy[index];

g += copy[index+1];

b += copy[index+2];

r = r / 9;
g = g / 9;
b = b / 9;
</pre>

實際用途：

<br>

✓ 美顏效果

<br>

✓ 降低雜訊

<br>

✓ AI影像前處理

<br>

✓ 柔化圖片細節
`;
}

function edgeImage(){

    saveState();

    let imageData =
    ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let data =
    imageData.data;

    let copy =
    new Uint8ClampedArray(data);

    for(
        let y=1;
        y<canvas.height-1;
        y++
    ){

        for(
            let x=1;
            x<canvas.width-1;
            x++
        ){

            let i =
            (
                y *
                canvas.width
                +
                x
            ) * 4;

            let right =
            (
                y *
                canvas.width
                +
                (x+1)
            ) * 4;

            let diff =

            Math.abs(
                copy[i]
                -
                copy[right]
            );

            let value;

            let edgeLevel =
        parseInt(
        document.getElementById(
        "edgeLevel"
        ).value
        );

        if(diff > edgeLevel)
            {

                value = 0;

            }else{

                value = 255;
            }

            data[i] = value;
            data[i+1] = value;
            data[i+2] = value;
        }
    }

    ctx.putImageData(
        imageData,
        0,
        0
    );

    addLog("使用邊緣化");

    document
    .getElementById("explain")
    .innerHTML =

    `
    <h3>邊緣偵測 (Edge Detection)</h3>

功能：

<br>

找出圖片中的輪廓線。

<br><br>

運作原理：

<br>

比較左右像素差異。

<br><br>

如果差異很大：

<br>

表示這裡可能是邊界。

<br><br>

例如：

<br>

100 100

100 255

<br><br>

差異：

<br>

255-100

=155

<br><br>

因為差異很大，

判定為邊緣。

<br><br>

公式：

<br>

diff=

abs(pixel1-pixel2)

<br><br>

程式碼：

<pre>
let diff =

Math.abs(
pixel1-pixel2
);
</pre>

用途：

<br>

✓ 物件辨識

<br>

✓ AI訓練

<br>

✓ 車道線辨識

<br>

✓ 醫學影像分析
    `;
}

function resizeImage(){

    let width =
    parseInt(
        document.getElementById(
            "newWidth"
        ).value
    );

    let height =
    parseInt(
        document.getElementById(
            "newHeight"
        ).value
    );

    if(
        width <= 0 ||
        height <= 0
    ){

        alert("尺寸不可小於0");

        return;
    }

    saveState();

    let tempCanvas =
    document.createElement(
        "canvas"
    );

    let tempCtx =
    tempCanvas.getContext(
        "2d"
    );

    tempCanvas.width =
    width;

    tempCanvas.height =
    height;

    tempCtx.drawImage(
        canvas,
        0,
        0,
        width,
        height
    );

    canvas.width =
    width;

    canvas.height =
    height;

    ctx.drawImage(
        tempCanvas,
        0,
        0
    );

    

    document.getElementById(
    "newWidth"
    ).value = canvas.width;

    document.getElementById(
    "newHeight"
    ).value = canvas.height;

    addLog(
        "調整大小：" +
        width +
        " x " +
        height
    );

    document
.getElementById("explain")
.innerHTML =

`
<h3>調整大小 (Resize)</h3>

功能：

<br>

改變圖片尺寸。

<br><br>

目前尺寸：

<br>

${width} × ${height}

<br><br>

運作原理：

<br>

重新計算圖片像素位置。

<br><br>

例如：

<br>

原圖：

1000 × 1000

<br>

縮小後：

500 × 500

<br><br>

圖片檔案通常會變小。

<br><br>

程式碼：

<pre>
ctx.drawImage(

canvas,

0,
0,

width,
height

);
</pre>

用途：

<br>

✓ 網頁最佳化

<br>

✓ 節省儲存空間

<br>

✓ 統一圖片尺寸

<br>

✓ 上傳社群媒體
`;
}

function bilateralFilter(){

    saveState();

    let level =
    parseInt(
        document.getElementById(
            "bilateralLevel"
        ).value
    );

    let imageData =
    ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let data =
    imageData.data;

    let copy =
    new Uint8ClampedArray(data);

    for(
        let y=1;
        y<canvas.height-1;
        y++
    ){

        for(
            let x=1;
            x<canvas.width-1;
            x++
        ){

            let index =
            (y*canvas.width+x)*4;

            let r=0;
            let g=0;
            let b=0;
            let count=0;

            let center =
            copy[index];

            for(
                let dy=-1;
                dy<=1;
                dy++
            ){

                for(
                    let dx=-1;
                    dx<=1;
                    dx++
                ){

                    let ni =
                    (
                        (y+dy)
                        *
                        canvas.width
                        +
                        (x+dx)
                    )*4;

                    let diff =
                    Math.abs(
                        copy[ni]
                        -
                        center
                    );

                    if(
                        diff
                        <
                        level*10
                    ){

                        r += copy[ni];
                        g += copy[ni+1];
                        b += copy[ni+2];

                        count++;
                    }
                }
            }

            data[index] =
            r/count;

            data[index+1] =
            g/count;

            data[index+2] =
            b/count;
        }
    }

    ctx.putImageData(
        imageData,
        0,
        0
    );

    saveState();

    addLog(
        "使用保邊去躁 強度:"
        + level
    );

    document
.getElementById("explain")
.innerHTML =

`
<h3>保邊去躁 (Bilateral Filter)</h3>

<hr>

<b>【功能介紹】</b>

<br><br>

降低圖片雜訊，

同時保留物體邊緣。

<hr>

<b>【問題比較】</b>

<br>

一般模糊：

<br>

去除雜訊

✗ 邊緣消失

<br><br>

雙邊濾波：

<br>

去除雜訊

✓ 保留邊緣

<hr>

<b>【運作原理】</b>

<br><br>

比較周圍像素與中心像素。

<br><br>

顏色接近：

加入平均

<br>

顏色差異大：

忽略

<hr>

<b>【程式碼解析】</b>

<pre>
diff =

Math.abs(

copy[ni]

-

center

);

if(

diff < level*10

){

count++;

}
</pre>

<hr>

<b>【實際應用】</b>

<br>

✓ AI影像前處理

<br>

✓ 醫療影像

<br>

✓ 攝影修圖

<br>

✓ OpenCV常用技術

<hr>

<b>【本系統實作方式】</b>

<br>

利用像素差異決定是否參與平均計算。

<hr>

<b>【功能難度】</b>

<br>

★★★★★ 高級
`;
}
