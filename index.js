/* 
    Para executar:

        Executar no terminal:

            npm start  

	Para trocar em entre vide e webcan, localizar a linha abaixo e descomentar ou comentar:

			tracking.track('#video', tracker, { camera: true });

	Nota CleanCode: 
	
				Este é um tipo de comentario relevante pra se manter em um código!
	
	                                                                   Nell Junior  
																			
*/

const exec = require("child_process").exec;   
var arraySample = [];
var arrayChosen = [];
var eyesNoseMouth = {x:0 , y:0 , w: 0, h: 0};
var flagX = true; 
var lampadaOn = false; 
var imgHairOriginalColor, 
    imgBeardOriginalColor; 
var objTime;  

window.onload = function() {

    carregarImgs('./mexas/', '#paletaMexas');
    carregarImgs('./man/hair/','#sidebarManHair');
    carregarImgs('./man/beard/', '#sidebarBeard');
    carregarImgs('./woman/hair/', '#sidebarWomanHair');

    var menu_paleta_mexas = document.querySelectorAll('#paletaMexas > .roll img'),
        sampleCntxA = document.getElementById('sampleCntxA').getContext('2d') ,
        sampleCntxB = document.getElementById('sampleCntxB').getContext('2d'),
        chosenCntx = document.getElementById('chosenCnvs').getContext('2d');

    // Variaveis colorPicker

    var $picker = document.getElementById("colorPicker")
    ,   picker  = tinycolorpicker($picker)

    // Variaveis do Konva 

    var width = window.innerWidth,
        height = window.innerHeight, 
        containerKonva = document.querySelector('#containerKonva'),
        flagHairFirstTime = true ,
        flagBeardFirstTime = true ; 

    var track = document.querySelector(".track"),
        toggleManHair = document.querySelector('#toggleManHair'),            
        toggleWomanHair = document.querySelector('#toggleWomanHair'),            
        menu_image_beard = document.querySelectorAll('.vertical-menu-beard img'),
        toggleBeard = document.querySelector('#toggleBeard'),
        menu_image_hair = document.querySelectorAll('.vertical-menu-hair img');

    cnvsCover.width = video.width;
    cnvsCover.height = video.height;


    // Adicionando eventos aos elementos  - Nell - Nov/18 

    document.querySelector('body').addEventListener('click', function(event) {

        var x = event.pageX ;
        var y = event.pageY;

        var facePosition = document.querySelector('.face').getBoundingClientRect();
        var colorPicker = document.querySelector('#colorPicker').getBoundingClientRect();

        if (y > facePosition.top && y < facePosition.bottom &&  x > facePosition.left && x < facePosition.right) {

            if (y < (facePosition.top + facePosition.bottom) / 2 ) {
                document.querySelector("#colorPicker").style.marginTop = "100px";            
            }  else {
                document.querySelector("#colorPicker").style.marginTop = "400px";                        
            }

            document.querySelector("#colorPicker").style.display='block';
            document.querySelector(".track").style.display='block';
        } else {
            document.querySelector("#colorPicker").style.display='none';
            document.querySelector(".track").style.display='none';
        }   

    })


    Array.from(menu_image_hair).forEach(link => {

        link.addEventListener('click', function(event) {

            if (flagHairFirstTime) {
                //posição bolinhas brancas de seleção do hair  
                addAnchor(hairGroup, 0, 0, 'topLeft');
                addAnchor(hairGroup, 403, 0, 'topRight');
                addAnchor(hairGroup, 403, 403, 'bottomRight');
                addAnchor(hairGroup, 0, 403, 'bottomLeft');

                flagHairFirstTime = false;
            }

            imageObjHair = new Image();
            imageObjHair.onload = function() {
                hairImg.image(imageObjHair);
                layer.draw();
            };

            imageObjHair.src = ObtemImagem(this.src); 
            imgHairOriginalColor = this; 
            document.getElementById("cnvsCover").style.visibility = "hidden";

        });
    });        


    Array.from(menu_image_beard).forEach(link => {
        link.addEventListener('click', function(event) {

            if (flagBeardFirstTime) {
                // Tamanho do beard 
                beardImg = new Konva.Image({
                    width: 400,
                    height: 400
                });

                // Posicção inicial do bear 
                beardGroup = new Konva.Group({
                    x: 100,
                    y: 350,
                    draggable: true
                });

                layer.add(beardGroup);
                beardGroup.add(beardImg);

                //posição bolinhas brancas de seleção do bear 
                addAnchor(beardGroup, 0,50, 'topLeft');
                addAnchor(beardGroup, 400, 50, 'topRight');
                addAnchor(beardGroup, 400, 400, 'bottomRight');
                addAnchor(beardGroup, 0, 400, 'bottomLeft');   

                flagBeardFirstTime = false ; 
            }

            imageObjBeard = new Image();
            imageObjBeard.onload = function() {
                beardImg.image(imageObjBeard);
                layer.draw();
            };

            imageObjBeard.src =  ObtemImagem(this.src);  
            imgBeardOriginalColor = this; 

        });
    });        


    take_photo.addEventListener("click", e => {

        if (video.paused) {
            video.play() 
        } else {
            document.querySelector('.poweranges').style.visibility = "visible";
            document.getElementById('cnvsCover').style.visibility = "visible";
            document.getElementById('sampleCntxA').style.visibility = "visible";
            document.getElementById('sampleCntxB').style.visibility = "visible";
            video.pause();          
        }

    });


    Array.from(menu_paleta_mexas).forEach(imgMexa => {
        imgMexa.addEventListener('click', function(item) {
            img = document.createElement("img");
            img.setAttribute("src", item.currentTarget.src);
            img.onload = function() {
               iniciarPintura(); 
            } 
        });
    });        


    close_app.addEventListener("click", e => {
        window.close() ;	            		
    });


    light.addEventListener("click", e => {
        if (lampadaOn) {
          exec("python lampadaOff.py").unref();
          lampadaOn = false; 	
        } else {
          exec("python lampadaOn.py").unref();
          lampadaOn = true;
        }	 	
    });


    toggleManHair.addEventListener("mousedown", function(e){
        toggleManHair_sidebarManHair();
    });

    toggleBeard.addEventListener("mousedown", function(e){
        toggleBeard_sidebarBeard();
    });

    toggleWomanHair.addEventListener("mousedown", function(e){
        toggleWomanHair_sidebarWomanHair();
    });

    function toggleManHair_sidebarManHair() {
        var sidebarManHair = document.getElementById("sidebarManHair");

        if(sidebarManHair.style.right == "-120px"  || sidebarManHair.style.right == ""){
            sidebarManHair.style.right = "0px";
        } else {        
            sidebarManHair.style.right = "-120px";
        }
    }        

    function toggleBeard_sidebarBeard() {
        var sidebarBeard = document.getElementById("sidebarBeard");

        if(sidebarBeard.style.right == "-100px"  ||  sidebarBeard.style.right == "" ){
            sidebarBeard.style.right = "22px";
        } else {        
            sidebarBeard.style.right = "-100px";
        }
    }        

    function toggleWomanHair_sidebarWomanHair() {
        var sidebarWomanHair = document.getElementById("sidebarWomanHair");

        if(sidebarWomanHair.style.right == "-100px" || sidebarWomanHair.style.right == "" ){
            sidebarWomanHair.style.right = "22px";
        } else {        
            sidebarWomanHair.style.right = "-100px";
        }
    }        


    delete_photo.addEventListener("click", e => { 
        document.getElementById("cnvsCover").style.visibility = "visible";
        document.getElementById("video").style.visibility = "visible";
        document.querySelector(".poweranges").style.visibility = "hidden";       
        document.getElementById("cnvsMain").style.visibility = "hidden";            
        containerKonva.innerHTML = "";   
        reloadKonva();
        flagHairFirstTime = true ;
        flagBeardFirstTime = true ;
        video.play();
        clearTimeout(objTime);
    });


    track.addEventListener("click", function(e){
        var colorValue = document.querySelector(".colorInput").value;

        if (document.querySelector("#colorPicker").style.marginTop == "100px" || imgBeardOriginalColor == null) {
            if (imgHairOriginalColor) {
                changeColor(imageObjHair, colorValue, imgHairOriginalColor)            
            }        
        }  else {
            if (imgBeardOriginalColor) {
                changeColor(imageObjBeard, colorValue, imgBeardOriginalColor)                    
            }
        }

    });

    var _pwrHzX1 = new Powerange(pwrHzX1, { min: -100, max: video.width, start: 0 }); 
    var _pwrVrX1 = new Powerange(pwrVrX1, { vertical: true, min: -100, max: video.height-100, start: 0 }); 

    var _pwrHzX2 = new Powerange(pwrHzX2, { min: -100, max: video.width, start: 40 }); 
    var _pwrVrX2 = new Powerange(pwrVrX2, { vertical: true, min: -100, max: video.height-100, start: 0 }); 

    var context = cnvsCover.getContext('2d');
    var tracker = new tracking.ObjectTracker('face');

    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    // tracking.track('#video', tracker);

    tracking.track('#video', tracker, { camera: true });

    tracker.on('track', function(event) {

        context.clearRect(0, 0, cnvsCover.width, cnvsCover.height);

        event.data.forEach(function(rect) {

          context.strokeStyle = '#ffff00';
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);          

          eyesNoseMouth.x = parseInt(rect.x + rect.width * 0.25);
          eyesNoseMouth.y = parseInt(rect.y + rect.height * 0.25);

          eyesNoseMouth.w = parseInt(rect.width * .45);  
          eyesNoseMouth.h = parseInt(rect.height * .7);  

          context.strokeRect(eyesNoseMouth.x, eyesNoseMouth.y,  eyesNoseMouth.w, eyesNoseMouth.h);          

          context.fillStyle = "#fff";

          // Metade de (X + width)  e metade de (Y + height) deve me colocar no centro do retângulo

          var Xcoord =  rect.x + parseInt(pwrHzX1.value) ;
          var Ycoord =  rect.y + parseInt(pwrVrX1.value) ;

          context.fillText('x1', Xcoord, Ycoord);

          // Se o video exemplo: w:1280, h: 720
          // E o tananho do canvas de reconhecimento facia; 320x240 
          // Para obter as propriedades originais do video , usar video.videoWidth e video.videoHeight 
          // Então, abaixo é feito duas regra de 3

          if (flagX) {

              xVd = (video.videoWidth * Xcoord) / video.width;
              yVd = (video.videoHeight * Ycoord) / video.height-40;  

               // 4º e 5º parametrô dimendiona o tamanho da ammostra 

              sampleCntxA.drawImage(video, xVd, yVd, 80, 80, 0, 0, 600, 480);

          }  

          var Xcoord =  rect.x + parseInt(pwrHzX2.value) ;
          var Ycoord =  rect.y + parseInt(pwrVrX2.value) ;

          context.fillText('x2', Xcoord, Ycoord);

          if (flagX) {
           
              xVd = (video.videoWidth * Xcoord) / video.width;
              yVd = (video.videoHeight * Ycoord) / video.height-40;  

              sampleCntxB.drawImage(video, xVd, yVd, 10, 10, 0, 0, 200, 110);
          }

        });
    });

    function iniciarPintura() { 

        var cnvsMain = document.getElementById('cnvsMain');
        var cntxtMain = cnvsMain.getContext('2d');    
        var back = document.createElement('canvas');
        var backcontext = back.getContext('2d');

        chosenCntx.clearRect(0, 0, chosenCnvs.width , chosenCnvs.height);  
        chosenCntx.drawImage(img, 0, 0 , chosenCnvs.width * 1.5 , chosenCnvs.height * 1.5);        

        arrayChosen = [];
        arraySample = [];        

        flagX = false; 

        setTimeout(function(){
            
            colherAmostra(chosenCntx, arrayChosen, 80);
            colherAmostra(sampleCntxA, arraySample, 40);
            colherAmostra(sampleCntxB, arraySample, 40);

            arrayChosen = ordernarArray(arrayChosen);
            arraySample = ordernarArray(arraySample);

            // Elimina os pixels totalmente negros dos dois arrays  
            for (var idx = 0; idx < arrayChosen.length; idx++) {             
                 if (arrayChosen[idx][0] == 0) {
                    arrayChosen.splice(idx,1);
                    arraySample.splice(idx,1); 
                    idx = -1;         // No proximo loop , ira incrementar 1, então sera = 0 
                 }
            } 

            var cw = video.clientWidth,
                ch = video.clientHeight;

            cntxtMain.clearRect(0, 0, cnvsMain.width , cnvsMain.height);  
            cnvsMain.width = cw;
            cnvsMain.height = ch;
            back.width = cw;
            back.height = ch;

            video.play() ;

            document.getElementById("cnvsMain").style.visibility = "visible";
            document.getElementById("sampleCntxA").style.visibility = "hidden";
            document.getElementById("sampleCntxB").style.visibility = "hidden";            
            document.getElementById("video").style.visibility = "hidden";
            document.getElementById("cnvsCover").style.visibility = "hidden";
            document.querySelector(".poweranges").style.visibility = "hidden"; 

            clearTimeout(objTime);
            draw(video,cntxtMain,backcontext,cw,ch);

        }, 1000)
             
    }  

    reloadKonva();

    function reloadKonva() {

        //Variaveis sem declaração var dentro de function são variaveis globais 

        stage = new Konva.Stage({
            container: 'containerKonva',
            width: width,
            height: height
        });

        layer = new Konva.Layer();
        stage.add(layer);

        // Tamanho do Hair  
        hairImg = new Konva.Image({
            width: 400,
            height: 400
        });

        // Posicção inicial do Hair 
        hairGroup = new Konva.Group({
            y: 0,
            x: 100,
            draggable: true
        });

        layer.add(hairGroup);
        hairGroup.add(hairImg);

        // em obras -------------------------------
        //var viDEo = document.createElement('video');

        var image = new Konva.Image({
            image: video,
            draggable: true,
            width:200,
            height: 160,
            x: 50,
            y: 50
        });

        layer.add(image);

        var anim = new Konva.Animation(function () {
            // do nothing, animation just need to update the layer
        }, layer);

        var tr = new Konva.Transformer();
        tr.attachTo(image);
        layer.add(tr);

    }

};

