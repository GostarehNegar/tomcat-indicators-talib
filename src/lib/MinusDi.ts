import tomcat from '@gostarehnegar/tomcat'
type Intervals = tomcat.Domain.Base.Intervals
type IIndicator = tomcat.Domain.Indicators.IIndicator
type IFilter = tomcat.Domain.Pipes.IFilter
type CandleStickData = tomcat.Domain.Base.CandleStickData


import { TalibWrapperEx } from "./talibWrapper"

export const MDI = (period = 14, maxCount = 200, interval: Intervals = '4h'): IIndicator => {
  const id = `MinusDi-${period}-${maxCount}-${interval}`
  return {
    handler: async (candle: CandleStickData, THIS: IFilter) => {
      const candles = THIS.getScaler(interval, maxCount).push(candle)
      const MDIArray = await TalibWrapperEx.execute({
        name: "MINUS_DI",
        high: candles.getLast(maxCount).getSingleOHLCV('high'),
        low: candles.getLast(maxCount).getSingleOHLCV('low'),
        close: candles.getLast(maxCount).getSingleOHLCV('close'),
        startIdx: 0,
        endIdx: candles.getLast(maxCount).length - 1,
        optInTimePeriod: period,
      }) as number[]
      candle.indicators.setValue(id, MDIArray[MDIArray.length - 1]);
    },
    id: id
  }
}