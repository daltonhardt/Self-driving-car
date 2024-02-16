// Classe de sensores
// o constructor recebe o carro como argumento pois o sensor fica anexo ao carro
// e vamos usar as propriedades do carro para atualizar o sensor

class Sensor{
    constructor(car){ 
        this.car=car;
        this.rayCount=4;  // criando 3 raios de sensores
        this.rayLenght=100;  // comprimento do raio 100px depois disso ele não identifica mais nada
        this.raySpread=Math.PI/2;  // qtde de raios, 180/4 vai dar 3 angulos de 45 entre eles

        this.rays=[];  // array para manter cada raio individualmente
        this.readings=[];
    }

    // criando um método "update"
    update(roadBorders,traffic){
        this.#castRays();
        this.readings=[];
        for (let i=0;i<this.rays.length;i++){
            this.readings.push(
                this.#getReading(this.rays[i],roadBorders,traffic)  //passando raios e bordas para o método
            );
        }
    }

    // criando um método para ler as bordas da rua (ou carros na pista)
    // vamos ler vários cruzamentos do raio e manter o mais próximo no Reading
    // o sensor pode sair da pista e o raio cruzar com as 2 bordas da rua ou então
    // o raio pode cruzar com um carro na frente
    #getReading(ray,roadBorders,traffic){
        let touches=[];

        // se o raio tocar em algo
        for(let i=0;i<roadBorders.length;i++){
            const touch=getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if(touch){
                touches.push(touch);
            }
        }

        for(let i=0;i<traffic.length;i++){
            const poly=traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                const value=getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if(value){
                    touches.push(value);
                }
            }
        }

        // se o raio não tocar em nada
        if(touches.length==0){
            return null;
        }else{
            const offsets=touches.map(e=>e.offset);  // o array map method percorre todo o array
            const minOffset=Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
    }

    #castRays(){
        this.rays=[];  // iniciando o array vazio e começando a popular em seguida
        for(let i=0;i<this.rayCount;i++){
            const rayAngle=lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)  // se for 1 raio então t=0.5 
            )+this.car.angle;  // adicionando o angulo para o sensor girar junto com o carro

            // calculando o ponto inicial do array e o ponto final
            const start={x:this.car.x, y:this.car.y};
            const end={
                x:this.car.x-Math.sin(rayAngle)*this.rayLenght,
                y:this.car.y-Math.cos(rayAngle)*this.rayLenght
            };

            this.rays.push([start,end]);  //colocando os pontos no array para criar um segmento
        }
    }

    // vamos desenhar os sensores
    draw(ctx){
        for(let i=0;i<this.rayCount;i++){
            let end=this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(  // começando no inicio do raio
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(  // desenhando a linha até o final do raio
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(  // começando no inicio do raio
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(  // desenhando a linha até o final do raio
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}