// core-serp-vitals
// @defaced
(function () {
  // Make sure nothing has been previously injected, and the API key has been set.
  if (window.cruxKey === 'undefined' || document.getElementById('serp-styles')) { return }

  const css = `
    <style id="serp-styles">
    .serp-vitals {color: #4d5156; font-size: .75rem;}
    .serp-vitals .red {color: #ff4e42}
    .serp-vitals .green {color: #0cce6b}
    .serp-vitals .orange {color: #ffa400}
    .serp-vitals:before {
      content: 'Core Web Vitals';
      color: #b9bcbf;
    }
    .serp-vitals.serp-vitals--experimental:before {
      content: 'Experimental';
    }
    .serp-vitals {
      border: 1px solid #dadce0;
      border-radius: 3px;
      width: max-content;
      padding: 1px 4px 2px;
      display:inline-block;
    }
    .serp-vitals .serp-vitals-tag {
      border: 1px solid #81868a;
      border-radius: 2px;
      padding: 0 4px;
      font-size: 10px;
      margin-left: 4px;
      margin-right: 4px;
      display: inline-block;
    }
    </style>
  `
  document.body.insertAdjacentHTML('beforeend', css)

  const crux = require('crux-api/batch')
  const batch = crux.createBatch({ key: window.cruxKey })

  const urls = []
  // Select the links on the page.
  let serpArray = [...document.querySelectorAll('#search .g > div > div > div > a[data-ved][href^="http"]')]

  // Filter media elements from the array by removing any link with an explicity width set.
  serpArray = serpArray.filter(e => !e.style.width)

  // Filter large media elements by looking for a height on the parent.
  serpArray = serpArray.filter(e => !e.parentElement.style.height)

  serpArray.forEach(e => {
    urls.push(e.getAttribute('href'))
  })

  const records = async () => {
    if (window.vitalsLevel === 'ORIGIN') {
      return await batch(urls.map(origin => ({ origin, formFactor: window.vitalsDevice })))
    }

    return await batch(urls.map(url => ({ url, formFactor: window.vitalsDevice })))
  }

  const constraints = {
    lcp: { min: 2.5, max: 4 },
    fid: { min: 0.1, max: 0.3 },
    cls: { min: 0.1, max: 0.25 },
    inp: { min: 200, max: 500 }
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

        if (!metric.record.metrics.experimental_interaction_to_next_paint) {
          metric.record.metrics.experimental_interaction_to_next_paint = { percentiles: { p75: 'N/A' } }
        }
      }
    })

    serpArray.forEach((e, k) => {
      if (metrics[k] !== null) {
        e.insertAdjacentHTML('afterend', `
      <div class="serp-vitals-container">
        <div class="serp-vitals">
          <span class="serp-vitals-tag">LCP</span><span class="${getColor('lcp', metrics[k].record.metrics.largest_contentful_paint.percentiles.p75)}">${metrics[k].record.metrics.largest_contentful_paint.percentiles.p75}</span>
          <span class="serp-vitals-tag">FID</span><span class="${getColor('fid', metrics[k].record.metrics.first_input_delay.percentiles.p75)}">${metrics[k].record.metrics.first_input_delay.percentiles.p75}</span>
          <span class="serp-vitals-tag">CLS</span><span class="${getColor('cls', metrics[k].record.metrics.cumulative_layout_shift.percentiles.p75)}">${metrics[k].record.metrics.cumulative_layout_shift.percentiles.p75}</span>
        </div>
        <div class="serp-vitals serp-vitals--experimental">
          <span class="serp-vitals-tag">INP</span><span class="${getColor('inp', metrics[k].record.metrics.experimental_interaction_to_next_paint.percentiles.p75)}">${metrics[k].record.metrics.experimental_interaction_to_next_paint.percentiles.p75}</span>
        </div>
      </div>
  `)
      }
    })
  })
})()