// Utilizado para o movimento das imagens Konva  -- Nell Ago/18
function update(activeAnchor) {
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var image = group.get('Image')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();
    // update anchor positions
    switch (activeAnchor.getName()) {
        case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
        case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
        case 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            break;
        case 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            break;
    }

    image.position(topLeft.position());

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if(width && height) {
        image.width(width);
        image.height(height);
    }
}

function ordernarArray(arrObj) {
    arrayAuxA = [];
    arrayAuxB = [];

    arrObj.forEach(function(item) {
       arrayAuxA.push([zerosLeft(item[0],3), item[1] , item[2]])    
    })    

    arrayAuxA.sort() 

    arrayAuxA.forEach(function(item) {
       arrayAuxB.push([parseInt(item[0]), item[1] , item[2]])    
    })    
    
    return arrayAuxB;
}

function zerosLeft(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;
}


function draw (video,cntxt,bc,w,h) {
    
    if(video.paused || video.ended)	return false;
    // First, draw it into the backing canvas
    bc.drawImage(video,0,0,w,h);
    // Grab the pixel data from the backing canvas
    var idata = bc.getImageData(0,0,w,h);
    var data = idata.data;        

    // Loop through the pixels
    for (var i = 0; i < data.length; i+=4) { 


        var paintFlag = true ;  

        // (y * w) - (w - x)
        // e tambem é ncessario considrar o tamanho do elemento eyesNoseMouth.
        // Eu tambem preciso determinar que pixel é  (data[i] / 4)     

        var px = i / 4; 

        for (var y = eyesNoseMouth.y , len = eyesNoseMouth.y + eyesNoseMouth.h ; y < len ; y++ ) {
            var inicio = (y * video.width) - (video.width - eyesNoseMouth.x);  
            var final  =  inicio + eyesNoseMouth.w ;

            if (px >= inicio && px <= final) {
               paintFlag = false;                  
               break;
            }  
        }


        if (paintFlag && isPaintingArea(data[i], data[i+1] ,data[i+2], 12))  {

            var novaCor = definirHexNovaCor(data[i] , data[i+1] , data[i+2]);

            newColor = {
                R: novaCor.match(/[A-Za-z0-9]{2}/g).map(function(video) { return parseInt(video, 16) })[0],
                G: novaCor.match(/[A-Za-z0-9]{2}/g).map(function(video) { return parseInt(video, 16) })[1],
                B: novaCor.match(/[A-Za-z0-9]{2}/g).map(function(video) { return parseInt(video, 16) })[2]						
            };										
           
            var dataAux = mudarCor(newColor.R , newColor.G , newColor.B , -10 , -5) ;    

            data[i] = dataAux.R;
            data[i+1] =  dataAux.G;
            data[i+2] =  dataAux.B;
        }

    }
    idata.data = data;
    // Draw the pixels onto the visible canvas
    cntxt.putImageData(idata,0,0);
    // Start over!

    objTime = setTimeout(draw,20,video,cntxt,bc,w,h);
}


