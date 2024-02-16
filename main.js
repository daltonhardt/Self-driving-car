const canvas=document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext("2d");
const road=new Road(canvas.width/2, canvas.width*0.95);
// const car = new Car(100,100,30,50);  //primeiro carro criado na posição x=100,y=100
// abaixo criando o carro no meio da pista (x=meio da pista) e y=100
const car = new Car(road.getLaneCenter(1),100,30,50,"KEYS");

// criando tráfego com mais carros na rua
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2)
];

animate();

function animate(){
    for(let i=0;i<traffic.length;i++){  //animando o tráfego de carros
        traffic[i].update(road.borders,[]);
    }
    car.update(road.borders,traffic);
    canvas.height=window.innerHeight;

    // transferindo o ponto de vista como se fosse uma camera sobre o carro
    // o carro vai andando e a pista vai se movimentando junto
    ctx.save();  // salvando o contexto
    ctx.translate(0,-car.y+canvas.height*0.7);  // transfere X=0 e Y=valor negativo de Y no carro
    road.draw(ctx);  // desenhando a rua
    // desenhando os carros para gerar tráfego
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(ctx,"cyan")
    }
    car.draw(ctx,"green");  // desenhando o carro
    ctx.restore();  // recupera o contexto 

    requestAnimationFrame(animate);
}