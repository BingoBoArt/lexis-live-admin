<template>
    <div class="my-content-nav">
        <div class="content-nav-level">
            <el-select @change="updateSelect(1)" v-model="level"  clearable placeholder="请选择等级">
                <el-option v-for="item in levels" :key="item.level" :label="'Level'+item.level" :value="item.level">
                </el-option>
            </el-select>
        </div>
        <div class="content-nav-source">
            <el-select @change="updateSelect(1)" v-model="lessonType" ref="lessonType" clearable placeholder="请选择课程类型">
                <el-option v-for="item in lessonTypes" :key="item.lessonType" :label="item.lessonTypeEn" :value="item.lessonType">
                </el-option>
            </el-select>
        </div>
<!-- 新添加的筛选条件 -->
        <div>
            <el-select v-model="selec" @change="updateSelect(1)" clearable placeholder="请选择新的条件">
                <el-option v-for="(item,index) in option" :key="index" :label="item.item" :value="item.item">
                </el-option>
            </el-select>
        </div>
<!-- 新添加的筛选条件 -->
        <div class="search-wrap">
            <el-input @change="updateSelect" v-model="keyVal" placeholder="请输入内容"></el-input>
        </div>
        <slot></slot>
    </div>
</template>
<script>
import Request from "@/common/request.js"
export default {
    props: {
        value: {
        },
        selectItem: {
            type: Object,
            requried: true
        },
        release: {
            type: String,
            requried: false
        },
        lesson: {
            type: Boolean,
            requried: false,
            default: true
        }
    },
    data () {
        return {
            selec: '',
            option: [
                { item: "A", text: "ha"},
                { item: "B", text: "na"}
            ],
            dialogVisible: false,
            keyVal: '',
            level: '',
            lessonType: '',
            unit: '',
            lessonNo: '',
            levelData: '',
            lessonsData: '',
            levels: '',
            lessonTypes: '',
            units: '',
            lessons: '',
            notNull: true,
            selectItemVal: this.selectItem
        }
    },
    computed: {
        currentValue: {
            // 动态计算currentValue的值
            get: function() {
                return this.value;
            },
            set: function(val) {
                this.$emit('update', val);
            }
        }
    },
    components: {
    },
    mounted () {
        this.getLevelList();
        this.getLessonTypeList();
    },
    methods: {
        closeDialog (val) {
            // this.dialogVisible = false
            // // 不能使用对象直接赋值，会造成循环。
            // this.selectItemVal.level = val.level
            // this.selectItemVal.lessonType = val.lessonType
            // this.selectItemVal.unitId = val.unitId
            // this.selectItemVal.lessonNo = val.lessonNo
            // this.$emit('lesson-finsh', true)
        },
        // 获取 所有等级
        getLevelList () {
            this.loading = true
            let self = this
            Request({
                type: 'get',
                url: '/lesson/getLevelList'
            }).then((res) => {
                self.levels = res.data;
                this.getLessonTypeList;
            }).catch(() => {
                // 错误处理
            }).always(() => {
                self.loading = false;
            });
        },
        // 获取 所有课程类型
        getLessonTypeList () {
            this.loading = true
            let self = this
            Request({
                type: 'get',
                url: '/lesson/getLessonTypeList'
            }).then((res) => {
                self.lessonTypes = res.data
            }).catch(() => {
            }).always(() => {
                self.loading = false;
            });
        },
        // 获取所有课件
        async getLessonList () {
            this.loading = true
            let self = this
            let url = ''

            if (this.release != null && this.release == 2) {
                url = '/lesson/getLessonReleaseList'
            } else {
                url = '/lesson/getLessonList'
            }
            await Request({
                    type: 'get',
                    url: url,
                    data: this.selectItemVal
                }).then((res) => {
                    self.lessons = res.data
                }).catch(() => {
                    // 错误处理
                }).always(() => {
                    self.loading = false;
                });
        },
        /* 更新数据 */
        updateSelect (key) {
            var self = this;
            this.currentValue = {
                selec: self.selec,
                level: self.level,
                lessonType: self.lessonType,
                keyword: self.keyVal
            }
            if(key == 1){
                this.$emit('search');
            }
        }
    }
}
</script>
<style scoped>
.el-select {
  margin-right: 10px;
}
.my-content-nav {
  display: inline-flex;
  width: 100%;
  height: 40px;
  margin: 0 0 20px 0;
  display: -ms-flexbox;
}
.my-content-nav-lesson {
  float: right;
}
.search-wrap{
    width: 194px;
    margin-right: 10px;
}
.search-btn{
    float: right;
}
</style>
