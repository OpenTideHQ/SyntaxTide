# Command types

There are six broad types for all of the search commands: distributable streaming, centralized streaming, transforming, generating, orchestrating and dataset processing. These types are not mutually exclusive. A command might be streaming or transforming, and also generating.

The following tables list the commands that fit into each of these types. For detailed explanations about each of the types, see [Types of commands](/en/?resourceId=Splunk_Search_Typesofcommands) in the *Search Manual*.

To find out how the types of commands used in searches can affect performance, see [Write better searches](/en/?resourceId=Splunk_Search_Writebettersearches) in the *Search Manual*.

## Streaming commands

A [streaming command](https://docs.splunk.com/Splexicon:Streamingcommand) operates on each event as the event is returned by a search.

* A distributable streaming command runs on the indexer or the search head, depending on where in the search the command is invoked. Any distributable streaming command that comes after a non-streaming command in the search is processed on the search head.
* A centralized streaming command applies a transformation to each event returned by a search. Unlike distributable streaming commands, a centralized streaming command only works on the search head.

| Command | Notes |
| --- | --- |
| [addinfo](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/addinfo#id_34f48872_b13b_4739_9509_c5f1f527d188__addinfo) | Distributable streaming |
| [addtotals](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/addtotals#e6382db2_bfaa_47e2_b54f_ef0636acbb77__addtotals) | Distributable streaming. A [transforming](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#id_6523974f_d5aa_4270_9bd3_ca7585b8c1e3__Transforming_commands) command when used to calculate column totals (not row totals). |
| [arules](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/arules#f167de1b_5f77_4a1d_9c2d_e1d3f4abdc8b__arules) | Some of the work is distributable streaming running on the indexer or the search head. The rest of the work is centralized streaming running on the search head. |
| [autoregress](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/autoregress#id_6c11d555_ad43_4b23_b0a4_0bd64d538fa3__autoregress) | Centralized streaming. |
| [bin](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/bin#e2089f64_d93c_4ca8_a05f_c1c9eb1c0179__bin) | Streaming if specified with the `span` argument. Otherwise a dataset processing command. |
| [bucketdir](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/bucketdir#b553a5a8_6a64_4797_9c72_6716158d2bdd__bucketdir) | Distributable streaming by default, but centralized streaming if the `local` setting specified for the command in the commands.conf file is set to true. |
| [cluster](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/cluster#f12261ed_44f0_4d76_9e81_783f4f78e328__cluster) | Streaming in some modes. |
| [convert](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/convert#a9b0018b_50a9_4dc5_955d_d9535af8ff4d__convert) | Distributable streaming. |
| [dedup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/dedup#cc343630_62b6_453c_a08d_39c99aa852df__dedup) | Distributable streaming in a prededup phase. Centralized streaming after the individual indexers perform their own dedup and the results are returned to the search head from each indexer. Using the `sortby` argument or specifying `keepevents=true` makes the `dedup` command a dataset processing command. |
| [eval](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eval#e7c71eb8_ab76_40e9_b152_53cf6ccac16d__eval) | Distributable streaming. |
| [extract](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/extract#id_37ab1585_b912_46e5_822a_dded286ac6ff__extract) | Distributable streaming. |
| [fieldformat](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fieldformat#c84c2c6c_da0a_40f0_8774_be2ed930434d__fieldformat) | Distributable streaming. |
| [fields](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fields#id_77c2addd_d37f_413f_8409_4849a2364f3d__fields) | Distributable streaming. |
| [fillnull](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fillnull#ea500f11_dc13_4c3b_bb16_32e3345d99f7__fillnull) | Distributable streaming when a `field-list` is specified. A [dataset processing](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#id_2e9101fb_8b20_4e1d_b1e6_75c4ccc48589__Dataset_processing_commands) command when no `field-list` is specified. |
| [head](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/head#id_59ebb3d9_7e57_4ad1_8457_3c04ef2acbe4__head) | Centralized streaming. |
| [highlight](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/highlight#b05e9cef_8a91_4a8b_999d_f8246f1bd066__highlight) | Distributable streaming. |
| [iconify](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/iconify#id_4e818905_feeb_4853_8424_5f125d9d2d12__iconify) | Distributable streaming. |
| [iplocation](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/iplocation#id_4c1ae8b1_28de_453b_8d46_fbc07b9ea651__iplocation) | Distributable streaming. |
| [join](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/join#fcfc175c_cd72_43e5_8740_b9888e4c8b09__join) | Centralized streaming, if there is a defined set of fields to join to. A [dataset processing](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#id_2e9101fb_8b20_4e1d_b1e6_75c4ccc48589__Dataset_processing_commands) command when no `field-list` is specified. |
| [lookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/lookup#id_91c652d9_b562_4882_82b6_fc3ad08c88cc__lookup) | Distributable streaming when specified with `local=false`, which is the default. An [orchestrating](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#f9767084_a3f5_4a6d_b5d9_4945edb1e173__Orchestrating_commands) command when `local=true`. |
| [makemv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/makemv#fe8c2a8f_f15f_4663_b420_fd9634997d7d__makemv) | Distributable streaming. |
| [multikv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/multikv#id_884ea83c_6e95_402c_9660_7dd838a23567__multikv) | Distributable streaming. |
| [mvexpand](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mvexpand#abbcfd3b_7a2a_40a1_a15f_29efd5660135__mvexpand) | Distributable streaming. |
| [nomv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/nomv#id_1dee24ff_0981_4e80_aed2_0454856f4050__nomv) | Distributable streaming. |
| [rangemap](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rangemap#f4d5a1b2_51c4_4614_b3fa_a1e37da8fb2a__rangemap) | Distributable streaming. |
| [regex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/regex#id_1e8bb767_f5bf_4585_aa2d_da477342a282__regex) | Distributable streaming. |
| [reltime](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/reltime#id_9568473c_3c56_4f66_9ff6_99011b05c159__reltime) | Distributable streaming. |
| [rename](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rename#dc72aa4f_a698_4dda_8d71_c3974cdad2ef__rename) | Distributable streaming. |
| [replace](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/replace#id_4c55899c_d73d_446c_95ef_55aa4475910f__replace) | Distributable streaming. |
| [rex](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rex#id_19aef9bf_6cc6_4d87_b3f5_a4201ef5e102__rex) | Distributable streaming. |
| [search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search) | Distributable streaming if used further down the search pipeline. A [generating](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#b050774d_9272_4319_97e4_4ab16ca6851b__Generating_commands) command when it is the first command in the search. |
| [spath](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/spath#id_40c921da_4070_4be3_bc9e_8746d67ab14a__spath) | Distributable streaming. |
| [strcat](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/strcat#id_2a0ed758_290e_4723_8fd9_16933be3b4ef__strcat) | Distributable streaming. |
| [streamstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/streamstats#a22cb219_4252_47d8_9045_2df835669c52__streamstats) | Centralized streaming. |
| [tags](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tags#id_4fa38a34_6d86_441b_a7bc_60cbe3e3dbdc__tags) | Distributable streaming. |
| [transaction](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/transaction#ae5d299a_e9cf_4987_b6bc_6d0b434625b4__transaction) | Centralized streaming. |
| [typer](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/typer#id_972a3406_8aaf_461b_844a_2076dd3272a0__typer) | Distributable streaming. |
| [where](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/where#id_1ba3aadd_6e9f_42de_b388_3deb298f4b35__where) | Distributable streaming. |
| [untable](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/untable#id_4aa7ac19_50dc_4bdd_88b4_c57a4a3a5a53__untable) | Distributable streaming. |
| [xmlkv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xmlkv#id_31f64880_4504_4301_a5ba_e4793d8560ad__xmlkv) | Distributable streaming. |
| [xmlunescape](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xmlunescape#id_81048830_4d1a_4940_be90_9e310d89aa85__xmlunescape) | Distributable streaming by default, but centralized streaming if the `local` setting specified for the command in the commands.conf file is set to true. |
| [xpath](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xpath#id_4288b926_a1d3_4530_94ce_39d508745f49__xpath) | Distributable streaming. |
| [xyseries](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xyseries#id_9b3ac010_049b_4de2_a9d7_f85952c7efb3__xyseries) | Distributable streaming if the argument `grouped=false` is specified, which is the default. Otherwise a [transforming](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#id_6523974f_d5aa_4270_9bd3_ca7585b8c1e3__Transforming_commands) command. |

## Generating commands

A [generating command](https://docs.splunk.com/Splexicon:Generatingcommand) either returns information or generates results. Some generating commands can return information from an index, a data model, a lookup, or a CSV file without any transformations to the information. Other generating commands generate results, usually for testing purposes.

| Command | Notes |
| --- | --- |
| [datamodel](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/datamodel#d2eb5c91_ef93_4802_a3f4_719461ee09cd__datamodel) | Report-generating |
| [dbinspect](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/dbinspect#id_65645b52_c80f_4b2a_80c8_e61f90cca410__dbinspect) | Report-generating. |
| [eventcount](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eventcount#id_730ee4a7_b778_4481_a3c2_5dc6fc8e5c41__eventcount) | Report-generating. |
| [from](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/from#id_79a0c94a_2a1d_45f9_8365_0998f34fd75c__from) | Can be either report-generating or event-generating depending on the search or knowledge object that is referenced by the command. |
| [gentimes](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/gentimes#id_781f5cf5_e839_4232_b212_7d8ee644214a__gentimes) | Event-generating. |
| [inputcsv](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/inputcsv#id_452fa3a9_a932_4597_a452_aec4c5be1d3e__inputcsv) | Event-generating (centralized). |
| [Inputlookup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/inputlookup#d34e0d7d_f9ab_409b_9722_45400f8f891a__inputlookup) | Event-generating (centralized) when `append=false`, which is the default. |
| [loadjob](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/loadjob#id_48bd2478_e16c_4443_b3f1_ad353a9cee21__loadjob) | Event-generating (centralized). |
| [makeresults](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/makeresults#ddcd3bee_0938_4097_8a43_4f6bf0ea9aa2__makeresults) | Report-generating. |
| [metadata](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/metadata#id_1a637ad2_e479_4f6a_9ca1_c880f7d9b4c3__metadata) | Report-generating. Although metadata fetches data from all peers, any command run after it runs only on the search head. |
| [metasearch](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/metasearch#d7586015_186d_4434_a7b3_14a0949cc96d__metasearch) | Event-generating. |
| [mstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mstats#id_95f74b4f_687e_4616_9f0b_94a25dade6f9__mstats) | Report-generating, except when `append=true` is specified. |
| [multisearch](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/multisearch#id_1ab455e8_9d5b_4659_bdb5_c83bd133dc1b__multisearch) | Event-generating. |
| [pivot](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/pivot#b81328af_56c1_4628_ab25_58ad01fb3c63__pivot) | Report-generating. |
| [rest](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rest#id_7d0abf7b_52f8_47cb_bfc9_0f4954264650__rest) |  |
| [search](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/search#id_66acb6aa_636b_41a4_9ec3_a6ecb403c00a__search) | Event-generating (distributable) when the first command in the search, which is the default. A [streaming](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#id_3cf75549_04ad_471d_9cc7_15a934ab16f6__Streaming_commands) (distributable) command if used later in the search pipeline. |
| [searchtxn](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/searchtxn#id_90905d9d_a24a_470d_9075_d09475234a84__searchtxn) | Event-generating. |
| [set](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/set#id_653646ef_cdac_43a6_a15e_06f61dcfbdd9__set) | Event-generating. |
| [tstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tstats#e6057acd_1ed5_49ec_9881_ecdd6240a953__tstats) | Report-generating (distributable), except when `prestats=true`. When `prestats=true`, the `tstats` command is event-generating. |
| [typeaheadNo Content found for http://docs.splunk.com/Documentation/Splunk/10.0.0/SearchReference/Typeahead](http://docs.splunk.com/Documentation/Splunk/10.0.0/SearchReference/Typeahead) | Event-generating. |
| [walklexNo Content found for http://docs.splunk.com/Documentation/Splunk/10.0.0/SearchReference/Walklex](http://docs.splunk.com/Documentation/Splunk/10.0.0/SearchReference/Walklex) | Event-generating. |

## Transforming commands

A [transforming command](https://docs.splunk.com/Splexicon:Transformingcommand) orders the results into a data table. The command "transforms" the specified cell values for each event into numerical values for statistical purposes.

Note: In earlier versions of Splunk software, transforming commands were called reporting commands.

| Command | Notes |
| --- | --- |
| [addtotals](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/addtotals#e6382db2_bfaa_47e2_b54f_ef0636acbb77__addtotals) | Transforming when used to calculate column totals (not row totals). A distributable [streaming](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#id_3cf75549_04ad_471d_9cc7_15a934ab16f6__Streaming_commands) command when used to calculate row totals, which is the default. |
| [anomalydetection](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/anomalydetection#fb3f65df_158c_4835_beaf_3af5228a53df__anomalydetection) |  |
| [append](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/append#cd346e5d_e4be_4982_80a8_c52fecffaf65__append) |  |
| [associate](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/associate#id_3184e4a3_432e_47f4_a2bd_78f7033fa49d__associate) |  |
| [chart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/chart#id_19296c80_c832_4d74_8fd8_6de56666fc47__chart) |  |
| [cofilter](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/cofilter#b8c8e72b_6f85_4d3f_a7c8_8d3a67403e8f__cofilter) |  |
| [contingency](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/contingency#id_3e730821_f0bc_436b_a8f4_6a86ad9e9711__contingency) |  |
| [history](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/history#id_1cbcda36_b229_43b3_a5bc_23d1587c3ba4__history) |  |
| [makecontinuous](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/makecontinuous#cb2ddf16_e86f_4628_9b6c_0e8f9ad875c0__makecontinuous) |  |
| [mvcombine](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/mvcombine#id_8805ef66_c6da_4ab1_bfaa_d1e6a903a04e__mvcombine) |  |
| [rare](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/rare#id_34e62677_1b02_434d_b298_c0c1e25c3eb3__rare) |  |
| [stats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/stats#id_745bddf1_5557_4544_9052_deb0d70144ab__stats) |  |
| [table](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/table#a4df0a30_3b45_471a_ab81_c60b7477dfad__table) |  |
| [timechart](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/timechart#id_0f84007b_d6fd_455f_92c5_40bac9b52523__timechart) |  |
| [top](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/top#id_5d59fd51_ff0d_415f_adb1_cd3c78a8fcb1__top) |  |
| [xyseries](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/xyseries#id_9b3ac010_049b_4de2_a9d7_f85952c7efb3__xyseries) | Transforming if `grouped=true`. A [streaming](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#id_3cf75549_04ad_471d_9cc7_15a934ab16f6__Streaming_commands) (distributable) command when `grouped=false`, which is the default setting. |

## Orchestrating commands

[Orchestrating commands](https://docs.splunk.com/Splexicon:Orchestratingcommand) control some aspect of how a search is processed. They do not directly affect the final result set of the search. For example, you might apply an orchestrating command to a search to enable or disable a search optimization that helps the overall search complete faster.

| Command | Notes |
| --- | --- |
| [localop](/en/?resourceId=Splunk_SearchReference_Localop) |  |
| [lookup](/en/?resourceId=Splunk_SearchReference_Lookup) | Only becomes an orchestrating command when `local=true`. This forces the `lookup` command to run on the search head and not on any remote peers. A [streaming](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#id_3cf75549_04ad_471d_9cc7_15a934ab16f6__Streaming_commands) (distributable) command when `local=false`, which is the default setting. |
| [noop](/en/?resourceId=Splunk_SearchReference_Noop) |  |
| [redistribute](/en/?resourceId=Splunk_SearchReference_Redistribute) |  |
| [require](/en/?resourceId=Splunk_SearchReference_Require) |  |

## Dataset processing commands

A [dataset processing command](https://docs.splunk.com/Splexicon:Datasetprocessingcommand) is a command that requires the entire dataset before the command can run. Some of these commands fit into other command types in specific situations or when specific arguments are used.

| Command | Notes |
| --- | --- |
| [anomalousvalue](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/anomalousvalue#adf8d264_6647_4cfc_a5eb_3363bb55a0a7__anomalousvalue) | Some modes |
| [anomalydetection](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/anomalydetection#fb3f65df_158c_4835_beaf_3af5228a53df__anomalydetection) | Some modes |
| [append](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/append#cd346e5d_e4be_4982_80a8_c52fecffaf65__append) | Some modes |
| [appendcols](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/appendcols#id_40e2fdd2_c8c8_4059_b826_db6a95005a6a__appendcols) |  |
| [appendpipe](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/appendpipe#id_27cc9b5b_605f_40f2_af8e_d66a193a79a5__appendpipe) |  |
| [bin](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/bin#e2089f64_d93c_4ca8_a05f_c1c9eb1c0179__bin) | Some modes. A [streaming](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#id_3cf75549_04ad_471d_9cc7_15a934ab16f6__Streaming_commands) command if the `span` argument is specified. |
| [cluster](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/cluster#f12261ed_44f0_4d76_9e81_783f4f78e328__cluster) | Some modes |
| [concurrency](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/concurrency#id_7e2ba335_2e05_4f28_b4f8_a5a599f53f9a__concurrency) |  |
| [datamodel](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/datamodel#d2eb5c91_ef93_4802_a3f4_719461ee09cd__datamodel) |  |
| [dedup](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/dedup#cc343630_62b6_453c_a08d_39c99aa852df__dedup) | Using the `sortby` argument or specifying `keepevents=true` makes the `dedup` command a dataset processing command. Otherwise, `dedup` is a distributable streaming command in a prededup phase. Centralized streaming after the individual indexers perform their own dedup and the results are returned to the search head from each indexer. |
| [eventstats](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/eventstats#d50b254f_0c46_4fb9_8fed_a8a94363a53c__eventstats) |  |
| [fieldsummary](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fieldsummary#id_547f6d7b_7d62_461a_8c1b_22155611adc9__fieldsummary) |  |
| [fillnull](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/fillnull#ea500f11_dc13_4c3b_bb16_32e3345d99f7__fillnull) | When no `field-list` is specified, a dataset processing command. If a `field-list` is specified `fillnull` is a [distributable streaming](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#id_3cf75549_04ad_471d_9cc7_15a934ab16f6__Streaming_commands) command. |
| [from](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/from#id_79a0c94a_2a1d_45f9_8365_0998f34fd75c__from) | Some modes |
| [join](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/join#fcfc175c_cd72_43e5_8740_b9888e4c8b09__join) | Some modes. A [centralized streaming](/splunk-enterprise/search/spl-search-reference/10.0/quick-reference/command-types#id_3cf75549_04ad_471d_9cc7_15a934ab16f6__Streaming_commands) command when there is a defined set of fields to join to. |
| [map](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/map#id_05347ef5_9f31_49fa_a0c2_01558b2effb8__map) |  |
| [outlier](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/outlier#id_3e2dc81a_03fd_40f0_b0cb_a689011fe4a0__outlier) |  |
| [reverse](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/reverse#id_7c85ccb6_6bc2_4463_9b61_c1ca705f8d70__reverse) |  |
| [sort](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/sort#id_2a60b861_704d_4298_918f_274b501ec80d__sort) |  |
| [tail](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/tail#id_19606654_05b8_40f6_925a_f848b331f05b__tail) |  |
| [transaction](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/transaction#ae5d299a_e9cf_4987_b6bc_6d0b434625b4__transaction) | Some modes |
| [union](/splunk-enterprise/search/spl-search-reference/10.0/search-commands/union#id_6f6eb9e7_ad02_4d4c_b2fe_4bb02eb50a43__union) | Some modes |
