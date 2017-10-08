import Vue from 'vue'

Vue.component('light-bulb', {
  template: `
  <div class='light-bulb' >
  <p> Eureka! </p>
  </div>
  `
})

//mixin --use $options
var superPowersMixin = {
  data() {
    return {
      superPowers: false
    }
  },
  methods: {
    superMe() {
      this.$el.classList.add("super")
      this.superPowers = true
    }
  },
  created() {
    this.$options.template =
      `<div><h3 v-show="superPowers">super</h3>` +
      this.$options.template +
      `<button @click="superMe" v-if="!superPowers">
    Super!
    </button></div>`
  }
}
Vue.component('man', {
  template: '<p> 👨man</p>',
  mixins: [superPowersMixin]
})

Vue.component('cat', {
  mixins: [superPowersMixin],
  template: '<p> 🐈cat</p>',

})
//mixin--serve as subclassing
var Greeter = {
  template: `
    <p>
    {{ message}}
    <button @click="greet">greet</button>
    </p>` ,
  data() {
    return {
      message: '...'
    }
  },
  methods: {
    greet() {
      this.message = 'hello'
    }
  }
}
var SuperGreeter = {
  mixins: [Greeter],
  template: `
    <p>
    {{ message}}
    <button @click="superGreet">SuperGreeter</button>
    </p>`,
  methods: {
    superGreet() {
      this.greet()
      this.message = this.message + ' super'
    }
  }
}


// named slot
Vue.component('organogram', {
  template: ` <div class="organogram">
                <h3>Scratchy co. </h3>
                <div class="boss">
                  <h3>Boss</h3>
                  <slot name="boss">No boss</slot>
                </div>
                <div class="employee">
                  <h3>Employee</h3>
                  <slot name="employee">No employee</slot>
                </div>
              </div>`
})

Vue.component('cat', {
  template: ` <div>
                <figure>
                  <img :src="'http://lorempixel.com/220/220/cats/?' + name"/>
                  <figcaption>{{name}} </figcaption>
                </figure>
              </div>` ,
  props: ['name']
})

//scope slot
Vue.component('organogramScopeSlot', {
  template: ` 
    <div class="organogram">
      <h3>Scratchy co. </h3>
      <div class="boss">
        <h3>Boss</h3>
        <slot type="boss">No boss</slot>
      </div>
      <div class="employee" v-for="rank in 2">
        <h3>Employee</h3>
        <slot 
          type="employee"
          :rank="rank">
          No employee
        </slot>
      </div>
    </div>`
})

//loading components asynchronously
Vue.component('XuandePeriodVase', (resolve, reject) => {
  setTimeout(() => {
    if ((new Date()).getDay() !== 6) {
      resolve({
        template: '<div> Buy for only 4000000</div>',
        mounted() {
          this.$parent.$emit('loaded')
        }
      })
    } else {
      reject("Today is Sunday, Internet is closed! ")
    }
  }, 1000)
})

//recursive component
/* If use local registration, a name is a must
var taxonTree = {
name: 'taxonTree' ,
template: `
<li>
. . .
*/
Vue.component('taxonTree', {
  template: `
      <li>
        <div @click="toggle">
          {{taxon}}
          <span v-if="hasChildren">[ {{ open ? '-' : '+' }} ] </span>
        </div>
        <ul v-show="open">
          <taxon-tree
            v-for="(child, taxon) in tree"
            :tree="child"
            :taxon="taxon"
            :key="taxon"
          >
          </taxon-tree>
        </ul>
      </li>
      `,
    props: {
      tree: Object,
      taxon: String
    },
    data () {
      return {
        open: false
      }
    },
    computed: {
      hasChildren () {
        return this.tree !== null
      }
    },
    methods: {
      toggle () {
        this.open = !this.open
      }
    }
})
new Vue({
  el: '#app',
  data: {
    names: ['Murzik', 'Pushok', 'Barsik', 'Vaska', 'Matroskin'],
    loading: true,

    living: {
      animals: {
        invertebrates: {
          crab: null,
          bee: null,
          ant: null
        },
        vertebrates: {
          fish: {
            shark: null
          },
          mammals: {
            rabbit: null,
            rat: null
          }
        }
      },
      plants: {
        flowering: {
          maize: null,
          paddy: null
        },
        'non-flowering': {
          algae: {
            seaweed: null,
            spirogyra: null
          },
          fungi: {
            yeast: null,
            mushroom: null
          },
          moss: null,
          fern: null
        }
      }
    }
  },
  created() {
    this.$on('loaded', () => {
      this.loading = false
    })
  },
  computed: {
    catName() { // can only be invoked once
      return this.names[Math.floor(Math.random() * this.names.length)]
    }
  },
  methods: {
    catName2() {
      return this.names[Math.floor(Math.random() * this.names.length)]
    }
  },
  components: { Greeter, SuperGreeter }
})
