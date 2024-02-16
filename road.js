class Road{
    constructor(x,width, laneCount=3){
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        // atributos da rua
        this.left=x-width/2;
        this.right=x+width/2;
        const infinity=1000000;  // definindo um valor "infinito" 
        this.top=-infinity;  // na tela o valor de y aumenta para baixo então top é negativo
        this.bottom=+infinity;  // na tela o valor de y aumenta para baixo então bottom é positivo
    
        // declarando as bordas da rua para detectar se o carro bateu na lateral
        const topLeft={x:this.left,y:this.top};
        const topRight={x:this.right,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const bottomRight={x:this.right,y:this.bottom};
        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ]
    }

    // centralizando o carro na pista
    // pegando o centro da pista com um determinado index, da esquerda para direita (0,1,2..)
    getLaneCenter(laneIndex){
        const laneWidth=this.width/this.laneCount;
        // return this.left+laneWidth/2+laneIndex*laneWidth;  //primeiro desenho
        return this.left + laneWidth/2 + Math.min(laneIndex, this.laneCount-1)*laneWidth;
    }

    // desenhando a rua com as pistas
    draw(ctx){
        ctx.lineWidth=3;  // espessura da linha
        ctx.strokeStyle="white";  // cor da linha branca

        // desenhando as Lanes (linhas das pistas dentro da rua)
        // para isso fazemos um loop para criar as pistas conforme a variavel laneCount=3
        // dependendo do numero de laneCount temos mais ou menos linhas e o valor das
        // coordenadas de X variam, para isso usamos interpolação linear (lerp)
        // para saber os valores
        // for(let i=0;i<=this.laneCount;i++){
        //     const x=lerp(
        //         this.left,
        //         this.right,
        //         i/this.laneCount
        //     );
        //     // deixando a linha interna da pista pontilhada
        //     if(i>0 && i<this.laneCount){
        //         ctx.setLineDash([20,20]);
        //     }else{
        //         ctx.setLineDash([])
        //     }
        for(let i=1;i<=this.laneCount-1;i++){
            const x=lerp(
                this.left,
                this.right,
                i/this.laneCount
            );
            // deixando a linha interna da pista pontilhada
            ctx.setLineDash([20,20]);
            // desenhando a rua
            // linha do lado esquerdo
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });
    }
}
