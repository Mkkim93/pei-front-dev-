<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import Chart from "chart.js/auto";

const chartCanvas = ref<HTMLCanvasElement | null>(null);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    default: "300",
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  chart: {
    type: Object as () => {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
      }[];
    },
    required: true,
  },
});

onMounted(async () => {
  await nextTick();

  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  const gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  const gradientStroke2 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  const existingChart = Chart.getChart(props.id);
  if (existingChart) {
    existingChart.destroy();
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels: props.chart.labels,
      datasets: props.chart.datasets.map((dataset, index) => ({
        label: dataset.label,
        tension: 0.4,
        pointRadius: 0,
        borderColor: index === 0 ? "#4BB543" : "#3A416F",
        backgroundColor: index === 0 ? gradientStroke1 : gradientStroke2,
        borderWidth: 3,
        fill: true,
        data: dataset.data,
        maxBarThickness: 6,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
           
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
           
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#fbfbfb",
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            // drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            display: true,
            color: "#ccc",
            padding: 20,
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  });
});
</script>

<template>
  <div class="card z-index-2">
    <div class="pb-0 card-header mb-0">
      <h6>{{ props.title }}</h6>
      <p v-if="props.description" class="text-sm" v-html="props.description" />
    </div>
    <div class="p-3 card-body">
      <div class="chart">
        <canvas
          ref="chartCanvas"
          :id="props.id"
          class="chart-canvas"
          :height="props.height"
        />
      </div>
    </div>
  </div>
</template>
