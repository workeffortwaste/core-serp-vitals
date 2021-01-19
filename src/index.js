// core-serp-vitals
// @defaced
(function () {
  // Make sure nothing has been previously injected, and the API key has been set.
  if (window.cruxKey === 'undefined' || document.getElementById('serp-styles')) { return }

  const css = `
    <style id="serp-styles">
    .serp-vitals {color: #4d5156; font-size: .75rem;}
    .serp-vitals span {font-weight:bold;}
    .serp-vitals .red {color: #ff4e42}
    .serp-vitals .green {color: #0cce6b}
    .serp-vitals .orange {color: #ffa400}
    </style>
  `
  document.body.insertAdjacentHTML('beforeend', css)

  const crux = require('crux-api/batch')
  const batch = crux.createBatch({ key: window.cruxKey })

  const urls = []
  let serpArray = [...document.querySelectorAll('#search .rc > div > a[ping][data-ved]')]
  // Allow for potential changes to the SERP layout.
  if (serpArray.length === 0) {
    serpArray = [...document.querySelectorAll('#search .g div > a[ping][data-ved]')]
  }
  serpArray.forEach(e => {
    urls.push(e.getAttribute('href'))
  })

  const records = async () => {
    return await batch(urls.map(url => ({ url, formFactor: window.vitalsDevice })))
  }

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
      <div class="serp-vitals">
        LCP:<span class="${getColor('lcp', metrics[k].record.metrics.largest_contentful_paint.percentiles.p75)}">${metrics[k].record.metrics.largest_contentful_paint.percentiles.p75}</span>
        FID:<span class="${getColor('fid', metrics[k].record.metrics.first_input_delay.percentiles.p75)}">${metrics[k].record.metrics.first_input_delay.percentiles.p75}</span>
        CLS:<span class="${getColor('cls', metrics[k].record.metrics.cumulative_layout_shift.percentiles.p75)}">${metrics[k].record.metrics.cumulative_layout_shift.percentiles.p75}</span>
      </div>
  `)
      }
    })
  })
})()
