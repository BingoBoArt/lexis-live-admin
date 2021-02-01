export default {
    'code': 0,
    "msg": "success",
    'data': {
        'gameResInfo': { //单个游戏资源
            key: [{
                value: 1,
                label: "id"
            }, {
                value: 2,
                label: "题目信息(title)"
            }, {
                value: 3,
                label: "答案一(choice1)"
            }, {
                value: 3,
                label: "答案二(choice2)"
            }, {
                value: 3,
                label: "答案三(choice3)"
            }, {
                value: 3,
                label: "答案四(choice3)"
            }, {
                value: 4,
                label: "分值"
            }, {
                value: 5,
                label: "操作"
            }],
            details: [{
                    id: 1,
                    title: "vikings",
                    score: 2,
                    answer: [{
                            img: "vikings",
                            right: 1
                        },
                        {
                            img: "homeland",
                            right: 0
                        },
                        {
                            img: "longship",
                            right: 0
                        },
                        {
                            img: "scandinavia",
                            right: 0
                        }
                    ]
                },
                {
                    id: 2,
                    title: "homeland",
                    score: 2,
                    answer: [{
                            img: "vikings",
                            right: 0
                        },
                        {
                            img: "homeland",
                            right: 1
                        },
                        {
                            img: "longship",
                            right: 0
                        },
                        {
                            img: "scandinavia",
                            right: 0
                        }
                    ]
                },
                {
                    id: 3,
                    title: "vikings",
                    score: 2,
                    answer: [{
                            img: "vikings",
                            right: 1
                        },
                        {
                            img: "homeland",
                            right: 0
                        },
                        {
                            img: "longship",
                            right: 0
                        },
                        {
                            img: "scandinavia",
                            right: 0
                        }
                    ]
                }
            ],
            questionTemplate: {
                id: '',
                title: "待编辑",
                score: 1,
                answer: [{
                        img: "待编辑",
                        right: 0
                    },
                    {
                        img: "待编辑",
                        right: 0
                    },
                    {
                        img: "待编辑",
                        right: 0
                    },
                    {
                        img: "待编辑",
                        right: 0
                    }
                ]
            },
            selectImg: ''
        },
        'allGameList': [{
                gameType: 'yesOrNo',
                gameId: 100001
            },
            {
                gameType: 'yesOrNo',
                gameId: 100002
            },
            {
                gameType: 'guess',
                gameId: 80001
            },
            {
                gameType: 'guess',
                gameId: 80002
            },
            {
                gameType: 'pickOut',
                gameId: 90001
            },
            {
                gameType: 'pickOut',
                gameId: 90002
            }
        ]
    }
}
