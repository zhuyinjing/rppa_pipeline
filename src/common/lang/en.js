module.exports = {
  sample: 'Sample',
  //  按钮
  button: {
    confirm: 'OK',
    cancel: 'CANCEL',
    clear: 'CLEAR ALL',
    close: 'CLOSE',
    next_step: 'NEXT',
    previous_step: 'PREV',
    back: 'BACK',
    svg: 'GET SVG',
    select: 'SEARCH',
    describe: 'DESCRIPTION',
    deg: 'DEG',
    volcano: 'VOLCANO PLOT',
    heatmap: 'HEATMAP',
    ppi: 'PPI PLOT',
    enrichment: 'ENRICHMENT',
    force: 'PPI NETWORK PLOT',
    filter: 'FILTER',
    save_filter: 'SAVE',
    reset: 'RESTORE to DEFAULT',
    submit: 'SUBMIT',
    ok: 'OK, GET IT',
  },
  //  d3 选项
  d3: {
    radius: 'RADIUS of POINT',
    opacity: 'OPACITY of POINT',
    args: 'PARAMETER',
    option: 'OPTION',
    y_axis: 'y AXIS',
    gene_name_show: 'SHOW GENE NAMES',
    gene_num: 'SHOW GENE NUMBER',
    xmin: 'MIN VALUE of x AXIS',
    xmax: 'MAX VALUE of x AXIS',
    ymin: 'MIN VALUE of y AXIS',
    ymax: 'MAX VALUE of y AXIS',
    width: 'WIDTH',
    height: 'HEIGHT',
    gene_id_show: 'SHOW GENE ID',
    scatter_gene_show: 'SHOW SCATTER GENE',
    show: 'DISPLAY',
    hide: 'HIDE',

  },
  //  输入
  input: {
    split: 'input gene IDs are split by ","',
    hand: 'input',
    file: 'FILE UPLOAD',
    content: 'please input',
    support: 'Supported file types',
    gene_id_list: 'input gene IDs',
    gene_id: 'input ensembl stable IDs',
    gene_name: 'input gene names',
    split_method: 'input could be split by ",", space or new line symbol',

  },
  //  导航
  navbar: {
    home: 'HOME',
    project_list: 'PROJECTS',
    app_tool: 'APPs',
    logout: 'LOGOUT',
  },
  //  首页
  home: {
    introduction: 'Professional NGS Analysis System, Dedicated to Annotation And Visualization',
    project_button: 'View Project List',
    suggest_browser: 'We suggest browse the website using following browsers: ',
    footer_font: '京ICP备18032172号-1',
  },
  //  项目列表
  project_list: {
    create_project: 'CREATE NEW',
    project_name: 'NAME',
    create_time: 'CREATE TIME',
    edit_button: 'VIEW/EDIT EXPERIMENT DESIGNE',
    upload_button: 'UPLOAD fastq',
    run_button: 'RUN',
    report_button: 'VIEW REPORT',
    delete_button: 'DELETE PROJECT',
    project_introduction: 'PROJECT SUMMARY',
    species_type: 'SPECIES',
    sequencing_type: 'SEQUENCING TYPE',
  },
  //  编辑实验
  create_experiment: {
    edit_experiment: 'EDIT/UPDATE EXPERIMENT DESIGNE',
    clear_experiment: 'CLEAR',
    experiment_list: 'CONDITION LIST',
    experiment_condition: 'CONDITION',
    sample_name: 'SAMPLE NAME',
    case_control: 'CASE vs CONTROL',
    case: 'CASE',
    control: 'CONTROL',
    step1: 'SETP 1：Create conditions.',
    add_condition: 'ADD CONDITION',
    sample_number: 'SAMPLE NUMBER',
    case: 'CASE',
    step2: 'SETP 2：Create CASE vs CONTROL tests.',
  },
  //  上传测序文件
  upload_file: {
    sample_data: 'FASTQ DATA',
    file: 'FILE',
    upload: 'UPLOAD',
    import: 'IMPORT',
    upload_progress: 'UPLOADING PROGRESS',
    import_server_side: 'IMPORT SERVER-SIDE FILE DIRECTORY',
    upload_file: 'UPLOAD FILES'
  },
  //  运行分析
  run_task: {
    report: 'CREATE REPORT',
    run: 'RUN',
    refresh: 'REFRESH TASK STATUS',
    logLabel: 'LOG CONTENT'
  },
  //  报告侧边栏
  leftMenu: {
    report_home: 'REPORT',
    qc: 'QUALITY CONTROL',
    fastqc: 'SEQUENCING QUALITY',
    mappingqc: 'MAPPING QUALITY',
    trans: 'ASSEMBLING',
    new_trans: 'NEW TRANSCRIPTS',
    gene_matrix: 'QUATIFICATION',
    expr_matrix: 'QUATIFICATION MATRIX',
    cluster_all: 'SAMPLE OVERVIEW',
    cluster: 'SAMPLE CLUSTER',
    pca: 'PCA',
    paris: 'SAMPLE CORR',
    deg: 'DIFFERENCIAL EXPRESSION GENE',
    deg_chart: 'EXTRA VISUALIZATION',
    kegg: 'KEGG ENRICHMENT BUBBLE PLOT',
    asprofile: 'AS EVENT',
    asprofile_number: 'AS EVENT NUMBER PLOT',
    asprofile_percent: 'AS EVENT PERCENT PLOT',
  },
  //  报告首页
  report: {
    project: 'PROJECT',
    title: 'Introduction to RNASeq',
    introduction: 'RNASeq(RNA Sequencing) uses next-generation sequencing (NGS) to reveal the presence and quantity of RNA in a biological sample at a given moment. RNA-Seq is used to analyze the continuously changing cellular transcriptome. Specifically, RNA-Seq facilitates the ability to look at alternative gene spliced transcripts, post-transcriptional modifications, gene fusion, mutations/SNPs and changes in gene expression over time, or differences in gene expression in different groups or treatments. For more information about RNASeq, please visit https://en.wikipedia.org/wiki/RNA-Seq ',
    describe: 'Basic Information',
    species: 'Species',
    genome: 'Reference Genome',
    experiment: 'Experiment Design',
  },
  //  测序质检
  fastqc: {
    title: 'Sequencing Quality Control Report Summary',
    filename: 'FILE NAME',
    basic_statistics_paragraph1: '- Encoding says which ASCII encoding of quality values was found in this file. Possible value could be Phred33 or Phred64.',
    basic_statistics_paragraph2: '- Total Sequences: A count of the total number of sequences processed. ',
    basic_statistics_paragraph2: '- Filtered Sequences: If running in Casava mode sequences flagged to be filtered will be removed from all analyses. ',
    basic_statistics_paragraph3: '- Sequence Length: Provides the length of the shortest and longest sequence in the set. If all sequences are the same length only one value is reported.',
    basic_statistics_paragraph4: '- %GC: The overall %GC of all bases in all sequences, more information at http://www.bioinformatics.babraham.ac.uk/projects/fastqc/Help/3%20Analysis%20Modules/1%20Basic%20Statistics.html',
    basic_statistics: 'Basic Statistics',
    base_quality_paragraph1: '- This view shows an overview of the range of quality values across all bases at each position in the FastQ file.',
    base_quality_paragraph2: '- The y-axis on the graph shows the quality scores. The higher the score the better the base call. The background of the graph divides the y axis into very good quality calls (green), calls of reasonable quality (orange), and calls of poor quality (red). The quality of calls on most platforms will degrade as the run progresses, so it is common to see base calls falling into the orange area towards the end of a read.',
    base_quality_paragraph3: '- The central red line is the median value. The yellow box represents the inter-quartile range (25-75%). The upper and lower whiskers represent the 10% and 90% points. The blue line represents the mean quality.',
    base_quality_paragraph4: '- A warning will be issued if the lower quartile for any base is less than 10, or if the median for any base is less than 25.',
    base_quality_paragraph5: '- This module will raise a failure if the lower quartile for any base is less than 5 or if the median for any base is less than 20.',
    base_quality: 'Per Base Sequence Quality',
    per_quality_paragraph1: '- This graph will only appear in your analysis results if you are using an Illumina library which retains its original sequence identifiers. Encoded in these is the flowcell tile from which each read came. The graph allows you to look at the quality scores from each tile across all of your bases to see if there was a loss in quality associated with only one part of the flowcell.',
    per_quality_paragraph2: 'The plot shows the deviation from the average quality for each tile. The colours are on a cold to hot scale, with cold colours being positions where the quality was at or above the average for that base in the run, and hotter colours indicate that a tile had worse qualities than other tiles for that base. In the example below you can see that certain tiles show consistently poor quality. A good plot should be blue all over.',
    per_quality_paragraph3: 'Reasons for seeing warnings or errors on this plot could be transient problems such as bubbles going through the flowcell, or they could be more permanent problems such as smudges on the flowcell or debris inside the flowcell lane.',
    per_quality_paragraph4: '- This module will issue a warning if any tile shows a mean Phred score more than 2 less than the mean for that base across all tiles.',
    per_quality_paragraph5: '- This module will issue a warning if any tile shows a mean Phred score more than 5 less than the mean for that base across all tiles.',
    per_quality: 'Per Tile Sequence Quality',
    sequence_quality_paragraph1: '- The per sequence quality score report allows you to see if a subset of your sequences have universally low quality values. It is often the case that a subset of sequences will have universally poor quality, often because they are poorly imaged (on the edge of the field of view etc), however these should represent only a small percentage of the total sequences.',
    sequence_quality_paragraph2: 'If a significant proportion of the sequences in a run have overall low quality then this could indicate some kind of systematic problem - possibly with just part of the run (for example one end of a flowcell).',
    sequence_quality_paragraph3: '- A warning is raised if the most frequently observed mean quality is below 27 - this equates to a 0.2% error rate.',
    sequence_quality_paragraph4: '- An error is raised if the most frequently observed mean quality is below 20 - this equates to a 1% error rate.',
    sequence_quality: 'Per Sequence Quality Scores',
    gc_paragraph1: '- This module measures the GC content across the whole length of each sequence in a file and compares it to a modelled normal distribution of GC content.',
    gc_paragraph2: 'An unusually shaped distribution could indicate a contaminated library or some other kinds of biased subset. ',
    gc_paragraph3: 'A normal distribution which is shifted indicates some systematic bias which is independent of base position. If there is a systematic bias which creates a shifted normal distribution then this will not be flagged as an error by the module since it does not know what your genome GC content should be.',
    gc_paragraph4: '- A warning is raised if the sum of the deviations from the normal distribution represents more than 15% of the reads.',
    gc_paragraph5: '- This module will indicate a failure if the sum of the deviations from the normal distribution represents more than 30% of the reads.',
    gc: 'Per Sequence GC Content',
    invalid_base_paragraph1: '- If a sequencer is unable to make a base call with sufficient confidence then it will normally substitute an N rather than a conventional base] call',
    invalid_base_paragraph2: 'This module plots out the percentage of base calls at each position for which an N was called. It is not unusual to see a very low proportion of Ns appearing in a sequence, especially nearer the end of a sequence. However, if this proportion rises above a few percent it suggests that the analysis pipeline was unable to interpret the data well enough to make valid base calls. ',
    invalid_base_paragraph3: '- This module raises a warning if any position shows an N content of >5%.',
    invalid_base_paragraph4: '- This module will raise an error if any position shows an N content of >20%.',
    invalid_base: 'Per Base N Content',
    sequence_length_paragraph1: '- Some high throughput sequencers generate sequence fragments of uniform length, but others can contain reads of wildly varying lengths. Even within uniform length libraries some pipelines will trim sequences to remove poor quality base calls from the end.',
    sequence_length_paragraph2: 'This module generates a graph showing the distribution of fragment sizes in the file which was analysed. In many cases this will produce a simple graph showing a peak only at one size, but for variable length FastQ files this will show the relative amounts of each different size of sequence fragment.',
    sequence_length_paragraph3: '- This module will raise a warning if all sequences are not the same length.',
    sequence_length_paragraph4: '- This module will raise an error if any of the sequences have zero length.',
    sequence_length: 'Sequence Length Distribution',
    joint_contamination_paragraph1: '- The Kmer Content module will do a generic analysis of all of the Kmers in your library to find those which do not have even coverage through the length of your reads. This can find a number of different sources of bias in the library which can include the presence of read-through adapter sequences building up on the end of your sequences.',
    joint_contamination_paragraph2: '- This module will issue a warning if any sequence is present in more than 5% of all reads.',
    joint_contamination_paragraph3: '- This module will issue a warning if any sequence is present in more than 10% of all reads.',
    joint_contamination: 'Adapter Content',
  },
  //  比对结果质检
  mappingqc: {
    title: 'Mapping QC Statistics',
    introduction: ' The transcript consists of the exon sequence of the gene, so the reads generated by the transcriptome sequencing should theoretically be mainly posted back to the exon (including the UTR) region; at the same time, due to the existence of the variable shear event, some reads will be posted back to the intron region of the gene; in addition, a small amount of reads may be posted back to the intergenic region. Statistics on the location of the reads genomes can help determine the quality of the sequencing of the transcriptome. We used the Hisat2 software for genome-based replies, which is a follow-up update to TopHat2/Bowtie2, using the improved BWT algorithm for faster speeds and less resource usage. The authors recommend TopHat2/Bowtie2 and HISAT. The user switches to HISAT2.',
    references: 'Reference',
    link: 'Link',
    describe: ' As shown in the figure below, the abscissa indicates the post position of each type of reads, the ordinate indicates the number of reads in each cell that are posted back to the corresponding position (G in uppercase on the ordinate axis represents GIGA).',
    sample: 'Sample',
    total_base: 'Total Bases',
    ribose_proportion: 'Proportion of Ribosome',
    coding_proportion: 'Proportion of CDS',
    UTR_proportion: 'Proportion of UTR',
    intron_proportion: 'Proportion of Intron',
    gene_proportion: 'Proportion of intergenic',
  },
  //  新转录本概况
  new_trans: {
    view_classcode: 'What is classcode?',
  },
  //  表达量表格
  expr_matrix: {
    introduction: ' The direct manifestation of the expression level of a gene is to see how many reads are posted back to the gene region. This can be called gene expression abundance. In transcriptome analysis, the number of reads that fall within a gene region depends on the length of the gene and the depth of sequencing (generally, the longer the gene, the greater the number of reads, the higher the sequencing depth, the more relative number of reads for a gene. Therefore, we use RPKM, TPM, etc. as a quantitative representation of transcriptome data. They are all methods for standardizing expression levels, and the objects of standardization are the gene length and the sequencing depth.',
    describe: ' Transcripts Per Kilobase of exonmodel per Million mapped reads ( Transcripts per thousand bases per million mapping reads, TPM) is an optimized RPKM calculation method. TPM summarizes the length, expression, and number of genes. In each sample, the sum of the TPM values of all genes was 1M, so each sample was guaranteed to compare gene expression levels under a uniform standard.',
    Ni: 'the number of reads that mapping to the gene i；',
    Li: 'the sum of exon length of gene i ',
    TMP_span1: ' the TPM of a gene in a sample：firstly,the number of reads per gene is corrected with the length of the gene,then we use the corrected reads of the gene. ',
    TMP_span2: 'quotient with all the reads in the corrected sample ',
  },
  //  样本聚类
  cluster: {
    title: 'sample clustering map',
    introduction: ' The sample clustering heat map, the color of the matrix color block in the figure, can visually show the proximity of the gene expression patterns of different samples. The tree structure diagram on the left represents the result of sample clustering, and the samples with closer gene expression patterns are closer in the data structure diagram. The sample distance is calculated using Euclidean distance, the linkage calculation between samples is ward, and the clustering tool used is fastcluster software,using R language',
    describe: '“Show branch length” When select this option, the length of the stem of the tree will reflect the distance between the samples.',
  },
  //  差异基因
  deg: {
    filter_condition: ' screening conditions for current differentially expressed genes ',
    filter_total: 'the number of differentially expressed genes ',
    abs: 'absolute value',
    show_coding: 'show coding genes onlu',
    show_all_type: 'show all types of genes',
    show: 'show',
    up: ' up-regulation of expression ',
    down: ' down-regulation of expression ',
  },
  //  火山图
  volcano_plot: {
    introduction: ' The horizontal and vertical coordinates of the Volcano Plot show two important indicators of gene differential expression (the abscissa is log2FoldChange, the more the deviation from the origin,the larger the difference; the ordinate is -log10(pvalue), the larger the value, the more significant the difference). Through the volcano map, genes that are significantly differentially expressed between the two samples can be screened very intuitively.',
  },
  //  MA 图
  ma_plot: {
    introduction: ' MA plot showed the relationship between gene expression abundance and the change of expression in samples. The X-axis of MA plot is the average abundance of genes in the two types of samples compared, the Y-axis is log2 (expression difference multiplier), and the Y-axis is a measure of the change of gene expression, indicating whether a gene is up or down in the experimental group. For example, if the differential expression gene G of A vs B is 500 in Sample A and 2000 in Sample B, then the X-axis coordinate is ',
    yaxis_introduction: ' the Y axis coordinate is ',
  },
  //  heatmap
  heatmap: {
    introduction: 'Differentially expressed gene heat maps can visually show the difference in gene expression under different experimental conditions by color depth, and can visually show the difference in regulation mode (expression profile) under different experimental conditions. The default color scheme is green for lower expression levels, red for higher expression levels, and black for intermediate expression levels. The user can click on the color bar in the upper left corner to change the color scheme. The tree structure on the left side of the HeatMap indicates the result of gene clustering, and the closer the genes expressing the trend, the closer the position in the tree structure diagram. The tree structure above the HeatMap represents the results of sample clustering, and the samples with closer gene expression patterns are closer in the data structure map. The input data of HeatMap is the TPM value of the top 100 genes in the list of differentially expressed genes between samples. The distance of the gene and the distance of the sample are calculated by Euclidean distance, and the linkage calculation between genes and samples is ward, using Inchlib.',
  },
  //  富集分析
  enrichment_analysis: {
    trans: 'transcription factor',
  },
  //  ASprofile
  ASprofile: {
    asprofile_event: 'variable shear event',
  },
  //  svg 解释
  svg: {
    what_svg: 'what is svg ?',
    introduction: ' svg is a vector graphics format that has the advantage that formats such as jpg and png do not have.svg have the ability to zoom in or out at any time without sacrificing image quality. ',
    tool: 'tools for editing svg images include',
    browse: 'etc.Universal browser such as Chrome、Firefox、Safari can directly open and view svg images.'
  },
  //  app 应用
  app: {
    gene_matrix: 'gene expression matrix',
    group: 'grouping information',
    gene_distance: 'genetic distance calculation method ',
    gene_linkage: 'genetic linkage calculation method ',
    sample_distance: 'sample distance calculation method ',
    sample_linkage: ' sample linkage calculation method ',
    choose_project: 'choose project ',
    choose_group: 'choose group',
    choose_sample: 'choose sample',
    heatmap: 'genetic heatmap (user defined)',
    heatmap_base_project: 'genetic heatmap (based on project data)',
  },
  //  错误 / 警告
  warn: {
    no_expr: 'the following genes have no expression information in the selected projects and samples, which may be caused by the low expression level of these genes in the selected samples',
  }
}
