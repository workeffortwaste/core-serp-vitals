// core-serp-vitals
// @defaced
(function () {
  // Make sure nothing has been previously injected, and the API key has been set.
  if (window.cruxKey === 'null' && document.querySelectorAll('#serpVitals').length < 1) { return }

  const crux = require('crux-api/batch')
  const batch = crux.createBatch({ key: window.cruxKey })

  const urls = []
  const serpArray = [...document.querySelectorAll('#search .rc > div > a[ping]')]
  serpArray.forEach(e => {
    urls.push(e.getAttribute('href'))
  })

  const records = async () => {
    return await batch(urls.map(url => ({ url, formFactor: window.vitalsDevice })))
  }

  const css = `
    <style>
    #serpVitals {color: #4d5156; font-size: .75rem;}
    #serpVitals span{
      font-weight:bold;
    }
    #serpVitals .red {color: #ff4e42}
    #serpVitals .green {color: #0cce6b}
    #serpVitals .orange {color: #ffa400}
    </style>
  `
  document.body.insertAdjacentHTML('beforeend', css)

  const constraints = {
    lcp: { min: 2.5, max: 4 },
    fid: { min: 0.1, max: 0.3 },
    cls: { min: 0.1, max: 0.25 }
  }

  const getColor = (type, score) => {
    if (score === 'N/A') { return '' }
    if (score > constraints[type].max) {
      return 'red'
    }
    if (score > constraints[type].min) {
      return 'orange'
    }
    return 'green'
  }

  records().then(metrics => {
    metrics.forEach(metric => {
      if (metric !== null) {
        if (!metric.record.metrics.largest_contentful_paint) {
          metric.record.metrics.largest_contentful_paint = { percentiles: { p75: 'N/A' } }
        } else {
          metric.record.metrics.largest_contentful_paint.percentiles.p75 /= 1000
        }

        if (!metric.record.metrics.first_input_delay) {
          metric.record.metrics.first_input_delay = { percentiles: { p75: 'N/A' } }
        } else {
          metric.record.metrics.first_input_delay.percentiles.p75 /= 1000
        }

        if (!metric.record.metrics.cumulative_layout_shift) {
          metric.record.metrics.cumulative_layout_shift = { percentiles: { p75: 'N/A' } }
        }
      }
    })

    serpArray.forEach((e, k) => {
      if (metrics[k] !== null) {
        e.insertAdjacentHTML('afterend', `
      <div id="serpVitals">
        LCP:<span class="${getColor('lcp', metrics[k].record.metrics.largest_contentful_paint.percentiles.p75)}">${metrics[k].record.metrics.largest_contentful_paint.percentiles.p75}</span>
        FID:<span class="${getColor('fid', metrics[k].record.metrics.first_input_delay.percentiles.p75)}">${metrics[k].record.metrics.first_input_delay.percentiles.p75}</span>
        CLS:<span class="${getColor('cls', metrics[k].record.metrics.cumulative_layout_shift.percentiles.p75)}">${metrics[k].record.metrics.cumulative_layout_shift.percentiles.p75}</span>
      </div>
  `)
      }
    })
  })
})()
