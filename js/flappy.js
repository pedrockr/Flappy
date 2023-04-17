/*
  função utilizada para facilitar a criação de elementos
  que irão compor o jogo
  a função será utilizada passando a tag html que deverá
  ser criada e a classe que será atribuida a este elemento
*/
function novoElemento(tagName, className) {
  //atribui a 𝘦𝘭𝘦𝘮𝘦𝘯𝘵𝘰 um elemento html
  const elemento = document.createElement(tagName);
  //adiciona uma classe a o 𝘦𝘭𝘦𝘮𝘦𝘯𝘵𝘰
  elemento.className = className;
  return elemento;
}

/*
  Função construtora que será instanciada toda vez que as barreiras forem criadas
  Esta sendo passada a variavel 𝘳𝘦𝘷𝘦𝘳𝘴𝘢 pois há barreiras em cima e em
  baixo e esta variavel define isto.
*/
function Barreira(reversa = false) {
  //cria uma nova div com classe barreira
  this.elemento = novoElemento("div", "barreira");
  //cria as divs que irão compor a barreira
  const borda = novoElemento("div", "borda");
  const corpo = novoElemento("div", "corpo");
  /*
    Adiciona as divs criadas acima como 𝘤𝘩𝘪𝘭𝘥 da div barreira
    A operação ternaria define a ordem q as divs serão adicionadas
    à div barreira, criando assim a representação de barreiras
    em cima e em baixo
  */
  this.elemento.appendChild(reversa ? corpo : borda);
  this.elemento.appendChild(reversa ? borda : corpo);
  /*
    Modifica o css diretamente na tag
    posteriormente esta altura será variavel para que a abertura
    entre as barreiras superiores e inferiores varie de posição
  */
  this.setAltura = (altura) => (corpo.style.height = `${altura}px`);
}

/*
  Função construtora que ira criar as barreiras e variar
  a posição da abertura por onde o flappy irá passar
  o ⁡⁢⁢⁢this⁡ antes dos metodos e atributos tornam eles publicos
  ⁡⁢⁢⁢altura⁡: altura total da div onde o jogo ira rodas
  ⁡⁢⁢⁢abertura⁡: abertura que será deixada para o flappy passar
  ⁡⁢⁢⁢x⁡: posição da barreira na tela eixo x. A animação das barreiras
  se deslocando ira ocorrer variando x.
*/
function ParDeBarreiras(altura, abertura, x) {
  //cria a div que irá conter as barreiras superior e inferior
  this.elemento = novoElemento("div", "par-de-barreiras");
  //instancia da Barreira. Ira efetivamente criar as barreiras
  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);
  //Adicionas as barreiras criadas como 𝘤𝘩𝘪𝘭𝘥 do par-de-barreiras
  this.elemento.appendChild(this.superior.elemento);
  this.elemento.appendChild(this.inferior.elemento);

  //metodo responsavel por sortear e atribuir as alturas das barreiras
  this.sortearAbertura = () => {
    const alturaSuperior = Math.random() * (altura - abertura);
    const alturaInferior = altura - abertura - alturaSuperior;
    this.superior.setAltura(alturaSuperior);
    this.inferior.setAltura(alturaInferior);
  };
  //pega a posição da barreira na tela. O valor retornado é uma string
  //com px por isso esta sendo feito um 𝘴𝘱𝘭𝘪𝘵 e um 𝘱𝘢𝘳𝘴𝘦𝘐𝘯𝘵
  this.getX = () => parseInt(this.elemento.style.left.split("px")[0]);
  //atribui a posição horizontal a barreira
  this.setX = (x) => (this.elemento.style.left = `${x}px`);
  //pega a largura da barreira
  this.getLargura = () => this.elemento.clientWidth;

  this.sortearAbertura();
  this.setX(x);
}
/*
  Funcao construtora que ira lidar com a animacao das barreiras se deslocando
  pela tela do jogo
  No array pares serao instanciadas 4 barreiras que serao utilizadas no jogo
  estas barreiras serao reaproveitadas durante todo o jogo. Ao chegar no final da
  tela ela sera jogada para o final da fila e sorteado novemente a posicao
  da abertura
  alttura e largura: dimensao da tela do jogo
  abertura: abertura entre as barreiras superior e inferior
  espaco: espaco entre as barreiras na horizontal
  notificarPonto: ao cruzar o meio da tela sera adicionado um ponto
*/
function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
  this.pares = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaco),
    new ParDeBarreiras(altura, abertura, largura + espaco * 2),
    new ParDeBarreiras(altura, abertura, largura + espaco * 3),
  ];
  //quantos pixels a barreira irá se deslocar
  const deslocamento = 3;

  this.animar = () => {
    //percorre o array e aplica o deslocamento
    this.pares.forEach((par) => {
      par.setX(par.getX() - deslocamento);
      /*
      este if é reponsavel por reaproveitar a barreira
      ao chegar no final da tela ele manda a barreira para
      o final da fila
    */
      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaco * this.pares.length);
        par.sortearAbertura();
      }
      //este trecho é utilizado para verificar se a barreira passou pelo meio da tela
      const meio = largura / 2;
      console.log(meio);
      const cruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio;
      if (cruzouMeio) notificarPonto();
    });
  };
}

