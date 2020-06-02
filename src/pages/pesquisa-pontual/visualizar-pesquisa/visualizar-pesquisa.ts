import { Component, ViewChild, OnInit, ElementRef, AfterViewInit, AfterViewChecked, ViewChildren, AfterContentInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CustomMethods } from '../../../app/GlobalMethods';
import { URL_BASE, URL_CarregarPesquisaPontual, URL_CarregarGraficoPesquisaPontual } from '../../../app/app.url';
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
      this.ConfigureBackgroundDoughnutChart();
      this.dChartMethod();
    }
  }

  doughnutChart: any

  ResultadoCategorias: any;
  TipoAmbiente: number;
  NomePesquisa: string;
  Data: string;

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
    this.http.get(URL_BASE + URL_CarregarGraficoPesquisaPontual + "?idPesquisaColaborador=" + this.PesquisaPontual.IdPesquisaColaborador)
      .map(res => res.json()).subscribe(
        resp => {

          this.success = true;

          //Isso agrupa as pesquisas por categoria, pode ser usado futuramente

          // this.IsAgrupado = resp.IsAgrupado;
          // this.RespostaPesquisaPontual = resp.Result;
          // this.RespostaPesquisaPontual["Respostas"] =
          //   this.IsAgrupado ? this.GroupBy(this.RespostaPesquisaPontual["Respostas"], "Categorias")
          //     : this.RespostaPesquisaPontual["Respostas"];
          this.TipoAmbiente = resp.TipoAmbiente
          this.NomePesquisa = resp.NomePesquisa
          this.Data = resp.Data
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
    let valorPorcentagem = this.ResultadoCategorias.PercentualMediaGeral;
    let valorExcedente = 100 - valorPorcentagem;

    var deliveredData = {
      labels: [
        "Value"
      ],
      datasets: [
        {
          data: [valorPorcentagem, valorExcedente],
          backgroundColor: [
            this.DoughnutColor(valorPorcentagem),
            "rgba(0,0,0,0)"
          ],
          borderWidth: [
            0, 0
          ]
        }]
    };

    var deliveredOpt = {
      cutoutPercentage: 85,
      animation: {
        animationRotate: true,
        duration: 1000
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      radiusBackground: {
        color: '#d1d1d1' // Set your color per instance if you like
      },
      elements: {
        center: {
          // the longest text that could appear in the center
          maxText: '100%',
          text: this.ResultadoCategorias.MediaGeral.toFixed(2).toString(),
          fontColor: '#2E333B',
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          fontStyle: 'normal',
          fontSize: 34,
          // if a fontSize is NOT specified, we will scale (within the below limits) maxText to take up the maximum space in the center
          // if these are not specified either, we default to 1 and 256
          minFontSize: 1,
          maxFontSize: 256,
        }
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
      afterUpdate: function (chart) {
        if (chart.config.options.elements.center) {
          var helpers = Chart.helpers;
          var centerConfig = chart.config.options.elements.center;
          var globalConfig = Chart.defaults.global;
          var ctx = chart.chart.ctx;

          var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
          var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);

          if (centerConfig.fontSize)
            var fontSize = centerConfig.fontSize;
          // figure out the best font size, if one is not specified
          else {
            ctx.save();
            var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
            var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
            var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

            do {
              ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
              var textWidth = ctx.measureText(maxText).width;

              // check if it fits, is within configured limits and that we are not simply toggling back and forth
              if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
                fontSize += 1;
              else {
                // reverse last step
                fontSize -= 1;
                break;
              }
            } while (true)
            ctx.restore();
          }

          // save properties
          chart.center = {
            font: helpers.fontString(fontSize, fontStyle, fontFamily),
            fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
          };
        }
      },
      afterDraw: function (chart) {
        if (chart.center) {
          var centerConfig = chart.config.options.elements.center;
          var ctx = chart.chart.ctx;

          ctx.save();
          ctx.font = chart.center.font;
          ctx.fillStyle = chart.center.fillStyle;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx.fillText(centerConfig.text, centerX, centerY);
          ctx.restore();
        }
      },
    })
    // Chart.pluginService.register({
    //   beforeDraw: function (chart) {
    //     var width = chart.chart.width,
    //       height = chart.chart.height,
    //       ctx = chart.chart.ctx;

    //     ctx.restore();
    //     var fontSize = (height / 60).toFixed(2);
    //     ctx.font = fontSize + "em sans-serif";
    //     ctx.textBaseline = "middle";

    //     var text = uniqueValue,
    //       textX = Math.round((width - ctx.measureText(text).width) / 2),
    //       textY = height / 2;

    //     ctx.fillText(text, textX, textY);
    //     ctx.save();
    //   }
    // });


  }

  private radiusBackground = function () {
    var self = this;

    self.draw = function (chartInstance) {
      if (chartInstance.options.radiusBackground) {
        var x = chartInstance.chart.canvas.clientWidth / 2,
          y = chartInstance.chart.canvas.clientHeight / 2,
          ctx = chartInstance.chart.ctx;

        ctx.beginPath();
        ctx.arc(x, y, chartInstance.outerRadius - (chartInstance.radiusLength / 2), 0, 2 * Math.PI);
        ctx.lineWidth = chartInstance.radiusLength;
        ctx.strokeStyle = chartInstance.options.radiusBackground.color || '#d1d1d1';
        ctx.stroke();
      }
    };

    // see http://www.chartjs.org/docs/#advanced-usage-creating-plugins for plugin interface
    return {
      beforeDatasetsDraw: self.draw,
      onResize: self.draw
    }
  };

  private DoughnutColor(percent: number) {
    if (percent > 83.4) {
      return "#12C700";
    } else if (percent > 66.8) {
      return "#5AF158";
    } else if (percent > 50.2) {
      return "#C6FF00";
    } else if (percent > 33.6) {
      return "#FFEB3B";
    } else if (percent > 17) {
      return "#FFA726";
    } else {
      return "#FFCC80";
    }
  }

  ConfigureBackgroundDoughnutChart() {

    Chart.plugins.register(this.radiusBackground());



    // Register with Chart JS

  }



}
