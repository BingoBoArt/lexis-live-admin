<template>
    <div>
        <breadcrumb></breadcrumb>
        <router-link to="/dashboard/Library/Question/AddQuestion" class="add top-btn">
          <el-button type="success" icon="el-icon-plus">新增Question</el-button>
        </router-link>
        <div class="content-main">
          <div class="filter-box clearfix">
            <el-form :inline="true" :model="filterForm" class="demo-form-inline">
              <LessonFilter v-model="filter" :needKeyword="false">
                <el-button type="primary" @click="onSubmitFilter" icon="el-icon-search">查询</el-button>
              </LessonFilter>
              <!--
              <el-form-item label="question类型" class="left" style="width:580px">
                <el-radio-group v-model="question.questionType">
                    <el-radio-button v-for="(radio, index) in questionTypeList" :key="index" :label="radio.type">{{radio.typeName}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              -->
            </el-form>
          </div>
           <!-- 图片列表 -->

          <div class="content-list main form-table-box">

               <CommonTable :dataObject="questionObject">
                  <el-table-column label="options">
                      <template slot-scope="scope">
                        <span style="display: none">{{answers = (scope.row.question.map((item) => {return `#${item.answer}#`}).join(""))}}</span>
                        <ul class="option-list">
                          <li v-for="(item, index) in scope.row.option" :key="index" :class="{'right-answer': answers.indexOf(`${item.item}#`) > -1}">
                            <span v-if="item.text">{{item.item}}. {{item.text}}</span>
                            <span class="img-wrapper" v-if="item.img">
                              <img :src="item.img.content">
                            </span>
                          </li>
                        </ul>
                      </template>
                  </el-table-column>

                  <el-table-column label="Action" width="120">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDateTow(scope.row)">Edit</el-button>
                    </template>
                  </el-table-column>
               </CommonTable>

          </div>
        </div>
    </div>
</template>
<script>
import LessonFilter from '@/components/Coms/LessonFilter'
import CommonTable from '@/components/Coms/CommonTable'
import Breadcrumb from '@/components/Common/Breadcrumb'
export default {
    components: {
        LessonFilter,
        CommonTable,
        Breadcrumb
    },
    created () {
      // console.log("12345678765432")
      // console.log(this.questionObject)
    },
    data () {
        return {
            filter: {},
            question: {},
            questionObject: {
                dataKey: 'questionList', // data对应的key
                idKey: 'quesId', // id对应的key
                searchUrl: 'question/getQuestionList', // 查询接口地址
                // editUrl: '/dashboard/Library/Question/AddQuestion', // 编辑跳转地址
                // deleteUrl: 'question/deleteQuestion', // 删除接口地址
                searchParam: {}, // 查询参数
                columns: [ // 表格显示字段
                    {
                        prop: 'quesId',
                        width: '100',
                        label: 'ID'
                    },
                    {
                        prop: 'unitNameCh',
                        label: 'Unit',
                        width: '140',
                    },
                    {
                        prop: 'lessonTitleCh',
                        label: 'Lesson',
                        width: '140',
                    },
                    /*
                    {
                        prop: 'type',
                        label: 'Type',
                        width: '120',
                    },
                    */
                    {
                        prop: 'stem',
                        label: 'Question Text'
                    }
                ]
            },
            questionTypeList: [
                {
                    type: '1-1',
                    typeName: 'Text only'
                },
                {
                    type: '1-2',
                    typeName: 'Image + Text'
                },
                {
                    type: '1-3',
                    typeName: 'Text'
                },
                {
                    type: '1-4',
                    typeName: 'Audio'
                },
                {
                    type: '1-5',
                    typeName: 'video'
                }
            ],
            questionType: '1-1'
        }
    },
    methods: {
        onSubmitFilter() {
          // this.page.page = 1;
          this.query();
        },
        editDateTow (row) {
            // console.log(6766767)
            // console.log(row.quesId)
            // 页面跳转
            this.$router.push({ path: "/dashboard/Library/Question/AddQuestion", query: { quesId: row.quesId } })
            // this.$router.push({ name: 'Example/Add', query: { id: row.id } })
        },
        query () {
            let data = {
                ...this.filter,
                questionType: this.question.questionType // 问题模板
            }
            this.questionObject.searchParam = data
        }
    }
}
</script>

<style scoped>
 .option-list{
    li{
      float: left;
      margin: 0 10px;
      .img-wrapper{
        width: 50px;
        height: 50px;
        display: inline-block;
        img{
          width: 100%;
          height: 100%;
        }
      }

      &.right-answer{
          .img-wrapper{
            position: relative;
            display: inline-block;
            &:after{
              content: '✓';
              color: white;
              font-size: 30px;
              position: absolute;
              top: 10px;
              right: 10px;
            }
            &:before{
              content: ' ';
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              background: rgba(0, 0, 0, 0.3);
            }
          }
          span{
            color: green;
            &:after{
              content: '✓';
              font-size: 14px;
            }
          }
      }
    }
  }
</style>