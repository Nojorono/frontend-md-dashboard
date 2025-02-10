<template>
  <base-material-card class="v-card--material-chart" v-bind="$attrs" v-on="$listeners">
    <template v-slot:heading>
      <chartist :data="chartData" :event-handlers="eventHandlers" :options="options" :ratio="ratio"
        :responsive-options="responsiveOptions" :type="type" class="chart-container" />
    </template>

    <slot slot="reveal-actions" name="reveal-actions" />

    <slot />

    <slot slot="actions" name="actions" />
  </base-material-card>
</template>

<script>
  export default {
    name: 'MaterialChartCard',

    inheritAttrs: false,

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
      eventHandlers: {
        type: Array,
        default: () => ([]),
      },
      options: {
        type: Object,
        default: () => ({
          donut: true,
          donutWidth: 60,
          startAngle: 0,
          total: 100,
          showLabel: true,
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
          labelInterpolationFnc: value => `${value}%`
        }),
      },
      ratio: {
        type: String,
        default: undefined,
      },
      responsiveOptions: {
        type: Array,
        default: () => ([]),
      },
      type: {
        type: String,
        required: true,
        validator: v => ['Bar', 'Line', 'Pie'].includes(v),
      },
    },

    computed: {
      chartData() {
        return {
          ...this.data,
          colors: this.data.colors
        }
      }
    },

    mounted() {
      console.log(this.data);
    }
  }
</script>

<style lang="sass">
  .v-card--material-chart
    transition: all 0.3s ease-in-out
    
    &:hover
      transform: translateY(-2px)
      box-shadow: 0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(0,0,0,.4)
    
    .chart-container
      max-height: 250px
      padding: 1rem
      transition: all 0.3s ease
      aspect-ratio: 1 / 1
      margin: 0 auto
      width: 100%
      display: flex
      justify-content: start
      align-items: start

    p
      color: #999
      margin: 0.5rem 0
      font-size: 0.95rem

  .ct-square
    display: flex

    .v-card--material__heading
      max-height: 185px
      padding: 1rem
      border-radius: 6px

      .ct-label
        color: inherit
        opacity: .8
        font-size: 1rem
        font-weight: 400
        text-shadow: 0 1px 2px rgba(0,0,0,.1)

      .ct-grid
        stroke: rgba(255, 255, 255, 0.3)
        stroke-dasharray: 2px
        stroke-width: 1px

      .ct-series-a
        .ct-point,
        .ct-line,
        .ct-bar,
        .ct-slice-donut
          stroke: rgba(255,255,255,.9)
          stroke-width: 2px
          transition: stroke-width 0.3s

        .ct-slice-pie,
        .ct-area
          fill: rgba(255,255,255,.6)
          transition: fill 0.3s

      .ct-chart-pie .ct-series
        .ct-slice-pie
          stroke: #fff
          stroke-width: 2px

      .ct-chart-donut .ct-series
        .ct-slice-donut
          stroke-width: 60px

      .ct-chart-pie, .ct-chart-donut
        .ct-label
          fill: #fff
          font-size: 1rem
          font-weight: 500
</style>
