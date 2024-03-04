var styles = `
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
body {
  overflow: hidden;
  touch-action: none;
  background: #252525;
}
main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
canvas {
  width: auto !important;
  height: auto !important;
  max-width: 100% !important;
  max-height: 100% !important;
 /* box-shadow: 0px 0px 40px #000000;*/
}
`
var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

let w;
let h
let pix = 1
let s, c, pg, pg2, img, sh
let i, f, g, k
let frameMod
let blurShader

let seed1
let borderStr
let uOctave
let border
let blockColor, blockColor2, blockColor3
let stopCount = 1
let far
let blockW, blockH
let yatayChooser
let sChooser
let mapChooser
let ellipseChooser
let akChooser
let dirChooser
let whEdgeX
let probb
let borderBox
let move
let al

function preload() {
  seed1 = 99999999 * random()

  sh = loadShader("pix.vert", "pix.frag");
}

function setup() {


  w = windowWidth
  h = windowHeight

  c = createCanvas(w, h, WEBGL)
  pixelDensity(pix)
  f = createGraphics(w, h)
  f.pixelDensity(pix)
  f.colorMode(HSB, 360, 100, 100, 1)
  pg = createGraphics(w, h, WEBGL)
  pg.pixelDensity(pix)
  pg.noStroke()


  g = createGraphics(w, h, WEBGL)
  g.pixelDensity(pix)
  g.colorMode(HSB, 360, 100, 100, 1)
  g.background(0, 0, 80)

  f.background(0, 0, 10)

  pg2 = createGraphics(w, h)
  pg2.pixelDensity(pix)
  pg2.noStroke()

  img = createGraphics(w, h)
  img.pixelDensity(pix)
  img.imageMode(CENTER)
  img.colorMode(HSB, 360, 100, 100, 1)
  img.rectMode(CENTER)

  f.rectMode(CENTER)

  // blurShader = g.createShader(theVertex1, fbmfrag)


  // seed1 = 97469322.36331618
  console.log(seed1)
  noiseSeed(seed1)
  randomSeed(seed1)


  let frArr = [25, 50, 75, 50, 25, 50, 75, 50, 50, 75]


  frameMod = frArr[floor(random(frArr.length))]


  far = 30
  frameRate(far)


  f.push();
  f.rectMode(CENTER)
  // f.fill(220, 80, 90);
  // f.fill(0, 80, 90);
  // f.fill(120, 80, 90);
  // f.fill(180, 80, 90);
  // f.fill(280, 80, 90);
  // f.fill(330, 80, 90);
  f.fill(random([0, 220, 120, 180, 280, 330]), random([80, 80, 80, 80, 80, 0]), 90);
  f.rect(w / 2, h / 2, w * 2, h * 2)
  f.pop();





  minDim = min(width, height)

  sChooser = random([1.0, 2.0, 3.0, 1.0])

  if (sChooser == 1.0) {
    s = minDim / 10
  } else if (sChooser == 2.0) {
    s = minDim / 50
  } else if (sChooser == 3.0) {
    s = minDim / 20
  }




  f.push()
  // noiseSeed(seed1)
  // randomSeed(seed1)

  for (let x = 0; x <= width; x += s) {
    for (let y = 0; y <= height; y += s) {
      f.strokeWeight(1)
      // f.stroke(20,80,90)
      // f.point(x,y)

      if (random(1) < 0.9) {
        f.noFill()
      } else {
        f.fill(0, 0, 0)
      }

      f.rectMode(CENTER)
      f.rect(x, y, s)

    }
  }

  for (let x = 0; x <= width; x += s / 2) {
    for (let y = 0; y <= height; y += s / 2) {
      f.strokeWeight(1)
      // f.stroke(0,0,random(90,100))
      // f.point(x,y)

      if (random(1) < 0.9) {
        f.noFill()
      } else {
        f.fill(0, 0, 0, 0.1)
      }
      f.rectMode(CENTER)
      f.rect(x, y, s)

    }
  }


  f.pop()



  mapChooser = random([0.0, 0.0, 0.0, 0.0, 1.0, 2.0, 0.0, 0.0])

  ellipseChooser = random([0.0, 0.0, 1.0, 0.0, 0.0])

  if (mapChooser !== 0.0) {
    ellipseChooser = 0
  }

  probb = random([0, 1])

  akChooser = random([1, 2])

  dirChooser = random([1.0, 3.0, 3.0, 4.0])


  let dX = random([1., -1., 0.0, 0.0])
  let dY

  if (dX == 1. || dX == -1) {
    dY = 0.0
  } else {
    dY = random([-1, 1])
  }

  let proD = random([.1, .5])

  let text1 = random([0.0, 0.0, 0.0, 1.0])
  let text2 = random([0.0, 0.0, 0.0, 1.0, 0.0, 0.0])


  shader(sh)

  sh.setUniform('resolution', [w * pix, h * pix])
  sh.setUniform('pg', pg2)
  sh.setUniform('pg2', pg2)
  sh.setUniform('img', f)
  sh.setUniform('proD', proD)

  sh.setUniform('u_text1', text1)
  sh.setUniform('u_text2', text2)
  sh.setUniform('u_scale', random([2, 5, 10, 15, 20, 30, 20, 20, 20, 2, 2, 2, 2]))




  if (dirChooser == 1.0) {
    sh.setUniform('dirX', dX) ///sadece dikeyYatay
    sh.setUniform('dirY', dY)
  } else if (dirChooser == 2.0) {
    sh.setUniform('dirX', random([-1., 1.])) ///sadece kose
    sh.setUniform('dirY', random([-1., 1.]))
  } else if (dirChooser == 3.0) {
    sh.setUniform('dirX', random([-1., 1., 0., 0., 0.])) ////hepsi
    sh.setUniform('dirY', random([-1., 1., 0., 0., 0.]))
  }


  if (akChooser == 1.0) {
    sh.setUniform('ak', 1.)
  } else if (akChooser == 2.0) {
    sh.setUniform('ak', 3.0)
  } else if (akChooser == 3.0) {
    sh.setUniform('ak', 5.0)
  } else if (akChooser == 4.0) {
    sh.setUniform('ak', 10.0)
  }


  sh.setUniform('satOn', dirChooser)




  img.image(f, w / 2, h / 2)

  blockColor = 255
  blockColor2 = 255
  blockColor3 = 255



  blockW = width / 2
  blockH = height / 2
  blockAni = random([0.0, 1.0])

  border = random([0.0, 0.0, 1.0, 1.0, 1.0])


  if (border == 1.0) borderStr = "border"
  yatayChooser = random([0.0, 1.0, 2.0, 3.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0])

  borderBox = random([1, 2])

  whEdgeX = minDim / 10

  // noCursor()

  move = 0
  al = 255

}