function definirHexNovaCor(red , green,  blue ) {
    var valor = parseInt ("" + red + green + blue); 
    var resultMaisAprox = 255255255;
    var indiceMaisAprox = 0;

    for (var idx = 0, len = arraySample.length; idx < len; idx++) {
         vaAux = parseInt("" + arraySample[idx][0] + arraySample[idx][1] + arraySample[idx][2]) ;

         if (Math.abs(valor - vaAux) < resultMaisAprox) {
             resultMaisAprox = Math.abs(valor - vaAux);
             indiceMaisAprox = idx; 
         }        
    }

    return rgbToHex (
        arrayChosen[indiceMaisAprox][0],
        arrayChosen[indiceMaisAprox][1],
        arrayChosen[indiceMaisAprox][2]
    )

}


function definirNovaCor(red , green,  blue ) {
    valor = parseInt ("" + red + green + blue); 
    resultMaisAprox = 255255255;
    indiceMaisAprox = 0;

    for (var idx = 0, len = arraySample.length; idx < len; idx++) {
         vaAux = parseInt("" + arraySample[idx][0] + arraySample[idx][1] + arraySample[idx][2]) ;

         if (Math.abs(valor - vaAux) < resultMaisAprox) {
             resultMaisAprox = Math.abs(valor - vaAux);
             indiceMaisAprox = idx; 
         }        
    }

    return arrayChosen[indiceMaisAprox] ;

}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb (color) {
  let hex = color[0] === '#' ? color.slice(1) : color;
  let c;

  // expand the short hex by doubling each character, fc0 -> ffcc00
  if (hex.length !== 6) {
    hex = ((() => {
      const result = [];
      for (c of Array.from(hex)) {
        result.push(`${c}${c}`);
      }
      return result;
    })()).join('');
  }
  const colorStr = hex.match(/#?(.{2})(.{2})(.{2})/).slice(1);
  const rgb = colorStr.map(col => parseInt(col, 16));
  rgb.push(1);
  return rgb;
}

function rgbToHsl (rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const add = max + min;

  const hue =
    min === max ?
      0
    : r === max ?
      (((60 * (g - b)) / diff) + 360) % 360
    : g === max ?
      ((60 * (b - r)) / diff) + 120
    :
      ((60 * (r - g)) / diff) + 240;

  const lum = 0.5 * add;

  const sat =
    lum === 0 ?
      0
    : lum === 1 ?
      1
    : lum <= 0.5 ?
      diff / add
    :
      diff / (2 - add);

  const h = Math.round(hue);
  const s = Math.round(sat * 100);
  const l = Math.round(lum * 100);
  const a = rgb[3] || 1;

  return [h, s, l, a];
}

function hexToHsl (color) {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb);
  return {origin : color , hue: hsl[0] , saturation: hsl[1] , light: hsl[2]};
}

