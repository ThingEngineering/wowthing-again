<script lang="ts">
    import {
        Chart,
        LineElement,
        PointElement,
        LineController,
        LinearScale,
        LogarithmicScale,
        TimeScale,
        Filler,
        Legend,
        Title,
        Tooltip,
    } from 'chart.js'
    import 'chartjs-adapter-luxon'
    import sortBy from 'lodash/sortBy'
    import toPairs from 'lodash/toPairs'
    import { onMount } from 'svelte'
    import type { DateTime } from 'luxon'

    import { colors } from '@/data/colors'
    import { staticStore, userHistoryStore } from '@/stores'
    import { historyState } from '@/stores/local-storage'
    import { Region } from '@/types/enums'
    import parseApiTime from '@/utils/parse-api-time'
    import type { HistoryState } from '@/stores/local-storage'
    import type { StaticDataRealm } from '@/types'

    import RadioGroup from '@/components/forms/RadioGroup.svelte'

    Chart.register(
        LineElement,
        PointElement,
        LineController,
        LinearScale,
        LogarithmicScale,
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

    const redrawChart = function(historyState: HistoryState)
    {
        if (chart) {
            chart.destroy()
        }

        const data: { datasets: any[] } = {
            datasets: [],
        }
        const stacked = historyState.chartType === 'area-stacked'

        const realms: [string, number][] = []
        for (const realmId in $userHistoryStore.data.gold) {
            const realm: StaticDataRealm = $staticStore.data.realms[realmId]
            realms.push([
                `[${Region[realm.region]}] ${realm.name}`,
                parseInt(realmId)
            ])
        }
        realms.sort()

        let firstRealmId = -1
        for (let realmIndex = 0; realmIndex < realms.length; realmIndex++) {
            const [realmName, realmId] = realms[realmIndex]
            if (firstRealmId === -1) {
                firstRealmId = realmId
            }

            const colorIndex = (realmIndex + 1) * 2
            const color1 = colors[colorIndex]
            const color2 = colors[colorIndex + 1]

            let points: {x: DateTime, y: number}[]
            if (historyState.scale === 'hour') {
                points = $userHistoryStore.data.gold[realmId].map((point) => ({
                    x: parseApiTime(point[0]),
                    y: point[1],
                }))
            }
            else if (historyState.scale === 'day') {
                const temp: Record<string, [DateTime, number]> = {}
                for (const [time, value] of $userHistoryStore.data.gold[realmId]) {
                    const parsedTime = parseApiTime(time).toLocal()
                    temp[parsedTime.toISODate()] = [parsedTime.set({ hour: 0, minute: 0, second: 0 }), value]
                }
                points = sortBy(
                    toPairs(temp),
                    ([date]) => date
                ).map(
                    ([, [time, value]]) => [time, value]
                )
            }

            data.datasets.push({
                backgroundColor: color1,
                borderColor: stacked ? '#000' : color1,
                borderWidth: stacked ? 1 : 2,
                fill: stacked,
                label: realmName,
                spanGaps: true,
                data: points,
            })
        }

        if (historyState.chartType === 'line' && firstRealmId >= 0) {
            const totals: [string, number][] = []
            for (let pointIndex = 0; pointIndex < data.datasets[0].data.length; pointIndex++) {
                let total = 0
                for (let datasetIndex = 0; datasetIndex < data.datasets.length; datasetIndex++) {
                    total += data.datasets[datasetIndex].data[pointIndex][1]
                }
                totals.push([data.datasets[0].data[pointIndex][0], total])
            }

            data.datasets.push({
                backgroundColor: colors[0],
                borderColor: colors[0],
                borderWidth: 2,
                fill: stacked,
                label: 'Total',
                spanGaps: true,
                data: totals.map((point) => ({
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
                radius: 4,
                responsive: true,
                spanGaps: true,
                interaction: {
                    axis: 'xy',
                    intersect: false,
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
                        bodySpacing: 5,
                        boxPadding: 3,
                        position: 'average',
                        callbacks: {
                            footer: (tooltipItems) =>
                            {
                                if (historyState.chartType === 'line') {
                                    return undefined
                                }

                                const total: number = tooltipItems.reduce((a: number, b) => a + b.parsed.y, 0)
                                return `Total: ${total.toLocaleString()}`
                            },
                        },
                        bodyFont: {
                            size: 15,
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
                            tooltipFormat: historyState.scale === 'hour' ? 'ff' : 'DD',
                            minUnit: 'day',
                        },
                    },
                    y: {
                        stacked: stacked,
                        type: 'logarithmic',
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
    .radio-container {
        background: $highlight-background;
        margin-right: 0.5rem;
        padding: 0.25em 0.375em;
    }
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
        <div class="radio-container border">
            <RadioGroup
                bind:value={$historyState.chartType}
                name="chart_type"
                options={[
                    ['area-stacked', 'Area (stacked)'],
                    ['line', 'Line'],
                    //['line-daily', 'Line (daily range)'],
                ]}
            />
        </div>

        <div class="radio-container border">
            <RadioGroup
                bind:value={$historyState.scale}
                name="scale"
                options={[
                    ['hour', 'Hourly'],
                    ['day', 'Daily'],
                ]}
            />
        </div>
    </div>

    <div class="thing-container">
        <canvas id="gold-chart"></canvas>
    </div>
</div>
