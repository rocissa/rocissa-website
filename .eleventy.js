const yaml = require("js-yaml")
const {parse} = require("csv-parse/sync")
const pluginWebc = require("@11ty/eleventy-plugin-webc")
const esbuild = require("esbuild")
const {lessLoader} = require("esbuild-plugin-less")
const cacheBuster = require("@mightyplow/eleventy-plugin-cache-buster")
const markdownItAttrs = require("markdown-it-attrs")
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation")
const { EleventyRenderPlugin } = require("@11ty/eleventy")
const strftime = require('strftime')
const faviconsPlugin = require("eleventy-plugin-gen-favicons")
const { tzlib_get_ical_block } = require("timezones-ical-library")
const fastglob = require("fast-glob")
const fs = require("fs")
const wordwrap = require("wordwrapjs")

module.exports = function (eleventyConfig) {
    // ignore the _drafts directory when building for production
    if(process.env.ELEVENTY_ENV === "production" || process.env.SKIP_DRAFTS == true) {
        eleventyConfig.ignores.add("_drafts")
    }

    // copy directories of static files to the _site folder
    eleventyConfig.addPassthroughCopy("css")
    eleventyConfig.addPassthroughCopy("images")
    eleventyConfig.addPassthroughCopy("js")

    // process Markdown and HTML templates; copy image files and PDFs that are stored anywhere in the site
	eleventyConfig.setTemplateFormats([
		"md",
        "liquid",
		"html",
		"jpg",
		"jpeg",
		"png",
		"pdf"
	]);

    // custom markdown filters
    const md = require("markdown-it")({
    	html: true,  // allow html tags in markdown content
    	breaks: false, // do not treat newlines in markdown as <br> tags
    	linkify: true //convert bare URLs into links
    }).use(markdownItAttrs)
    eleventyConfig.setLibrary("md", md)

    // implement Jekyll's markdownify plugin (parse markdown in variables)
	eleventyConfig.addFilter("markdownify", value => (value) ? md.render(value) : "")

    // dates without a timezone are assumed to be in UTC which causes them to be off by a day
    // when displayed on the site.  This adjusts the timestamps to factor in the local timezone.
    eleventyConfig.addFilter("localtime", value => {
        let date = new Date(value)
        let tz = date.getTimezoneOffset()
        let newdate = new Date(date.getTime() + (tz * 60000))
        return newdate
    })

	// allow parsng yaml data files
    eleventyConfig.addDataExtension("yaml, yml", contents => yaml.load(contents));

    // allow parsing csv files
    eleventyConfig.addDataExtension("csv", contents => parse(contents, {
        columns: true,
        skip_empty_lines: true
    }))

    // allow webc components
    eleventyConfig.addPlugin(pluginWebc, {
    	components: "_components/**/*.webc"
    })

    // allow-templates inside templates (i.e. webc inside markdown) with the render plugin
    eleventyConfig.addPlugin(EleventyRenderPlugin)

    // watch for changes in the jssrc and less directories
    eleventyConfig.addWatchTarget("./jssrc")
    eleventyConfig.addWatchTarget("./less")

    eleventyConfig.addPlugin(cacheBuster({
        outputDirectory: "./_site"
    }))

    // enable the Eleventy Navigation plugin
    eleventyConfig.addPlugin(eleventyNavigationPlugin)

    eleventyConfig.addPlugin(faviconsPlugin, {
        manifestData: {
            name: "Information Systems Security Association - Rochester Chapter",
            short_name: "RocISSA"
        }
    })

    eleventyConfig.on("eleventy.before", () => {
        // build jssrc/site.js and less/site.less
        return esbuild.build({
            entryPoints: [
                { out: "js/site", in: "./jssrc/site.js"},
                { out: "css/site", in: "./less/site.less"},
            ],
            external: [  // don't try to include images and fonts when building css files
                "*.svg",
                "*.jpg",
                "*.png",
                "*.gif",
                "*.webp",
                "*.woff",
                "*.woff2"
            ],
            outdir: "_site",
            bundle: true,
            minify: process.env.ELEVENTY_ENV === "production",
            sourcemap: process.env.ELEVENTY_ENV !== "production",
            plugins: [lessLoader()]
        })
    })

    /**
     * Format a range of dates in longform English format
     */
    eleventyConfig.addShortcode("daterange", function (start, end) {
        let startDate = new Date(start)
        let endDate = new Date(end)

        let tz = startDate.getTimezoneOffset()
        startDate = new Date(startDate.getTime() + (tz * 60000))
        endDate = new Date(endDate.getTime() + (tz * 60000))


        if(startDate == endDate) {
            // single day
            return strftime("%B %e, %Y", startDate)
        }
        else if(startDate.getFullYear() != endDate.getFullYear() || startDate.getMonth() != endDate.getMonth()) {
            // in different years or months? return two full dates
            return strftime("%B %e, %Y", startDate) + " - " + strftime("%B %e, %Y", endDate)
        }

        // return month day-day, year
        let month = strftime("%B", startDate)
        let year = strftime("%Y", startDate)
        return month + " " + startDate.getDate() + " - " + endDate.getDate() + ", " + year
    })

    /*
     * Add a "icalendar" collection to create ics files for meetings
     * if they have a "start" value in their front matter
     */
    eleventyConfig.addCollection("icalendar", function(collectionApi) {
        let meetings = collectionApi.getFilteredByTag("meetings")
        let ical = meetings.filter(entry => (typeof entry.data.start_time != "undefined") ? true : false)
        return ical
    })

    /*
     * Shortcode to generate a VTIMEZONE block for iCalendar (ics) files
     */
    eleventyConfig.addShortcode("timezoneblock", function (tzname) {
        return tzlib_get_ical_block(tzname)[0]
    })

    /*
     * Wordwrap filter
     */
    eleventyConfig.addFilter("wordwrap", (text, width, eol) => {
        return wordwrap.wrap(text, {
            width: width,
            eol: eol
        })
    })

    /*
     * Reformat iCalendar files to use CRLF line endings
     */
    eleventyConfig.on("eleventy.after", () => {
        const ics = fastglob.sync(['_site/**/*.ics'])
        ics.map((path) => {
            fs.readFile(path, (err, data) => {
                let d = data.toString();
                d = d.replaceAll("\r", "").replaceAll("\n", "\r\n");
                fs.writeFile(path, d, err => {
                    if(err){
                        console.log(err)
                    }
                })
            })
        })
    })

	return {
		dir: {
            // look for layout files in _layouts instead of _includes
			layouts: "_layouts"
	    }
	}
}
