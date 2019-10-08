export class Colaborador {
    //id:number = 12122; //Lorena
    //id:number = 15562; //Renata Oli
    //id:number = 14839;//Rafael Melo
    //id:number = 14820;//Vanessa da Vera
    //id:number = 14807;//Vera da Vanessa
    //id:number = 14665;//Fabio Artfix

    
    id:number = +localStorage.getItem('idColaborador');
    idSuperior:number = +localStorage.getItem('idSuperior');
    perfil:string = localStorage.getItem('perfil');
    foto:string = localStorage.getItem('foto');
    nome:string = localStorage.getItem('NomeColaborador');

    //Dados do colaborador logado
    //id:number = ;
}