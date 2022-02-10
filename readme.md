# Core SERP Vitals - Chrome Extension
https://defaced.dev/tools/core-serp-vitals/

Show the Core Web Vitals from the Chrome User Experience Report in the Google Search Results.

**Like this project? Help support my projects and buy me a coffee via [Ko-fi](https://ko-fi.com/defaced) or sponsor me on [GitHub Sponsors](https://github.com/sponsors/workeffortwaste/)**.

## Getting Started

### Installation

Install the extension from the Chrome Web Store.

https://chrome.google.com/webstore/detail/core-serp-vitals/oipmhlkineglclpndlecjmbleapbcilf



### Settings

#### API Key

**This extension requires an Chrome UX Report API key to retrieve the Core Web Vital metrics.**

You can obtain a key from this page: https://developers.google.com/web/tools/chrome-user-experience-report/api/guides/getting-started

This needs to be entered into the extension's options page.

#### Measurement Level

By default the extension pulls the Core Web Vital metrics at the `URL` level. This can be changed to `origin` level from the settings on the extension's options page.

#### Device Type

By default the extension pulls the Core Web Vital metrics from `mobile` devices. This can be changed to `desktop` devices from the settings on the extension's options page.

### Usage

With the extension installed Google's Search Results Page will be enhanced to display the Core Web Vital metrics, where available, from the Chrome User Experience Report underneath the page titles.

The metrics are coloured according to their respective thresholds for Good, Poor, and Needs Improvement.

[Defining Core Web Vitals Thresholds](https://web.dev/defining-core-web-vitals-thresholds/)

### Build

To manually build the extension run `npm run build` to create an unpackaged extension in `./dist`.

## Author

Chris Johnson - [defaced.dev](https://defaced.dev) - [@defaced](http://twitter.co.uk/defaced/)
