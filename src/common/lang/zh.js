module.exports = {
  sample: '样本',
  //  按钮
  button: {
    confirm: '确定',
    cancel: '取消',
    clear: '清空',
    close: '关闭',
    next_step: '下一步',
    previous_step: '上一步',
    back: '返回',
    svg: '下载 SVG',
    select: '查询',
    describe: '说明',
    deg: '差异基因',
    volcano: '火山图',
    heatmap: '基因热图',
    ppi: '蛋白互作图',
    enrichment: '富集分析',
    force: '蛋白互作网络图',
    filter: '筛选',
    save_filter: '保存筛选',
    reset: '恢复默认列表',
    submit: '提交',
    ok: 'ok, 我知道了',
  },
  //  d3 选项
  d3: {
    radius: '点的半径',
    opacity: '点透明度',
    args: '参数',
    option: '操作',
    y_axis: 'y轴显示',
    gene_name_show: '是否显示基因名',
    gene_num: '显示基因个数',
    xmin: 'x轴最小值',
    xmax: 'x轴最大值',
    ymin: 'y轴最小值',
    ymax: 'y轴最大值',
    width: '宽',
    height: '高',
    gene_id_show: 'ID显示',
    scatter_gene_show: '是否显示离散的基因',
    show: '显示',
    hide: '隐藏',

  },
  //  输入
  input: {
    split: '请输入内容,以英文逗号分隔',
    hand: '手动输入',
    file: '上传文件',
    content: '请输入内容',
    support: '支持文件类型',
    gene_id_list: '输入基因 ID 列表',
    gene_id: '按 geneId 输入',
    gene_name: '按 geneName 输入',
    split_method: '请输入列表, 可以用英文逗号、空格或者换行符分隔',

  },
  //  导航
  navbar: {
    home: '首页',
    project_list: '项目列表',
    app_tool: '分析工具',
    logout: '退出账号',
  },
  //  首页
  home: {
    introduction: '专业、深度、可视化的高通量生物数据分析平台',
    project_button: '查看项目列表',
    suggest_browser: '建议使用浏览器',
    footer_font: '京ICP备18032172号-1',
  },
  //  项目列表
  project_list: {
    create_project: '新建项目',
    project_name: '项目名称',
    create_time: '创建时间',
    edit_button: '查看/编辑 实验设计',
    upload_button: '上传测序文件',
    run_button: '运行分析',
    report_button: '查看报告',
    delete_button: '删除项目',
    project_introduction: '项目简介',
    species_type: '物种类型',
    sequencing_type: '测序类型',
  },
  //  编辑实验
  create_experiment: {
    edit_experiment: '编辑/更新实验设计',
    clear_experiment: '清空实验设计',
    experiment_list: '实验条件一览',
    experiment_condition: '实验条件',
    sample_name: '样本名称',
    case_control: '差异表达基因比对条件',
    case: '实验组',
    control: '对照组',
    step1: '第一步：填写实验条件',
    add_condition: '增加实验条件',
    sample_number: '样本数目',
    case: '实验组',
    step2: '第二步：填写需要进行差异表达基因对比的条件对',
  },
  //  上传测序文件
  upload_file: {
    sample_data: '样本数据',
    file: '文件',
    upload: '上传',
    import: '导入',
    upload_progress: '上传进度',
    import_server_side: '导入服务器端文件目录',
    upload_file: '上传文件'
  },
  //  运行分析
  run_task: {
    report: '生成报告',
    run: '运行分析任务',
    refresh: '刷新任务状态',
    logLabel: '日志内容'
  },
  //  报告侧边栏
  leftMenu: {
    report_home: '报告首页',
    qc: '质量控制',
    fastqc: '测序质检',
    mappingqc: '比对结果质检',
    trans: '转录本拼接概况',
    new_trans: '新转录本概况',
    gene_matrix: '基因表达量',
    expr_matrix: '基因表达量表格',
    cluster_all: '样本聚类概览',
    cluster: '样本聚类',
    pca: 'PCA 主成分分析',
    paris: '样本相关性图',
    deg: '差异表达基因分析',
    deg_chart: '差异分析后可视化',
    kegg: 'KEGG 富集分析气泡图',
    asprofile: '可变剪切分析',
    asprofile_number: '可变剪切事件数量统计',
    asprofile_percent: '可变剪切事件百分比统计',
  },
  //  报告首页
  report: {
    project: '项目',
    title: '转录组测序简介',
    introduction: '转录组测序是对样本中所有 RNA 的集合（核糖体 RNA 除外）进行高通量测序。通过转录组测序，理论上可以得到测序样本所有基因的表达水平。结合良好的实验设计，转录组测序可以较为准确的定位到与特定表型相关的基因列表，从而可以为进一步的研究提供较为明确的研究思路。',
    describe: '基本信息',
    species: '物种',
    genome: '参考基因组',
    experiment: '项目实验设计',
  },
  //  测序质检
  fastqc: {
    title: '测序数据质量评估简报',
    filename: '文件名',
    basic_statistics_paragraph1: '- Encoding 指测序平台的版本和相应的编码版本号，可推测是 Phred33 或是 Phred 64 质量分数的编码方式。',
    basic_statistics_paragraph2: '- Total Sequences 输入文本的reads的数量。',
    basic_statistics_paragraph2: '- Total Sequences 输入文本的reads的数量。',
    basic_statistics_paragraph3: '-Sequence length 测序的长度。',
    basic_statistics_paragraph4: '- %GC 是我们需要重点关注的一个指标，这个值表示的是全部序列中的 GC 含量，这个数值一般是物种特意的，比如人类细胞就是 42% 左右。',
    basic_statistics: '基本统计',
    base_quality_paragraph1: '- 用箱式图的方式展示数据质量，图中每 1 个位置，都是该位置的所有序列的测序质量的一个统计。',
    base_quality_paragraph2: '纵轴是质量得分，Q =-10*log10(p)，p 为测错的概率。所以一条 reads 某位置出错概率 0.01 时，其 quality 就是 20。横轴是测序序列的位置。',
    base_quality_paragraph3: '蓝色线是各个位置的平均值的连线。一般要求此图中，所有位置的 10% 分位数大于 20，也就是常说的 Q20 过滤。',
    base_quality_paragraph4: '- 如果任何碱基质量低于 10，或者是任何中位数低于 25 报警；',
    base_quality_paragraph5: '- 如果任何碱基质量低于 5，或者是任何中位数低于 20 报错。',
    base_quality: '碱基质量',
    per_quality_paragraph1: '- 这一模块是检查在测序平台上，reads 中每一个碱基位置在不同的测序小孔之间的偏离度，偏离度越高，碱基质量越差。',
    per_quality_paragraph2: '纵轴表示测序小孔，蓝色表示低于平均偏离度，越红则说明偏离平均质量方差越多，也就是说质量越差，本图中都是蓝色表明质量很好。',
    per_quality_paragraph3: '如果出现质量问题可能是短暂的，如有气泡产生，也可能是长期的，如在某一小孔中存在杂质。',
    per_quality_paragraph4: '- 偏离度小于平均值2以上报警；',
    per_quality_paragraph5: '- 偏离度小于平均值5以上不合格。',
    per_quality: '每瓦质量',
    sequence_quality_paragraph1: '- 这是为了检测一部分质量特别差的 reads，如果有则会在图上出现多个峰，如在测序仪边缘的 reads。',
    sequence_quality_paragraph2: '纵轴是 reads 数目，横轴是质量分数，代表不同 Phred 值对应了多少的 reads。 ',
    sequence_quality_paragraph3: '- 当峰值小于 27（错误率 0.2%）时警报；',
    sequence_quality_paragraph4: '- 当峰值小于 20（错误率 1%）时不合格。',
    sequence_quality: '序列质量',
    gc_paragraph1: '- 图中红色曲线是实际的测序 GC 含量分布图，而蓝色曲线则是理论分布（正态分布，不过均值不一定都是 50%，而是由平均 GC 含量推断的）。',
    gc_paragraph2: '如果红色曲线形状存在比较大的偏差，往往是由于文库的污染造成的。',
    gc_paragraph3: '红色曲线越平滑越好，越接近蓝色曲线越好。形状接近正态但偏离理论分布的情况提示我们可能有系统偏差。',
    gc_paragraph4: '- 偏离理论分布的 reads 超过 15% 时发出警报；',
    gc_paragraph5: '- 超过30%时报不合格。',
    gc: 'GC含量',
    invalid_base_paragraph1: '- 纵轴是百分含量，横轴是 read 的位置，当测序仪不能确切地测定出某一个碱基时就会标注为 N，',
    invalid_base_paragraph2: '正常情况下 N 的比例是很小的，所以图上常常看到一条直线。当看到有峰时，说明测序出了问题。 ',
    invalid_base_paragraph3: '- 当任意位置的 N 的比例超过 5% 警报；',
    invalid_base_paragraph4: '- 超过 20% 不合格。',
    invalid_base: '无效碱基含量',
    sequence_length_paragraph1: '- 每次测序仪测出来的长度在理论上应该是完全相等的，但是总会有一些偏差，',
    sequence_length_paragraph2: '当测序的长度有很大不同时，则表明测序仪在此次测序过程中产生的数据不可信，但对于某些测序平台，具有不同的 read 长度是完全正常的。',
    sequence_length_paragraph3: '- 当 reads 长度不一致时警告；',
    sequence_length_paragraph4: '- 当有长度为 0 的 read 时不合格。',
    sequence_length: '序列长度分布',
    joint_contamination_paragraph1: '- 此图衡量的是序列中两端 adapter 的情况，如果在 fastqc 分析的时候 -a（指定含 adapters 序列文件）选项没有内容，则默认使用图例中的通用 adapter 序列进行统计。',
    joint_contamination_paragraph2: '- 含有 adapter 超过所有 reads 的 5% 的警告；',
    joint_contamination_paragraph3: '- 超过 10% 不合格。',
    joint_contamination: '接头污染',
  },
  //  比对结果质检
  mappingqc: {
    title: '序列比对结果统计图',
    introduction: '转录本由基因外显子序列组成，因此转录组测序产生的 reads 理论上应主要回贴到基因外显子（包括 UTR ）区域；同时由于可变剪切事件的存在，部分 reads 会回贴到基因内含子区域；另外可能有少量 reads 会回帖到基因间区。对 reads 基因组回贴位置进行统计，可以辅助判断转录组的测序质量。 我们使用 Hisat2 软件进行基因组回帖比对分析，该软件是是 TopHat2/Bowtie2 的后续更新版本，使用改进的 BWT 算法，实现了更快的速度和更少的资源占用，作者推荐 TopHat2/Bowtie2和 HISAT 的用户转换到 HISAT2 。',
    references: '参考文献',
    link: '原文链接',
    describe: '如下图所示，横坐标表示各类 reads 回贴位置，纵坐标表示每个细胞中回贴到相应位置的 reads 的数目（纵坐标轴上大写的 G 代表 GIGA）。',
    sample: '样本',
    total_base: '总碱基数',
    ribose_proportion: '核糖体占比',
    coding_proportion: '编码区占比',
    UTR_proportion: 'UTR占比',
    intron_proportion: '内含子区占比',
    gene_proportion: '基因间区占比',
  },
  //  新转录本概况
  new_trans: {
    view_classcode: '查看classcode说明',
  },
  //  表达量表格
  expr_matrix: {
    introduction: '一个基因表达水平的直接体现就是看有多少 reads 回帖到该基因区域，这个可以称之为基因的表达丰度。在转录组的分析中，落在一个基因区域内的 read 数目取决于基因长度和测序深度（一般来说，基因越长 read 数目越多，测序深度越高，则一个基因对应的 read 数目也相对越多），因此我们常用 RPKM、TPM 等作为转录组数据定量的表示方法。它们都是对表达量进行标准化的方法，而标准化的对象就是基因长度与测序深度。',
    describe: 'Transcripts Per Kilobase of exonmodel per Million mapped reads (每千个碱基的转录每百万映射读取的 Transcripts， TPM) 是一种优化的 RPKM 计算方法，TPM 概括了基因的长度、表达量和基因数目。在每个样本内，所有基因的 TPM 值总和为 1M，因此各个样本都可以保证在一个统一的标准下进行基因表达量的比较。',
    Ni: 'mapping 到基因 i 上的 read 数；',
    Li: '基因 i 的外显子长度的总和。',
    TMP_span1: '在一个样本中一个基因的 TPM：先对每个基因的read数用基因的长度进行校正，之后再用校正后的这个基因 read 数',
    TMP_span2: '与校正后的这个样本的所有 read 求商。',
  },
  //  样本聚类
  cluster: {
    title: '样本聚类图',
    introduction: '样本聚类热图，图中矩阵色块颜色的深浅，可以直观的显示不同样本的基因表达模式的接近程度。左侧的树状结构图表示样本聚类的结果，基因表达模式更接近的样本，在数据结构图中的位置更接近。样本距离的计算采用欧式距离，样本间的 linkage 计算方法为 ward，使用的聚类工具是 R 语言的 fastcluster 软件。',
    describe: '“Show branch length” 选项打开以后，树状图的枝干长度会体现样本之间的距离远近。',
  },
  //  差异基因
  deg: {
    filter_condition: '当前差异表达基因筛选条件',
    filter_total: '差异表达基因数目',
    abs: '绝对值',
    show_coding: '只显示编码基因',
    show_all_type: '显示所有类型基因',
    show: '显示',
    up: '当中表达量上调',
    down: '当中表达量下调',
  },
  //  火山图
  volcano_plot: {
    introduction: '火山图（Volcano Plot）的横纵坐标分别显示基因差异表达的两个重要指标（ 横坐标为 log2FoldChange，越偏离原点差异倍数越大；纵坐标为 -log10(pvalue)，该值越大，说明差异越显著 ）。通过火山图，可以非常直观地筛选出在两样本间发生显著差异表达的基因。',
  },
  //  MA 图
  ma_plot: {
    introduction: 'MA plot 展示了基因在样本间的表达量丰度和表达量变化之间的关系。MA plot 的 X 轴是基因在比对的两类样本中的丰度平均值，Y 轴是为 log2(表达差异倍数取)，Y 轴是在衡量基因表达量的变化，表明一个基因在实验组中上调还是下调。例如 A vs B 的差异表达基因 G，在样本 A 中的表达量为 500，在样本 B 中的表达量为 2000，则 X 轴坐标为是',
    yaxis_introduction: 'Y 轴坐标为',
  },
  //  heatmap
  heatmap: {
    introduction: '差异表达基因热图，可以通过颜色深浅来直观显示不同实验条件下基因表达的差异，并且可以较直观的显示出不同实验条件下调基因调控模式（表达谱）的差异。默认的配色方案为绿色代表较低的表达水平，红色代表较高的表达水平，黑色代表中间表达水平。用户可以点击左上角的色条更改配色方案。HeatMap 左侧的树状结构表示基因聚类的结果，表达趋势越接近的基因，在树状结构图中的位置也更接近。HeatMap 上方的树状结构图表示样本聚类的结果，基因表达模式更接近的样本，在数据结构图中的位置更接近。HeatMap 的输入数据为样本间差异表达基因列表中前 100 个基因的 TPM 值，基因距离和样本距离的计算采用欧式距离，基因和样本间的 linkage 计算方法为 ward，使用工具为 Inchlib',
  },
  //  富集分析
  enrichment_analysis: {
    trans: '转录因子',
  },
  //  ASprofile
  ASprofile: {
    asprofile_event: '可变剪切事件',
  },
  //  svg 解释
  svg: {
    what_svg: '什么是 svg ?',
    introduction: 'svg 是一种矢量图形格式，它具有 jpg 和 png 等格式无法具备的优势，可以任意放大或缩小图形显示，同时又不会牺牲图像质量。',
    tool: '可以编辑 svg 图片的工具有',
    browse: '等。通用浏览器像 Chrome、Firefox、Safari 等也可以直接打开 svg 图像查看。'
  },
  //  app 应用
  app: {
    gene_matrix: '基因表达矩阵',
    group: '分组信息',
    gene_distance: '基因距离计算方法',
    gene_linkage: '基因linkage计算方法',
    sample_distance: '样本距离计算方法',
    sample_linkage: '样本linkage计算方法',
    choose_project: '选择项目',
    choose_group: '选择分组',
    choose_sample: '选择物种',
    heatmap: '基因热图 (用户自定义)',
    heatmap_base_project: '基因热图 (基于项目数据)',
  },
  //  错误 / 警告
  warn: {
    no_expr: '下列基因在所选择的项目及样本中无表达信息，这可能是由于这些基因在所选择的样本中表达水平过低导致的',
  }
}