function hsl2rgb (h, s, l) {

    var r, g, b, m, c, x

    if (!isFinite(h)) h = 0
    if (!isFinite(s)) s = 0
    if (!isFinite(l)) l = 0

    h /= 60
    if (h < 0) h = 6 - (-h % 6)
    h %= 6

    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))

    c = (1 - Math.abs((2 * l) - 1)) * s
    x = c * (1 - Math.abs((h % 2) - 1))

    if (h < 1) {
        r = c
        g = x
        b = 0
    } else if (h < 2) {
        r = x
        g = c
        b = 0
    } else if (h < 3) {
        r = 0
        g = c
        b = x
    } else if (h < 4) {
        r = 0
        g = x
        b = c
    } else if (h < 5) {
        r = x
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }

    m = l - c / 2
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return { R: r, G: g, B: b }

}


function colherAmostra(context, arrayElement, loops) {

    // Coleta 50 amostras aleatórias de pixels e salva no arraySample 

    var idata = context.getImageData(0,0, context.canvas.width, context.canvas.height);
    var data = idata.data;


    for (var i = 0 ; i < loops ; i++) {

         var rndm = Math.floor(Math.random()  *  data.length)    
         var idx = rndm ;

         while (idx % 4 != 0) {
            idx += 1; 
         } 
            
         arrayElement.push([data[idx] , data[idx+1] , data[idx+2]]); 

    } 

}

