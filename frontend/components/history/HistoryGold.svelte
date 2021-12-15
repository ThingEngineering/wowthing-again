<script lang="ts">
    import {
        Chart,
        LineElement,
        PointElement,
        LineController,
        LinearScale,
        TimeScale,
        Filler,
        Legend,
        Title,
        Tooltip,
    } from 'chart.js'
    import 'chartjs-adapter-luxon'
    import { onMount } from 'svelte'

    import { colors } from '@/data/colors'
    import { staticStore, userHistoryStore } from '@/stores'
    import { historyState } from '@/stores/local-storage'
    import { Region } from '@/types/enums'
    import parseApiTime from '@/utils/parse-api-time'
    import type { HistoryState } from '@/stores/local-storage'
    import type { StaticDataRealm } from '@/types'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'

    Chart.register(
        LineElement,
        PointElement,
        LineController,
        LinearScale,
        TimeScale,
        Filler,
        Legend,
        Title,
        Tooltip,
    )

    let chart: Chart
    $: {
        if (document.getElementById('gold-chart')) {
            redrawChart($historyState)
        }
    }

    onMount(() => redrawChart($historyState))

    const redrawChart = function(historyState: HistoryState) {
        if (chart) {
            chart.destroy()
        }

        const data: { datasets: any[] } = {
            datasets: [],
        }

        const realms: [string, number][] = []
        for (const realmId in $userHistoryStore.data.gold) {
            const realm: StaticDataRealm = $staticStore.data.realms[realmId]
            realms.push([
                `[${Region[realm.region]}] ${realm.name}`,
                parseInt(realmId)
            ])
        }
        realms.sort()

        for (let realmIndex = 0; realmIndex < realms.length; realmIndex++) {
            const [realmName, realmId] = realms[realmIndex]
            data.datasets.push({
                backgroundColor: colors[realmIndex],
                borderColor: historyState.stacked ? '#000' : colors[realmIndex],
                borderWidth: historyState.stacked ? 1 : 2,
                fill: historyState.stacked,
                label: realmName,
                spanGaps: true,
                data: $userHistoryStore.data.gold[realmId].map((point) => ({
                    x: parseApiTime(point[0]),
                    y: point[1],
                })),
            })
        }

        const ctx = document.getElementById('gold-chart') as HTMLCanvasElement
        chart = new Chart(ctx, {
            type: 'line',
            data,
            options: {
                animation: false,
                color: '#fff',
                radius: 5,
                responsive: true,
                spanGaps: true,
                interaction: {
                    axis: 'xy',
                    mode: 'index',
                },
                layout: {
                    padding: 10,
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14,
                            }
                        },
                    },
                    tooltip: {
                        position: 'average',
                        callbacks: {
                            footer: (tooltipItems) => {
                                const total: number = tooltipItems.reduce((a: number, b) => a + b.parsed.y, 0)
                                return `Total: ${total.toLocaleString()}`
                            },
                        },
                        bodyFont: {
                            size: 14,
                        },
                        footerFont: {
                            size: 16,
                        },
                        titleFont: {
                            size: 16,
                        },
                    },
                },
                scales: {
                    x: {
                        type: 'time',
                        grid: {
                            color: '#666',
                        },
                        ticks: {
                            color: '#eee',
                            font: {
                                size: 14,
                            },
                        },
                        time: {
                            tooltipFormat: 'ff', // less short localized date and time
                            minUnit: 'day',
                        },
                    },
                    y: {
                        stacked: historyState.stacked,
                        grid: {
                            color: '#666',
                        },
                        ticks: {
                            color: '#eee',
                            font: {
                                size: 14,
                            },
                        },
                    },
                },
            },
        })
    }
</script>

<style lang="scss">
    .thing-container {
        border: 1px solid $border-color;
        border-radius: $border-radius;
        padding: 1rem;
        width: 100%;
    }
    canvas {
        width: 100%;
    }
</style>

<div class="view">
    <div class="options-container">
        <button>
            <Checkbox
                name="highlight_missing"
                bind:value={$historyState.stacked}
            >Stacked area</Checkbox>
        </button>
    </div>

    <div class="thing-container">
        <canvas id="gold-chart"></canvas>
    </div>
</div>
