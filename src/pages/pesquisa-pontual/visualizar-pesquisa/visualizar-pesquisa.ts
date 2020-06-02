import { Component, ViewChild, OnInit, ElementRef, AfterViewInit, AfterViewChecked, ViewChildren, AfterContentInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CustomMethods } from '../../../app/GlobalMethods';
import { URL_BASE, URL_CarregarPesquisaPontual } from '../../../app/app.url';
import * as $ from 'jquery';
import { Chart } from 'chart.js';





@IonicPage()
@Component({
  selector: 'page-visualizar-pesquisa',
  templateUrl: 'visualizar-pesquisa.html',
})


export class VisualizarPesquisaPage {
  @ViewChild('doughnutCanvas') doughnutCanvas: ElementRef;

  private donutsContent
  @ViewChild('donuts') set content(content: ElementRef) {
    if (content) { // initially setter gets called with undefined
      //inicializa as configurações do grafico
      this.donutsContent = content;
      this.ConfigureRoundedDoughnut();
      this.ConfigureUniqueValueDoughtnut();
      this.dChartMethod();
    }
  }

  doughnutChart: any

  ResultadoCategorias : any;
  rate: number = 0;
  tipo: number;
  titulo: string;
  loopNumbers: any;
  IsAgrupado: boolean;
  ResultadoPorGrafico: boolean = true;

  //PesquisaPontual: any;
  PerguntasFormulario = [];

  success = undefined;

  PesquisaPontual = {
    Id: 0,
    IdPesquisaColaborador: 0,
    Data: "",
    IdFormularioResposta: 0,
    NomePesquisa: "",
    Respostas: []

  };

  RespostaPesquisaPontual: any;

  Aviso = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private CustomMethods: CustomMethods
  ) {

    this.tipo = navParams.get("type");
    this.titulo = this.tipo == 1 ? this.titulo = 'Em Andamento' : 'Histórico'
    this.loopNumbers = Array(5).fill(0).map((x, i) => (i + 1));

    this.PesquisaPontual = navParams.get("pesquisa");
    this.CustomMethods.exibirLoading();
    this.loadPesquisa();

  }





  loadPesquisa() {
    this.http.get(URL_BASE + URL_CarregarPesquisaPontual + "?idPesquisaColaborador=" + this.PesquisaPontual.IdPesquisaColaborador)
      .map(res => res.json()).subscribe(
        resp => {
          //console.log(this.doughnutCanvas);

          this.success = true;
          this.IsAgrupado = resp.IsAgrupado;
          this.RespostaPesquisaPontual = resp.Result;
          this.RespostaPesquisaPontual["Respostas"] =
            this.IsAgrupado ? this.GroupBy(this.RespostaPesquisaPontual["Respostas"], "Categorias")
              : this.RespostaPesquisaPontual["Respostas"];

              console.log(resp.DataResult)
              this.ResultadoCategorias = resp.DataResult

          this.CustomMethods.loader.dismiss();
        }, err => {
          this.success = false;
          this.CustomMethods.loader.dismiss();
          //this.CustomMethods.okAlert("Não foi possivel carregar feedback, verifique sua conexão com a internet e tente novamente");

        }
      );
  }

  GroupBy(array: any, prop: string): any {
    let KeyValuedArray = [];
    KeyValuedArray = array.reduce((result, currentValue) => {
      console.log(result[currentValue["PerguntaFormulario"][prop]["nome"]])
      result[currentValue["PerguntaFormulario"][prop]["nome"]] = result[currentValue["PerguntaFormulario"][prop]["nome"]] || [];
      result[currentValue["PerguntaFormulario"][prop]["nome"]].push(currentValue);
      return result;
    }, Object.create(null));

    let groupedResult = []
    for (var obj in KeyValuedArray) {

      groupedResult.push(Object.assign({},
        {
          Categoria: obj,
          Perguntas: KeyValuedArray[obj]
        }
      ));
    }
    return groupedResult;
  }

  mudarEstado(e: any) {
    $(".radio-group-ambiente").removeClass("selecionado");
    let _parentDiv = $(e.target).parent().parent();
    _parentDiv.addClass("selecionado");
  }



  onRateChange(event) {
    console.log('Your rate:', event);
    console.log('Binded Value:', this.rate);
  }

  dChartMethod() {
    var deliveredData = {
      labels: [
        "Value"
      ],
      datasets: [
        {
          data: [85, 15],
          backgroundColor: [
            "#3ec556",
            "rgba(0,0,0,0)"
          ],
          hoverBackgroundColor: [
            "#3ec556",
            "rgba(0,0,0,0)"
          ],
          borderWidth: [
            0, 0
          ]
        }]
    };

    var deliveredOpt = {
      cutoutPercentage: 88,
      animation: {
        animationRotate: true,
        duration: 2000
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    };

    this.doughnutChart = new Chart(this.donutsContent.nativeElement, {
      type: 'RoundedDoughnut',
      data: deliveredData,
      options: deliveredOpt
    });
  }
  ConfigureRoundedDoughnut() {
    Chart.defaults.RoundedDoughnut = Chart.helpers.clone(Chart.defaults.doughnut);
    Chart.controllers.RoundedDoughnut = Chart.controllers.doughnut.extend({
      draw: function (ease) {
        var ctx = this.chart.ctx;
        var easingDecimal = ease || 1;
        var arcs = this.getMeta().data;
        Chart.helpers.each(arcs, function (arc, i) {
          arc.transition(easingDecimal).draw();

          var pArc = arcs[i === 0 ? arcs.length - 1 : i - 1];
          var pColor = pArc._view.backgroundColor;

          var vm = arc._view;
          var radius = (vm.outerRadius + vm.innerRadius) / 2;
          var thickness = (vm.outerRadius - vm.innerRadius) / 2;
          var startAngle = Math.PI - vm.startAngle - Math.PI / 2;
          var angle = Math.PI - vm.endAngle - Math.PI / 2;

          ctx.save();
          ctx.translate(vm.x, vm.y);

          ctx.fillStyle = i === 0 ? vm.backgroundColor : pColor;
          ctx.beginPath();
          ctx.arc(radius * Math.sin(startAngle), radius * Math.cos(startAngle), thickness, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = vm.backgroundColor;
          ctx.beginPath();
          ctx.arc(radius * Math.sin(angle), radius * Math.cos(angle), thickness, 0, 2 * Math.PI);
          ctx.fill();

          ctx.restore();
        });
      }
    });

  }

  ConfigureUniqueValueDoughtnut() {
    Chart.pluginService.register({
      beforeDraw: function (chart) {
        var width = chart.chart.width,
          height = chart.chart.height,
          ctx = chart.chart.ctx;

        ctx.restore();
        var fontSize = (height / 57).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        var text = "75%",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    });
  }




}