function isPaintingArea(red , green , blue , fator) {
    var retorno = false ; 
    
    for (var idx = 0 ; idx < arraySample.length ; idx++) {
        var item = arraySample[idx] 
         min = red - fator;
         max = red + fator;   

        if (item[0] <= max  && item[0] >= min) {
           min = green - fator;
           max = green + fator;   

           if (item[1] <= max  && item[1] >= min) {
               min = blue - fator;
               max = blue + fator;   
               if (item[2] <= max  && item[2] >= min) {
                  retorno = true; 
                  break ;
               }
           }
        }  
    }
    return retorno;
}


function mudarCor(red , green , blue , fatorLig, fatorSat) {

    var aux =  rgbToHsl([Math.round(red) , Math.round(green) , Math.round(blue)]);

    if  (aux[1] + fatorSat < 100 && aux[1] + fatorSat > 0)  {
        aux[1] += fatorSat ;            
    }

    if  (aux[2] + fatorLig < 100 && aux[2] + fatorLig > 0)  {
        aux[2] += fatorLig ;            
    }

    return  hsl2rgb (aux[0] , aux[1], aux[2])

}

function carregarImgs(strFolder, strSidebar) {
    var fs = require('fs'),
        roll = document.querySelector(strSidebar).querySelector('.roll');

    fs.readdirSync(strFolder).forEach(filePng => {

        var aLink = document.createElement("a") ,
            imagem  = document.createElement("img"); 

            imagem.src = strFolder+filePng;   
            imagem.href = "#";

        aLink.appendChild(imagem); 
        roll.appendChild(aLink);

    })
} 

