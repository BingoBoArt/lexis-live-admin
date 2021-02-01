import Vue from 'vue'
import Config from '@/common/config.js'

const COURSE_LAYOUT = Config.course_layout;

// v-layout:title="layout1-0" v-layout:image="layout1-0" v-layout:text="layout1-0" v-layout:flashcard="layout1-0"
// layout1-0 => COURSE_LAYOUT['layout1'].templates[0]
function handle(el, binding, vnode){
  el.style.display = 'none'
  const args = binding.value.split("-")
  const type = binding.arg; // title|image|text|flashcard
  const layout = args[0];
  const template = parseInt(args[1]);
  if(COURSE_LAYOUT[layout] && COURSE_LAYOUT[layout].templates[template] && COURSE_LAYOUT[layout].templates[template][type]){
    el.style.display = ''
  }
}
Vue.directive('layout', {
  update(...args) {
    handle(...args)
  },
  bind(...args) {
    handle(...args)
  }
})