function draw() {

  let x = (random(w / s) ^ (frameCount / s)) * s
  let y = (random(h / s) ^ (frameCount / s)) * s


  let m = 1 ///10

  // pg.fill(random([0, 255, 127]) / m, random([0, 255, 127]) / m, random([0, 255, 127]) / m)
  // pg.rect(x, y, s * 2, s * 2)


  pg2.fill(random([0, 255, 127]) / m, random([0, 255, 127]) / m, random([0, 255, 127]) / m)
  pg2.rect(x, y, s, s)



  if (border == 1.0) {
    pg2.push()
    pg2.fill(blockColor, blockColor2, blockColor3)
    pg2.rectMode(CENTER)
    if (yatayChooser == 0.0) {
      pg2.push()
      pg2.translate(blockW, height / 2)
      pg2.rect(0, 0, width / 10, height)
      pg2.pop()

      pg2.push()
      pg2.translate(blockW - width / 5, height / 2)
      pg2.rect(0, 0, width / 10, height)
      pg2.pop()

      pg2.push()
      pg2.translate(blockW + width / 5, height / 2)
      pg2.rect(0, 0, width / 10, height)
      pg2.pop()

    } else if (yatayChooser == 1.0) {
      pg2.push()
      pg2.translate(width / 2, blockH)
      pg2.rect(0, 0, width, height / 10)
      pg2.pop()

      pg2.push()
      pg2.translate(width / 2, blockH - height / 5)
      pg2.rect(0, 0, width, height / 10)
      pg2.pop()

      pg2.push()
      pg2.translate(width / 2, blockH + height / 5)
      pg2.rect(0, 0, width, height / 10)
      pg2.pop()

    } else if (yatayChooser == 2.0) {
      pg2.push()
      pg2.rectMode(CORNER)
      if (borderBox == 1) {
        pg2.rect(0, 0, width / 2, height / 2)
        pg2.rect(width / 2, height / 2, width, height)
      } else {
        pg2.rect(width / 2, 0, width, height / 2)
        pg2.rect(0, height / 2, width / 2, height)
      }
      pg2.pop()
    } else if (yatayChooser == 3.0) {
      pg2.push()
      pg2.rectMode(CENTER)
      if (borderBox == 1) {
        pg2.rect(width / 2, height / 2, width, height / 2)
      } else {
        pg2.rect(width / 2, height / 2, min(width, height) / 2, height)
      }
      pg2.pop()
    } else if (yatayChooser == 4.0) {
      pg2.push()
      pg2.ellipse(width / 2, height / 2, min(width, height) / 1.25)
      pg2.pop()
    } else if (yatayChooser == 5.0) {
      pg2.push()
      pg2.rectMode(CORNER)
      if (borderBox == 1) {
        pg2.rect(0, 0, width / 2, height)
      } else {
        pg2.rect(0, 0, width, height / 2)
      }


      pg2.pop()
    } else if (yatayChooser == 6.0) {
      pg2.push()
      pg2.rectMode(CORNER)


      if (borderBox == 1) {
        pg2.rect(width / 2, 0, width / 2, height)
      } else {
        pg2.rect(0, height / 2, width, height / 2)
      }
      pg2.pop()
    } else if (yatayChooser == 7.0) {
      pg2.push()

      pg2.rectMode(CENTER)


      if (borderBox == 1) {
        pg2.rect(width / 2, height / 2, width / 3, height)
      } else {
        pg2.rect(width / 2, height / 2, width, height / 3)
      }
      pg2.pop()
    }


    pg2.pop()
  }

  // pg2.fill(move, al)
  // pg2.rect(0, 0, w / 2, h)


  img.image(c, w / 2, h / 2)

  if (frameCount % frameMod == 0) {

    minDim = min(width, height)
    if (sChooser == 1.0) {
      s = random([minDim / 10, minDim / 5, minDim / 20, minDim / 10, minDim / 50])
    } else if (sChooser == 2.0) {
      s = random([minDim / 50, minDim / 20, minDim / 50, minDim / 20])
    } else if (sChooser == 3.0) {
      s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
    }

    for (let y = 0; y < h; y += s) {
      for (let x = 0; x < w; x += s) {
        if (mapChooser == 0) {

        } else if (mapChooser == 1) {
          if (probb == 0) {
            if (x <= width / 2 - s * 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 40, minDim / 20, minDim / 40, minDim / 20])
            }
          } else {
            if (x >= width / 2 - s * 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 40, minDim / 20, minDim / 40, minDim / 20])
            }
          }
        } else {
          if (probb == 0) {
            if (y <= height / 2 - s * 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 40, minDim / 20, minDim / 40, minDim / 20])
            }
          } else {
            if (y >= height / 2 - s * 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 40, minDim / 20, minDim / 40, minDim / 20])
            }
          }
        }

        let r = random([0, 255, 127])
        let g = random([0, 255, 127])
        let b = random([0, 255, 127])

        pg2.fill(r, g, b)

        // al = random([255, 255, 255, 255, 0])

        // let bol = x > w / 2

        // if(al == 0) bol = true

        // if (bol) 
        pg2.rect(x, y, s, s)




        // if (frameCount % 50 == 0) {
        //   pg2.fill(0, 0, 0)
        //   if(random(1) < 0.8)pg2.rect(0, 0, w / 2, h)

        // }else{

        // }



      }
    }

    if (akChooser == 1.0) {
      sh.setUniform('ak', random([1., 1., 2.0, 1., 1., 2.0, 3., 1., 1., 1.]))
    } else if (akChooser == 2.0) {
      sh.setUniform('ak', 3.0)
    } else if (akChooser == 3.0) {
      sh.setUniform('ak', 5.0)
    } else if (akChooser == 4.0) {
      sh.setUniform('ak', 10.0)
    }

    let dX = random([1., -1., 0.0, 0.0])
    let dY

    if (dX == 1. || dX == -1) {
      dY = 0.0
    } else {
      dY = random([-1, 1])
    }

    if (dirChooser == 1.0) {
      sh.setUniform('dirX', dX)
      sh.setUniform('dirY', dY)
    } else if (dirChooser == 2.0) {
      sh.setUniform('dirX', random([-1., 1.]))
      sh.setUniform('dirY', random([-1., 1.]))
    } else if (dirChooser == 3.0) {
      sh.setUniform('dirX', random([-1., 1., 0., 0., 0.]))
      sh.setUniform('dirY', random([-1., 1., 0., 0., 0.]))
    }

    blockColor = random([255, 127])
    blockColor2 = random([255, 127])
    blockColor3 = random([255, 127])

    blockW = random([width / 2, width / 4, width / 1.3333])
    blockH = random([height / 2, height / 4, height / 1.3333])

    if (borderStr == "border") {
      border = random([1.0, 1.0, 0.0, 1.0, 1.0])
    }
  }

  sh.setUniform('u_time', millis() / 1000.0)
  sh.setUniform('pg', pg2)
  sh.setUniform('img', img)
  sh.setUniform('pg2', pg2)

  // sh.setUniform('pg', img)
  // sh.setUniform('img', img)
  // sh.setUniform('pg2', pg2)

  pg.noStroke()

  quad(-1, -1, 1, -1, 1, 1, -1, 1)





}


function keyPressed() {
  if (key == ' ') {
    stopCount += 1
    if (stopCount % 2 == 0) {
      frameRate(0)
    } else {
      frameRate(far)
    }
  }
  if (key == "s") {
    saveCanvas("strained", "png")
  }
}