function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();

    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: true,
        dragOnTop: false
    });

    anchor.on('dragmove', function() {
        update(this);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function() {
        group.setDraggable(true);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        layer.draw();
    });
    anchor.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        layer.draw();
    });

    group.add(anchor);
}

function ObtemImagem(url){
    var canvas = document.createElement("canvas");	
    canvas.setAttribute("width","100");                
    canvas.setAttribute("height","100");	           	                                                   
    context = canvas.getContext("2d");                 
    
    var img = document.createElement("img");
    img.src = url; 
    context.drawImage(img,0,0,100,100);	
        
    var dataURL = compressImage(canvas,4);	

    return dataURL;
    
    function compressImage(canvas, size) {
        var compression = 1.0;
        while(compression > 0.5) {
            var dataURL = canvas.toDataURL('image/png', compression);
            if (dataURL.length/1012 < size) return dataURL;
            if (compression <= 0.1) {
                compression -= 0.01;
            } else {
                compression -= 0.1;
            }
        }
        return dataURL;
    }                       
}

function changeColor(elemento, novaColor, imgOriginalColor) {

    newColor = {
        R: novaColor.match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) })[0],
        G: novaColor.match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) })[1],
        B: novaColor.match(/[A-Za-z0-9]{2}/g).map(function(v) { return parseInt(v, 16) })[2]						
    };										

    var canvas = document.createElement("canvas");	
    canvas.setAttribute("width", imgOriginalColor.naturalWidth);                
    canvas.setAttribute("height", imgOriginalColor.naturalHeight);	           	                                                   
    
    var ctx = canvas.getContext("2d");            

    ctx.drawImage(imgOriginalColor, 0, 0);
    var originalPixels = ctx.getImageData(0, 0, imgOriginalColor.naturalWidth, imgOriginalColor.naturalHeight);
    var currentPixels = ctx.getImageData(0, 0, imgOriginalColor.naturalWidth, imgOriginalColor.naturalHeight);            

    for(var I = 0, L = originalPixels.data.length; I < L; I += 4) {
        if(currentPixels.data[I + 3] > 0){
            currentPixels.data[I] = originalPixels.data[I] / 255 * newColor.R;
            currentPixels.data[I + 1] = originalPixels.data[I + 1] / 255 * newColor.G;
            currentPixels.data[I + 2] = originalPixels.data[I + 2] / 255 * newColor.B;
        }
    }

    ctx.putImageData(currentPixels, 0, 0);
    elemento.src = canvas.toDataURL("image/png");						            
}

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function showSliders() {
    var allSlider = document.querySelectorAll('.slider-wrapper'); 
    
    for (idx = 0 ; idx < allSlider.length; idx++ ) {
        allSlider[idx].style.display = 'block';                
    }                
}
