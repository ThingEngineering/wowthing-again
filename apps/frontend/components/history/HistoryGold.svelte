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
    import type { TimeUnit } from 'chart.js'
    import 'chartjs-adapter-luxon'
    import some from 'lodash/some'
    import sortBy from 'lodash/sortBy'
    import { DateTime } from 'luxon'
    import { onMount } from 'svelte'

    import { colors } from '@/data/colors'
    import { staticStore, timeStore, userHistoryStore } from '@/stores'
    import { historyState } from '@/stores/local-storage'
    import { Region } from '@/enums'
    import parseApiTime from '@/utils/parse-api-time'
    import type { HistoryState } from '@/stores/local-storage'
    import type { UserHistoryData } from '@/types/data'
    import type { StaticDataRealm } from '@/types/data/static'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
    import RadioGroup from '@/components/forms/RadioGroup.svelte'
    import Select from '@/components/forms/Select.svelte'

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
    let ready: boolean
    $: {
        if (ready) {
            const current = $timeStore.toUTC()
            const last = $userHistoryStore.lastUpdated
            const diff = current.diff(last).toMillis()

            if (
                current.minute >= 5 &&
                (
                    diff > (60 * 60 * 1000) ||
                    current.hour !== last.hour
                )
            ) {
                userHistoryStore.fetch({ evenIfLoaded: true })
            }

            redrawChart($historyState, $userHistoryStore)
        }
    }

    onMount(() => ready = true)

    const intervalSettings: Record<string, [string, TimeUnit]> = {
        hour: ['ff', 'day'],
        day: ['DD', 'day'],
        week: ['DD', 'week'],
        month: ['MMM yyyy', 'month'],
    }

    type DataPoint = {x: DateTime, y: number}
    const redrawChart = function(historyState: HistoryState, userHistoryData: UserHistoryData)
    {
        if (chart) {
            chart.destroy()
        }

        const data: { datasets: any[] } = {
            datasets: [],
        }
        const stacked = historyState.chartType === 'area-stacked'

        const realms: [string, number][] = []
        for (const realmId in userHistoryData.gold) {
            if (!some(userHistoryData.gold[realmId], ([, value]) => value > 0)) {
                continue
            }

            const realm: StaticDataRealm = $staticStore.realms[realmId]
            realms.push([
                `[${Region[realm.region]}] ${realm.name}`,
                parseInt(realmId)
            ])
        }
        //realms.sort()

        const pointMap: Record<number, DateTime> = {}

        let minTime: DateTime = DateTime.now().minus({ years: 10 })
        if (historyState.timeFrame === '1week') {
            minTime = DateTime.now().minus({ weeks: 1 })
        }
        else if (historyState.timeFrame === '1month') {
            minTime = DateTime.now().minus({ months: 1 })
        }
        else if (historyState.timeFrame === '3month') {
            minTime = DateTime.now().minus({ months: 3 })
        }
        else if (historyState.timeFrame === '6month') {
            minTime = DateTime.now().minus({ months: 6 })
        }
        else if (historyState.timeFrame === '1year') {
            minTime = DateTime.now().minus({ months: 12 })
        }

        let firstRealmId = -1
        for (let realmIndex = 0; realmIndex < realms.length; realmIndex++) {
            const [realmName, realmId] = realms[realmIndex]
            if (firstRealmId === -1) {
                firstRealmId = realmId
            }

            const color = colors[(realmIndex + 1) * 2]

            let points: DataPoint[]
            if (historyState.interval === 'hour') {
                points = userHistoryData.gold[realmId]
                    .map((point) => ({
                        x: parseApiTime(point[0]),
                        y: point[1],
                    }))
            }
            else {
                const temp: Record<string, [DateTime, number]> = {}
                for (const [time, value] of userHistoryData.gold[realmId]) {
                    const parsedTime = parseApiTime(time).toLocal()
                    let fakeTime: DateTime
                    if (historyState.interval === 'day') {
                         fakeTime = parsedTime.set({
                             hour: 0,
                             minute: 0,
                             second: 0,
                         })
                    }
                    else if (historyState.interval === 'week') {
                        fakeTime = parsedTime.set({
                            weekday: 8,
                            hour: 0,
                            minute: 0,
                            second: 0,
                        })
                    }
                    else if (historyState.interval === 'month') {
                        fakeTime = parsedTime.set({
                            day: 1,
                            hour: 0,
                            minute: 0,
                            second: 0,
                        })
                    }

                    if (fakeTime > $timeStore) {
                        fakeTime = $timeStore.set({
                            hour: 0,
                            minute: 0,
                            second: 0,
                        })
                    }

                    temp[fakeTime.toISODate()] = [fakeTime, value]
                }

                points = sortBy(
                    Object.entries(temp),
                    ([date]) => date
                )
                .map(([, [time, value]]) => ({
                        x: time,
                        y: value,
                    })
                )
            }

            points = points.filter(({ x }) => x >= minTime)

            for (const point of points) {
                pointMap[point.x.toUnixInteger()] = point.x
            }

            data.datasets.push({
                backgroundColor: color,
                borderColor: stacked ? '#000' : color,
                borderWidth: stacked ? 1 : 2,
                fill: stacked,
                label: realmName,
                spanGaps: true,
                data: points,
            })
        }

        // Pad out each dataset with data for all time periods
        const smalls: Record<number, DataPoint> = {}
        const totals: Record<number, DataPoint> = {}

        const allPoints: [number, DateTime][] = Object.entries(pointMap)
            .map(([a, b]) => [parseInt(a), b])
        allPoints.sort()

        for (const dataset of data.datasets) {
            const oldMap: Record<number, DataPoint> = Object.fromEntries(
                dataset.data.map((dataPoint: DataPoint) => [dataPoint.x.toUnixInteger(), dataPoint])
            )
            const newData: DataPoint[] = []

            for (let pointIndex = 0; pointIndex < allPoints.length; pointIndex++) {
                const [ts, dateTime] = allPoints[pointIndex]
                if (oldMap[ts]) {
                    newData.push(oldMap[ts])
                }
                else {
                    if (pointIndex === 0) {
                        newData.push({x: dateTime, y: 0})
                    }
                    else {
                        newData.push({x: dateTime, y: newData[pointIndex - 1].y})
                    }
                }

                if (totals[ts] === undefined) {
                    smalls[ts] = {x: dateTime, y: 0}
                    totals[ts] = {x: dateTime, y: 0}
                }

                const newValue = newData[pointIndex].y
                totals[ts].y += newValue

                if (historyState.tooltipCombineSmall && newValue < 10000) {
                    smalls[ts].y += newValue
                }
            }

            dataset.data = newData
        }

        data.datasets.sort((a, b) => b.data[b.data.length - 1].y - a.data[a.data.length - 1].y)

        if (historyState.chartType === 'line' && firstRealmId >= 0) {
            if (historyState.tooltipCombineSmall) {
                const anyUseful = Object.values(smalls).filter((value) => value.y > 0).length > 0
                if (anyUseful) {
                    const smallPoints = sortBy(
                        Object.values(smalls),
                        (point: DataPoint) => point.x.toUnixInteger()
                    )

                    data.datasets.push({
                        backgroundColor: colors[colors.length - 2],
                        borderColor: colors[colors.length - 2],
                        borderWidth: 2,
                        fill: stacked,
                        label: 'Other',
                        spanGaps: true,
                        data: smallPoints,
                    })
                }
            }

            const totalPoints = sortBy(
                Object.values(totals),
                (point: DataPoint) => point.x.toUnixInteger()
            )

            data.datasets.push({
                backgroundColor: colors[0],
                borderColor: colors[0],
                borderWidth: 2,
                fill: stacked,
                label: 'Total',
                spanGaps: true,
                data: totalPoints,
            })
        }

        const ctx = document.getElementById('gold-chart') as HTMLCanvasElement
        chart = new Chart(ctx, {
            type: 'line',
            data,
            options: {
                animation: false,
                color: '#fff',
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
                        position: 'nearest',
                        filter: (e) => !historyState.tooltipCombineSmall || e.parsed.y >= 10000,
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
                            tooltipFormat: intervalSettings[historyState.interval][0],
                            unit: intervalSettings[historyState.interval][1],
                            displayFormats: {
                                week: 'yyyy-MM-dd',
                            }
                        },
                    },
                    y: {
                        stacked: stacked,
                        type: historyState.scaleType,
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
    .view {
        flex-direction: column;
    }
    .radio-container {
        background: $highlight-background;
        margin-right: 0.5rem;
        padding: 0.25em 0.375em;
    }
    .thing-container {
        border: 1px solid $border-color;
        padding: 1rem;
        width: 100%;
    }
    canvas {
        width: 100%;
    }
    .options-group {
        align-items: center;
        display: flex;
        gap: 0.3rem;
    }
</style>

<div class="view">
    <div class="options-container">
        <div class="radio-container border">
            <RadioGroup
                bind:value={$historyState.chartType}
                name="chart_type"
                options={[
                    ['area-stacked', 'Area'],
                    ['line', 'Line'],
                ]}
            />
        </div>

        <div class="radio-container border">
            <RadioGroup
                bind:value={$historyState.interval}
                name="interval"
                options={[
                    ['hour', 'Hourly'],
                    ['day', 'Daily'],
                    ['week', 'Weekly'],
                    ['month', 'Monthly'],
                ]}
            />
        </div>

        <div class="options-group">
            Timeframe:
            <Select
                name="time_frame"
                width={'9.5rem'}
                bind:selected={$historyState.timeFrame}
                options={
                    [
                        ['all', '- All -'],
                        ['1year', '1 year'],
                        ['6month', '6 months'],
                        ['3month', '3 months'],
                        ['1month', '1 month'],
                        ['1week', '1 week'],
                    ]
                }
            />
        </div>

        <div class="radio-container border">
            <RadioGroup
                bind:value={$historyState.scaleType}
                name="scale_type"
                options={[
                    ['linear', 'Linear'],
                    ['logarithmic', 'Log'],
                ]}
            />
        </div>

        <div class="radio-container border">
            <Checkbox
                bind:value={$historyState.tooltipCombineSmall}
                name="tooltip_combine_small"
            >Combine &lt;10k tooltip values</Checkbox>
        </div>
    </div>

    <div class="thing-container">
        <canvas id="gold-chart"></canvas>
    </div>
</div>
