import './App.css';
import 'react-calendar-heatmap/dist/styles.css';
import 'react-tooltip/dist/react-tooltip.css'
import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip'

function App() {
  const [contributions, setContributions] = useState([])
  const [lastYearCommit, setLastYearCommit] = useState(0)

  const handleMouseOver = (event)=>{
    ReactTooltip.show(event.target)
  }
  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch('https://github-contributions-api.jogruber.de/v4/gaearon?y=last')
        if (!response.ok) {
          return
        }
        const data = await response.json()
        setContributions(data.contributions)
        setLastYearCommit(data.total?.lastYear)
      } catch (error) {
        console.error('api error ', error)
      }
    }
    fetchData()
  }, [])
  return (
    <div className="App">
      <div>
        <CalendarHeatmap
          startDate={new Date(contributions[0]?.date)}
          endDate={new Date(contributions[contributions.length - 1]?.date)}
          values={contributions}
          titleForValue={(value) =>(`Date is ${value.date}`)}
          tooltipDataAttrs={(value) => (
            {
              'data-tooltip-id':'my-tooltip',
              'data-tooltip-content': value ? `Date for the tooltip is ` : 'no data',
              onmouseover:handleMouseOver

            }
          )}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-${value?.level}`
          }}
          showWeekdayLabels={true}
        >
          <ReactTooltip id='my-tooltip' />
        </CalendarHeatmap>
      </div>
    </div>
  );
}

export default App;
