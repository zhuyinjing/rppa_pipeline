<template>
      <div class="">
        <imgMenuShowComp></imgMenuShowComp>

        <el-breadcrumb separator="/" style="margin:5px 0 50px 0">
          <el-breadcrumb-item :to="{ path: 'report' }">{{$t('report.project')}} {{$store.state.projectName}}</el-breadcrumb-item>
          <el-breadcrumb-item>基因融合鉴定与注释</el-breadcrumb-item>
        </el-breadcrumb>

        <h2>基因融合鉴定与注释</h2>

        <el-button type="primary" size="small" icon="el-icon-picture" @click="$store.commit('d3saveSVG', ['gene_fusion', 'rectContainer'])">{{$t('button.svg')}}</el-button>
        <i class="el-icon-question cursor-pointer" style="font-size:16px" @click="$store.state.svgDescribeShow = true"></i>

        <div id="rectContainer"></div>

      </div>
</template>

<script>
import imgMenuShowComp from '@/components/imgMenuShowComp.vue'
import * as d3 from 'd3'

export default {
  data () {
    return {
      data: null
    }
  },
  components: {
    imgMenuShowComp
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      let gene = JSON.parse(sessionStorage.getItem('gene_fusion_data'))
      this.axios.get('/server/get_gene_fusion_info?p='+ this.$store.state.projectId +'&sampleName='+ gene.sampleName +'&geneId='+ gene.geneId).then(res => {
        if (res.data.message_type === 'success') {
          this.data = res.data
          this.initD3()
        } else {
          this.$message.error('请求出错！')
        }
      }).catch(e => {
        this.$message.error('请求出错！')
      })
    },
    initD3 () {
      let self = this
      let hassvg = d3.selectAll('#rectSvg')
      if (hassvg) {
        d3.selectAll('#rectSvg').remove()
      }
      let width = 1000, height = 800;
      let padding = {top:30,right:100,bottom:60,left:100}
      let rectSvg = d3.select("#rectContainer").append("svg").attr("width", width + padding.left + padding.right).attr("height", height).attr("id", "rectSvg")

      let data = this.data.geneFusion
      let preScale = d3.scaleLinear().domain([data.preExon[0][0], data.preExon[data.preExon.length - 1][1]]).range([padding.left, (width / 2) + padding.left])
      let postScale = d3.scaleLinear().domain([data.postExon[0][0], data.postExon[data.postExon.length - 1][1]]).range([(width / 2) + padding.left, width + padding.left])

      let tooltip = d3.select('#rectContainer')
      	.append('div')
      	.style('position', 'absolute')
        .style('z-index', '10')
      	.style('color', 'black')
        .style('visibility', 'hidden')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
      	.text('')

      // 染色体
      let chrData = this.data.chromInfo
      // let chrData = {9:{name:'chr1',length:138394717},10:{name:'chr5',length:138394717}}
      let chrGroup = rectSvg.append("g").attr("transform", "translate("+ padding.left +", "+ padding.top +")")
      let chrRectHeight = 5
      chrGroup.selectAll(".rect")
              .data(Object.keys(chrData))
              .enter()
              .append("rect")
              .attr("x", (d, i) => Object.keys(chrData).length === 1 ? 0 : i * (width / 2))
              .attr("y", 0)
              .attr("width", Object.keys(chrData).length === 1 ? width : width / 2)
              .attr("height", chrRectHeight)
              .attr("stroke", (d, i) => "#9e9e9e")
              .attr("fill", (d, i) => "none")

      chrGroup.selectAll(".text")
              .data(Object.values(chrData))
              .enter()
              .append("text")
              .attr("transform", (d, i) => {
                if (Object.keys(chrData).length === 1) {
                  return "translate("+ width / 2 +", -10)"
                } else {
                  if (i === 0) {
                    return "translate("+ (width / 4) +", -10)"
                  } else {
                    return "translate("+ (width / 4 * 3) +", -10)"
                  }
                }
              })
              .text(d => d.name)
              .style('text-anchor', 'middle')

      let rectGroupStartY = 200
      let rectGroup = rectSvg.append("g").attr("transform", "translate("+ 0 +", " + rectGroupStartY + ")")

      let rectHeight = 15

      // preExon
      rectGroup.selectAll(".rect")
               .data(data.preExon)
               .enter()
               .append("rect")
               .attr("x", d => preScale(d[0]))
               .attr("y", d => 0)
               .attr("width", d => preScale(d[1]) - preScale(d[0]))
               .attr("height", rectHeight)
               .attr("fill", "#fff")
               .attr("stroke", "red")
               .style("stroke-dasharray", (d, i) => i === (data.preExon.length - 1) ? 0 : '3 2')
               .on('mouseover', function (d, i) {
                 return tooltip.style('visibility', 'visible').text("exon: " + ((data.exonPair.split(";")[0]) - 0 - (data.preExon.length - 1 - i)))
               })
               .on('mousemove', function (d, i) {
                 return tooltip.style('top', (d3.event.pageY-20)+'px').style('left',(d3.event.pageX+10)+'px')
               })
               .on('mouseout', function (d, i) {
                 return tooltip.style('visibility', 'hidden')
               })

       // preIntron
       rectGroup.selectAll(".rect")
                .data(data.preIntron)
                .enter()
                .append("path")
                .attr("d", d => "M " + preScale(d[0]) + " " + rectHeight / 2 + "L " + preScale(d[1]) + " " + rectHeight / 2)
                .attr("stroke", "red")
                .style("stroke-dasharray", '3 2')

        // postExon
        rectGroup.selectAll(".rect")
                 .data(data.postExon)
                 .enter()
                 .append("rect")
                 .attr("x", d => postScale(d[0]))
                 .attr("y", d => 0)
                 .attr("width", d => postScale(d[1]) - postScale(d[0]))
                 .attr("height", rectHeight)
                 .attr("fill", "#fff")
                 .attr("stroke", "blue")
                 .style("stroke-dasharray", (d, i) => i === 0 ? 0 : '3 2')
                 .on('mouseover', function (d, i) {
                   return tooltip.style('visibility', 'visible').text("exon: " + ((data.exonPair.split(";")[1]) - 0 + i))
                 })
                 .on('mousemove', function (d, i) {
                   return tooltip.style('top', (d3.event.pageY-20)+'px').style('left',(d3.event.pageX+10)+'px')
                 })
                 .on('mouseout', function (d, i) {
                   return tooltip.style('visibility', 'hidden')
                 })

         // postIntron
         rectGroup.selectAll(".rect")
                  .data(data.postIntron)
                  .enter()
                  .append("path")
                  .attr("d", d => "M " + postScale(d[0]) + " " + rectHeight / 2 + "L " + postScale(d[1]) + " " + rectHeight / 2)
                  .attr("stroke", "blue")
                  .style("stroke-dasharray", '3 2')

      // exon 两端的坐标文字
      let exonTextY = rectGroupStartY + rectHeight + 15
      rectSvg.selectAll(".text")
             .data([data.preExon[0][0], data.postExon[data.postExon.length - 1][1]])
             .enter()
             .append("text")
             .attr("transform", (d, i) => "translate("+ (i * width + padding.left) +"," + exonTextY + ")")
             .text(d => d)
             .style('text-anchor', (d, i) => i === 0 ? "end" : "start")

      // rect 和 chr 的连线 path
      if (Object.keys(chrData).length === 1) {
        // 最上面的染色体
        var chrScale = d3.scaleLinear().domain([0, chrData[data.chromId[0]].length]).range([padding.left, width + padding.left])
        // 中间扩大了范围的 rect
        var xDomainData = [data.preExon,data.postExon].flat(3)
        var chrRectScale = d3.scaleLinear().domain(d3.extent(xDomainData)).range([padding.left, width + padding.left])
      } else {
        // 最上面的两个染色体
        var preChrScale = d3.scaleLinear().domain([0, chrData[data.chromId[0]].length]).range([padding.left, (width / 2) + padding.left])
        var postChrScale = d3.scaleLinear().domain([0, chrData[data.chromId[1]].length]).range([(width / 2) + padding.left, width + padding.left])
        // 中间扩大了范围的两个 rect
        var xPreDomainData = data.preExon.flat()
        var xPostDomainData = data.postExon.flat()
        var preChrRectScale = d3.scaleLinear().domain(d3.extent(xPreDomainData)).range([padding.left, (width / 2) + padding.left])
        var postChrRectScale = d3.scaleLinear().domain(d3.extent(xPostDomainData)).range([padding.left, (width / 2) + padding.left])
      }

      let chrRectMargin = 50
      // 中间的 rect
      chrGroup.selectAll(".rect")
              .data(Object.keys(chrData))
              .enter()
              .append("rect")
              .attr("x", (d, i) => Object.keys(chrData).length === 1 ? 0 : i * (width / 2))
              .attr("y", chrRectHeight + chrRectMargin)
              .attr("width", Object.keys(chrData).length === 1 ? width : width / 2)
              .attr("height", chrRectHeight)
              .attr("fill", (d, i) => i === 0 ? "#FFC107" : "#ff9800")
              .attr("stroke", (d, i) => i === 0 ? "#FFC107" : "#ff9800")

      // 中间的 rect 映射到染色体的区域
      rectSvg.selectAll(".path")
               .data(Array.from(new Set(data.chromId)))
               .enter()
               .append("path")
               .attr("d", (d, i) => {
                 let pathStartY = padding.top + chrRectHeight + chrRectMargin
                 if (Object.keys(chrData).length === 1) { // 如果前后都来自同一个染色体
                   return "M " + padding.left + " " + pathStartY + "L " + chrScale(d3.min(xDomainData)) + " " + (padding.top + chrRectHeight)
                          + "L " + chrScale(d3.max(xDomainData)) + " " + (padding.top + chrRectHeight) + "L " + (padding.left + width) + " " + pathStartY
                 } else {
                   if (i === 0) {
                    return "M " + padding.left + " " + pathStartY + "L " + preChrScale(d3.min(xPreDomainData)) + " " + (padding.top + chrRectHeight)
                           + "L " + preChrScale(d3.max(xPreDomainData)) + " " + (padding.top + chrRectHeight) + "L " + preScale(data.preExon[data.preExon.length - 1][1]) + " " + pathStartY
                   } else {
                     return "M " + postScale(data.postExon[0][0]) + " " + pathStartY + "L " + postChrScale(d3.min(xPostDomainData)) + " " + (padding.top + chrRectHeight)
                            + "L " + postChrScale(d3.max(xPostDomainData)) + " " + (padding.top + chrRectHeight) + "L " + postScale(data.postExon[data.postExon.length - 1][1]) + " " + pathStartY
                   }
                 }
               })
               .attr("stroke", (d, i) => i === 0 ? "#FFC107" : "#ff9800")
               .attr("fill", "none")

      // chrRect 对应的 coordinate
      let chrTextY = padding.top + chrRectHeight + chrRectMargin + 20
      if (Object.keys(chrData).length === 1) {
        rectSvg.selectAll(".text")
               .data(d3.extent(xDomainData))
               .enter()
               .append("text")
               .attr("transform", (d, i) => "translate("+ (i * width + padding.left) +"," + chrTextY+ ")")
               .text(d => d)
               .style('text-anchor', (d, i) => i === 0 ? "end" : "start")

        // 染色体上的方块
        rectSvg.append("rect")
               .attr("x", chrScale(d3.min(xDomainData)))
               .attr("y", padding.top)
               .attr("width", chrScale(d3.max(xDomainData)) - chrScale(d3.min(xDomainData)))
               .attr("height", chrRectHeight)
               .attr("stroke", "#FFC107")
               .attr("fill", "#FFC107")

      } else {
        var chrText = [d3.extent(xPreDomainData), d3.extent(xPostDomainData)].flat()
        rectSvg.selectAll(".text")
               .data(chrText)
               .enter()
               .append("text")
               .attr("transform", (d, i) => {
                 if (i < 2) {
                   return "translate("+ (i * (width / 2) + padding.left) +"," + chrTextY +")"
                 } else if (i === 2) {
                   return "translate("+ ((width / 2) + padding.left) +"," + chrTextY +")"
                 } else {
                   return "translate("+ (width + padding.left) +"," + chrTextY +")"
                 }
               })
               .text(d => d)
               .style('text-anchor', (d, i) => i < 2 ? "end" : "start")

         // 染色体上的方块
         rectSvg.selectAll(".rect")
                .data([xPreDomainData, xPostDomainData])
                .enter()
                .append("rect")
                .attr("x", d => chrScale(d3.min(d)))
                .attr("y", padding.top)
                .attr("width", chrScale(d3.max(d)) - chrScale(d3.min(d)))
                .attr("height", chrRectHeight)
                .attr("stroke", (d, i) => i === 0 ? "#FFC107" : "#ff9800")
                .attr("fill", (d, i) => i === 0 ? "#FFC107" : "#ff9800")
      }


      // 可变剪切不分映射到 chrRect 的区域
      rectSvg.selectAll(".path")
               .data(data.chromId)
               .enter()
               .append("path")
               .attr("d", (d, i) => {
                 let pathStartY = padding.top + chrRectHeight * 2 + chrRectMargin
                 if (Object.keys(chrData).length === 1) { // 如果前后都来自同一个染色体
                   if (i === 0) {
                    return "M " + preScale(data.preExon[data.preExon.length - 1][0]) + " " + rectGroupStartY + "L " + chrRectScale(data.preExon[data.preExon.length - 1][0]) + " " + pathStartY
                           + "L " + chrRectScale(data.preExon[data.preExon.length - 1][1]) + " " + pathStartY + "L " + preScale(data.preExon[data.preExon.length - 1][1]) + " " + rectGroupStartY
                   } else {
                     return "M " + postScale(data.postExon[0][0]) + " " + rectGroupStartY + "L " + chrRectScale(data.postExon[0][0]) + " " + pathStartY
                            + "L " + chrRectScale(data.postExon[0][1]) + " " + pathStartY + "L " + postScale(data.postExon[0][1]) + " " + rectGroupStartY
                   }
                 } else {
                   if (i === 0) {
                    return "M " + preScale(data.preExon[data.preExon.length - 1][0]) + " " + rectGroupStartY + "L " + preChrRectScale(data.preExon[data.preExon.length - 1][0]) + " " + pathStartY
                           + "L " + preChrRectScale(data.preExon[data.preExon.length - 1][1]) + " " + pathStartY + "L " + preScale(data.preExon[data.preExon.length - 1][1]) + " " + rectGroupStartY
                   } else {
                     return "M " + postScale(data.postExon[0][0]) + " " + rectGroupStartY + "L " + postChrRectScale(data.postExon[0][0]) + " " + pathStartY
                            + "L " + postChrRectScale(data.postExon[0][1]) + " " + pathStartY + "L " + postScale(data.postExon[0][1]) + " " + rectGroupStartY
                   }
                 }
               })
               .attr("stroke", (d, i) => i === 0 ? "red" : "blue")
               .attr("fill", (d, i) => i === 0 ? "red" : "blue")

      let rectBottomHeight = 25
      let rectBottomStartY = 400
      let rectGroupBottom = rectSvg.append("g").attr("transform", "translate("+ 0 +", " + rectBottomStartY + ")")
      // var xScale = d3.scaleLinear().domain(data.fusionCoords).range([width / 3 + padding.left, width / 3 * 2 + padding.left])
      var xScale = d3.scaleLinear().domain(data.fusionCoords).range([padding.left, width + padding.left])

      rectGroupBottom
          .append("rect")
          .attr("x",xScale(data.fusionCoords[0]))
          .attr("y",0)
          .attr("width", xScale(data.lengthPair[0]) - xScale(data.fusionCoords[0]))
          .attr("height", rectBottomHeight)
          .attr("stroke", (d,i) => "red")
          .attr("fill", (d,i) => "none")

      rectGroupBottom
          .append("rect")
          .attr("x",xScale(data.lengthPair[0]))
          .attr("y",0)
          .attr("width", xScale(data.fusionCoords[1]) - xScale(data.lengthPair[0]))
          .attr("height", rectBottomHeight)
          .attr("stroke", (d,i) => "blue")
          .attr("fill", (d,i) => "none")

      rectGroupBottom.selectAll(".text")
                     .data(data.geneName.split(";"))
                     .enter()
                     .append("text")
                     .attr("transform", (d, i) => {
                       if (i === 0) {
                         return "translate(" + xScale(data.lengthPair[0] / 2)+ "," + (rectBottomHeight / 2 + 5) + ")"
                       } else {
                         return "translate(" + (xScale(data.lengthPair[0]) + (xScale(data.fusionCoords[1]) - xScale(data.lengthPair[0])) / 2) + "," + (rectBottomHeight / 2 + 5) + ")"
                       }
                     })
                     .text((d, i) => d + " ( exon : "+ data.exonPair.split(";")[i] +" )")
                     .style('text-anchor', 'middle')

     // 融合部分两端的坐标文字
     let exonPairTextY = rectBottomStartY + rectBottomHeight + 15

     rectSvg.selectAll(".text")
            .data([data.preExon[data.preExon.length - 1][0], data.postExon[0][1]])
            .enter()
            .append("text")
            .attr("transform", (d, i) => "translate("+ (i * width + padding.left) +"," + exonPairTextY + ")")
            .text(d => d)
            .style('text-anchor', (d, i) => i === 0 ? "end" : "start")

      rectSvg.selectAll(".path")
               .data(['preExon', 'postExon'])
               .enter()
               .append("path")
               .attr("d", (d, i) => {
                 if (i === 0) {
                   return "M " + preScale(data.preExon[data.preExon.length - 1][0]) + ' ' + (rectGroupStartY + rectHeight) + "L " + xScale(data.fusionCoords[0]) + " " + rectBottomStartY
                 } else {
                   return "M " + postScale(data.postExon[0][1]) + ' ' + (rectGroupStartY + rectHeight) + "L " + xScale(data.fusionCoords[1]) + " " + rectBottomStartY
                 }
               })
               .attr("stroke", (d, i) => i === 0 ? "red" : "blue")

      if (data.domainCoords[0] !== 'NA') {
        let marginTop1 = rectBottomHeight + 15
        let marginTop2 = rectBottomHeight + 40
        let h = 5 // 线段的高度

        rectGroupBottom
            .append("path")
            .attr("d", () => {
              return "M " + xScale(data.orfCoords[0]) + " " + marginTop1 + "L " + xScale(data.orfCoords[0]) + " " + (marginTop1 + h)
                      + "L " + xScale(data.orfCoords[1]) + " " + (marginTop1 + h) + "L " + xScale(data.orfCoords[1]) + " " + marginTop1
            })
            .attr("stroke", "#000")
            .attr("fill", "none")

        rectGroupBottom
            .append("text")
            .attr("transform", "translate(" + xScale(data.domainCoords[0] - 0 + ((data.orfCoords[1] - data.orfCoords[0]) / 2)) + ", "+ (marginTop1 + h + 15) +")")
            .text("ORF")
            .style('text-anchor', 'middle')

        rectGroupBottom
            .append("path")
            .attr("d", () => {
              return "M " + xScale(data.domainCoords[0]) + " " + marginTop2 + "L " + xScale(data.domainCoords[0]) + " " + (marginTop2 + h)
                      + "L " + xScale(data.domainCoords[1]) + " " + (marginTop2 + h) + "L " + xScale(data.domainCoords[1]) + " " + marginTop2
            })
            .attr("stroke", "#000")
            .attr("fill", "none")

        rectGroupBottom
            .append("text")
            .attr("transform", "translate(" + xScale(data.domainCoords[0] - 0 + ((data.domainCoords[1] - data.domainCoords[0]) / 2)) + ", "+ (marginTop2 + h + 17) +")")
            .text(data.pfamDesc)
            .style('text-anchor', 'middle')
      }

    },
  }
}
</script>

<style scoped="true">
</style>
