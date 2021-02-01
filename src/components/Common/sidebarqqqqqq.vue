<template>
    

        <el-submenu index="course">
            <template slot="title">
                <i class="icon iconfont icon-yishitubiaoshuchu-"></i>
                <span>课件管理</span>
            </template>
            <el-menu-item index="/dashboard/Course/List">
                <i class="icon iconfont icon-circle"></i>
                <span>课件列表</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/Course/Edit">
                <i class="icon iconfont icon-circle"></i>
                <span>添加课件</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/Course/Publish">
                <i class="icon iconfont icon-circle"></i>
                <span>课件上架</span>
            </el-menu-item>
        </el-submenu>
        <el-submenu index="Resource">
            <template slot="title">
                <i class="icon iconfont icon-resource"></i>
                <span>资源</span>
            </template>
            <el-menu-item index="/dashboard/Resource/Image">
                <i class="icon iconfont icon-circle"></i>
                <span>图片</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/Resource/Audio">
                <i class="icon iconfont icon-circle"></i>
                <span>音频</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/Resource/Video">
                <i class="icon iconfont icon-circle"></i>
                <span>视频</span>
            </el-menu-item>
        </el-submenu>
        <el-submenu index="library">
            <template slot="title">
                <i class="icon iconfont icon-library"></i>
                <span>Library</span>
            </template>
            <el-submenu index="library/Unit">
                <template slot="title">
                    <i class="icon iconfont icon-library"></i>
                    <span>Unit</span>
                </template>
                <el-menu-item index="/dashboard/library/Unit/List">
                    <template slot="title">
                        <i class="icon iconfont icon-circle"></i>
                        <span>Unit列表</span>
                    </template>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="library/Block">
                <template slot="title">
                    <i class="icon iconfont icon-library"></i>
                    <span>Block</span>
                </template>
                <el-menu-item index="/dashboard/library/Block/List">
                    <template slot="title">
                        <i class="icon iconfont icon-circle"></i>
                        <span>Block管理</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/dashboard/library/Block/LessonList">
                    <template slot="title">
                        <i class="icon iconfont icon-circle"></i>
                        <span>BlockLesson管理</span>
                    </template>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="library/Config">
                <template slot="title">
                    <i class="icon iconfont icon-library"></i>
                    <span>Config</span>
                </template>
                <el-menu-item index="/dashboard/library/Config/List">
                    <template slot="title">
                        <i class="icon iconfont icon-circle"></i>
                        <span>Config列表</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/dashboard/library/Config/Add">
                    <template slot="title">
                        <i class="icon iconfont icon-circle"></i>
                        <span>Config管理</span>
                    </template>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="library/Banner">
                <template slot="title">
                    <i class="icon iconfont icon-library"></i>
                    <span>New Banner</span>
                </template>
                <el-menu-item index="/dashboard/library/Banner/List">
                    <template slot="title">
                        <i class="icon iconfont icon-circle"></i>
                        <span>Banner列表</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/dashboard/library/Banner/AddBanner">
                    <template slot="title">
                        <i class="icon iconfont icon-circle"></i>
                        <span>Banner新增</span>
                    </template>
                </el-menu-item>
            </el-submenu>
            <el-menu-item index="/dashboard/library/gameRes">
                <template slot="title">
                    <i class="icon iconfont icon-circle"></i>
                    <span>游戏管理</span>
                </template>
                </el-menu-item>
            <el-menu-item index="/dashboard/Library/Flashcards/List">
                <template slot="title">
                    <i class="icon iconfont icon-circle"></i>
                    <span>Flashcard管理</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/dashboard/Library/Question/List">
                <template slot="title">
                    <i class="icon iconfont icon-circle"></i>
                    <span>Question管理</span>
                </template>
            </el-menu-item>
            <!--
            <el-submenu index="library/flashcard">
            <template slot="title">
            <i class="icon iconfont icon-circle"></i>
            <span>Flashcard</span>
            </template>
            <el-menu-item index="/dashboard/library/flashcard/flashcardlist">
            <i class="icon iconfont icon-circle"></i>
            <span>Flashcard列表</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/library/flashcard/flashcardCreateEditPage">
            <i class="icon iconfont icon-circle"></i>
            <span>Flashcard管理</span>
            </el-menu-item>
            </el-submenu>
            <el-submenu index="library/question">
            <template slot="title">
            <i class="icon iconfont icon-circle"></i>
            <span>Question</span>
            </template>
            <el-menu-item index="/dashboard/library/question/List">
            <i class="icon iconfont icon-circle"></i>
            <span>Question List</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/library/question/Add">
            <i class="icon iconfont icon-circle"></i>
            <span>Question Manage</span>
            </el-menu-item>
            </el-submenu>
            -->
        </el-submenu>
        <el-submenu index="OrderLive">
            <template slot="title">
                <i class="icon iconfont icon-order"></i>
                <span>约课</span>
            </template>
            <el-menu-item index="/dashboard/orderLive/List">
                <i class="icon iconfont icon-circle"></i>
                <span>约课列表</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/OrderLive/AddLive">
                <i class="icon iconfont icon-circle"></i>
                <span>创建约课</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/OrderLive/CurriculumAdd">
                <i class="icon iconfont icon-circle"></i>
                <span>新增时序</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/OrderLive/CurriculumList">
                <i class="icon iconfont icon-circle"></i>
                <span>时序列表</span>
            </el-menu-item>
        </el-submenu>



        <el-submenu index="Live">
            <template slot="title">
                <i class="icon iconfont icon-resource"></i>
                <span>录播</span>
            </template>
            <el-menu-item index="/dashboard/Record/Table">
                <i class="icon iconfont icon-circle"></i>
                <span>录播课表</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/Record/Select">
                <i class="icon iconfont icon-circle"></i>
                <span>选择录播课表</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/Record/Selected">
                <i class="icon iconfont icon-circle"></i>
                <span>已选的录播课表</span>
            </el-menu-item>
        </el-submenu>

        
        <!-- <el-submenu index="cdn">
        <template slot="title">
        <i class="icon iconfont icon-order"></i>
        <span>教师管理</span>
        </template>
        <el-menu-item index="/dashboard/Teacher/List">
        <i class="icon iconfont icon-circle"></i>
        <span>教师列表</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/Teacher/Add">
        <i class="icon iconfont icon-circle"></i>
        <span>教师编辑</span>
        </el-menu-item>
        </el-submenu> -->
        <el-submenu index="monitor">
            <template slot="title">
                <i class="icon iconfont icon-resource"></i>
                <span>Monitor</span>
            </template>
            <el-menu-item index="/dashboard/monitor/liveInfoList">
                <i class="icon iconfont icon-circle"></i>
                <span>当天直播列表</span>
            </el-menu-item>
            <!-- <el-menu-item index="/dashboard/monitor/teachLogList">
            <i class="icon iconfont icon-circle"></i>
            <span>执教日志</span>
            </el-menu-item> -->
            <el-menu-item index="/dashboard/monitor/teachLogListV2">
                <i class="icon iconfont icon-circle"></i>
                <span>执教日志</span>
            </el-menu-item>
        </el-submenu>
        <el-submenu index="Teacher">
            <template slot="title">
                <i class="icon iconfont icon-order"></i>
                <span>教师管理</span>
            </template>
            <el-menu-item index="/dashboard/Teacher/List">
                <i class="icon iconfont icon-circle"></i>
                <span>教师列表</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/Teacher/Add">
                <i class="icon iconfont icon-circle"></i>
                <span>教师编辑</span>
            </el-menu-item>
        </el-submenu>
        <el-submenu index="Issue">
            <template slot="title">
                <i class="icon iconfont icon-order"></i>
                <span>试卷管理</span>
            </template>
            <el-menu-item index="/dashboard/Issue/ExeGroupList">
                <i class="icon iconfont icon-circle"></i>
                <span>题组列表</span>
            </el-menu-item>
            <el-menu-item index="/dashboard/Issue/ExeIssueList">
                <i class="icon iconfont icon-circle"></i>
                <span>试卷列表</span>
            </el-menu-item>
        </el-submenu>
        <el-submenu index="School">
            <template slot="title">
                <i class="icon iconfont icon-order"></i>
                <span>校区管理</span>
            </template>
            <el-menu-item index="/dashboard/School/SchoolUserExcel">
                <i class="icon iconfont icon-circle"></i>
                <span>用户上传</span>
            </el-menu-item>
        </el-submenu>
        <!-- <el-submenu index="CDN">
        <template slot="title">
        <i class="icon iconfont icon-order"></i>
        <span>CDN</span>
        </template>
        <el-menu-item index="/dashboard/cdn/preheat">
        <i class="icon iconfont icon-circle"></i>
        <span>预热</span>
        </el-menu-item>
        </el-submenu> -->


</template>
