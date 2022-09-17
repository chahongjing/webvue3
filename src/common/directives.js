import { createPopper } from '@popperjs/core';

var tooltip = null
function initDom() {
  if(!tooltip) {
    tooltip = document.querySelector('div.mytooltip')
    if(!tooltip) {
      tooltip = $('<div class="mytooltip" role="tooltip"><span></span><div class="arrow" data-popper-arrow></div></div>')[0]
      document.body.appendChild(tooltip)
    }
  }
}
initDom()

export default {
  focus: {
    // 当绑定元素插入到 DOM 中。

    mounted: function (el) {
      // 聚焦元素
      el.focus()
    }
    //也可以用update,update就是当页面有操作的时候就触发，比如点击按钮，输入框输入都算。
    //有一个要注意的就是，就是你页面有几个input,比如一个input绑定了v-focus,一个没有绑定。你在没绑定v-focus的input输入时，绑定了v-focus的input就是自动获取焦点，这是个bug.
    //update: function (el) {
    //el.focus()
    //}
  },
  tooltip: {
    mounted: function (el, binding, vnode, oldNode) {
      setTooltip(el, binding, vnode);
    },
    updated: function (el, binding, vnode, oldNode) {
      setTooltip(el, binding, vnode);
    }
  },
  authcode: {
    mounted: function (el, binding, vnode, oldNode) {
      handlePermission(el, binding);
    },
    updated: function (el, binding, vnode, oldNode) {
      handlePermission(el, binding);
    }
  },
  mytest: {
    mounted: function (el, binding, vnode, oldNode) {
      // console.log("1:" + JSON.stringify(binding));
    },
    updated: function (el, binding, vnode, oldNode) {
      // console.log("2:" + JSON.stringify(binding));
    }
  }
}

function setTooltip(el, binding, vnode) {
  // if (binding.oldValue === binding.value) return;
  var msg = binding.value;
  if (msg === null || msg === undefined) {
    msg = '';
  }
      // {placement: 'right'}
  var popperInstance = createPopper(el, tooltip,{modifiers: [{name: 'offset',options: {offset: [0, 6]}}]});
  // show(popperInstance, tooltip, '测试<span style="color:red;font-weight:bold;">tool</span>tip')
  el.addEventListener('mouseenter', () => show(popperInstance, tooltip, msg));
  el.addEventListener('focus', () => show(popperInstance, tooltip, msg));
  el.addEventListener('mouseleave', () => hide(popperInstance, tooltip));
  el.addEventListener('blur', () => hide(popperInstance, tooltip));
}

function handlePermission(el, binding) {
  var permissionList = binding.instance.getPermissionList();
  if(!permissionList || !permissionList.some(item => item == binding.value) && el.parentElement) {
   el.parentElement.removeChild(el)
  }
}

function show(popperInstance, tooltip, msg) {
  // Make the tooltip visible
  tooltip.getElementsByTagName('span')[0].innerHTML = msg
  tooltip.setAttribute('data-show', '');

  // Enable the event listeners
  popperInstance.setOptions((options) => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      { name: 'eventListeners', enabled: true },
    ],
  }));

  // Update its position
  popperInstance.update();
}

function hide(popperInstance, tooltip) {
  // Hide the tooltip
  tooltip.removeAttribute('data-show');

  // Disable the event listeners
  popperInstance.setOptions((options) => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      { name: 'eventListeners', enabled: false },
    ],
  }));
}