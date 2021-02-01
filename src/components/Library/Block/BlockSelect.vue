<template>
    <div :gutter="2" class="row-bg">
        {{currentValue}}{{selectComp}}
        <el-col :span="4">
            <div class="se-level">
                <el-select v-model="selectObject.level" :disabled="dontmove" placeholder="选择level" clearable>
                    <el-option v-for="(item, index) in selectItems" :key="index" :label="'level' + item.level" :value="item.level">
                    </el-option>
                </el-select>
            </div>
        </el-col>
        <el-col :span="4" v-if="selectObject.deep>=2">
            <div class="se-type">
                <el-select v-model='selectObject.unitId' :disabled="dontmove" placeholder="请选择Unit" clearable>
                    <el-option v-for="(item, index) in selectUnits" :key="index" :label="item.nameEn" :value="item.unitId">
                    </el-option>
                </el-select>
            </div>
        </el-col>
        <el-col :span="4">
            <div class="se-unit" v-if="selectObject.deep>=3">
                <el-select v-model='selectObject.blockNo' :disabled="dontmove" placeholder="请选择block" clearable>
                    <el-option v-for="(item, index) in selectBlocks" :key="index" :label="'block:'+item.blockNoName" :value="item.blockNo">
                    </el-option>
                </el-select>
            </div>
        </el-col>
    </div>
</template>
<script>
import Request from '@/common/request.js'
export default {
    data () {
        return {
            dontmove: false,
            selectObject: {},
            selectUnits: [],
            selectItems: [],
            selectBlocks: []
        }
    },
    props: {
        value: {
            type: Object
        },
    },
    created () {
        // console.log(this.$route.name)
        // console.log(this.$route.query)
        if((this.$route.name == 'LessonAdd' && this.$route.query.lessonId) || (this.$route.name == 'Add' && this.$route.query.blockNo)) {
            this.dontmove = true
        }
        this.getSelectInfo()
    },
    computed: {
        currentValue: {
            // 动态计算currentValue的值
            get: function () {
                this.selectObject = this.value;
            },
            set: function () {
                this.$emit('input', this.selectObject);
            }
        },
        selectComp: function() {
            if(this.selectObject.level){
                this.levelChange(this.selectObject.level)
            }
            if(this.selectObject.unitId){
                this.unitChange(this.selectObject.unitId)
            }
        }
    },
    methods: {
        getSelectInfo () {
            Request({
                url: '/lesson/getLevelList',
                data: { deep: this.selectObject.deep }
            }).then((res) => {
                this.selectItems = res.data;
            }).catch(() => {
                // 错误处理
            }).always(() => {
                // this.save_loading = false;
            })
        },
        levelChange (level) {
            if (level) {
                Request({
                    url: 'lesson/getUnitListByLevel',
                    data: { level: level },
                    type: 'post'
                }).then(res => {
                    this.selectUnits = res.data;
                })
            }
        },
        unitChange (unitId) {
            if (unitId) {
                if (this.selectObject.deep >= 3 && this.selectObject.level != null) {
                    Request({
                        type: 'post',
                        url: 'lesson/getBlockListByUnitId',
                        data: { level: this.selectObject.level, unitId: unitId }
                    }).then(res => {
                        this.selectBlocks = res.data;
                    })
                }
            }
        }
    }
}
</script>