function Passaro(alturaJogo) {
  let voando = false;

  this.elemento = novoElemento("img", "passaro");
  this.elemento.src = "imgs/passaro.png";

  this.getY = () => parseInt(this.elemento.style.bottom.split("px")[0]);
  this.setY = (y) => (this.elemento.style.bottom = `${y}px`);

  window.onkeydown = (e) => (voando = true);
  window.onkeyup = (e) => (voando = false);

  this.animar = () => {
    const novoY = this.getY() + (voando ? 8 : -5);
    const alturaMaxima = alturaJogo - this.elemento.clientHeight;

    if (novoY <= 0) {
      this.setY(0);
    } else if (novoY >= alturaMaxima) {
      this.setY(alturaMaxima);
    } else {
      this.setY(novoY);
    }
  };
  this.setY(alturaJogo / 2);
}

function Progresso() {
  this.elemento = novoElemento("span", "progresso");
  this.atualizarPontos = (pontos) => {
    this.elemento.innerHTML = pontos;
  };
  this.atualizarPontos(0);
}

function estaoSobrepostos(elementoA, elementoB) {
  const a = elementoA.getBoundingClientRect();
  const b = elementoB.getBoundingClientRect();

  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;
  return horizontal && vertical;
}

function colidiu(passaro, barreiras) {
  let colidiu = false;
  barreiras.pares.forEach((parDeBarreiras) => {
    if (!colidiu) {
      const superior = parDeBarreiras.superior.elemento;
      const inferior = parDeBarreiras.inferior.elemento;
      colidiu =
        estaoSobrepostos(passaro.elemento, superior) ||
        estaoSobrepostos(passaro.elemento, inferior);
    }
  });
  return colidiu;
}

function FlappyBird() {
  let pontos = 0;

  const areaDoJogo = document.querySelector("[wm-flappy]");
  const altura = areaDoJogo.clientHeight;
  const largura = areaDoJogo.clientWidth;

  const progresso = new Progresso();
  const barreiras = new Barreiras(altura, largura, 200, 400, () =>
    progresso.atualizarPontos(++pontos)
  );
  const passaro = new Passaro(altura);

  areaDoJogo.appendChild(progresso.elemento);
  areaDoJogo.appendChild(passaro.elemento);
  barreiras.pares.forEach((par) => areaDoJogo.appendChild(par.elemento));

  this.start = () => {
    const temporizador = setInterval(() => {
      barreiras.animar();
      passaro.animar();
      if (colidiu(passaro, barreiras)) {
        clearInterval(temporizador);
      }
    }, 20);
  };
}

new FlappyBird().start();
