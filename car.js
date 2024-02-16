class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;  // definindo um valor de fricção para acelerar e frear
        this.angle=0;
        this.damaged=false;  // inicializando o carro como "não batido"

        // habilitando os sensores somente para o carro que controlamos
        if(controlType!="DUMMY"){
            this.sensor=new Sensor(this);
        }
        this.controls=new Controls(controlType);
    }

    update(roadBorders,traffic){  // definindo um método "update"
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        // checando se o sensor existe no carro para atualizar o sensor
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
        }
    }

    // criando um Método para verificar se o carro bateu
    #assessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){  //percorre a borda da rua
            if(polysIntersect(this.polygon,roadBorders[i])){  //percorre a borda do poligono do carro
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){  //percorre a borda da rua
            if(polysIntersect(this.polygon,traffic[i].polygon)){  //percorre a borda do poligono do carro
                return true;
            }
        }
        return false;
    }

    // criando um Método para identificar as coordendas do carro
    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;  // o raio "rad"=hipotenusa. Dividido por 2 porque só preceisamos da metade
        const alpha=Math.atan2(this.width,this.height);  // angulo alpha é o arco-tangente da largura pela altura
        // ponto top-right
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        // ponto top-left
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        // ponto bottom-right
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        // ponto bottom-left
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if (this.speed>this.maxSpeed){  //setando a velo máxima
            this.speed=this.maxSpeed;
        }

        if (this.speed<-this.maxSpeed/2){  //velo reversa a metade da velo pra frente
            this.speed=-this.maxSpeed/2;
        }

        if (this.speed>0){  // se a velo>0 (frente) diminuimos a velocidade com a fricção
            this.speed-=this.friction;
        }

        if (this.speed<0){  // se a velo<0 (trás) diminuimos a velocidade com a fricção
            this.speed+=this.friction;
        }

        if (Math.abs(this.speed)<this.friction){  //se a velo < fricção paramos o carro
            this.speed=0;  // setando a velo para 0 (zero) deixando o carro parado
        }

        if (this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx,color){
        // Antes o carro era criado com linhas dessa forma
        // ctx.save();
        // //transfere o centro do carro para a posição onde queremos que ele rotacione
        // ctx.translate(this.x, this.y);  
        // ctx.rotate(-this.angle)  // rotacionando o carro pelo valor negativo do angulo
        // ctx.beginPath();
        // ctx.rect(
        //     -this.width/2,
        //     -this.height/2,
        //     this.width,
        //     this.height
        // );
        // ctx.fill();

        // // temos que chamar o restore do context porque senão a cada frame de animação
        // // o carro vai transladar e rotacionar infinitamente
        // ctx.restore();

        // verificando se o carro estiver batido
        if(this.damaged){
            ctx.fillStyle="red";
        }else{
            ctx.fillStyle=color;
        }
        // Agora criamos o carro com o Polygon criado pelo Método acima
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        // desenhando o sensor se o carro é o que estamos controlando
        if(this.sensor){
            this.sensor.draw(ctx);  // o carro chama a rotina para desenhar os sensores
        }
    }
}